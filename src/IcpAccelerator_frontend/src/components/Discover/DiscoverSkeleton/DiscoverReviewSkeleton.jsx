import React from 'react';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const DiscoverReviewSkeleton = () => {
  return (
    <SkeletonThemeMain>
      {/* <div
        
        className='bg-gray-100 rounded-lg p-4 flex md1:mt-4 flex-col gap-4 '
      >
        <div className='flex gap-4 flex-shrink-0'>
          <SkeletonTheme color='#e3e3e3'>
            <div className='relative flex flex-col items-center'>
              
              <div className='rounded-lg  '>
                <Skeleton height={60} width={60} />
              </div>

              <div
                className='flex items-center justify-center border-2 rounded-full border-gray-300 w-10 h-10 absolute mt-0.5'
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#e3e3e3',
                }}
              >
                <svg
                  className='w-6 h-6 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                </svg>
              </div>
            </div>
          </SkeletonTheme>
          <div className='flex-grow'>
            <h2 className='text-base font-semibold text-gray-800 mb-1'>
              <Skeleton height={20} />
            </h2>
            <div className='flex gap-1 mb-2'>
              <Skeleton circle={true} height={20} width={20} count={5} />
            </div>

            <div className='text-gray-600 text-xs'>
              <Skeleton  height={15} count={2} />     
            </div>
          </div>
        </div>
      </div> */}
      <div
          className='bg-gray-100 rounded-lg p-2 sm0:p-4 flex mt-4 flex-col gap-4'
        >
          <div className='flex flex-col sm0:flex-row justify-center sm0:justify-normal items-center sm0:items-start gap-2 sm0:gap-4 flex-shrink-0'>
            <div className='relative  mx-auto rounded-full mb-4'>
              <Skeleton circle={true} height={50} width={50} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div
                  className='flex items-center justify-center border-2 rounded-full border-gray-300 w-6 h-6 absolute mt-0.5'
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#e3e3e3',
                  }}
                >
                  <svg
                    className='w-4 h-4 text-gray-400'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                  </svg>
                </div>
              </div>
            </div>
            <div className='flex-grow'>
              <Skeleton height={20} width={120} className='mb-1' />
              <div className='flex gap-1 mb-2'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} circle height={20} width={20} />
                ))}
              </div>
              <div class='space-y-2.5 animate-pulse w-full '>
            <div class='flex items-center w-full'>
              <div class='h-2.5 bg-gray-200 rounded-full  w-32'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
            </div>
            <div class='flex items-center w-full '>
              <div class='h-2.5 bg-gray-200 rounded-full  w-full'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
            </div>
          </div>
            </div>
          </div>
        </div>
    </SkeletonThemeMain>
  );
};

export default DiscoverReviewSkeleton;
