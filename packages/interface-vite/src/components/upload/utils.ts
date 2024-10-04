interface ClipboardReturn {
  blob: Blob;
  fileName: string;
}

interface Props {
  filter: (type: string) => boolean;
  /**
   * 有效性对比，判断当前这次读取到的剪切板内容是否可以采用
   * @param clipboardItems
   * @returns
   */
  comparisonEffectiveness: (clipboardItems: ClipboardItems) => boolean;
}

/*
 * 传递filter过滤type类型，之后返回一个过滤之后的files集合
 */
export const checkClipboard = async ({
  filter,
  comparisonEffectiveness,
}: Props): Promise<ClipboardReturn[]> => {
  try {
    // 请求剪切板权限
    const clipboardItems = await navigator.clipboard.read();
    // 如果相同则跳过
    if (comparisonEffectiveness(clipboardItems)) {
      return [];
    }
    const files: ClipboardReturn[] = [];
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (filter(type)) {
          const suffix = type.split('/').at(-1) || '';
          const blob = await clipboardItem.getType(type);
          files.push({
            blob,
            fileName: `${Date.now()}.${suffix}`,
          });
        }
      }
    }
    return files;
  } catch (e) {
    console.error(e);
    return [];
  }
};
