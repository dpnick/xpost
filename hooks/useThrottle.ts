import { useEffect } from 'react';

export default function useThrottle<S>(
  callback: () => void,
  delay: number,
  dependencies: S[]
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...dependencies]);
}
