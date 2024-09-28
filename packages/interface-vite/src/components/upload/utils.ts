interface ClipboardReturn {
  blob: Blob;
  fileName: string;
}

/*
 * 读取剪切板
 */
export const checkClipboard = async (): Promise<ClipboardReturn[]> => {
  try {
    // 请求剪切板权限
    const clipboardItems = await navigator.clipboard.read();
    const files: ClipboardReturn[] = [];
    for (const clipboardItem of clipboardItems) {
      // 检查剪切板是否包含图片
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
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
  } catch {
    return [];
  }
};
