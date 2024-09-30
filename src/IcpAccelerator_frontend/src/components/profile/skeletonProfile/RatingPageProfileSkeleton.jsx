import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';

const RatingPageProfileSkeleton = () => {
  return (
    <SkeletonThemeMain>
        <div className="p-3 sm0:p-6 flex flex-col items-center justify-center">
      
      <Skeleton circle height={100} width={100} />
      <Skeleton height={30} width={200} />
      <Skeleton height={20} width={150} />
      <div className="flex gap-2 my-5">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} circle height={32} width={32} />
        ))}
      </div>
      <Skeleton height={60} width="100%" />
    </div>
    </SkeletonThemeMain>
  )

  
}

export default RatingPageProfileSkeleton;



const ProfileSkeleton = () => {
  return (
    <div className='flex flex-col mt-6 items-center'>
      <Skeleton circle height={112} width={112} />
      <Skeleton height={30} width={200} className='mt-4' />
      <Skeleton height={20} width={150} className='mt-2' />
    </div>
  );
};

export  {ProfileSkeleton};


const ReviewSkeleton = ({count=3}) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className='bg-gray-100 rounded-lg p-2 sm0:p-4 flex mt-4 flex-col gap-4'
        >
          <div className='flex flex-col sm0:flex-row justify-center sm0:justify-normal items-center sm0:items-start gap-2 sm0:gap-4 flex-shrink-0'>
            <Skeleton circle height={48} width={48} />
            <div className='flex-grow'>
              <Skeleton height={20} width={120} className='mb-1' />
              <div className='flex gap-1 mb-2'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} circle height={20} width={20} />
                ))}
              </div>
              <Skeleton height={40} width='100%' />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export  {ReviewSkeleton};

