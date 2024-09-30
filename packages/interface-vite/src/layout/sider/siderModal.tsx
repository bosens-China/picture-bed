import { App, Form, Input, Modal, Space, Tag, Tooltip } from 'antd';
import { FC, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import {
  addUser,
  MenuItem as FieldType,
  setSelected,
} from '@/store/features/users/slice';
import { Edit } from './sider';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  edit: Edit;
  setEdit: React.Dispatch<React.SetStateAction<Edit>>;
}

export const SiderModal: FC<Props> = ({ open, setOpen, edit, setEdit }) => {
  const dispatch = useAppDispatch();

  const { message } = App.useApp();

  const [form] = Form.useForm<FieldType>();

  const { users } = useAppSelector((state) => state.users);

  const handleCancel = () => {
    setOpen(false);
    setEdit({});
    form.resetFields();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    values.uid ||= values.label as string;
    values.key = values.uid;
    dispatch(
      addUser({
        ...values,
      }),
    );
    // 激活
    dispatch(setSelected(values.key));

    handleCancel();
    message.success('添加成功');
  };

  const title = useMemo(() => {
    return edit.key ? `编辑用户` : `添加用户`;
  }, [edit]);

  const initialValues = useMemo(() => {
    return users.find((f) => f.key === edit.key);
  }, [edit.key, users]);

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        centered
      >
        <Form
          onFinish={handleOk}
          autoComplete="off"
          layout="vertical"
          form={form}
          initialValues={initialValues}
        >
          <Form.Item<FieldType>
            label="名称"
            name="label"
            rules={[
              {
                required: true,
                message: '请输入用户名称!',
              },
              {
                validator(_rule, value, callback) {
                  /*
                   * 新增则全部校验，编辑则去除自身校验更改名称是否重复
                   */
                  const arr = users
                    .filter((f) => f.key !== edit.key)
                    .map((f) => f.label);
                  if (arr.includes(value)) {
                    return callback(`用户名称重复。`);
                  }
                  return callback();
                },
              },
            ]}
          >
            <Input placeholder="用于在左侧展示名称"></Input>
          </Form.Item>
          <Form.Item<FieldType>
            label={
              <Space align="center">
                用户标识
                <Tooltip title="用于区分用户信息所使用，不同用户上传的资源文件不同，如果不输入则与名称保持一致。">
                  <Tag color="processing" className="cursor-pointer">
                    说明
                  </Tag>
                </Tooltip>
              </Space>
            }
            name="uid"
            rules={[
              {
                validator(_rule, value, callback) {
                  if (!value) {
                    return callback();
                  }
                  const arr = users
                    .filter((f) => f.key !== edit.key)
                    .map((f) => f.uid);
                  if (arr.includes(value)) {
                    return callback(`用户标识重复。`);
                  }
                  return callback();
                },
              },
            ]}
          >
            <Input placeholder="用于区分用户信息所使用，不同用户上传的资源文件不同"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
