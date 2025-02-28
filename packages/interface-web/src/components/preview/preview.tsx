import { Avatar, Image } from 'antd';
import { ResponseParameters } from 'core/api/page.js';
import { FC, useMemo } from 'react';
import { TypeIcons } from './types-icon';

type Props = ResponseParameters['data'][number];

export const Preview: FC<Props> = ({ url, contentType }) => {
  return useMemo(() => {
    const [, type] = contentType.split('/').map((f) => f.toLowerCase());
    const fileType = url.split('.').pop()?.toLowerCase();
    if (contentType.includes('image')) {
      return (
        <div className="h-140px flex! justify-center items-center">
          <Image
            className="h-auto! object-fill w-auto! min-w-48px max-h-140px!"
            src={url}
            alt={url}
          />
        </div>
      );
    }
    if (contentType.includes('video')) {
      return (
        <video controls className="h-140px">
          <source src={url} type={`video/${type}`} />
          <p>暂时不支持预览 {type} 类型</p>
        </video>
      );
    }
    if (contentType.includes('audio')) {
      return (
        <div className="h-140px flex! justify-center items-center p-x-12px">
          <audio controls src={url}>
            <source src={url} type={`audio/${type}`} />
            <p>暂时不支持播放 {type} 类型</p>
          </audio>
        </div>
      );
    }

    return (
      <div
        className="h-140px flex! justify-center items-center p-t-15px"
        onClick={() => {
          window.open(url, url);
        }}
      >
        <TypeIcons fileName={url}>
          <Avatar shape="square" size={140}>
            {fileType ? `${fileType}` : `.${type}`}
          </Avatar>
        </TypeIcons>
      </div>
    );
  }, [contentType, url]);
};
