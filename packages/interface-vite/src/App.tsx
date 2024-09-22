import { Layout, Space } from 'antd';
import { Upload } from './upload/upload';
import { Setup } from './setup/setup';
import { Typography } from 'antd';
import CatppuccinFolderImagesOpen from '@/assets/CatppuccinFolderImagesOpen.svg';

const { Title } = Typography;

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Layout className="h-100vh">
      <Header>
        <div className="flex p-x-24px items-center">
          <a href="/" className="flex-1">
            <Title
              style={{
                margin: 0,
                padding: 0,
                fontSize: '24px',
                lineHeight: '64px',
                fontWeight: 400,
              }}
              level={1}
            >
              <Space align="center">
                <img
                  src={CatppuccinFolderImagesOpen}
                  alt="logo"
                  className="h-32px vertical--6px"
                />
                图床资源上传
              </Space>
            </Title>
          </a>

          <Space size="large">
            <Setup></Setup>
            <Upload></Upload>
          </Space>
        </div>
      </Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default App;
