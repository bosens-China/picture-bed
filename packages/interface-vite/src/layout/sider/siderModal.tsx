import { App, Form, Input, Modal, Space, Tag, Tooltip } from 'antd';
import { FC, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import {
  addStaging,
  MenuItem as FieldType,
  setSelected,
} from '@/store/features/staging/slice';
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

  const { staging } = useAppSelector((state) => state.staging);

  const handleCancel = () => {
    setOpen(false);
    setEdit({});
    form.resetFields();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const key = values.uid;
    dispatch(
      addStaging({
        ...values,
        key,
      }),
    );
    // 激活
    dispatch(setSelected(key));

    handleCancel();
    message.success('添加成功');
  };

  const title = useMemo(() => {
    return edit ? `编辑工作台` : `添加工作台`;
  }, [edit]);

  const initialValues = useMemo(() => {
    return staging.find((f) => f.key === edit.key);
  }, [edit.key, staging]);

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
            label="工作台名称"
            name="label"
            rules={[
              {
                required: true,
                message: '请输入工作台名称!',
              },
              {
                validator(_rule, value, callback) {
                  if (staging.find((f) => f.label === value)) {
                    return callback(`工作台名称重复。`);
                  }
                  return callback();
                },
              },
            ]}
          >
            <Input placeholder="用于在左侧工作台展示名称"></Input>
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
                  if (staging.find((f) => f.key === value)) {
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
