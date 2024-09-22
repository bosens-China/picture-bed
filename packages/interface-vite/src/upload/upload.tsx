import {
  Button,
  Form,
  Modal,
  Tooltip,
  Upload as MyUpload,
  UploadProps,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { ExclamationCircleFilled, InboxOutlined } from '@ant-design/icons';

import { useDocumentVisibility } from 'ahooks';

const { Dragger } = MyUpload;

type FieldType = {
  property?: string[];
};

const { confirm } = Modal;

export const Upload = () => {
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {
    setOpen(false);
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
  useEffect(() => {
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
          : `检测到剪切板包含图片资源，是否将相关资源上传到代上传资源列表？`,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentVisibility]);

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
