import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSelected } from '@/store/features/users/slice';

export const Empty = () => {
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!users.length) {
      return;
    }
    // 如果存在值则直接跳转走
    navigate(`/${users[0].key}`);
    dispatch(setSelected(`${users[0].key}`));
  }, [users, navigate, dispatch]);

  return (
    <div className="p-12px">
      <Spin tip="初始化数据中...">
        <div className="h-240px"></div>
      </Spin>
    </div>
  );
};
