import { Form, Radio, Space } from 'antd';
import { FC } from 'react';

interface FieldType {
  theme: 'auto' | 'light' | 'dark';
}

interface Props {
  onOk: (values: FieldType) => void;
}

export const Theme: FC<Props> = ({ onOk }) => {
  const themes: Array<{
    value: FieldType['theme'];
    label: React.ReactNode;
  }> = [
    {
      label: (
        <Space size="small">
          <div className="i-mdi-lightbulb-auto-outline"></div>
          跟随系统
        </Space>
      ),

      value: 'auto',
    },
    {
      label: (
        <Space size="small">
          <div className="i-mdi-lightbulb-on-outline"></div>
          浅色模式
        </Space>
      ),
      value: 'light',
    },
    {
      label: (
        <Space size="small">
          <div className="i-mdi-moon-waning-crescent"></div>
          深色模式
        </Space>
      ),
      value: 'dark',
    },
  ];
  return (
    <Form initialValues={{ theme: 'auto' }} onFinish={onOk} layout="vertical">
      <Form.Item<FieldType> label="主题选择" name="theme">
        <Radio.Group>
          <Space direction="vertical">
            {themes.map((item) => (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};
