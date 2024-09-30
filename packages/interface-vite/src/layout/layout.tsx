import { Layout } from 'antd';
import { Footer as LayoutFooter } from './footer';
import { Header as LayoutHeader } from './header';
import { RootSider } from './sider/root-sider';
import { Outlet } from 'react-router-dom';
import { useAsyncEffect } from 'ahooks';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { addUser } from '@/store/features/users/slice';
import { useNavigate } from 'react-router-dom';

const { Content, Footer } = Layout;

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

      dispatch(addUser({ label: '默认用户', key: 'main', uid: res.visitorId }));
      navigate('/');
    }
  }, [users.length]);

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
        <Layout style={{ marginInlineStart: 280 }}>
          <LayoutHeader></LayoutHeader>
          <Content>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <LayoutFooter></LayoutFooter>
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};
