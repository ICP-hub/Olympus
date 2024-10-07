import React from 'react';
import SkeletonThemeMain from '../../../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const DiscoverDocumentSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div
        className={`relative flex flex-col sm4:flex-row sm4:items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300 `}
      >
        {/* Image Section with Background */}
        <div className='bg-gray-100 px-3 py-4 rounded-lg flex-shrink-0 flex flex-col items-center'>
        <Skeleton height={60} width={100}  />
        <Skeleton height={16} width={100}  />  
        </div>

        {/* Details Section */}
        <div className='ml-4 mt-3 sm4:mt-0 flex-grow transition-all duration-300'>
          <div className='flex justify-between flex-wrap'>
            <div className="w-[60%]">
            <Skeleton height={20}  />
            </div>
            <div className="w-[30%]">
            <Skeleton height={20}  />
            </div>
          </div>
          <p className={`text-gray-600 mt-3 `}>
            <Skeleton height={20} count={2} />
          </p>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default DiscoverDocumentSkeleton;
