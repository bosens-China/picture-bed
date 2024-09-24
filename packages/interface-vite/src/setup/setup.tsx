import { DownSquareTwoTone, UpSquareTwoTone } from '@ant-design/icons';
import { App, Button, Form, Input, Modal, theme, Tooltip } from 'antd';
import { useState } from 'react';

type FieldType = {
  uid: string;
};

const { useToken } = theme;

export const Setup = () => {
  const [open, setOpen] = useState(false);
  // 高级功能是否展开
  const [expand, setExpand] = useState(false);
  const { message } = App.useApp();
  const { token } = useToken();

  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setExpand(false);
  };
  const handleOk = () => {
    handleCancel();
  };

  return (
    <>
      <Tooltip title="打开图床相关设置" placement={'leftTop'}>
        <Button className="flex" onClick={() => setOpen(true)}>
          <div className="i-catppuccin-eslint-ignore text-size-2xl cursor-pointer"></div>
          设置
        </Button>
      </Tooltip>

      <Modal
        title="上传资源"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        centered
      >
        <Form
          initialValues={{}}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item<FieldType>
            label="用户标识"
            name="uid"
            rules={[
              {
                required: true,
                message: '请上传资源文件!',
              },
            ]}
          >
            <Input placeholder="用于区分用户信息所使用，不同用户上传的资源文件不同"></Input>
          </Form.Item>
          <div
            className="cursor-pointer flex items-center"
            style={{ color: token.colorPrimary }}
            onClick={() => setExpand(!expand)}
          >
            <span className="mr-3px select-none">
              {expand ? `收起` : `展开`}
            </span>
            {!expand ? (
              <DownSquareTwoTone className="text-size-18px" />
            ) : (
              <UpSquareTwoTone className="text-size-18px" />
            )}
          </div>
          {expand && <></>}
        </Form>
      </Modal>
    </>
  );
};
