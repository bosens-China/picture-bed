import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const defaultFingerprint = async () => {
  const res = await FingerprintJS.load().then((res) => {
    return res.get();
  });

  return res;
};
