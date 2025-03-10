import { AxiosProgressEvent } from 'axios';
import { request } from '../utils/request';

export interface UploadBody {
  fileName?: string;
  file: File;
  uid: string;
}

export interface UploadReturnStructure {
  id: number;
  fileName: string;
  time: string;
  url: string;
  uid: string;
  base64: string;
  contentType: string;
  shareCode: null | string;
  shareExpireDate: null | string;
  size: string;
  md5: string;
}

export type UploadProgress = (
  progressEvent: AxiosProgressEvent,
  body: Required<UploadBody>,
) => void;

export async function upload(
  body: UploadBody,
  onUploadProgress?: UploadProgress,
) {
  const obj: Required<UploadBody> = {
    fileName: body.fileName ?? body.file.name,
    file: body.file,
    uid: body.uid,
  };

  const { data } = await request.postForm<UploadReturnStructure>(
    `/img/upload`,
    obj,
    {
      onUploadProgress: (progressEvent) => {
        onUploadProgress?.(progressEvent, obj);
      },
    },
  );
  return data;
}
