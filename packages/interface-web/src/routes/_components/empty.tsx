import EmptyImg from '@/assets/empty-img.svg?react';
import EmptyProject from '@/assets/empty-project.svg?react';
import { FC } from 'react';

interface Props {
  type: 'assets' | 'projects';
}

export const Empty: FC<Props> = ({ type }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-#F9FAFB rounded-50% w-40 p-14 flex justify-center items-center h-40">
        {type === 'assets' ? (
          <EmptyImg className="w-24 h-24"></EmptyImg>
        ) : (
          <EmptyProject className="w-24 h-24"></EmptyProject>
        )}
      </div>
      <div className="color-#111827 lh-8 font-600 text-size-4 mt-4.75">
        {type === 'assets' ? `暂无图片` : `暂无项目`}
      </div>
      <div className="color-#4B5563 lh-6">
        {type === 'assets'
          ? `当前还没有上传任何图片，支持 JPG、PNG、SVG 等格式`
          : `您还没有创建任何项目，开始创建您的第一个项目吧`}
      </div>
    </div>
  );
};
