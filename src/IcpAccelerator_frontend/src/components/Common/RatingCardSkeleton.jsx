import React from 'react';
import Skeleton from 'react-loading-skeleton';
import SkeletonThemeMain from './SkeletonTheme';
const RatingCardSkeleton = ({}) => {
  return (
    <SkeletonThemeMain>
      <div className='bg-gray-100 max-h-[250px] h-[220px] rounded-lg p-6 flex flex-col items-center'>
        <span className='text-4xl font-bold text-black'>
          <Skeleton circle={true} height={40} width={40} />
        </span>
        <div className='flex ss1:gap-2 my-5'>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              circle={true}
              height={32}
              width={32}
              className='lgx:w-[1.7rem] lgx:h-[1.7rem] dxl0:w-8 h-8'
            />
          ))}
        </div>
        <span className='text-sm text-gray-600 cursor-pointer'>
          <Skeleton width={70} height={20} />
        </span>
      </div>
    </SkeletonThemeMain>
  );
};

export default RatingCardSkeleton;
