import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';

import React, { useState } from 'react';
import {
  DashOutlined,
  DeleteOutlined,
  FormOutlined,
  GithubOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { MenuProps, Tag, Tooltip } from 'antd';
import {
  App,
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Space,
  Typography,
} from 'antd';
import Logo from '@/assets/logo.svg?react';
import Dir from '@/assets/dir.svg?react';
import { SiderModal } from './_components/siderModal';
import { Grouping, useGroupingStore } from '@/store/grouping';

import { MyUpload } from './_components/upload';
import { useShallow } from 'zustand/shallow';

const { Header, Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

export const Route = createFileRoute('/grouping')({
  component: RouteComponent,
  loader(ctx) {
    const { id } = ctx.params as Record<string, string>;
    const { setActiveId } = useGroupingStore.getState();
    setActiveId(id);
  },
});

function RouteComponent() {
  const { modal, message } = App.useApp();
  const { removeGroup, groups, activeId } = useGroupingStore(
    useShallow((state) => {
      return {
        removeGroup: state.removeGroup,

        groups: state.groups,
        activeId: state.activeId,
      };
    }),
  );

  const navigate = useNavigate();

  const items: MenuProps['items'] = groups.map((group) => ({
    key: group.id,
    icon: <Dir></Dir>,
    label: (
      <div
        className="overflow-hidden flex-grow whitespace-nowrap text-ellipsis"
        title={group.title}
      >
        {group.title}
      </div>
    ),
    extra: (
      <>
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: '编辑',
                icon: <FormOutlined />,
                onClick: (e) => {
                  e.domEvent.stopPropagation();
                  setEdit(group);
                  setOpen(true);
                },
              },

              {
                key: 'delete',
                label: '删除',

                icon: <DeleteOutlined />,
                onClick: async (e) => {
                  e.domEvent.stopPropagation();
                  await modal.confirm({
                    title: `删除提醒`,
                    content: (
                      <>
                        确定要删除「<Tag>{group.title}</Tag>」分组吗？
                        <br />
                        删除分组只是在本地清空，后续如果添加相同用户标识的分组数据依然存在。
                      </>
                    ),
                    onOk() {
                      removeGroup(group.id);
                      message.success('删除成功');
                    },
                  });
                },
              },
            ],
          }}
          trigger={['click', 'hover']}
        >
          <Button type="text" icon={<DashOutlined></DashOutlined>}></Button>
        </Dropdown>
      </>
    ),
  }));

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Grouping | null>(null);

  return (
    <>
      <Layout hasSider>
        <Sider
          style={siderStyle}
          width={280}
          className="p-6 border-r-solid border-r-color-border-color border-0.5"
        >
          <Space align="center">
            <Logo></Logo>
            <div className="color-title lh-8 font-700 text-size-6">
              敖武的图床
            </div>
          </Space>
          <MyUpload></MyUpload>

          <div>
            <div className="color-secondary text-size-3.5 lh-5">项目列表</div>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[activeId].filter((f) => f != null)}
              items={items}
              inlineIndent={12}
              onClick={({ key }) => {
                navigate({
                  to: '/grouping/$id',
                  params: {
                    id: key,
                  },
                });
              }}
            />
            <Button
              type="dashed"
              size="large"
              block
              className="mt-6"
              icon={<PlusOutlined />}
              onClick={() => {
                setOpen(true);
              }}
            >
              新建项目
            </Button>
          </div>
        </Sider>
        <Layout>
          <Header className="flex justify-center px-6 border-b-solid border-b-color-border-color border-0.5 pos-sticky top-0 z-2">
            <div className="flex-1">
              <Tooltip title="等待接口接入...">
                <Input
                  prefix={<SearchOutlined></SearchOutlined>}
                  placeholder="搜索图片"
                  className="w-64"
                  disabled={true}
                ></Input>
              </Tooltip>
            </div>

            <Space align="center" size="large">
              <Typography.Link className="color-#4B5563 text-size-5">
                <SettingOutlined />
              </Typography.Link>
              <a
                href="https://playground.z.wiki/img-cloud/index.html"
                target="_blank"
                rel="noreferrer"
                title="跳转原图床"
              >
                敖武的图床
              </a>
              <a
                href="https://github.com/bosens-China/picture-bed"
                target="_blank"
                rel="noreferrer"
                title="跳转GitHub地址"
                className="text-size-2xl color-#4B5563 hover:color-#2563EB"
              >
                <GithubOutlined />
              </a>
            </Space>
          </Header>
          <Content style={{ overflow: 'initial' }} className="px-6 py-5.25">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <SiderModal
        open={open}
        setOpen={setOpen}
        edit={edit}
        setEdit={setEdit}
      ></SiderModal>
    </>
  );
}
