export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface RunParallelProps<T, U> {
  /**
   * 最大并发数量
   *
   * @type {number}
   * @memberof RunParallelProps
   */
  maxConcurrency: number;
  /**
   * item 为传递的子项
   * index从0开始，表示数组下标
   * total为总数
   *
   * @memberof RunParallelProps
   */
  iteratorFn: (item: T, index: number, total: number) => U;
  // 等待时间
  waitingTime?: number;
}

/**
 * 限速器，用于控制异步任务的最大数量
 *
 * @export
 * @template T
 * @template U
 * @param {T[]} source
 * @param {RunParallelProps<T, U>} options
 * @return {*}
 */
export async function runParallel<T, U>(
  source: T[],
  options: RunParallelProps<T, U>,
) {
  const total = source.length;
  let index = 0;
  const { maxConcurrency, iteratorFn, waitingTime = 0 } = options;
  // 结果
  const ret: Promise<U>[] = [];
  // 控制任务等待
  const executing: unknown[] = [];

  for (const item of source) {
    const p = Promise.resolve().then(() => {
      return iteratorFn(item, index++, total);
    });

    ret.push(p);

    // 如果数量大于并发，则限速
    if (total > maxConcurrency) {
      const e = p.then(async () => {
        if (waitingTime) {
          await sleep(waitingTime);
        }
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      if (executing.length >= maxConcurrency) {
        /*
         * 失败了也无所谓，返回的就是全部状态
         */
        try {
          await Promise.race(executing);
        } catch {
          //
        }
      }
    }
  }
  return Promise.allSettled(ret);
}

/**
 * 生成指定范围内的随机整数
 *
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} - 返回随机整数
 */
export function getRandomInt(min: number, max: number) {
  // 确保 min 和 max 是整数
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
