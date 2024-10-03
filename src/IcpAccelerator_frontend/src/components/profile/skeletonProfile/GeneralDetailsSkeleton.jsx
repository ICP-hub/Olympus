import React from 'react';
import Skeleton from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';

const GeneralDetailsSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='my-4'>
        <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
          <Skeleton width={100} />
        </h3>
        <div className='flex items-center'>
          <Skeleton width={200} />
          <Skeleton circle={true} height={16} width={16} className='ml-2' />
          <Skeleton width={50} height={20} className='ml-2' />
        </div>
      </div>

      <div className='mb-4'>
        <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
          <Skeleton width={80} />
        </h3>
        <Skeleton width={200} />
      </div>

      <div className='mb-4'>
        <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
          <Skeleton width={80} />
        </h3>
        <Skeleton width={250} />
      </div>

      <div className='mb-4'>
        <h3 className='font-normal mb-2 text-xs text-gray-500'>
          <Skeleton width={100} />
        </h3>
        <div className='flex space-x-2'>
          <Skeleton width={60} height={25} />
          <Skeleton width={60} height={25} />
        </div>
      </div>

      <div className='mb-4'>
        <h3 className='mb-2 text-xs text-gray-500'>
          <Skeleton width={80} />
        </h3>
        <div className='flex items-center'>
          <Skeleton width={200} />
        </div>
      </div>

      <div className='mb-4 max-w-sm'>
        <h3 className='mb-2 text-xs text-gray-500'>
          <Skeleton width={80} />
        </h3>
        <Skeleton height={40} width={'100%'} />
      </div>

      <div className='mb-4 max-w-sm'>
        <h3 className='mb-2 text-xs text-gray-500'>
          <Skeleton width={80} />
        </h3>
        <Skeleton height={40} width={'100%'} />
      </div>

      <div>
        <h3 className='mb-2 text-xs text-gray-500'>
          <Skeleton width={80} />
        </h3>
        <div className='flex space-x-2'>
          <Skeleton circle={true} height={24} width={24} />
          <Skeleton circle={true} height={24} width={24} />
          <Skeleton circle={true} height={24} width={24} />
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default GeneralDetailsSkeleton;
