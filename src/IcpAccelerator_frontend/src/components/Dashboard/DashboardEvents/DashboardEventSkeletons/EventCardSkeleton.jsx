import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';

const EventCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='max-w-7xl mx-auto bg-white'>
        <div className='bg-white rounded-lg shadow p-4 mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-center md:items-start'>
            <div className='flex flex-col md:flex-row items-center gap-4 w-full relative'>
              <SkeletonTheme color='#e3e3e3'>
                <div className='relative flex flex-col items-center w-full md:w-[240px] bg-[#e3e3e3]'>
                  <Skeleton
                    height={172}
                    width='full'
                    className='rounded-lg mb-2'
                  />

                  <div className='flex items-center justify-center absolute inset-0 rounded-md'>
                    <svg
                      className='w-14 h-14 text-gray-400 '
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 20 18'
                    >
                      <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                    </svg>
                  </div>
                </div>
              </SkeletonTheme>

              <div className='w-full md:w-2/3 mt-3 md:-mt-2'>
                <Skeleton height={24} width='30%' className='rounded-md mb-2' />
                <Skeleton
                  height={20}
                  width='100%'
                  className='rounded-md mb-2'
                />
                {/* <Skeleton
                  height={15}
                  count={3}
                  width='100%'
                  className='rounded-md mb-1'
                /> */}
                <div
                  role='status'
                  className='space-y-2.5 animate-pulse max-w-lg'
                >
                  <div className='flex items-center w-full'>
                    <div className='h-2.5 bg-gray-200 rounded-full  w-32'></div>
                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                  </div>
                  <div className='flex items-center w-full max-w-[480px]'>
                    <div className='h-2.5 bg-gray-200 rounded-full  w-full'></div>
                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                  </div>

                  <div className='flex items-center w-full max-w-[440px]'>
                    <div className='h-2.5  bg-gray-300 rounded-full w-32'></div>
                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                    <div className='h-2.5 ms-2 bg-gray-200 rounded-full  w-full'></div>
                  </div>
                  <div className='flex items-center w-full max-w-[480px]'>
                    <div className='h-2.5 bg-gray-200 rounded-full  w-full'></div>
                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                  </div>

                  <span className='sr-only'>Loading...</span>
                </div>
                <div className='flex gap-3 items-center mt-2'>
                  <Skeleton height={20} width={60} className='rounded-md' />
                  <Skeleton height={20} width={60} className='rounded-md' />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ))} */}
      </div>
    </SkeletonThemeMain>
  );
};

export default EventCardSkeleton;
