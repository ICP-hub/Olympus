import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const OngoingAcceleratorSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#e3e3e3' highlightColor='#c8c8c873'>
      <div className='block w-full drop-shadow-xl rounded-lg bg-white mb-8 -mt-1 '>
        <div className='w-full relative'>
          <Skeleton height={170} width='100%' className='sm:h-48 lg:h-56' />
          <div className='absolute h-12 w-12 -bottom-1 right-[20px]'></div>
        </div>
        <div className='w-full'>
          <div className='p-4 sm:p-6 lg:p-8'>
            <div className='w-full mt-4'>
              <div className='flex-col text-[#737373] flex'>
                <h1 className='font-bold text-black text-lg sm:text-xl lg:text-2xl truncate capitalize'>
                  <Skeleton height={30} width='100%' />
                </h1>
                <p className='text-sm whitespace-nowrap pt-1'>
                  <span className='text-black font-bold'>
                    <Skeleton height={15} width={100} />
                  </span>
                </p>
                <p className='text-sm whitespace-nowrap pt-1'>
                  <span className='text-black font-bold'>
                    <Skeleton height={15} width={80} />
                  </span>
                </p>
              </div>
              <p className='text-[#7283EA] font-semibold text-lg sm:text-xl lg:text-2xl'>
                <Skeleton height={30} width={130} />
              </p>
              <div className='flex w-full py-2'>
                <p className='line-clamp-3 h-12'>
                  <Skeleton height={15} width={200} count={2} />
                </p>
              </div>
              <p className='text-[#7283EA] font-semibold text-lg sm:text-xl lg:text-2xl'>
                <Skeleton height={30} width={60} />
              </p>
              <div className='flex gap-1'>
                <Skeleton height={15} width={25} className='rounded-lg' />
                <Skeleton height={15} width={25} className='rounded-lg' />
                <Skeleton height={15} width={25} className='rounded-lg' />
              </div>
              <div className='flex flex-row flex-wrap space-x-8 mt-2'>
                <div className='flex gap-4 justify-between w-full'>
                  <div className='flex flex-col font-bold'>
                    <p className='text-[#7283EA]'>
                      <Skeleton height={20} width={180} />
                      <Skeleton height={25} width={130} />
                    </p>
                  </div>
                  <div className='flex flex-col font-bold'>
                    <p className='text-[#7283EA]'>
                      <Skeleton height={20} width={50} />
                      <Skeleton height={25} width={25} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default OngoingAcceleratorSkeleton;
