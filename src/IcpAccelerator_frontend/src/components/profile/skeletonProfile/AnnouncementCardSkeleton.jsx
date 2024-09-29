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
          <Skeleton circle height={64} width={64} />
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
