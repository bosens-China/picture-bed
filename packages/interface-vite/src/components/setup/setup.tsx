import { DatabaseOutlined } from '@ant-design/icons';
import { App, Button, Form, Modal, Space, Tabs, TabsProps } from 'antd';
import { FC } from 'react';
import { Base } from './base';
import { Theme } from './theme';
import { useAppDispatch } from '@/store/hooks';
import {
  BaseFieldType,
  setBase,
  setTheme,
  ThemeFieldType,
} from '@/store/features/users/slice';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Setup: FC<Props> = ({ open, setOpen }) => {
  const [baseForm] = Form.useForm<BaseFieldType>();
  const [themeForm] = Form.useForm<ThemeFieldType>();

  const { message } = App.useApp();
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = async () => {
    let base: BaseFieldType;
    let theme: ThemeFieldType;
    try {
      base = await baseForm.validateFields();
    } catch {
      return;
    }
    try {
      theme = await themeForm.validateFields();
    } catch {
      return;
    }
    dispatch(setTheme(theme));
    dispatch(setBase(base));
    message.success('设置保存成功');
  };

  const tabItems: TabsProps['items'] = [
    {
      label: '基础模块设置',
      key: 'base',
      icon: <DatabaseOutlined />,
      children: (
        <div className="h-400px max-h-80vh overflow-auto">
          <Base form={baseForm} />
        </div>
      ),
      forceRender: true,
    },
    {
      label: (
        <div className="flex items-center">
          <div className="i-mdi-theme-light-dark text-size-16px! mr-12px"></div>
          主题设置
        </div>
      ),
      key: 'theme',
      // icon: ,
      children: (
        <div className="h-400px max-h-80vh overflow-auto">
          <Theme form={themeForm} />
        </div>
      ),

      forceRender: true,
    },
  ];

  return (
    <Modal
      title="设置"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={null}
      className="max-w-100vw"
      centered
    >
      <Tabs tabPosition="left" items={tabItems}></Tabs>
      <div className="flex">
        <div className="flex-1"></div>
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleOk}>
            全部保存
          </Button>
        </Space>
      </div>
    </Modal>
  );
};
