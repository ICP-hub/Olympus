import { useCallback } from 'react';

// Custom Hook
const useFormatDateFromBigInt = () => {
  const formatDate = useCallback((bigIntDate) => {
    // Convert BigInt to Number before division
    const date = new Date(Number(bigIntDate) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, []);

  const formatTime = useCallback((bigIntDate) => {
    // Convert BigInt to Number before division
    const date = new Date(Number(bigIntDate) / 1000000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }, []);

  const timeAgo = useCallback((bigIntDate) => {
    // Convert BigInt to Number before division
    const date = new Date(Number(bigIntDate) / 1000000);
    const now = new Date();
    const secondsAgo = Math.round((now - date) / 1000);

    if (secondsAgo < 60) {
      return 'just now';
    } else if (secondsAgo < 3600) { 
      return `${Math.floor(secondsAgo / 60)} minutes ago`;
    } else if (secondsAgo < 86400) { 
      return `${Math.floor(secondsAgo / 3600)} hours ago`;
    } else if (secondsAgo < 2592000) { 
      return `${Math.floor(secondsAgo / 86400)} days ago`;
    } else if (secondsAgo < 31536000) { 
      return `${Math.floor(secondsAgo / 2592000)} months ago`;
    } else {
      return `${Math.floor(secondsAgo / 31536000)} years ago`;
    }
  }, []);

  return [formatDate, formatTime, timeAgo];
}

export default useFormatDateFromBigInt;
