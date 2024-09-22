import { Button, Tooltip } from 'antd';

export const Setup = () => {
  return (
    <>
      <Tooltip title="打开图床相关设置" placement={'leftTop'}>
        <Button className="flex">
          <div className="i-catppuccin-eslint-ignore text-size-2xl cursor-pointer"></div>
          设置
        </Button>
      </Tooltip>
    </>
  );
};
