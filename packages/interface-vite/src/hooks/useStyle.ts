import { useEffect, useRef } from 'react';

export const useStyle = (css: Record<string, Record<string, string>>) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style');
      document.head.appendChild(style);
      styleRef.current = style as HTMLStyleElement;
    }

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (!styleRef.current) {
      return;
    }
    styleRef.current.innerHTML = Object.entries(css).reduce(
      (acc, [key, value]) => {
        return `${acc}
        ${key} {
          ${Object.entries(value).reduce((acc, [key, value]) => {
            return `${acc}
              ${key}: ${value};
              `;
          }, '')}
        }
        `;
      },
      '',
    );
  }, [css]);
};
