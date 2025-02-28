import {
  useAsyncEffect,
  useDocumentVisibility,
  useEventListener,
  useKeyPress,
} from 'ahooks';
import React, { useMemo, useRef } from 'react';
import { checkClipboard } from './utils';
import { useAppSelector } from '@/store/hooks';
import * as _ from 'lodash-es';
import { baseInitialValues } from '../setup/share';
import { BaseFieldType } from '@/store/features/users/slice';
import { App, Form, FormInstance, UploadFile } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { FieldType, UploadState } from './upload';
import { sleep } from 'core/utils/speedLimiter.js';

interface Props {
  modalState: UploadState;
  setModalState: React.Dispatch<React.SetStateAction<UploadState>>;
  form: FormInstance<FieldType>;
}

/**
 * 读取剪切板hooks方法
 * 初始情况下直接读取剪切板，获取里面数据
 * 如果存在打开上传弹窗，将剪切板数据设置到上传弹窗中
 * 如果已经打开则将blob添加进入上传弹窗中
 * @returns
 *
 */
export const useReadCuttingBoard = ({
  modalState,
  setModalState,
  form,
}: Props) => {
  const { modal } = App.useApp();

  const executionStatus = useRef<boolean>(false);
  // const clipperBuffer = useRef<null | ClipboardItems>(null);

  const property = Form.useWatch('property', form);
  const base = useAppSelector((state) => state.users.base);

  const requiredBase = useMemo<BaseFieldType>(() => {
    return _.defaultsDeep({}, base, baseInitialValues);
  }, [base]);

  /**
   * 手动执行一次剪切板读取
   * @returns
   */
  const manualExecution = async () => {
    const { cuttingBoard, cuttingBoardFormat } = requiredBase;
    // 不开启不需要进行后续步骤
    if (cuttingBoard === false || cuttingBoardFormat.length === 0) {
      return;
    }
    await sleep(500);
    const files = await checkClipboard({
      filter: (type) => {
        if (cuttingBoardFormat.includes('html')) {
          return type === 'text/html';
        }
        if (cuttingBoardFormat.includes('image')) {
          return type.startsWith('image/');
        }
        if (cuttingBoardFormat.includes('txt')) {
          return type === 'text/plain';
        }
        return false;
      },
      comparisonEffectiveness() {
        return false;
        // const result = clipperBuffer.current === clipboardItems;

        // if (import.meta.env && result) {
        //   console.warn(`剪切板内容一致，不需要上传`);
        // }

        // clipperBuffer.current = clipboardItems;
        // return result;
      },
    });

    if (!files.length) {
      if (import.meta.env.DEV) {
        console.warn('没有检测到剪切板资源');
      }
      return;
    }

    if (executionStatus.current) {
      return;
    }
    executionStatus.current = true;

    const assignment = () => {
      form.setFieldValue('property', [
        ...(property || []),
        ...files.map((f): UploadFile => {
          const file = new File([f.blob], f.fileName);
          return {
            uid: `${Date.now()}-${f.fileName}`,
            name: f.fileName,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            originFileObj: file as any,
            status: 'done',
            url: URL.createObjectURL(file),
          };
        }),
      ]);
    };

    modal.confirm({
      title: '上传提醒?',
      icon: React.createElement(ExclamationCircleFilled),
      content: `检测到剪切板变化，是否上传相关资源文件？`,
      onOk() {
        executionStatus.current = false;
        if (!modalState.open) {
          setModalState({ open: true });
        }
        assignment();
      },
      onCancel() {
        executionStatus.current = false;
      },
    });
    return;
  };

  const documentVisibility = useDocumentVisibility();
  /*
   * 窗口显示隐藏的时候触发，但是浏览器有安全限制，所以这块的检测不一定生效
   *
   */
  useAsyncEffect(async () => {
    if (documentVisibility === 'hidden') {
      return;
    }

    await manualExecution();
  }, [
    documentVisibility,
    requiredBase.cuttingBoard,
    requiredBase.cuttingBoardFormat,
  ]);

  /*
   * 剪切板如果发生变化就订阅
   * 但是很遗憾，目前也并不支持
   * https://udn.realityripple.com/docs/Web/API/Window/clipboardchange_event#Browser_compatibility
   */
  useEventListener(
    'clipboardchange',
    () => {
      manualExecution();
    },
    { target: window },
  );

  /*
   * 支持快捷键粘贴
   */
  useKeyPress(['ctrl.v', 'meta.v'], async () => {
    if (!modalState.open || !requiredBase.shortcutPaste) {
      return;
    }
    manualExecution();
  });

  return {
    property,
    manualExecution,
    requiredBase,
  };
};
