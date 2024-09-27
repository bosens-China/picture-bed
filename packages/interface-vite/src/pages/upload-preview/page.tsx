import { useRequest } from 'ahooks';
import { App, Card, Col, Row, Spin } from 'antd';
import { imgHistory } from 'core/api/page.js';
import { useAppSelector } from '@/store/hooks';
import { activationItem } from '@/store/features/staging/selectors';

const { Meta } = Card;

export const UploadPreview = () => {
  const { message } = App.useApp();
  const activation = useAppSelector(activationItem);
  const { loading, data } = useRequest(imgHistory, {
    defaultParams: [
      {
        uid: activation?.uid || '',
      },
    ],
    onError(e) {
      message.error(e.message);
    },
    ready: !!activation?.uid,
  });

  return (
    <div className="p-12px">
      <Spin spinning={loading}>
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
      </Spin>
    </div>
  );
};
