import { useProjectStore } from '@/store/project';
import { CloudUploadOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Dropdown, Space, theme, Upload, UploadProps } from 'antd';
// import { uploadFiles, UploadFilesBody } from 'core';
// import { browserUpload, UploadBodyBrowser } from 'core/api/upload-browser.js';
import { UploadBrowser } from 'core/upload-browser';

export const MyUpload = () => {
  const { token } = theme.useToken();
  const { colorBgBase } = token;

  const { loading, run } = useRequest(
    new UploadBrowser({
      userConfig: {
        onUploadProgress(progressEvent, body) {
          console.log({
            progressEvent,
            body,
          });
        },
      },
    }).browserUpload,
    // async (files: UploadFilesBody<UploadBodyBrowser>['files']) => {
    //   return uploadFiles(browserUpload, {
    //     files: files,
    //     config: {
    //       // maxConcurrency: requiredBase.concurrentQuantity,
    //       // waitingTime: requiredBase.waitingInterval,
    //       onUploadProgress(progressEvent, body) {
    //         // setSchedule((obj) => {
    //         //   const file = body.file as unknown as UploadFile;
    //         //   obj[file.uid] = progressEvent.progress || 0;
    //         //   return { ...obj };
    //         // });
    //       },
    //       messageCallback: ({ item, err, data }) => {
    //         // form.setFieldValue(
    //         //   'property',
    //         //   property?.map((f) => {
    //         //     const file = item.file as unknown as UploadFile;
    //         //     if (f.uid === file.uid) {
    //         //       f.status = data ? 'done' : 'error';
    //         //       if (err) {
    //         //         f.response = getErrorMsg(err);
    //         //       }
    //         //     }
    //         //     return { ...f };
    //         //   }),
    //         // );
    //       },
    //     },
    //   });
    // },
    {
      manual: true,
      /*
       * 将上传的资源全部重置为loading
       * 排除掉已经成功的元素
       */
      onBefore() {
        // form.setFieldValue(
        //   'property',
        //   property?.map((f) => {
        //     if (f.originFileObj?.uid && cacheMap.get(f.originFileObj?.uid)) {
        //       return f;
        //     }
        //     return {
        //       ...f,
        //       status: 'uploading',
        //     };
        //   }),
        // );
      },
      onSuccess(data) {
        debugger;
        // message.destroy();
        // const multifile = data.length > 1;
        // if (data.every((f) => f.status === 'rejected')) {
        //   message.error(
        //     `上传文件${multifile ? '全部' : ''}失败，鼠标悬浮文件信息可以查看具体错误信息。`,
        //   );
        //   return;
        // }
        // if (data.some((f) => f.status === 'rejected')) {
        //   message.warning(
        //     `未${multifile ? '全部' : ''}上传成功，鼠标悬浮文件信息可以查看具体错误信息。`,
        //   );
        // }
        // message.success('上传成功');
        // event?.emit(EventName.uploadChanges);
        // /*
        //  * 上传成功，给表单一个标识标记上传成功
        //  */
        // property?.forEach((item) => {
        //   if (item.status === 'done') {
        //     cacheMap.set(item.originFileObj?.uid || '', true);
        //   }
        // });
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
