import { DatabaseOutlined } from '@ant-design/icons';
import { Col, Menu, MenuProps, Modal, Row } from 'antd';
import { FC, useState } from 'react';
import { Base } from './base';
import { Theme } from './theme';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Setup: FC<Props> = ({ open, setOpen }) => {
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {
    handleCancel();
  };

  type MenuItem = Required<MenuProps>['items'][number];

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
  const [selectedKeys, setSelectedKeys] = useState(['base']);

  return (
    <Modal
      title="设置"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
    >
      <Row gutter={16}>
        <Col flex="160px">
          <Menu
            className="max-h-400px overflow-auto"
            onSelect={(e) => {
              setSelectedKeys(e.selectedKeys);
            }}
            selectedKeys={selectedKeys}
            mode="inline"
            items={items}
          />
        </Col>
        <Col flex={'auto'} className="max-h-400px overflow-auto">
          {selectedKeys.includes('base') && <Base onOk={handleOk}></Base>}
          {selectedKeys.includes('theme') && <Theme onOk={handleOk}></Theme>}
        </Col>
      </Row>
    </Modal>
  );
};
