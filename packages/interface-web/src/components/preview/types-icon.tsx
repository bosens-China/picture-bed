import { FC, PropsWithChildren } from 'react';

interface Props {
  fileName: string;
}

export const TypeIcons: FC<PropsWithChildren<Props>> = ({
  fileName,
  children,
}) => {
  const template = (icon: string) => (
    <div className={`${icon} w-100px h-100px`}></div>
  );
  if (/\.zip$/i.test(fileName)) {
    return template('i-vscode-icons-file-type-zip');
  }
  if (/\.txt$/i.test(fileName)) {
    return template('i-vscode-icons-file-type-text');
  }
  if (/\.(wps|dps|et|wpt|docx?|xlsx?|pptx?|doc|xls|ppt)$/i.test(fileName)) {
    return template('i-vscode-icons-file-type-word2');
  }
  return children;
};
