import {
  Button,
  Form,
  Modal,
  Tooltip,
  Upload as MyUpload,
  UploadProps,
  message,
} from 'antd';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = MyUpload;

type FieldType = {
  property?: string[];
};

export const Upload = () => {
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    directory: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

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
      >
        <Form initialValues={{}} autoComplete="off" layout="vertical">
          <Form.Item<FieldType>
            label="代上传资源"
            name="property"
            rules={[
              {
                required: true,
                message: '请上传资源文件!',
                type: 'array',
                min: 1,
              },
            ]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
              <p className="ant-upload-hint">支持单次或批量上传</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
