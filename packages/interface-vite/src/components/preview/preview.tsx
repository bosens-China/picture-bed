import { FC, useMemo } from 'react';

interface Props {
  url: string;
}

export const Preview: FC<Props> = ({ url }) => {
  return useMemo(() => {
    const type = url.split('.').pop()?.toLowerCase() || '';

    switch (type) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp':
        return <img src={url} alt={url} />;

      case 'mp4':
      case 'webm':
      case 'ogg':
        return (
          <video controls>
            <source src={url} type={`video/${type}`} />
            <p>暂时不支持预览 {type} 类型</p>
          </video>
        );

      case 'mp3':
      case 'wav':
        return (
          <audio controls>
            <source src={url} type={`audio/${type}`} />
            <p>暂时不支持预览 {type} 类型</p>
          </audio>
        );

      // case 'pdf':
      //   return (
      //     <embed src={url} type="application/pdf" width="600" height="500" />
      //   );

      default:
        return <p>Unsupported file type: {url}</p>;
    }
  }, [url]);
};
