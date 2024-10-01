import React from 'react';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import Skeleton from 'react-loading-skeleton';
import DashboardHomeProfileCardsSkeleton from './DashboardHomeProfileCardsSkeleton';
export default function DashboardHomeWelcomeSectionSkeleton() {
  const skeletonData = Array(4).fill(null);
  return (
    <SkeletonThemeMain>
      <div className='bg-white rounded-lg lg:p-6 mb-6 pt-1'>
        <h1 className='text-sm sxs2:text-base ss3:text-xl xxs:text-2xl sm5:text-3xl font-bold mb-6 mt-6  break-all truncate'>
          <Skeleton width={200} />
        </h1>
        <div className='overflow-x-auto'>
          <div className='flex gap-6 my-1 '>
            {/* 1st card  */}
            <div className='bg-[#F8FAFC] rounded-lg p-4 relative flex flex-col w-[237px] md:w-[330px] ss2:w-[280px] h-[226px] flex-shrink-0 shadow-lg '>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-grow pr-4'>
                  <h3 className='text-md text-[#121926] font-semibold mb-2'>
                    <Skeleton width={150} />
                  </h3>
                  <p className='text-sm text-[#4B5565] line-clamp-3 hover:line-clamp-6  '>
                    <Skeleton count={3} />
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  <div className='w-20 h-16'>
                    <Skeleton circle={true} height={50} width={50} />
                  </div>
                </div>
              </div>
              <div className='mt-auto pt-4 flex items-center space-x-2'>
                <button className='text-[#4B5565] hover:text-gray-600 text-sm'>
                  <Skeleton width={100} height={40} />
                </button>
              </div>
            </div>
            {/* 2nd card  */}
            <div className='bg-[#F8FAFC] rounded-lg p-4 relative flex flex-col w-[237px] md:w-[330px] ss2:w-[280px] h-[226px] flex-shrink-0 shadow-lg '>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-grow pr-4'>
                  <h3 className='text-md text-[#121926] font-semibold mb-2'>
                    <Skeleton width={150} />
                  </h3>
                  <p className='text-sm text-[#4B5565] line-clamp-3 hover:line-clamp-6  '>
                    <Skeleton count={3} />
                  </p>
                </div>
              </div>
              <div className='mt-auto pt-4 flex items-center space-x-2'>
                <button className='text-[#4B5565] hover:text-gray-600 text-sm'>
                  <Skeleton width={80} height={40} />
                </button>
                <button className='text-[#4B5565] hover:text-gray-600 text-sm'>
                  <Skeleton width={80} height={40} />
                </button>
              </div>
            </div>
            {/* 3rd card  */}
            <div className='bg-[#F8FAFC] rounded-lg p-4 relative flex flex-col w-[237px] md:w-[330px] ss2:w-[280px] h-[226px] flex-shrink-0 shadow-lg '>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-grow pr-4'>
                  <h3 className='text-md text-[#121926] font-semibold mb-2'>
                    <Skeleton width={150} />
                  </h3>
                  <p className='text-sm text-[#4B5565] line-clamp-3 hover:line-clamp-6  '>
                    <Skeleton count={3} />
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  <div className='w-20 h-16'>
                    <Skeleton circle={true} height={50} width={50} />
                  </div>
                </div>
              </div>
              <div className='mt-auto pt-4 flex items-center space-x-2'>
                <button className='text-[#4B5565] hover:text-gray-600 text-sm'>
                  <Skeleton width={80} height={40} />
                </button>
              </div>
            </div>
            {/* 4th card  */}
            <div className='bg-[#F8FAFC] rounded-lg p-4 relative flex flex-col w-[237px] md:w-[330px] ss2:w-[280px] h-[226px] flex-shrink-0 shadow-lg '>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-grow pr-4'>
                  <h3 className='text-md text-[#121926] font-semibold mb-2'>
                    <Skeleton width={150} />
                  </h3>
                  <p className='text-sm text-[#4B5565] line-clamp-3 hover:line-clamp-6  '>
                    <Skeleton count={3} />
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  <div className='w-20 h-16'>
                    <Skeleton circle={true} height={50} width={50} />
                  </div>
                </div>
              </div>
              <div className='mt-auto pt-4 flex items-center space-x-2'>
                <button className='text-[#4B5565] hover:text-gray-600 text-sm'>
                  <Skeleton width={80} height={40} />
                </button>

                <button className='text-[#4B5565] hover:text-gray-600 text-sm'>
                  <Skeleton width={80} height={40} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DashboardHomeProfileCardsSkeleton />
    </SkeletonThemeMain>
  );
}
