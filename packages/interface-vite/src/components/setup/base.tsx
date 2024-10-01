import { BaseFieldType } from '@/store/features/users/slice';
import { Form, FormInstance, InputNumber, Space, Switch } from 'antd';
import { FC, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

interface WaitingIntervalProps {
  value?: BaseFieldType['waitingInterval'];
  onChange?: (value?: BaseFieldType['waitingInterval']) => void;
}

const WaitingInterval: FC<WaitingIntervalProps> = ({ value, onChange }) => {
  const [min, max] = value || [];

  const triggerChange = (obj: { min?: number | null; max?: number | null }) => {
    onChange?.([
      ('min' in obj ? obj.min : min) ?? undefined,
      ('max' in obj ? obj.max : max) ?? undefined,
    ]);
  };

  return (
    <Space>
      <InputNumber
        value={min}
        placeholder="最小区间"
        onChange={(e) => triggerChange({ min: e })}
      ></InputNumber>
      <InputNumber
        value={max}
        onChange={(e) => triggerChange({ max: e })}
        placeholder="最大区间"
      ></InputNumber>
    </Space>
  );
};

interface Props {
  form: FormInstance<BaseFieldType>;
}

export const Base: FC<Props> = ({ form }) => {
  const { base } = useAppSelector((state) => state.users);

  useEffect(() => {
    form.setFieldsValue(base || {});
  }, [base, form]);

  return (
    <Form
      labelCol={{ span: 6 }}
      initialValues={{ cuttingBoard: true }}
      onFinish={() => {}}
      form={form}
    >
      <Form.Item<BaseFieldType> label="检测剪切板" name="cuttingBoard">
        <Switch />
      </Form.Item>
      <Form.Item<BaseFieldType> label="并发数量" name="concurrentQuantity">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item<BaseFieldType> label="等待区间（秒）" name="waitingInterval">
        <WaitingInterval></WaitingInterval>
      </Form.Item>
    </Form>
  );
};
