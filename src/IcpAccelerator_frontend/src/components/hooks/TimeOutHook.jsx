import { useEffect } from 'react';

const useTimeout = (callback, delay = 5000) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timer);
  }, [callback, delay]);
};

export default useTimeout;
