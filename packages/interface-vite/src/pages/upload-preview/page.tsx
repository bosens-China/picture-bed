import { usePagination } from 'ahooks';
import {
  App,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Pagination,
  Row,
  Typography,
  Spin,
  Tooltip,
  Empty,
  Dropdown,
  MenuProps,
} from 'antd';
import { imgHistory } from 'core/api/page.js';
import { useAppSelector } from '@/store/hooks';
import { activationItem } from '@/store/features/users/selectors';
import { useMemo } from 'react';
import { Preview } from '@/components/preview/preview';
import dayjs from 'dayjs';
import './style.less';
import { getErrorMsg } from '@/utils/error';
import { getVideoUrl } from './utils';
import { CopyOutlined } from '@ant-design/icons';
import classnames from 'classnames';

const { Text } = Typography;
const { Meta } = Card;

export const UploadPreview = () => {
  const { message } = App.useApp();
  const activation = useAppSelector(activationItem);
  const { loading, data, pagination } = usePagination(
    ({ pageSize, current }) => {
      return imgHistory({ pageSize, current, uid: activation?.uid || '' });
    },
    {
      onError(e) {
        message.error(getErrorMsg(e));
      },
      ready: !!activation?.uid,
      refreshDeps: [activation?.uid],
    },
  );

  const list = useMemo(() => {
    return data?.list.map((f) => {
      if (f.contentType.includes('video')) {
        f.url = getVideoUrl(f.url);
      }
      return f;
    });
  }, [data?.list]);

  return (
    <div className="p-12px upload-preview  flex flex-col">
      <Spin
        spinning={loading}
        wrapperClassName={classnames([
          `flex-1 overflow-x-hidden overflow-y-auto`,
          { hidden: !list?.length },
        ])}
      >
        <Row gutter={[8, 16]} className="my-12px">
          {list?.map((item) => {
            const name = item.fileName.split('/').at(-1) || '';
            const time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss');
            const borderedItems: DescriptionsProps['items'] = [
              {
                key: '1',
                label: '大小',
                children: item.size,
              },
              {
                key: '1',
                label: '上传时间',
                children: (
                  <Text style={{ width: 200 }} ellipsis={{ tooltip: time }}>
                    {time}
                  </Text>
                ),
              },
              {
                key: '1',
                label: '类型',
                children: (
                  <Text
                    code
                    style={{ width: 200 }}
                    ellipsis={{ tooltip: item.contentType }}
                  >
                    {item.contentType}
                  </Text>
                ),
              },
            ];
            type ContextMenuItems = NonNullable<MenuProps['items']>[number] & {
              show?: boolean;
            };
            const contextMenuItems: ContextMenuItems[] = [
              {
                label: '复制 URL',
                key: '1',
                icon: <CopyOutlined />,
                onClick: async () => {
                  await navigator.clipboard.writeText(item.url);
                  message.success('复制成功');
                },
              },
              {
                label: '解压 ZIP',
                key: '2',
                show: /\.zip/i.test(item.url),
                icon: (
                  <div className="i-vscode-icons-file-type-zip text-size-18px"></div>
                ),
              },
            ].filter((f) => ('show' in f ? f.show : true));
            return (
              <Col
                key={item.id}
                xs={{ flex: '100%' }}
                md={{ flex: '50%' }}
                lg={{ flex: '33%' }}
                xl={{ flex: '25%' }}
              >
                <Dropdown
                  menu={{ items: contextMenuItems }}
                  trigger={['contextMenu']}
                >
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<Preview {...item}></Preview>}
                  >
                    <Meta
                      title={
                        <Tooltip title={name} placement="top">
                          <span>{name}</span>
                        </Tooltip>
                      }
                      description={
                        <Descriptions
                          column={1}
                          size={'small'}
                          items={borderedItems}
                        />
                      }
                    />
                  </Card>
                </Dropdown>
              </Col>
            );
          })}
        </Row>
      </Spin>
      {!list?.length && !loading && (
        <Empty
          className="m-y-24px mt-30vh"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
      {!!list?.length && (
        <div className="flex justify-center p-y-24px">
          <Pagination
            showTotal={(total) =>
              `第 ${pagination.current} 页，共 ${total} 条数据`
            }
            showSizeChanger
            showQuickJumper
            {...pagination}
          ></Pagination>
        </div>
      )}
    </div>
  );
};
