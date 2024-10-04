import {
  BaseFieldType,
  cuttingBoardFormat,
} from '@/store/features/users/slice';
import {
  Divider,
  Form,
  FormInstance,
  InputNumber,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import { FC, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { baseInitialValues } from './share';
import { useMemoAsync } from '@/hooks/use-memo-async';

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
    <>
      <div className="flex mb-12px">
        <div> 等待区间（毫秒）</div>
        <Tooltip
          title={
            <p>
              范围区间是可选的，如果全部为空则不限制，如果为范围则会在这个区间进行随机等待。
              <br />
              如果只设置最小时间则表示等待最小的时间，但是如果只设置最大时间则表示从0
              ~ 最大时间区间。
            </p>
          }
        >
          <Tag bordered={false} color="processing">
            说明
          </Tag>
        </Tooltip>
      </div>
      <Space>
        <InputNumber
          value={min}
          placeholder="最小区间"
          onChange={(e) => triggerChange({ min: e })}
          min={0}
        ></InputNumber>
        <div>~</div>
        <InputNumber
          value={max}
          onChange={(e) => triggerChange({ max: e })}
          placeholder="最大区间"
          min={0}
        ></InputNumber>
      </Space>
    </>
  );
};

interface Props {
  form: FormInstance<BaseFieldType>;
}

export const Base: FC<Props> = ({ form }) => {
  const { base } = useAppSelector((state) => state.users);

  const cuttingBoard = Form.useWatch('cuttingBoard', form);

  useEffect(() => {
    form.setFieldsValue(base || {});
  }, [base, form]);

  /*
   *
   */

  const available = useMemoAsync(async () => {
    try {
      await navigator.clipboard.readText();
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <Form
      labelCol={{ span: 6 }}
      initialValues={baseInitialValues}
      onFinish={() => {}}
      form={form}
    >
      <Divider orientation="left">剪切板自动上传</Divider>
      <Form.Item<BaseFieldType> label="剪切板上传类型" name="cuttingBoard">
        <Switch disabled={!available} />
      </Form.Item>
      {cuttingBoard && available && (
        <Form.Item<BaseFieldType>
          label="剪切板上传格式"
          name="cuttingBoardFormat"
        >
          <Select
            style={{ width: 240 }}
            mode={'multiple'}
            options={[...cuttingBoardFormat]}
          ></Select>
        </Form.Item>
      )}

      <Form.Item<BaseFieldType>
        label="上传对话框快捷粘贴"
        name="shortcutPaste"
        extra={
          <Tooltip
            title={
              <p>
                开启之后可以在上传资源的对话框使用 ctrl.v 或者 meta.v
                来快速粘贴资源。
                <br />
                粘贴的资源取决于复制的内容，不受剪切板上传格式约束。
              </p>
            }
          >
            <Tag bordered={false} color="processing">
              属性说明
            </Tag>
          </Tooltip>
        }
      >
        <Switch disabled={!available} />
      </Form.Item>

      <Divider orientation="left">并发设置</Divider>
      <Form.Item<BaseFieldType> label="并发数量" name="concurrentQuantity">
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item<BaseFieldType>
        label={null}
        name="waitingInterval"
        wrapperCol={{ offset: 3 }}
      >
        <WaitingInterval />
      </Form.Item>
    </Form>
  );
};
