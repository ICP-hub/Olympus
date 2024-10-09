import React from 'react';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const UserProjectCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='flex flex-col sm0:flex-row w-full sm0:items-center cursor-pointer shadow-md py-2 border rounded-lg sm0:pl-3 gap-3 sm0:gap-6'>
        <div className='lg1:h-[140px] sm0:px-0 bg-gray-100 rounded-md flex items-center justify-center lg1:px-10 p-2'>
          <SkeletonTheme color='#e3e3e3'>
            <div className='relative flex flex-col items-center'>
              {/* Profile circle skeleton */}
              <div className='rounded-lg  '>
                <Skeleton height={96} width={96} />
              </div>

              {/* Icon in the center of the circle */}
              <div
                className='flex items-center justify-center border-2 rounded-full border-gray-300 w-12 h-12 absolute mt-0.5'
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#e3e3e3',
                }}
              >
                <svg
                  className='w-8 h-8 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                </svg>
              </div>
            </div>
          </SkeletonTheme>
        </div>
        <div className='w-full pl-4 px-6 sm0:pl-0 sm0:w-3/4'>
          <h3 className='text-lg font-bold text-gray-900 line-clamp-1'>
            <Skeleton height={20} />
          </h3>
          <p className='text-gray-500 text-sm'>
            <Skeleton height={20} />
          </p>
          <div className='text-gray-600 text-sm mt-2 overflow-hidden text-ellipsis max-h-14 line-clamp-3 break-all'>
            {/* {description ? parse(description) : 'No description available.'} */}
            <Skeleton height={18} style={{ borderRadius: '18px' }} count={2} />
          </div>
          <div className='flex space-x-2 mt-2 overflow-x-auto w-full max-w-full'>
            <div className='flex gap-2'>
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default UserProjectCardSkeleton;
