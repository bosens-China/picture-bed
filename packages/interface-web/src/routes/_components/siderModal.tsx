import { App, Button, Form, Input, Modal, Space, Tag, Tooltip } from 'antd';
import { FC, useMemo } from 'react';
import { imgHistory } from '@boses/picture-bed-sdk';
import { useAsyncEffect, useRequest } from 'ahooks';
import { useGroupingStore, Grouping } from '@/store/grouping';
import { defaultFingerprint } from '@/utils/fingerprint';
import { useShallow } from 'zustand/shallow';
import { useNavigate } from '@tanstack/react-router';

export interface SiderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  edit: Grouping | null;
  setEdit: React.Dispatch<React.SetStateAction<Grouping | null>>;
}

export const SiderModal: FC<SiderProps> = ({
  open,
  setOpen,
  edit,
  setEdit,
}) => {
  const { message, modal } = App.useApp();

  const [form] = Form.useForm<Pick<Grouping, 'title' | 'uid'>>();
  const navigate = useNavigate();

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const { runAsync: runHistory, loading: loadingHistory } = useRequest(
    imgHistory,
    { manual: true },
  );

  const handleOk = async () => {
    const values = await form.validateFields();
    // values.uid ||= values.label as string;
    // values.key = values.uid;
    /*
     * 如果是新增项目，调用一次查询接口判断项目是否已经存在了
     * 如果存在则进行弹窗提示，是否继续后续的步骤
     * 如果编辑则不等于自身的时候进行判断
     */
    let repeat = false;
    if (!edit?.id) {
      try {
        const data = await runHistory({ uid: values.uid });
        repeat = !!data.list.length;
      } catch {
        //
      }
    }
    if (repeat) {
      const result = await modal.confirm({
        title: `继续分组创建提示`,
        content: (
          <>
            远程用户标识 <Tag>{values.uid}</Tag>
            已经存在（可能其他用户也创建了相同的用户标识），是否继续添加项目？
          </>
        ),
      });
      if (!result) {
        return;
      }
    }
    if (edit?.id) {
      editGroup(edit.id, {
        ...edit,
        ...values,
      });
    } else {
      const id = getRandomId();
      addGroup({
        id,
        ...values,
      });
      navigate({
        to: '/grouping/$id',
        params: {
          id,
        },
      });
    }
    handleCancel();
    message.success(`${title}成功`);
  };

  const title = useMemo(() => {
    return edit?.id ? `编辑项目` : `添加项目`;
  }, [edit]);

  const { editGroup, addGroup, groups } = useGroupingStore(
    useShallow((state) => {
      return {
        editGroup: state.editGroup,
        addGroup: state.addGroup,

        activeId: state.activeId,
        groups: state.groups,
      };
    }),
  );

  const initialValues = async () => {
    return (
      groups.find((f) => f.id === edit?.id) || {
        uid: groups.length
          ? getRandomId()
          : (await defaultFingerprint()).visitorId,
        title: groups.length ? '' : `默认项目`,
      }
    );
  };

  useAsyncEffect(async () => {
    if (!open) {
      setEdit(null);
      return;
    }
    const values = await initialValues();
    form.setFieldsValue(values);
  }, [form, initialValues, open, setEdit]);

  // 获取随机id
  function getRandomId() {
    return Math.random().toString(36).substring(2, 10);
  }

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
        >
          <Form.Item<Grouping>
            label="项目名称"
            name="title"
            rules={[
              {
                required: true,
                message: '请输入项目名称!',
              },
              {
                validator(_rule, value) {
                  /*
                   * 新增则全部校验，编辑则去除自身校验更改名称是否重复
                   */
                  const arr = groups
                    .filter((f) => f.id !== edit?.id)
                    .map((f) => f.title);
                  if (arr.includes(value)) {
                    return Promise.reject(`项目名称「${value}」已存在。`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="请输入项目名称..."></Input>
          </Form.Item>

          <Form.Item<Grouping>
            label={
              <Space align="center" className="flex-1">
                用户标识
                <Tooltip title="用于区分用户身份所使用，不同项目上传的用户标识不同。">
                  <Tag color="processing" className="cursor-pointer">
                    说明
                  </Tag>
                </Tooltip>
              </Space>
            }
            name="uid"
            extra={
              <Space className=" mt-1">
                <Button
                  className="pl-0!"
                  type="link"
                  onClick={async () => {
                    const res = await defaultFingerprint();
                    form.setFieldsValue({
                      uid: res.visitorId,
                    });
                  }}
                >
                  使用默认标识
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    form.setFieldsValue({
                      uid: getRandomId(),
                    });
                  }}
                >
                  随机生成
                </Button>
              </Space>
            }
            rules={[
              {
                required: true,
                message: '请输入用户标识!',
              },
              {
                validator(_rule, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const arr = groups
                    .filter((f) => f.id !== edit?.id)
                    .map((f) => f.id);
                  if (arr.includes(value)) {
                    return Promise.reject(`用户标识「${value}」已存在。`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="请输入用户标识..."></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
