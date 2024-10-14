
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import SkeletonThemeMain from '../../../Common/SkeletonTheme';

const EventRequestCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className="bg-white rounded-lg shadow p-4 mt-4 w-full md:max-w-full">
        <div className="flex flex-col sm1:flex-row sm1:gap-4 lg:flex-col lg1:flex-row items-start md1:items-center">
          {/* Image section */}
          <div className="w-full lgx:w-[272px] h-[230px]">
            <div className="w-full lgx:max-w-[230px] lgx:min-w-[230px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden">
              <div className="group relative h-full">
                {/* Background placeholder */}
                <div className="absolute ">
                  <Skeleton height="100%" width="100%" />
                </div>
                <div
                      className='flex items-center justify-center border-2 rounded-full border-gray-300 w-20 h-20 absolute mt-0.5'                    style={{                      top: '50%',                      left: '50%',                      transform: 'translate(-50%, -50%)',                      backgroundColor: '#e3e3e3',                    }}                  >                    <svg                      className='w-12 h-12 text-gray-400'                      fill='currentColor'                      viewBox='0 0 24 24'                    >                      <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                       </svg>
                     </div>
                <div
                  className="absolute flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Skeleton circle={true} height="100%" width="100%" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full mt-4 sm0:mt-0 lg:mt-4 lg1:mt-0">
            <div className=" mt-2 md:mt-0 w-full">
              <h3 className="text-base md:text-lg font-bold md:mt-0 ">
                <Skeleton width="80%" height={20} />
              </h3>
            
            </div>
            <div className="flex items-center py-[2px]">
              <Skeleton circle={true} width={24} height={24} className="mr-2" />
              <Skeleton width={150} height={15} className="mt-3" />
            </div>
            <div className="border-t border-gray-200 my-1"></div>

            {/* Description */}
            <div className="">
              {/* <Skeleton count={3} width="100%" height={10} /> */}
              <div role="status" class="space-y-2.5 animate-pulse max-w-lg">
    <div class="flex items-center w-full">
        <div class="h-2.5 bg-gray-200 rounded-full  w-32"></div>
        <div class="h-2.5 ms-2 bg-gray-300 rounded-full w-24"></div>
        <div class="h-2.5 ms-2 bg-gray-300 rounded-full w-full"></div>
    </div>
    <div class="flex items-center w-full max-w-[480px]">
        <div class="h-2.5 bg-gray-200 rounded-full  w-full"></div>
                <div class="h-2.5 ms-2 bg-gray-300 rounded-full w-full"></div>
        <div class="h-2.5 ms-2 bg-gray-300 rounded-full w-24"></div>
    </div>
    
    <div class="flex items-center w-full max-w-[440px]">
        <div class="h-2.5  bg-gray-300 rounded-full w-32"></div>
        <div class="h-2.5 ms-2 bg-gray-300 rounded-full w-24"></div>
        <div class="h-2.5 ms-2 bg-gray-200 rounded-full  w-full"></div>
    </div>
    
    <span class="sr-only">Loading...</span>
</div>
            </div>

            {/* Funding and Location */}
            <div className="flex flex-wrap gap-3 items-center mt-2 ">
              <div className="flex items-center">
              <Skeleton width={20} height={15} className="ml-1 rounded-md mr-2" />

                <Skeleton width={60} height={15} />
              </div>
              <div className="flex items-center text-sm text-gray-700">
              <Skeleton width={20} height={15} className="ml-1 rounded-md mr-2" />

                <Skeleton width={60} height={15} className="ml-1" />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center ">
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  width={60}
                  height={24}
                  className="rounded-full"
                  style={{ borderRadius: '1rem' }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-1 ">
              <Skeleton width={90} height={25} style={{ borderRadius: '1rem' }}/>
              <Skeleton width={90} height={25} style={{ borderRadius: '1rem' }}/>
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default EventRequestCardSkeleton;
