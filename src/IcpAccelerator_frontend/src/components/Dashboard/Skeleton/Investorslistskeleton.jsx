import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const InvestorlistSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#e3e3e3' highlightColor='#c8c8c873'>
      <div className='bg-white  hover:scale-105 w-full  drop-shadow-xl rounded-lg mb-5 md:mb-0 p-6 lg:ml-2'>
        <div className='justify-center flex items-center'>
          <div className='size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay '>
            {' '}
            <Skeleton circle={true} height={175} width={175} />
          </div>
        </div>
        <div className='text-black text-start'>
          <div className='text-start my-3'>
            <span className='font-semibold text-lg truncate'>{name}</span>
            <span className='block text-gray-500 truncate'>
              <Skeleton height={18} width={150} />
            </span>
          </div>
          <div className='flex overflow-x-auto gap-2 pb-4 justify-start'>
            {
              <>
                <span className='rounded-full  text-xs font-bold   leading-none flex items-center'>
                  <Skeleton height={13} width={75} />
                </span>
              </>
            }
          </div>
          <div className='flex  gap-1'>
            <Skeleton
              height={12}
              width={25}
              rounded-lg
              className='rounded-xl'
            />
            <Skeleton
              height={12}
              width={25}
              rounded-lg
              className='rounded-xl'
            />
            <Skeleton
              height={12}
              width={25}
              rounded-lg
              className='rounded-xl'
            />
          </div>

          <Skeleton height={33} width='100%' />
        </div>
      </div>
    </SkeletonTheme>
  );
};
