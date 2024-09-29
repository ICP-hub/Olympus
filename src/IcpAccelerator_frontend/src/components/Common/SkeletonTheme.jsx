import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const SkeletonThemeMain = ({ children }) => {
  return (
    <SkeletonTheme baseColor='#e3e3e3' highlightColor='#c8c8c873'>
      {children}
    </SkeletonTheme>
  );
};

export default SkeletonThemeMain;
