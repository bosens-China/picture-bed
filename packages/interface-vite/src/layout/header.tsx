import { Space, theme } from 'antd';
import { Upload } from '@/components/upload/upload';

export const Header = () => {
  const { token } = theme.useToken();

  return (
    <>
      <div
        className={`flex p-x-24px items-center min-h-50px pos-fixed top-0 left-280px z-1 right-0`}
        style={{ backgroundColor: `var(--themeColor, ${token.colorBgLayout})` }}
      >
        {/* <a href="/" className="flex-1">
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
      </a> */}
        <div className="flex-1"></div>
        <Space size="large">
          <Upload></Upload>
        </Space>
      </div>
      <div className="h-50px z--1"></div>
    </>
  );
};
