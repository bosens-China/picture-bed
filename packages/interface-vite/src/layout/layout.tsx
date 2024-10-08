import { Layout, theme } from 'antd';
import { Footer as LayoutFooter } from './footer';
import { Header as LayoutHeader } from './header';
import { RootSider } from './sider/root-sider';
import { Outlet } from 'react-router-dom';
import { useAsyncEffect } from 'ahooks';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { addUser } from '@/store/features/users/slice';
import { useNavigate } from 'react-router-dom';
import { useStyle } from '@/hooks/useStyle';

const { useToken } = theme;

export const AppLayout = () => {
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users } = useAppSelector((state) => state.users);

  // 初始化情况下对一些值进行默认设定
  useAsyncEffect(async () => {
    if (!users.length) {
      const res = await FingerprintJS.load().then((res) => {
        return res.get();
      });

      dispatch(addUser({ label: '默认分组', key: 'main', uid: res.visitorId }));
      navigate('/');
    }
  }, [users.length]);

  const { token } = useToken();

  /*
   * 注入一些样式到css中
   */

  useStyle({
    body: {
      'background-color': token.colorBgLayout,
    },
  });

  return (
    <>
      {/* <Layout className="h-100vh">
      <Affix offsetTop={0}>
        <Header>
       
        </Header>
      </Affix>
    
    </Layout> */}
      <Layout hasSider className="h-100vh">
        <div style={siderStyle}>
          <RootSider></RootSider>
        </div>
        <main style={{ marginInlineStart: 280 }} className="w-100vw">
          <LayoutHeader></LayoutHeader>
          <div
            style={{ backgroundColor: `var(--themeColor)` }}
            className="m-12px mb-0"
          >
            <Outlet />
          </div>
          <footer
            style={{ textAlign: 'center', background: token.colorBgLayout }}
          >
            <LayoutFooter></LayoutFooter>
          </footer>
        </main>
      </Layout>
    </>
  );
};
