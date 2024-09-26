import {
  Form,
  Modal,
  Tooltip,
  Upload as MyUpload,
  UploadProps,
  App,
  Dropdown,
  DropdownProps,
  Button,
  UploadFile,
  Progress,
} from 'antd';

import { ExclamationCircleFilled, InboxOutlined } from '@ant-design/icons';
import { store } from '@/store';
import { useDocumentVisibility, useRequest, useUpdateEffect } from 'ahooks';
import { useMemo, useState } from 'react';
import { uploadFiles } from 'core';
import { UploadBody } from 'core/api/upload.ts';
import { AxiosError } from 'axios';

const { Dragger } = MyUpload;

type FieldType = {
  property?: UploadFile[];
};

const { confirm } = Modal;

export const Upload = () => {
  // Modal 相关状态
  const [modalState, setModalState] = useState<{
    open: boolean;
    isDir?: boolean;
    // 百分比
    percent: number;
  }>({
    open: false,
    isDir: false,
    percent: 0,
  });
  const { user } = store;
  const { message } = App.useApp();
  const [form] = Form.useForm<FieldType>();
  const property = Form.useWatch('property', form);
  const handleCancel = () => {
    setModalState({ open: false, isDir: false, percent: 0 });
    form.resetFields();
  };

  const { loading, run } = useRequest(uploadFiles, {
    manual: true,
    onSuccess() {
      message.success(`上传成功`);
    },
    onError(e) {
      const err = e as AxiosError;
      modalState.percent = 0;
      switch (err.code) {
        case 'ERR_NETWORK':
          message.error(
            `网络错误访问错误，可能是cors问题也可能是服务端接口出现问题。`,
          );

          return;

        default:
          message.error(e.message);
      }
    },
  });

  const handleOk = async () => {
    const result = await form.validateFields();
    const files = result.property!.map((item): UploadBody => {
      return {
        uid: user!.uid!,
        file: item.originFileObj,
      };
    });
    run({
      files,
      config: {
        iteratorFn(_item, index, total) {
          console.log({ index, total });

          modalState.percent = ((index + 1) / total) * 100;
        },
      },
    });
  };

  const documentVisibility = useDocumentVisibility();

  /*
   * 读取剪切板
   */
  const checkClipboard = async (): Promise<Blob[]> => {
    try {
      // 请求剪切板权限
      const clipboardItems = await navigator.clipboard.read();

      const files: Promise<Blob>[] = [];
      for (const clipboardItem of clipboardItems) {
        // 检查剪切板是否包含图片
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = clipboardItem.getType(type);
            files.push(blob);
          }
        }
      }
      return await Promise.all(files);
    } catch {
      return [];
    }
  };

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
      confirm({
        title: '上传提醒?',
        icon: <ExclamationCircleFilled />,
        content: !modalState.open
          ? '检测到剪切板包含图片资源，是否打开上传资源对话框，上传相关资源？'
          : `检测到剪切板包含图片资源，是否将相关资源上传到待上传资源列表？`,
        onOk() {
          if (!modalState.open) {
            setModalState({ open: true, percent: 0 });
          }
          // 赋值
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
      },
    ],
    onClick: (e) => {
      switch (e.key) {
        case 'dir':
          setModalState({ open: true, isDir: true, percent: 0 });
          break;

        default:
          break;
      }
    },
  };

  return (
    <>
      <Tooltip title="上传资源" placement={'leftTop'}>
        <Dropdown.Button
          onClick={() => setModalState({ open: true, percent: 0 })}
          menu={menu}
          type="primary"
        >
          <div className="i-catppuccin-folder-upload-open text-size-2xl cursor-pointer"></div>
          上传资源
        </Dropdown.Button>
      </Tooltip>

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
            确定
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
                <Dragger {...{ ...uploadProps, ...item }}>
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
            <Progress
              steps={property?.length}
              percent={modalState.percent}
              size={[20, 30]}
              className={!property?.length ? 'op-0' : ''}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
