import { useProjectStore } from '@/store/project';
import { getErrorMsg } from '@/utils/error';
import { createFileRoute } from '@tanstack/react-router';
import { usePagination, useSize } from 'ahooks';
import { App, Button, Image, Pagination, Spin } from 'antd';
import { Daum, imgHistory } from 'core/api/page.js';
import { FC, useMemo } from 'react';
import dayjs from 'dayjs';
import { DashOutlined } from '@ant-design/icons';
import { Empty } from './_components/empty';

export const Route = createFileRoute('/$id')({
  component: Index,
  loader(ctx) {
    const isNull = ctx.params.id === 'null';
    return { isNull };
  },
});

type CardProps = Daum;

// 卡片
const Card: FC<CardProps> = ({ contentType, fileName, size, time, url }) => {
  return (
    <div className="border-solid border-color-#E5E7EB">
      <div className="h-50 overflow-hidden flex justify-center items-center">
        {contentType.includes('image') ? (
          <Image className="min-w-24" src={url} />
        ) : null}
      </div>
      <div className="p-4 text-size-3.5 lh-5">
        <div className="color-#111827 flex items-center justify-between">
          <div className="overflow-hidden flex-grow whitespace-nowrap text-ellipsis">
            {fileName}
          </div>
          <Button
            type="text"
            className="flex-shrink-0"
            icon={<DashOutlined className="" />}
          ></Button>
        </div>
        <div className="color-#6B7280 flex items-center justify-between">
          <div>{size}</div>
          <div>{dayjs(time).format('YYYY-MM-DD')}</div>
        </div>
      </div>
    </div>
  );
};

function Index() {
  const { message } = App.useApp();
  const current = useProjectStore((state) => state.current);
  const projects = useProjectStore((state) => state.projects);
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

  const { pagination, data, loading } = usePagination(
    ({ pageSize, current: c }) => {
      return imgHistory({ pageSize, current: c, uid: `${current}` });
    },
    {
      onError(e) {
        message.error(getErrorMsg(e));
      },
      ready: !!current && !isNull,
      refreshDeps: [
        current,
        // numberChanges
      ],
    },
  );

  return (
    <div>
      <div className="color-#111827 text-size-4.5 lh-7">全部图片</div>
      <Spin tip="Loading..." spinning={loading} delay={100}>
        <div
          className="my-5.75 gap-4 grid rounded-4"
          style={{
            gridTemplateColumns: `repeat(${rowTotal}, minmax(0, 1fr))`,
          }}
        >
          {data?.list.map((item) => {
            return <Card {...item} key={item.id}></Card>;
          })}
        </div>
      </Spin>
      {!isNull && !!data?.total && (
        <div className="flex justify-center">
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

      {(isNull || !projects.length || !data?.total) && (
        <Empty type={projects.length ? 'assets' : 'projects'}></Empty>
      )}
    </div>
  );
}
