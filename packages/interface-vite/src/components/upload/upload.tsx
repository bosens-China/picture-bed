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
  ExclamationCircleFilled,
  FolderAddOutlined,
  FolderOpenOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useDocumentVisibility, useRequest, useUpdateEffect } from 'ahooks';
import { useContext, useEffect, useMemo, useState } from 'react';
import { uploadFiles, UploadFilesBody } from 'core';
import { useAppSelector } from '@/store/hooks';
import { activationItem } from '@/store/features/users/selectors';
import { getErrorMsg } from '@/utils/error';
import './style.less';
import { checkClipboard } from './utils';
import { browserUpload, UploadBodyBrowser } from 'core/api/upload-browser.ts';
import { EventConent } from '@/App';
import { EventName } from '@/hooks/use-event/event-name';

const { Dragger } = MyUpload;

type FieldType = {
  property?: UploadFile[];
};

export const Upload = () => {
  // Modal 相关状态
  const [modalState, setModalState] = useState<{
    open: boolean;
    isDir?: boolean;
  }>({
    open: false,
    isDir: false,
  });
  // const { user } = store;
  const { message, modal } = App.useApp();
  const event = useContext(EventConent);
  const [form] = Form.useForm<FieldType>();
  const { loading, run } = useRequest(
    async (files: UploadFilesBody<UploadBodyBrowser>['files']) => {
      return uploadFiles(browserUpload, {
        files: files,

        config: {
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
       */
      onBefore() {
        form.setFieldValue(
          'property',
          property?.map((f) => {
            return {
              ...f,
              status: 'uploading',
            };
          }),
        );
      },
      onSuccess(data) {
        message.destroy();

        if (data.every((f) => f.status === 'rejected')) {
          message.error(
            '上传文件全部失败，鼠标悬浮文件信息可以查看具体错误信息。',
          );
          return;
        }
        if (data.some((f) => f.status === 'rejected')) {
          message.warning(
            `未全部上传成功，鼠标悬浮文件信息可以查看具体错误信息。`,
          );
        }
        message.success('上传成功');
        event?.emit(EventName.uploadChanges);
      },
    },
  );

  const property = Form.useWatch('property', form);

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
    const files = result.property!.map((item): UploadBodyBrowser => {
      return {
        uid: activation?.uid || '',
        file: item.originFileObj as File,
      };
    });
    setSchedule({});

    run(files);
  };

  const documentVisibility = useDocumentVisibility();

  /*
   * 页面变动监听剪切板的变化，读取所有图片资源来上传
   */
  useUpdateEffect(() => {
    if (documentVisibility !== 'visible') {
      return;
    }
    (async () => {
      const files = await checkClipboard();

      if (!files.length) {
        return;
      }
      modal.confirm({
        title: '上传提醒?',
        icon: <ExclamationCircleFilled />,
        content: !modalState.open
          ? '检测到剪切板包含图片资源，是否打开上传资源对话框，上传相关资源？'
          : `检测到剪切板包含图片资源，是否将相关资源上传到待上传资源列表？`,
        onOk() {
          if (!modalState.open) {
            setModalState({ open: true });
          }
          // 赋值
          form.setFieldValue(
            'property',
            files.map((f) => new File([f.blob], f.fileName)),
          );
        },
        onCancel() {
          //
        },
      });
    })();
  }, [documentVisibility]);

  const uploadProps: UploadProps = {
    multiple: true,

    customRequest(options) {
      options.onSuccess?.(`${Date.now()}`);
    },
  };

  type UploadItems = {
    name: keyof FieldType;
    describe: [string] | [string, string];
    label: string;
  } & Partial<UploadProps>;

  const uploadItems = useMemo<UploadItems[]>(() => {
    return [
      !modalState.isDir
        ? {
            name: 'property',
            describe: [`单击或拖动文件到此区域进行上传`, `支持单次或批量上传`],
            label: '待上传资源',
          }
        : {
            name: 'property',
            describe: [`单击或拖动文件夹到此区域进行上传`],
            label: '待上传资源（文件夹）',
            directory: true,
          },
    ];
  }, [modalState.isDir]);

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
        keyboard={!loading}
        maskClosable={!loading}
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
                  {item.describe[1] && (
                    <p className="ant-upload-hint">{item.describe[1]}</p>
                  )}
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
