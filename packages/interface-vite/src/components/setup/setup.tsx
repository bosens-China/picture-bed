import { DatabaseOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Col,
  Form,
  Menu,
  MenuProps,
  Modal,
  Row,
  Space,
} from 'antd';
import { FC, useState } from 'react';
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
      setSelectedKeys(['base']);
      return;
    }
    try {
      theme = await themeForm.validateFields();
      setSelectedKeys(['theme']);
    } catch {
      return;
    }
    dispatch(setTheme(theme));
    dispatch(setBase(base));
    message.success('设置保存成功');
  };

  type MenuItem = Required<MenuProps>['items'][number] & {
    key: 'base' | 'theme';
  };

  const items: MenuItem[] = [
    {
      label: '基础模块设置',
      key: 'base',
      icon: <DatabaseOutlined />,
    },
    {
      label: '主题设置',
      key: 'theme',
      icon: <div className="i-mdi-theme-light-dark text-size-16px!"></div>,
    },
  ];
  const [selectedKeys, setSelectedKeys] = useState<MenuItem['key'][]>(['base']);

  return (
    <Modal
      title="设置"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={null}
    >
      <Row gutter={16}>
        <Col flex="160px" className="">
          <Menu
            className="h-400px"
            onSelect={(e) => {
              setSelectedKeys(e.selectedKeys as MenuItem['key'][]);
            }}
            selectedKeys={selectedKeys}
            mode="inline"
            items={items}
          />
        </Col>
        <Col flex={'auto'}>
          <div className="flex flex-col h-400px">
            <div className="flex-1 overflow-auto">
              {selectedKeys.includes('base') && <Base form={baseForm}></Base>}
              {selectedKeys.includes('theme') && (
                <Theme form={themeForm}></Theme>
              )}
            </div>
            <div className="flex">
              <div className="flex-1"></div>
              <Space>
                <Button onClick={handleCancel}>取消</Button>
                <Button type="primary" onClick={handleOk}>
                  全部保存
                </Button>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};
