export interface BusuanziCallback {
  site_pv: number;
  page_pv: number;
  version: number;
  site_uv: number;
}

/**
 * 使用busuanzi进行数据统计
 * @returns
 */
export const getData = (): Promise<BusuanziCallback> => {
  return new Promise((resolve, reject) => {
    const BusuanziCallback = `BusuanziCallback_${Math.floor(1099511627776 * Math.random())}`;
    const scr = document.createElement('script');
    scr.src = `//busuanzi.ibruce.info/busuanzi?jsonpCallback=${BusuanziCallback}`;
    scr.type = 'text/javascript';
    scr.referrerPolicy = 'no-referrer-when-downgrade';
    document.head.appendChild(scr);
    // @ts-expect-error 忽略window上错误
    window[BusuanziCallback] = (data) => {
      resolve(data);
      scr.remove();
    };
    scr.onerror = (e) => {
      reject(e);
      scr.remove();
    };
  });
};
