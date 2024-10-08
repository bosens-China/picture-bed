import { App, Form, Input, Modal, Space, Tag, Tooltip } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import {
  addUser,
  MenuItem as FieldType,
  setSelected,
} from '@/store/features/users/slice';
import { Edit } from './sider';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { imgHistory } from 'core/api/page.js';
import { useRequest } from 'ahooks';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  edit: Edit;
  setEdit: React.Dispatch<React.SetStateAction<Edit>>;
}

export const SiderModal: FC<Props> = ({ open, setOpen, edit, setEdit }) => {
  const dispatch = useAppDispatch();

  const { message, modal } = App.useApp();

  const [form] = Form.useForm<FieldType>();

  const { users } = useAppSelector((state) => state.users);

  const handleCancel = () => {
    setOpen(false);
    setEdit({});
    form.resetFields();
  };

  const { runAsync: runHistory, loading: loadingHistory } = useRequest(
    imgHistory,
    { manual: true },
  );

  const handleOk = async () => {
    const values = await form.validateFields();
    values.uid ||= values.label as string;
    values.key = values.uid;
    /*
     * 如果是新增分组，调用一次查询接口判断分组是否已经存在了
     * 如果存在则进行弹窗提示，是否继续后续的步骤
     * 如果编辑则不等于自身的时候进行判断
     */

    let repeat = false;

    if (initialValues?.uid !== values.uid) {
      try {
        const data = await runHistory({ uid: values.uid });
        repeat = !!data.list.length;
      } catch {
        //
      }
    }

    if (repeat) {
      const result = await modal.confirm({
        title: `新建提示`,
        content: (
          <>
            远程用户标识 <Tag>{values.uid}</Tag>{' '}
            已经存在（可能其他用户也创建了相同的用户标识），是否继续添加分组？
          </>
        ),
      });
      if (!result) {
        return;
      }
    }

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
    return edit.key ? `编辑分组` : `添加分组`;
  }, [edit]);

  const initialValues = useMemo(() => {
    return users.find((f) => f.key === edit.key);
  }, [edit.key, users]);

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setFieldsValue(initialValues as any);
  }, [form, initialValues, open]);
  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        centered
        className="max-w-100vw"
        confirmLoading={loadingHistory}
      >
        <Form
          onFinish={handleOk}
          autoComplete="off"
          layout="vertical"
          form={form}
          initialValues={initialValues}
        >
          <Form.Item<FieldType>
            label="分组名称"
            name="label"
            rules={[
              {
                required: true,
                message: '请输入分组名称!',
              },
              {
                validator(_rule, value) {
                  /*
                   * 新增则全部校验，编辑则去除自身校验更改名称是否重复
                   */
                  const arr = users
                    .filter((f) => f.key !== edit.key)
                    .map((f) => f.label);
                  if (arr.includes(value)) {
                    return Promise.reject(`用户名称重复。`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="用于在左侧展示名称"></Input>
          </Form.Item>

          <div
            className="cursor-pointer my-12px flex items-center"
            onClick={() => setExpand(!expand)}
          >
            <span className="mr-6px">{!expand ? '展开' : '收起'}</span>
            {!expand ? <CaretDownFilled /> : <CaretUpFilled />}
          </div>

          <Form.Item<FieldType>
            label={
              <Space align="center">
                用户标识
                <Tooltip title="用于区分用户信息所使用，不同分组上传的资源文件不同，如果不输入则与名称保持一致。">
                  <Tag color="processing" className="cursor-pointer">
                    说明
                  </Tag>
                </Tooltip>
              </Space>
            }
            name="uid"
            rules={[
              {
                validator(_rule, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const arr = users
                    .filter((f) => f.key !== edit.key)
                    .map((f) => f.uid);
                  if (arr.includes(value)) {
                    return Promise.reject(`用户标识重复。`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
            className={!expand ? 'op-0 pos-absolute z--1' : ''}
          >
            <Input placeholder="用于区分用户信息所使用，不同分组上传的资源文件不同"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
