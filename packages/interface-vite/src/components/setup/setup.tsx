import { DownSquareTwoTone, UpSquareTwoTone } from '@ant-design/icons';
import { App, Button, Form, Input, Modal, theme, Tooltip } from 'antd';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { activationItem } from '@/store/features/staging/selectors';

const { useToken } = theme;

interface FieldType {
  uid: string;
}

export const Setup = () => {
  const [open, setOpen] = useState(false);
  // 高级功能是否展开
  const [expand, setExpand] = useState(false);
  const { message } = App.useApp();
  const { token } = useToken();

  const [form] = Form.useForm<FieldType>();

  const activation = useAppSelector(activationItem);

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setExpand(false);
  };
  const handleOk = async () => {
    // const values = await form.validateFields();
    // store('user', values);
    // handleCancel();
    // message.success('设置成功');
  };

  return (
    <>
      <Tooltip title="打开图床相关设置" placement={'leftTop'}>
        <Button
          disabled={!activation?.uid}
          className="flex"
          onClick={() => setOpen(true)}
        >
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
        footer={[
          <Button key="not" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form
          onFinish={handleOk}
          initialValues={activation}
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
