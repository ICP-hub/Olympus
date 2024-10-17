import { useEffect } from 'react';

const useTimeout = (callback, delay = 1000) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timer);
  }, [callback, delay]);
};

export default useTimeout;
