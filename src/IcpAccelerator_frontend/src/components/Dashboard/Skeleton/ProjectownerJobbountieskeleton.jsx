import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ProjectOwnerJobSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#e3e3e3' highlightColor='#c8c8c873'>
      <div className='border-2 mb-5 mx-1 rounded-2xl shadow-lg bg-white w-full sm:w-[520px] '>
        <div className='p-4 md:p-2'>
          <h3 className='text-lg font-[950] truncate w-full'>
            <Skeleton height={25} width='50%' />
          </h3>
          <div className='flex flex-col sm:flex-row mt-2'>
            <div className='w-full sm:w-1/2'>
              <div className='pt-2 flex'>
                <Skeleton height={55} className='rounded-xl' width={55} />
                <div className='mt-auto pl-2'>
                  <p className='font-[950] text-base truncate w-28'>
                    <Skeleton height={20} width={100} />
                  </p>
                  <p className='font-[450] line-clamp-2 text-xs w-48'>
                    <Skeleton height={15} width={180} count={2} />
                  </p>
                </div>
              </div>
              <div className='mt-2 pr-4'>
                <p className='text-base font-[950] py-2'>
                  <Skeleton height={20} width={130} />
                </p>
                <ul className='text-xs font-[450] list-disc list-outside'>
                  <li className='h-40 overflow-y-scroll'>
                    <Skeleton height={15} width='100%' count={7} />
                  </li>
                </ul>
              </div>
            </div>
            <div className='flex flex-col justify-between w-full sm:w-1/2 mt-4 sm:mt-0'>
              <div className='flex items-center'>
                <p className='text-base font-[950] pr-2 w-full'>
                  <Skeleton height={20} width={80} />
                </p>
                <div className='flex gap-2 w-full'>
                  <Skeleton height={20} width={30} className='rounded-xl' />
                  <Skeleton height={20} width={30} className='rounded-xl' />
                  <Skeleton height={20} width={30} className='rounded-xl' />
                </div>
              </div>
              <div className='mt-2'>
                <p className='text-base font-[950] py-2'>
                  <Skeleton height={20} width={80} />
                </p>
                <ul className='text-xs font-[450] list-disc list-inside'>
                  <Skeleton height={15} width={80} />
                </ul>
              </div>
              <div className='mt-2'>
                <p className='text-base font-[950] py-1'>
                  <Skeleton height={20} width={80} />
                </p>
                <span className='capitalize'>
                  <Skeleton height={15} width={80} />
                </span>
              </div>
              <div className='mt-2 flex flex-col md:flex-row md:items-end'>
                <div className='w-full'>
                  <span className='text-sm'>
                    <Skeleton height={20} width={130} className='mb-2' />
                  </span>
                </div>
                <div className='w-full sm:w-1/2 mt-2 md:mt-0 mb-2 ml-2 '>
                  <Skeleton height={25} width={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
