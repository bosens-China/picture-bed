import type { MenuProps } from 'antd';
import { App, Button, Dropdown, Menu, Space, Tag } from 'antd';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback, useMemo, useState } from 'react';
import { removeUser, setSelected } from '@/store/features/users/slice';
import { SiderModal } from './siderModal';

import {
  DashOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import * as _ from 'lodash-es';
import { useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

export interface Edit {
  key?: string;
}

export const Sider = () => {
  const { users, selected } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { modal, message } = App.useApp();

  const [edit, setEdit] = useState<Edit>({});

  const operateItems = useMemo<MenuItem[]>(
    () => [
      {
        key: 'edit',
        label: '编辑',
        icon: <FormOutlined />,
      },

      {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
      },
    ],
    [],
  );

  const operateClick = useCallback(
    async (
      key: string,
      e: Parameters<NonNullable<MenuProps['onClick']>>[0],
    ) => {
      e.domEvent.stopPropagation();

      switch (e.key) {
        case 'edit':
          setEdit({ key: key });
          setOpen(true);
          return;
        case 'delete':
          await modal.confirm({
            title: `删除提醒`,
            content: (
              <>
                确定要删除该分组吗？
                <br />
                删除数据只是在工作台隐藏分组，后续如果添加相同分组标识的分组数据依然存在。
              </>
            ),
            onOk() {
              dispatch(removeUser(key));
              message.success('删除成功');
            },
          });
      }
    },
    [dispatch, message, modal],
  );

  const items = useMemo<MenuItem[]>(() => {
    return [
      {
        key: 'add',
        label: (
          <div className="flex flex-1 justify-center items-center">
            <Button icon={<PlusOutlined />}>添加分组</Button>
          </div>
        ),
        style: {
          background: `var(--themeColor)`,
        },
      },
      ...users.map((f) => {
        return {
          ...f,
          label: (
            <div className="flex flex-1 justify-between">
              <div className="mr-6px flex-1">{f.label}</div>
              {f.key === 'main' && (
                <div className="mr-21px">
                  <Tag color="processing">本地</Tag>
                </div>
              )}

              {f.key !== 'main' && (
                <Dropdown
                  menu={{
                    items: operateItems,

                    onClick: _.partial(operateClick, f.key),
                  }}
                  trigger={['click', 'hover']}
                >
                  <a onClick={(e) => e.preventDefault()} className="">
                    <Space align="center">
                      <Tag color="processing">本地</Tag>
                      <DashOutlined></DashOutlined>
                    </Space>
                  </a>
                </Dropdown>
              )}
            </div>
          ),
        };
      }),
    ];
  }, [operateClick, operateItems, users]);

  const [open, setOpen] = useState(false);

  const onAdd = () => {
    setOpen(true);
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'add') {
      onAdd();
      return;
    }
    dispatch(setSelected(e.key));
    // 更改路由
    navigate(e.key);
  };
  return (
    <>
      <Menu
        onClick={onClick}
        selectedKeys={selected ? [selected] : []}
        mode="inline"
        items={items}
        className="w-200px"
      />
      <SiderModal edit={edit} setEdit={setEdit} open={open} setOpen={setOpen} />
    </>
  );
};
