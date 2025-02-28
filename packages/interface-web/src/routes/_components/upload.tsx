import { useProjectStore } from '@/store/project';
import { globalFunctions } from '@/utils/global-functions';
import { CloudUploadOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Dropdown, Space, theme, Upload, UploadProps } from 'antd';
// import { uploadFiles, UploadFilesBody } from 'core';
// import { browserUpload, UploadBodyBrowser } from 'core/api/upload-browser.js';
import { UploadBrowser } from 'core/upload-browser';

export const MyUpload = () => {
  const { token } = theme.useToken();
  const { colorBgBase } = token;
  const { message } = App.useApp();

  const { run } = useRequest(
    new UploadBrowser({
      userConfig: {
        onUploadProgress(progressEvent, body) {
          // @ts-expect-error 忽略错误
          const key = body.file._id;
          message.open({
            key,
            type: 'loading',
            content: `正在上传 ${body.file.name} 文件，当前进度：${Math.floor((progressEvent.progress ?? 0) * 100)}%`,
          });
        },
      },
    }).browserUpload,
    {
      manual: true,
      /*
       * 将上传的资源全部重置为loading
       * 排除掉已经成功的元素
       */
      onBefore([body]) {
        const key = `${performance.now()}`;
        // @ts-expect-error 忽略错误
        body.file._id = key;
        message.open({
          key,
          type: 'loading',
          content: `开始上传文件 ${body.file.name}`,
        });
      },
      onError(e, [body]) {
        // @ts-expect-error 忽略错误
        const key = body.file._id;
        message.open({
          key,
          type: 'error',
          content: e.message,
        });
      },
      onSuccess(_data, [{ file }]) {
        // @ts-expect-error 忽略错误
        const key = file._id;
        message.open({
          key,
          type: 'success',
          content: `上传成功`,
        });
        globalFunctions.updateList?.();
      },
    },
  );
  const current = useProjectStore((state) => state.current);
  const baseProps: UploadProps = {
    multiple: true,
    name: 'property',
    showUploadList: false,
    customRequest: (options) => {
      run({
        file: options.file as File,
        uid: current!,
      });
      options.onSuccess?.(`${Date.now()}`);
    },
  };

  return (
    <Dropdown.Button
      type="primary"
      size="large"
      className="mt-7 mb-6.75 [&_.ant-btn]-flex-1"
      menu={{
        items: [
          {
            label: (
              <Upload {...baseProps} directory>
                上传文件夹
              </Upload>
            ),

            key: 'dir',
            icon: <FolderOpenOutlined />,
          },
        ],
      }}
    >
      <Upload {...baseProps}>
        <Space style={{ color: colorBgBase }}>
          <CloudUploadOutlined />
          上传图片
        </Space>
      </Upload>
    </Dropdown.Button>
  );
};
