import { useMemo } from 'react';

function useTruncateWithEllipsis(str, startLen, endLen) {
  const truncatedString = useMemo(() => {
    if (str.length <= startLen + endLen) {
      return str;
    }
    const start = str.substring(0, startLen);
    const end = str.substring(str.length - endLen);
    return `${start}...${end}`;
  }, [str, startLen, endLen]);

  return truncatedString;
}

export default useTruncateWithEllipsis;
