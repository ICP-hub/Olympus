import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
const AttendeeCardSkeleton = () => {
    return (
        <>
        <SkeletonThemeMain>
      <div className='flex p-4 bg-white shadow-md rounded-lg mb-6'>
        <div className='flex-shrink-0 w-[70px] h-[70px]'>
          <Skeleton circle={true} height={70} width={70} /> {/* Circular Skeleton for profile picture */}
        </div>
        <div className='ml-6 flex-1'>
          <Skeleton height={24} width='30%' className='rounded-md mb-2' /> {/* Skeleton for name */}
          <Skeleton height={20} width='100%' className='rounded-md mb-2' /> {/* Skeleton for username */}
          <div className='border-t border-gray-200 mt-2'></div>
  
          <Skeleton height={15} count={2} width='100%' className='rounded-md mb-1' /> {/* Skeleton for bio */}
  
          <div className='flex flex-wrap gap-2 mt-1'>
            <Skeleton height={20} width={100} className='rounded-full' /> {/* Skeleton for reason to join */}
            <Skeleton height={20} width={100} className='rounded-full' /> {/* Skeleton for area of interest */}
          </div>
  
          <div className='flex items-center mt-1'>
            <Skeleton height={20} width={20} className='mr-2 rounded-full' /> {/* Skeleton for location icon */}
            <Skeleton height={20} width={100} className='rounded-md' /> {/* Skeleton for country */}
          </div>
        </div>
      </div></SkeletonThemeMain>
      </>
    );
  };
  export default AttendeeCardSkeleton;