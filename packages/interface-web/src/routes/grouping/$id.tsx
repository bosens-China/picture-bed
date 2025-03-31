import { useActiveGroup, useGroupingStore } from '@/store/grouping';
import { getErrorMsg } from '@/utils/error';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { usePagination, useSize } from 'ahooks';
import { App, Pagination, Spin } from 'antd';
import { imgHistory } from '@boses/picture-bed-sdk';
import { useEffect, useMemo } from 'react';
import { Empty } from '../_components/empty';
import { globalFunctions } from '@/utils/global-functions';
import { Card } from '../_components/card';
import { useShallow } from 'zustand/shallow';

export const Route = createFileRoute('/grouping/$id')({
  component: Index,
  loader(ctx) {
    // 检查id是否有效，不存在重新定位
    const id = ctx.params.id;
    const { groups } = useGroupingStore.getState();
    if (!groups.find((f) => f.id === id)) {
      return redirect({
        to: '/grouping',
      });
    }
  },
});

function Index() {
  const { message } = App.useApp();
  const { groups } = useGroupingStore(
    useShallow((state) => {
      return {
        groups: state.groups,
      };
    }),
  );

  const size = useSize(document.body);

  const rowTotal = useMemo(() => {
    // {
    //   'xs': 0,
    //   'sm': 576,
    //   'md': 768,
    //   'lg': 992,
    //   'xl': 1200,
    // }
    if (!size?.width) {
      return 1;
    }
    if (size.width > 1200) {
      return Math.floor(window.innerWidth / 350);
    }
    if (size.width > 992) {
      return 3;
    }
    if (size.width > 768) {
      return 2;
    }
    return 1;
  }, [size?.width]);

  const activeGroup = useActiveGroup();

  const { pagination, data, loading, refresh } = usePagination(
    ({ pageSize, current: c }) => {
      return imgHistory({ pageSize, current: c, uid: activeGroup!.uid });
    },
    {
      onError(e) {
        message.error(getErrorMsg(e));
      },
      ready: !!activeGroup?.uid,
      refreshDeps: [activeGroup?.uid],
    },
  );
  useEffect(() => {
    globalFunctions.updateList = refresh;
  }, [refresh]);

  return (
    <div>
      <div className="color-title text-size-4.5 lh-7">全部图片</div>
      <Spin tip="Loading..." spinning={loading} delay={100}>
        <div>
          <div
            className={'my-5.75 gap-4 grid overflow-auto'}
            style={{
              gridTemplateColumns: `repeat(${rowTotal}, minmax(0, 1fr))`,
            }}
          >
            {data?.list.map((item) => {
              return <Card {...item} key={item.id}></Card>;
            })}
          </div>
        </div>
      </Spin>
      {!!data?.total && (
        <div className="flex justify-center">
          <Pagination
            className="flex-1 [&_.ant-pagination-total-text]-flex-1"
            showTotal={(total) =>
              `第 ${pagination.current} 页，共 ${total} 条数据`
            }
            showSizeChanger
            showQuickJumper
            {...pagination}
          ></Pagination>
        </div>
      )}

      {(!groups.length || !data?.total) && !loading && (
        <Empty type={groups.length ? 'assets' : 'projects'}></Empty>
      )}
    </div>
  );
}
