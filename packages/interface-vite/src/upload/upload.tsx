import {
  Button,
  Form,
  Modal,
  Tooltip,
  Upload as MyUpload,
  UploadProps,
  App,
  Row,
  Col,
} from 'antd';
import { useState } from 'react';
import { ExclamationCircleFilled, InboxOutlined } from '@ant-design/icons';

import { useDocumentVisibility, useUpdateEffect } from 'ahooks';

const { Dragger } = MyUpload;

type FieldType = {
  property?: string[];
  propertyDir?: string[];
};

const { confirm } = Modal;

export const Upload = () => {
  const [open, setOpen] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };
  const handleOk = () => {
    handleCancel();
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
        content: !open
          ? '检测到剪切板包含图片资源，是否打开上传资源对话框，上传相关资源？'
          : `检测到剪切板包含图片资源，是否将相关资源上传到待上传资源列表？`,
        onOk() {
          if (!open) {
            setOpen(true);
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

  const uploadItems: UploadItems[] = [
    {
      name: 'property',
      describe: [`单击或拖动文件到此区域进行上传`, `支持单次或批量上传`],
      label: '待上传资源',
    },
    {
      name: 'propertyDir',
      describe: [`单击或拖动文件夹到此区域进行上传`],
      label: '待上传资源（文件夹）',
      directory: true,
    },
  ];

  return (
    <>
      <Tooltip title="上传资源" placement={'leftTop'}>
        <Button type="primary" className="flex" onClick={() => setOpen(true)}>
          <div className="i-catppuccin-folder-upload-open text-size-2xl cursor-pointer"></div>
          上传资源
        </Button>
      </Tooltip>

      <Modal
        title="上传资源"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        centered
      >
        <Form
          initialValues={{}}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Row align="middle" gutter={16}>
            {uploadItems.map((item) => {
              return (
                <Col span={12} key={item.name}>
                  <Form.Item<FieldType>
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
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal>
    </>
  );
};
