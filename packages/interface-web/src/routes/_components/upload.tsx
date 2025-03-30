import { useGroupingStore } from '@/store/grouping';
import { globalFunctions } from '@/utils/global-functions';
import { CloudUploadOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Dropdown, Space, theme, Upload, UploadProps } from 'antd';
import { upload } from '@boses/picture-bed-sdk';
import * as _ from 'lodash-es';
import { useShallow } from 'zustand/shallow';

export const MyUpload = () => {
  const { token } = theme.useToken();
  const { colorBgBase } = token;
  const { message } = App.useApp();

  const fn = _.partialRight(upload, (progressEvent, body) => {
    // @ts-expect-error 忽略错误
    const key = body.file._id;
    message.open({
      key,
      type: 'loading',
      content: `正在上传 ${body.file.name} 文件，当前进度：${Math.floor((progressEvent.progress ?? 0) * 100)}%`,
    });
  });

  const { run } = useRequest(fn, {
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
  });
  const { activeId, groups } = useGroupingStore(
    useShallow((state) => {
      return {
        activeId: state.activeId,
        groups: state.groups,
      };
    }),
  );

  const currentUid = groups.find((f) => f.id === activeId)?.uid;

  const baseProps: UploadProps = {
    multiple: true,
    name: 'property',
    showUploadList: false,
    customRequest: (options) => {
      run({
        file: options.file as File,
        uid: currentUid!,
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
            disabled: !groups.length,
            key: 'dir',
            icon: <FolderOpenOutlined />,
          },
        ],
      }}
      disabled={!groups.length}
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
