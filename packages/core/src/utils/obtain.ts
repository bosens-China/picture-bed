// 获取原始地址
export const obtainOrigin = <T extends { url: string }>(
  body: T,
): T & { original: string | null } => {
  const url = body.url;
  if (url.includes(`cdn.z`)) {
    return {
      ...body,
      original: url.replace(`cdn.`, ``),
    };
  }
  return { ...body, original: null };
};

// https://cdn.z.wiki/autoupload/20250311/wvP3/240X240/avatar-1741679215438.png?type=ha
// https://z.wiki/autoupload/20250311/wvP3/240X240/avatar-1741679215438.png?type=ha
