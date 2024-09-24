import { Affix, Card, Col, Layout, Row, Space } from 'antd';
import { Upload } from './upload/upload';
import { Setup } from './setup/setup';
import { Typography } from 'antd';
import CatppuccinFolderImagesOpen from '@/assets/CatppuccinFolderImagesOpen.svg';

const { Title } = Typography;
const { Meta } = Card;
const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Layout className="h-100vh">
      <Affix offsetTop={0}>
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
      </Affix>
      <Content className="p-12px">
        <Row gutter={[16, 16]}>
          <Col
            xs={{ flex: '100%' }}
            md={{ flex: '50%' }}
            lg={{ flex: '33%' }}
            xl={{ flex: '25%' }}
          >
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  alt="example"
                  className="max-h-200px w-auto object-fill"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta
                title="Europe Street beat"
                description="www.instagram.com"
              />
            </Card>
          </Col>
        </Row>
        <Footer>Footer</Footer>
      </Content>
    </Layout>
  );
};

export default App;
