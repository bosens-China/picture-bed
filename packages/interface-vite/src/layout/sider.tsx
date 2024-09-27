import type { MenuProps } from 'antd';
import { Button, Dropdown, Menu } from 'antd';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useMemo, useState } from 'react';
import { setSelected } from '@/store/features/staging/slice';
import { SiderModal } from './siderModal';
import { DashOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import _ from 'lodash-es';

type MenuItem = Required<MenuProps>['items'][number];

export interface Edit {
  key?: string;
}

export const Sider = () => {
  const { staging, selected } = useAppSelector((state) => state.staging);
  const dispatch = useAppDispatch();

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

  const operateClick = (key: string, e: { key: string }) => {
    switch (e.key) {
      case 'edit':
        setEdit({ key: key });
        setOpen(true);
        return;
    }
  };

  const items = useMemo<MenuItem[]>(() => {
    return [
      {
        key: 'add',
        label: <Button>添加工作台</Button>,
        style: {
          background: '#fff',
        },
      },
      ...staging.map((f) => {
        return {
          ...f,
          label: (
            <div className="flex">
              <div className="flex-1 mr-6px">{f.label}</div>
              {f.key !== 'main' && (
                <Dropdown
                  menu={{
                    items: operateItems,
                    onClick: _.partial(operateClick, f.key),
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <DashOutlined></DashOutlined>
                  </a>
                </Dropdown>
              )}
            </div>
          ),
        };
      }),
    ];
  }, [operateItems, staging]);

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
  };
  return (
    <>
      <Menu
        onClick={onClick}
        selectedKeys={selected ? [selected] : []}
        mode="inline"
        items={items}
      />
      <SiderModal edit={edit} setEdit={setEdit} open={open} setOpen={setOpen} />
    </>
  );
};
