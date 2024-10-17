import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';

const RatingPageProfileSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='p-3 sm0:p-6 flex flex-col items-center justify-center'>
        {/* <Skeleton circle height={100} width={100} /> */}
        <div className='relative  mx-auto rounded-full mb-4'>
          <Skeleton circle={true} height={100} width={100} />
          <div className='absolute inset-0 flex items-center justify-center'>
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
        </div>
        <Skeleton height={20} width={200} />
        <Skeleton height={15} width={150} />
        <div className='flex gap-2 my-5'>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} circle height={32} width={32} />
          ))}
        </div>
        <Skeleton height={60} width='100%' />
      </div>
    </SkeletonThemeMain>
  );
};

export default RatingPageProfileSkeleton;

const ProfileSkeleton = () => {
  return (
    <div className='flex flex-col mt-6 items-center justify-center'>
      <div className='relative w-20 h-20 mx-auto rounded-full mb-4'>
        <Skeleton circle={true} height={80} width={80} />
        <div className='absolute mt-2 inset-0 flex items-center justify-center'>
          <div
            className='flex items-center justify-center border-2 rounded-full border-gray-300 w-10 h-10'
            style={{
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
      </div>

      <Skeleton height={30} width={200} className='mt-4' />
      <Skeleton height={20} width={150} className='mt-2' />
    </div>
  );
};

export { ProfileSkeleton };

const ReviewSkeleton = () => {
  return (
    <>
      {/* {[...Array(count)].map((_, index) => ( */}
      
      <div className='bg-gray-100 rounded-lg p-2 sm0:p-4 flex mt-4 flex-col gap-4'>
        <div className='flex flex-col sm0:flex-row justify-center sm0:justify-normal items-center sm0:items-start gap-2 sm0:gap-4 flex-shrink-0'>
          <div className='relative  mx-auto rounded-full mb-0 sm0:mb-4 '>
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
          <div className='flex-col sm0:flex-row justify-center items-center w-full '>
            <div className="flex-col w-full items-center sm0:items-start">
            <div className="w-full flex justify-center sm0:justify-start">
            <Skeleton height={20} width={120} className='mb-1' />
            </div>
            <div className='flex gap-1 justify-center sm0:justify-start mb-2'>
            
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} circle height={20} width={20} />
              ))}
            </div>
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
      {/* ))} */}
    </>
  );
};

export { ReviewSkeleton };
