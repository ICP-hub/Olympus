import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';

const EventCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className="max-w-7xl mx-auto bg-white">
        {/* <div className="hidden md:flex flex-col md:items-end mb-8 pt-4">
          <Skeleton height={32} width={128} className="rounded-md" />
        </div> */}

        {/* {Array.from({ length: 4 }).map((_, index) => ( */}
          <div  className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center gap-4 w-full relative">
                <SkeletonTheme color="#e3e3e3">
                  <div className="relative flex flex-col items-center w-full md:w-[240px] bg-[#e3e3e3]">
                    <Skeleton height={172} width="full" className="rounded-lg mb-2" />
                    {/* <div className="flex items-center justify-center border-2 rounded-full border-gray-500 w-24 h-24 absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div> */}
                    <div className='flex items-center justify-center absolute inset-0 rounded-md'>
                  <h2 className='text-4xl font-bold text-gray-500'>
                    Banner
                  </h2>
                </div>
                  </div>
                </SkeletonTheme>

                <div className="w-full md:w-2/3 mt-3 md:-mt-2">
                  <Skeleton height={24} width="30%" className="rounded-md mb-2" />
                  <Skeleton height={20} width="100%" className="rounded-md mb-2" />
                  <Skeleton height={15} count={3} width="100%" className="rounded-md mb-1" />
                  <div className="flex gap-3 items-center mt-2">
                    <Skeleton height={20} width={60} className="rounded-md" />
                    <Skeleton height={20} width={60} className="rounded-md" />
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
