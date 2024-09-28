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
} from 'antd';
import { imgHistory } from 'core/api/page.js';
import { useAppSelector } from '@/store/hooks';
import { activationItem } from '@/store/features/staging/selectors';
import { useEffect } from 'react';
import { Preview } from '@/components/preview/preview';
import dayjs from 'dayjs';
import './style.less';
import { getErrorMsg } from '@/utils/error';

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

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="p-12px upload-preview  flex flex-col">
      <Spin
        spinning={loading}
        wrapperClassName="flex-1 overflow-x-hidden overflow-y-auto"
        className=""
      >
        <Row gutter={[16, 16]}>
          {data?.list.map((item) => {
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
                children: <Text code>{item.contentType}</Text>,
              },
            ];
            return (
              <Col
                key={item.id}
                xs={{ flex: '100%' }}
                md={{ flex: '50%' }}
                lg={{ flex: '33%' }}
                xl={{ flex: '25%' }}
              >
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<Preview url={item.url}></Preview>}
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
              </Col>
            );
          })}
        </Row>
      </Spin>
      {!data?.list.length && (
        <Empty
          className="m-y-24px mt-30vh"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
      {!!data?.list.length && (
        <div className="flex justify-center p-y-24px">
          <Pagination {...pagination}></Pagination>
        </div>
      )}
    </div>
  );
};
