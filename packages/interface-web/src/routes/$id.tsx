import { useGroupingStore } from '@/store/grouping';
import { getErrorMsg } from '@/utils/error';
import { createFileRoute } from '@tanstack/react-router';
import { usePagination, useSize } from 'ahooks';
import { App, Pagination, Spin } from 'antd';
import { imgHistory } from '@boses/picture-bed-sdk';
import { useEffect, useMemo } from 'react';
import { Empty } from './_components/empty';
import { globalFunctions } from '@/utils/global-functions';
import { Card } from './_components/card';
import classnames from 'classnames';
import { useShallow } from 'zustand/shallow';

export const Route = createFileRoute('/$id')({
  component: Index,
  loader(ctx) {
    const isNull = ctx.params.id === 'null';
    return { isNull };
  },
});

function Index() {
  const { message } = App.useApp();
  const { activeId, groups } = useGroupingStore(
    useShallow((state) => {
      return {
        activeId: state.activeId,
        groups: state.groups,
      };
    }),
  );

  const { isNull } = Route.useLoaderData();

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

  const { pagination, data, loading, refresh } = usePagination(
    ({ pageSize, current: c }) => {
      return imgHistory({ pageSize, current: c, uid: `${activeId}` });
    },
    {
      onError(e) {
        message.error(getErrorMsg(e));
      },
      ready: !!activeId && !isNull,
      refreshDeps: [
        activeId,
        // numberChanges
      ],
    },
  );
  useEffect(() => {
    globalFunctions.updateList = refresh;
  }, [refresh]);

  return (
    <div>
      <div className="color-title text-size-4.5 lh-7">全部图片</div>
      <Spin tip="Loading..." spinning={loading} delay={100}>
        <div
          className={classnames([
            {
              'h-[calc(100vh-215px)]': data?.list.length,
            },
          ])}
        >
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
      {!isNull && !!data?.total && (
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

      {(isNull || !groups.length || !data?.total) && !loading && (
        <Empty type={groups.length ? 'assets' : 'projects'}></Empty>
      )}
    </div>
  );
}
