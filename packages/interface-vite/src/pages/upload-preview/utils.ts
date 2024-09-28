// 解析视频的真实url
export function getVideoUrl(url: string) {
  return `${url.replace('https://cdn.z.wiki', 'https://z.wiki')}?type=true&flag=2`;
}
