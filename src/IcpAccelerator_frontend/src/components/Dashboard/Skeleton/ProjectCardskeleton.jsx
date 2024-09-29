import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export const ProjectCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#e3e3e3' highlightColor='#c8c8c873'>
      <div className='flex items-center  '>
        <div className='flex'>
          <Skeleton height={65} width={65} className='rounded-md ml-[8px] ' />
        </div>
        <div className='flex justify-between items-center w-full'>
          <div className='px-2'>
            <div className='flex items-center'>
              <div className='flex items-center'>
                <p className='font-[950] text-2xl pr-2'>
                  <Skeleton height={25} width={100} />
                </p>
              </div>
            </div>
            <div className='md:flex block text-xs md:text-sm text-[#737373] mt-3'>
              <Skeleton height={20} width={35} className='rounded-xl' />
            </div>
          </div>

          <div className='flex flex-row flex-wrap gap-2 text-xs md:text-sm text-right pr-4'>
            <div className='flex gap-2.5 mr-2 '>
              <div className='w-4 h-4'>
                <Skeleton height={25} width={25} circle={true} />
              </div>

              <div className='w-4 h-4'>
                <Skeleton height={25} width={25} circle={true} />
              </div>
            </div>
            {/* {website && ( */}
            {/* <a href={website} target="_blank"> */}
            <Skeleton height={25} width={100} />

            <Skeleton height={25} width={105} />
          </div>
        </div>
      </div>
      <div className='flex justify-between text-gray-500 px-2 pt-2'>
        <div className='flex items-center '>
          {/* {country && ( */}
          <div className='flex  justify- start  gap-2'>
            {' '}
            <Skeleton height={20} width={50} />
            <p>
              {/* {doj && ( */}
              <div className='flex text-xs md:text-sm text-[#737373]'>
                <p>
                  <Skeleton height={20} width={200} />
                </p>
              </div>
              {/* )} */}
            </p>
          </div>
          {/* )} */}
        </div>
        <div></div>
      </div>
    </SkeletonTheme>
  );
};
