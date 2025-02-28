import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
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
import { MenuProps } from 'antd';
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
import { useProject } from '@/hooks/use-project';
import { SiderModal } from './_components/siderModal';
import { ProjectItem, useProjectStore } from '@/store/project';
import { useInspect } from '@/hooks/use-inspect';
import { MyUpload } from './_components/upload';

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

export const Route = createRootRoute({
  component: () => {
    const { projects, current } = useProject();
    const { modal, message } = App.useApp();
    const removeProject = useProjectStore((state) => state.removeProject);
    const setCurrent = useProjectStore((state) => state.setCurrent);

    const items: MenuProps['items'] = projects.map((project) => ({
      key: project.id,
      icon: <Dir></Dir>,
      label: (
        <div
          className="overflow-hidden flex-grow whitespace-nowrap text-ellipsis"
          title={project.title}
        >
          {project.title}
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
                    setEdit(project);
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
                          确定要删除该分组吗？
                          <br />
                          删除分组只是在本地清空，后续如果添加相同用户标识的分组数据依然存在。
                        </>
                      ),
                      onOk() {
                        removeProject(project.id);
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
    const [edit, setEdit] = useState<ProjectItem | null>(null);

    /*
     * 健康检查
     */
    useInspect();

    return (
      <>
        <Layout hasSider>
          <Sider
            style={siderStyle}
            width={280}
            className="p-6 border-r-solid border-r-color-#E5E7EB border-0.5"
          >
            <Space align="center">
              <Logo></Logo>
              <div className="color-#111827 lh-8 font-700 text-size-6">
                敖武的图床
              </div>
            </Space>
            <MyUpload></MyUpload>

            <div>
              <div className="color-#6B7280 text-size-3.5 lh-5">项目列表</div>
              <Menu
                theme="light"
                mode="inline"
                selectedKeys={[current].filter((f) => f !== null)}
                items={items}
                inlineIndent={12}
                onClick={(e) => {
                  setCurrent(e.key);
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
            <Header className="flex justify-center px-6 border-b-solid border-b-color-#E5E7EB border-0.5">
              <div className="flex-1"></div>
              <Space align="center" size="large">
                <Input
                  prefix={<SearchOutlined></SearchOutlined>}
                  placeholder="搜索图片"
                  className="w-64"
                ></Input>
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

        <TanStackRouterDevtools />
      </>
    );
  },
});
