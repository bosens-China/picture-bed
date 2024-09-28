import type { MenuProps } from 'antd';
import { ConfigProvider, Menu } from 'antd';
import { useMemo } from 'react';
import { AppstoreOutlined, DashOutlined } from '@ant-design/icons';
import { Sider } from './sider';

type MenuItem = Required<MenuProps>['items'][number];

export interface Edit {
  key?: string;
}

export const RootSider = () => {
  const items = useMemo<MenuItem[]>(() => {
    return [
      {
        label: '工作台',
        icon: <AppstoreOutlined></AppstoreOutlined>,
        key: 'workbench',
      },
      {
        label: '更多',
        icon: <DashOutlined />,
        key: 'setting',
        children: [
          {
            label: (
              <a
                href="https://github.com/bosens-China/picture-bed/issues"
                target="issues"
              >
                问题、意见反馈
              </a>
            ),
            key: 'feedback',
          },
        ],
      },
    ];
  }, []);

  const onClick: MenuProps['onClick'] = () => {};
  return (
    <div className="flex">
      <ConfigProvider
        theme={{
          components: {
            Menu: {},
          },
        }}
      >
        <Menu
          onClick={onClick}
          selectedKeys={['workbench']}
          mode="inline"
          inlineCollapsed={true}
          items={items}
          className="h-100vh"
        />
      </ConfigProvider>

      <Sider></Sider>
    </div>
  );
};
