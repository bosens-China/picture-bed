import { getData } from '@/utils/busuanzi';
import { AreaChartOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Space } from 'antd';
import { useLocation } from 'react-router-dom';

export const Footer = () => {
  // 每次路由发生变化，重新请求然后获取
  const location = useLocation();

  const { data } = useRequest(getData, {
    refreshDeps: [location],
    debounceWait: 500,
    debounceLeading: true,
  });

  return (
    <div>
      <Space>
        <AreaChartOutlined />
        <p>总访问量 {data?.site_pv || 0} 次</p>
        <p>总访客数 {data?.site_uv || 0} 人</p>
      </Space>
    </div>
  );
};
