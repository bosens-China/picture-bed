import { upload } from '@boses/picture-bed-sdk';
import { fileFromPath } from 'formdata-node/file-from-path';

const imgList = process.argv.slice(2);

(async () => {
  const files = await Promise.all(imgList.map((f) => fileFromPath(f)));

  const arr: string[] = [];

  for (const file of files) {
    const result = await upload({
      file: file as unknown as File,
      uid: 'yliu',
    });
    arr.push(result.url);
  }

  process.stdout.write(`Upload Success:\n${arr.join('\n')}`);
})();
