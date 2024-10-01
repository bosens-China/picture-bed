import { Form, FormInstance, Radio, Space } from 'antd';
import { FC, useEffect } from 'react';
import { ThemeFieldType } from '@/store/features/users/slice';
import { useAppSelector } from '@/store/hooks';

interface Props {
  form: FormInstance<ThemeFieldType>;
}

export const Theme: FC<Props> = ({ form }) => {
  const themes: Array<{
    value: ThemeFieldType['theme'];
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

  const { theme } = useAppSelector((state) => state.users);

  useEffect(() => {
    form.setFieldsValue(theme || {});
  }, [form, theme]);

  return (
    <Form
      initialValues={{ theme: 'auto' }}
      onFinish={() => {}}
      layout="vertical"
      form={form}
    >
      <Form.Item<ThemeFieldType> label="主题设置" name="theme">
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
