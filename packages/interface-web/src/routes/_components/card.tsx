import { CopyOutlined, DashOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Dropdown, Image, Tooltip } from 'antd';
import { ImgHistoryResponse } from '@boses/picture-bed-sdk';
import { FC } from 'react';
import dayjs from 'dayjs';
import copy from 'copy-text-to-clipboard';

type CardProps = ImgHistoryResponse['data'][number];

// 卡片
export const Card: FC<CardProps> = ({
  contentType,
  fileName,
  size,
  time,
  url,
}) => {
  // 后缀
  const suffix = fileName.split('.').at(-1) || fileName;
  const { message } = App.useApp();
  return (
    <div className="border-solid border-color-border-color border-0.5 rounded-2 bg-card-bg">
      <div className="h-50 overflow-hidden flex justify-center items-center rounded-2">
        {contentType.includes('image') ? (
          <Image className="min-w-24" src={url} />
        ) : (
          <Avatar size={160} className="text-size-12! max-w-90% max-h-90%">
            {suffix}
          </Avatar>
        )}
      </div>
      <div className="p-4 text-size-3.5 lh-5">
        <div className="color-title flex items-center justify-between">
          <div className="overflow-hidden flex-grow whitespace-nowrap text-ellipsis">
            {fileName}
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  label: '复制链接',
                  key: 'copy',
                  icon: <CopyOutlined />,
                  onClick: () => {
                    copy(url);
                    message.success(`复制链接成功。`);
                  },
                },
              ],
            }}
          >
            <Button
              type="text"
              className="flex-shrink-0"
              icon={<DashOutlined className="" />}
            ></Button>
          </Dropdown>
        </div>
        <div className="color-secondary flex items-center justify-between">
          <div>{size}</div>
          <Tooltip title={dayjs(time).format('YYYY-MM-DD HH:mm')}>
            <div>{dayjs(time).format('YYYY-MM-DD')}</div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
