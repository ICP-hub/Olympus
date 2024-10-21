import React from 'react';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const DiscoverFundingCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='relative flex flex-col sm1:flex-row sm1:items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300 hover:shadow-lg'>
        {/* Overlay for Private Documents */}

        {/* Image Section */}
        <div className='flex-shrink-0 sm1:w-[30%] w-full'>
          <SkeletonTheme color='#e3e3e3'>
            <div className='relative flex flex-col items-center'>
              <div className='rounded-lg  '>
                <Skeleton height={96} width={110} />
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

        {/* Details Section */}
        <div
          className={`sm1:ml-6 flex-grow transition-all duration-300 sm1:w-[65%] w-full `}
        >
          <SkeletonTheme color='#e3e3e3'>
            <div className='flex sm1:justify-between justify-center gap-2 sm1:gap-0  items-center flex-wrap'>
              <p className='text-lg font-semibold text-gray-900'>
                <Skeleton height={20} width={100} />
              </p>
              <p className='text-sm text-gray-500 '>
                <Skeleton height={20} width={60} />
              </p>
            </div>
          </SkeletonTheme>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default DiscoverFundingCardSkeleton;
