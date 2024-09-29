import { Form, InputNumber, Space, Switch } from 'antd';
import { FC, useEffect } from 'react';

interface FieldType {
  cuttingBoard: boolean;
  concurrentQuantity: number;
  waitingInterval: [number?, number?];
}

interface WaitingIntervalProps {
  value?: FieldType['waitingInterval'];
  onChange?: (value?: FieldType['waitingInterval']) => void;
}

const WaitingInterval: FC<WaitingIntervalProps> = ({ value, onChange }) => {
  const [min, max] = value || [];

  const triggerChange = (obj: { min?: number | null; max?: number | null }) => {
    onChange?.([
      ('min' in obj ? obj.min : min) ?? undefined,
      ('max' in obj ? obj.max : max) ?? undefined,
    ]);
  };

  useEffect(() => {}, []);
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
  onOk: (values: FieldType) => void;
}

export const Base: FC<Props> = ({ onOk }) => {
  return (
    <Form
      labelCol={{ span: 6 }}
      initialValues={{ cuttingBoard: true }}
      onFinish={onOk}
    >
      <Form.Item<FieldType> label="检测剪切板" name="cuttingBoard">
        <Switch />
      </Form.Item>
      <Form.Item<FieldType> label="并发数量" name="concurrentQuantity">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item<FieldType> label="等待区间（秒）" name="waitingInterval">
        <WaitingInterval></WaitingInterval>
      </Form.Item>
    </Form>
  );
};
