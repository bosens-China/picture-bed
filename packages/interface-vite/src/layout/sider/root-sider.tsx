import type { MenuProps } from 'antd';
import { ConfigProvider, Menu } from 'antd';
import { useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  DashOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Sider } from './sider';
import { Setup } from '@/components/setup/setup';

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
    ];
  }, []);

  const [setupOpen, setSetupOpen] = useState(false);

  const moreItems = useMemo<MenuItem[]>(() => {
    return [
      {
        label: '更多',

        icon: <DashOutlined></DashOutlined>,
        key: 'more',
        children: [
          {
            label: '使用说明',
            icon: <div className="i-mdi-comment-question"></div>,
            key: 'SettingOutlined',
          },
          {
            label: '设置',
            icon: <SettingOutlined />,
            key: 'SettingOutlined',
            onClick: () => {
              setSetupOpen(true);
            },
          },
          {
            label: (
              <a
                href="https://github.com/bosens-China/picture-bed/issues"
                target="issues"
              >
                问题、意见反馈
              </a>
            ),
            icon: <QuestionCircleOutlined />,
            key: 'QuestionCircleOutlined',
          },
        ],
      },
    ];
  }, []);

  const onClick: MenuProps['onClick'] = () => {};
  return (
    <>
      <div className="flex">
        <ConfigProvider
          theme={{
            components: {
              Menu: {},
            },
          }}
        >
          <div className="h-100vh flex flex-col">
            <Menu
              onClick={onClick}
              selectedKeys={['workbench']}
              mode="inline"
              inlineCollapsed={true}
              items={items}
              className="flex-1"
            />
            <Menu
              triggerSubMenuAction={'click'}
              inlineCollapsed={true}
              items={moreItems}
              mode="inline"
              selectedKeys={[]}
            />
          </div>
        </ConfigProvider>

        <Sider></Sider>
      </div>
      <Setup setOpen={setSetupOpen} open={setupOpen}></Setup>
    </>
  );
};
