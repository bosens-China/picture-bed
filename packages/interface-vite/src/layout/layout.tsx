import { Layout } from 'antd';
import { Footer as LayoutFooter } from './footer';
import { Header as LayoutHeader } from './header';
import { RootSider } from './sider/root-sider';
import { Outlet } from 'react-router-dom';
import { useAsyncEffect } from 'ahooks';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { addStaging, setSelected } from '@/store/features/staging/slice';

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
  const { staging } = useAppSelector((state) => state.staging);

  // 初始化情况下对一些值进行默认设定
  useAsyncEffect(async () => {
    if (!staging.length) {
      const res = await FingerprintJS.load().then((res) => {
        return res.get();
      });

      dispatch(
        addStaging({ label: '主工作台', key: 'main', uid: res.visitorId }),
      );
      dispatch(setSelected('main'));
    }
  }, []);

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
        <Layout style={{ marginInlineStart: 250 }}>
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
