import type { MenuProps } from 'antd';
import { App, ConfigProvider, Menu } from 'antd';
import { useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  ClearOutlined,
  DashOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Sider } from './sider';
import { Setup } from '@/components/setup/setup';
import { setStore } from '@/store/utils';

type MenuItem = Required<MenuProps>['items'][number];

export interface Edit {
  key?: string;
}

export const RootSider = () => {
  const { modal } = App.useApp();
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
          },
          {
            label: '设置',
            icon: <SettingOutlined />,

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
          {
            label: '恢复默认设置',
            icon: <ClearOutlined />,

            onClick: () => {
              modal.confirm({
                title: '恢复默认设置',
                content: '恢复默认设置会把所有设置会滚到最初状态，请谨慎操作。',
                onOk: () => {
                  setStore(undefined);
                  window.location.reload();
                },
                okText: '确定',
                cancelText: '取消',
              });
            },
          },
        ],
      },
    ].map((f, index) => {
      return {
        ...f,
        key: index,
      };
    });
  }, [modal]);

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
