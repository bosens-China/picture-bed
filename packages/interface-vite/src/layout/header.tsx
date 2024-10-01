import { Space } from 'antd';
import classnames from 'classnames';

import { Upload } from '@/components/upload/upload';
import { useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';

export const Header = () => {
  const theme = useTheme();
  const className = useMemo(() => {
    // @unocss-include
    return classnames([
      `flex p-x-24px items-center h-64px`,
      {
        'bg-#fff': theme === 'light',
      },
    ]);
  }, [theme]);
  return (
    <div className={className}>
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
  );
};
