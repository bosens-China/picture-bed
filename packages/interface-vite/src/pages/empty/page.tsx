import { Spin } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Empty = () => {
  const { staging } = useAppSelector((state) => state.staging);

  const navigate = useNavigate();
  useEffect(() => {
    if (!staging.length) {
      return;
    }
    // 如果存在值则直接跳转走
    navigate(`/${staging[0].key}`);
  }, [staging, navigate]);

  return (
    <div className="p-12px">
      <Spin tip="初始化数据中...">
        <div className="h-240px"></div>
      </Spin>
    </div>
  );
};
