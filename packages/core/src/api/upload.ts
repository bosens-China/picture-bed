import { AxiosProgressEvent } from 'axios';
import { request } from '../utils/request';
import { obtainOrigin } from 'src/utils/obtain';

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
  return obtainOrigin(data);
}

export async function uploadFormData(
  formData: FormData,
  uid: UploadBody['uid'],
  onUploadProgress?: UploadProgress,
) {
  if (!formData.has('file')) {
    throw new Error(`formData 中缺少 file 参数`);
  }
  formData.append('uid', uid);

  const file = formData.get('file') as File;

  const fileName = (formData.get('fileName') as string) ?? file.name;
  if (!formData.has('fileName')) {
    formData.append('fileName', fileName);
  }

  const { data } = await request.post<UploadReturnStructure>(
    `/img/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        onUploadProgress?.(progressEvent, {
          uid,
          file,
          fileName,
        });
      },
    },
  );
  return obtainOrigin(data);
}
