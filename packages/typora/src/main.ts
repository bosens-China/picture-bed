import { uploadFiles } from 'core';
import { upload, UploadBody } from 'core/api/upload.ts';

const imgList = process.argv.slice(2);

const files: UploadBody[] = imgList.map((f) => {
  return {
    filePath: f,
    uid: 'yliu',
  };
});

uploadFiles(upload, { files }).then((res) => {
  const result: string[] = [];
  for (const element of res) {
    if (element.status === 'rejected') {
      return Promise.reject(element.reason);
    }
    result.push(element.value.url);
  }

  process.stdout.write(`Upload Success:\n${result.join('\n')}`);
});
