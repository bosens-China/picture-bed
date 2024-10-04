import {
  Form,
  Modal,
  Upload as MyUpload,
  UploadProps,
  App,
  Dropdown,
  DropdownProps,
  Button,
  UploadFile,
  Progress,
} from 'antd';

import {
  FolderAddOutlined,
  FolderOpenOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useContext, useEffect, useMemo, useState } from 'react';
import { uploadFiles, UploadFilesBody } from 'core';
import { useAppSelector } from '@/store/hooks';
import { activationItem } from '@/store/features/users/selectors';
import { getErrorMsg } from '@/utils/error';
import './style.less';
import { browserUpload, UploadBodyBrowser } from 'core/api/upload-browser.ts';
import { EventConent } from '@/App';
import { EventName } from '@/hooks/use-event/event-name';
import { useCache } from './useCache';
import { useReadCuttingBoard } from './use-read-cutting-board';

const { Dragger } = MyUpload;

export type FieldType = {
  property?: UploadFile[];
};

export interface UploadState {
  open: boolean;
  isDir?: boolean;
}

export const Upload = () => {
  // Modal 相关状态
  const [modalState, setModalState] = useState<UploadState>({
    open: false,
    isDir: false,
  });
  // const { user } = store;
  const { message } = App.useApp();
  const event = useContext(EventConent);
  const [form] = Form.useForm<FieldType>();

  const { property, requiredBase } = useReadCuttingBoard({
    modalState,
    setModalState,
    form,
  });

  const cacheMap = useCache({ open: modalState.open });

  const { loading, run } = useRequest(
    async (files: UploadFilesBody<UploadBodyBrowser>['files']) => {
      return uploadFiles(browserUpload, {
        files: files,
        config: {
          maxConcurrency: requiredBase.concurrentQuantity,
          waitingTime: requiredBase.waitingInterval,
          onUploadProgress(progressEvent, body) {
            setSchedule((obj) => {
              const file = body.file as unknown as UploadFile;
              obj[file.uid] = progressEvent.progress || 0;
              return { ...obj };
            });
          },
          messageCallback: ({ item, err, data }) => {
            form.setFieldValue(
              'property',
              property?.map((f) => {
                const file = item.file as unknown as UploadFile;
                if (f.uid === file.uid) {
                  f.status = data ? 'done' : 'error';
                  if (err) {
                    f.response = getErrorMsg(err);
                  }
                }

                return { ...f };
              }),
            );
          },
        },
      });
    },
    {
      manual: true,
      /*
       * 将上传的资源全部重置为loading
       * 排除掉已经成功的元素
       */
      onBefore() {
        form.setFieldValue(
          'property',
          property?.map((f) => {
            if (f.originFileObj?.uid && cacheMap.get(f.originFileObj?.uid)) {
              return f;
            }
            return {
              ...f,
              status: 'uploading',
            };
          }),
        );
      },
      onSuccess(data) {
        message.destroy();
        const multifile = data.length > 1;

        if (data.every((f) => f.status === 'rejected')) {
          message.error(
            `上传文件${multifile ? '全部' : ''}失败，鼠标悬浮文件信息可以查看具体错误信息。`,
          );
          return;
        }
        if (data.some((f) => f.status === 'rejected')) {
          message.warning(
            `未${multifile ? '全部' : ''}上传成功，鼠标悬浮文件信息可以查看具体错误信息。`,
          );
        }
        message.success('上传成功');
        event?.emit(EventName.uploadChanges);
        /*
         * 上传成功，给表单一个标识标记上传成功
         */
        property?.forEach((item) => {
          if (item.status === 'done') {
            cacheMap.set(item.originFileObj?.uid || '', true);
          }
        });
      },
    },
  );

  const [schedule, setSchedule] = useState<Record<string, number>>({});

  /**
   * 返回整体的上传进度
   */
  const [percent, successPercent] = useMemo(() => {
    const total = property?.length || 0;
    const proportion = 100 / total;
    const current = Object.values(schedule).reduce((x, y) => {
      return x + y;
    }, 0);
    // 计算完成的进度
    const currentSuccess = Object.keys(schedule)
      .filter((k) => {
        return property?.find((f) => f.uid === k)?.status === 'done';
      })
      .map((f) => schedule[f])
      .reduce((x, y) => x + y, 0);

    return [current * proportion, currentSuccess * proportion].map(
      (f) => +f.toFixed(2),
    );
  }, [schedule, property]);

  useEffect(() => {
    if (percent === 100 && loading) {
      message.open({
        type: 'loading',
        content: '上传成功，正在进行上传校验...',
        duration: 0,
      });
    }
  }, [percent, loading, message]);

  const handleCancel = () => {
    setModalState({ open: false, isDir: false });
    form.resetFields();
    setSchedule({});
  };

  const activation = useAppSelector(activationItem);

  const handleOk = async () => {
    const result = await form.validateFields();
    const files = result
      .property!.filter((f) => {
        if (!cacheMap.size) {
          return true;
        }
        return f.originFileObj?.uid && !cacheMap.get(f.originFileObj?.uid);
      })
      .map((item): UploadBodyBrowser => {
        return {
          uid: activation?.uid || '',
          file: item.originFileObj as File,
        };
      });

    if (!files.length) {
      message.warning(`资源已全部上传完成，无新增资源待上传。`);
      return;
    }
    setSchedule({});

    run(files);
  };

  const uploadProps: UploadProps = {
    multiple: true,

    customRequest(options) {
      options.onSuccess?.(`${Date.now()}`);
    },
  };

  type UploadItems = {
    name: keyof FieldType;
    describe: Array<string>;
    label: string;
  } & Partial<UploadProps>;

  const uploadItems = useMemo<UploadItems[]>(() => {
    return [
      !modalState.isDir
        ? {
            name: 'property',
            describe: [
              `单击或拖动文件到此区域进行上传`,
              `支持单次或批量上传`,
              requiredBase.shortcutPaste
                ? '如果剪切板有内容可以使用快捷键Ctrl+V（meta+V）进行粘贴'
                : '',
            ].filter((f) => f),
            label: '待上传资源',
          }
        : {
            name: 'property',
            describe: [
              `单击或拖动文件夹到此区域进行上传`,
              requiredBase.shortcutPaste ? '' : '',
              requiredBase.shortcutPaste
                ? '如果剪切板有内容可以使用快捷键Ctrl+V（meta+V）进行粘贴'
                : '',
            ].filter((f) => f),
            label: '待上传资源（文件夹）',
            directory: true,
          },
    ];
  }, [modalState.isDir, requiredBase.shortcutPaste]);

  const menu: DropdownProps['menu'] = {
    items: [
      {
        key: 'dir',
        label: '上传资源（文件夹）',
        icon: <FolderOpenOutlined />,
        disabled: !activation?.uid,
        onClick: () => {
          setModalState({ open: true, isDir: true });
        },
      },
    ],
  };

  return (
    <>
      <Dropdown menu={menu}>
        <Button
          type="primary"
          onClick={() => setModalState({ open: true })}
          disabled={!activation?.uid}
          icon={<FolderAddOutlined />}
        >
          上传资源
        </Button>

        {/* <div className="i-catppuccin-folder-upload-open text-size-2xl cursor-pointer"></div> */}
      </Dropdown>

      <Modal
        title="上传资源"
        open={modalState.open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        centered
        closable={!loading}
        keyboard={false}
        maskClosable={false}
        className="max-w-100vw"
        footer={[
          <Button key="not" onClick={handleCancel} disabled={loading}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk} loading={loading}>
            上传
          </Button>,
        ]}
      >
        <Form
          initialValues={{}}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          {uploadItems.map((item) => {
            return (
              <Form.Item<FieldType>
                key={item.name}
                valuePropName="fileList"
                label={item.label}
                name={item.name}
                className="y_upload"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
                rules={[
                  {
                    required: true,
                    message: '请上传资源文件!',
                    type: 'array',
                  },
                ]}
              >
                <Dragger {...{ ...uploadProps, ...item, disabled: loading }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{item.describe[0]}</p>
                  {item.describe.slice(1).map((f) => {
                    return (
                      <p className="ant-upload-hint" key={f}>
                        {f}
                      </p>
                    );
                  })}
                </Dragger>
              </Form.Item>
            );
          })}

          <Form.Item label="上传进度">
            {/* <Progress
              steps={property?.length}
              percent={modalState.percent}
              size={[20, 30]}
              className={!property?.length ? 'op-0' : ''}
            /> */}
            <Progress
              size={{ height: 15 }}
              percent={loading ? percent : successPercent}
              success={{ percent: successPercent }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
