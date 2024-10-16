import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';

const AnnouncementCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='container mx-auto md:my-6 bg-white'>
        <div className='flex justify-between items-center mx-3 pb-1 mb-2'>
          <Skeleton height={20} width={80} className='rounded-md' />
          <div className='flex gap-2 sm0:gap-4 items-center'>
            <Skeleton circle height={30} width={30} />
            <Skeleton circle height={30} width={30} />
          </div>
        </div>
        <div className='flex flex-col sm0:flex-row w-full items-center sm0:items-start px-3 py-5 shadow rounded-md mb-4 sm0:space-x-4'>
        <div className='relative  mx-auto rounded-full mb-4'>
              <Skeleton circle={true} height={60} width={60} />
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
                    className='w-5 h-5 text-gray-400'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                  </svg>
                </div>
              </div>
            </div>
          <div className='flex flex-col gap-1 w-full overflow-hidden'>
            <Skeleton height={25} width={180} className='rounded-md' />
            <Skeleton height={20} width='100%' className='rounded-md' />
            {/* <Skeleton height={20} width="80%" className="rounded-md" /> */}
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default AnnouncementCardSkeleton;
