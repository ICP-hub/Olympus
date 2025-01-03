import React from 'react';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { MdArrowOutward } from 'react-icons/md';

const RegionalHubSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='bg-white rounded-lg shadow-lg p-4 min-w-[260px] w-full '>
        <div>
          <div className='relative mx-auto rounded-full mb-4'>
            <Skeleton circle={true} height={60} width={60} />
          </div>
          <div>
            <h3 className='text-lg font-semibold line-clamp-1 break-all'>
              <Skeleton height={20} />
            </h3>
            <div className='space-y-2.5 animate-pulse w-full mt-2 '>
              <div className='flex items-center w-full'>
                <div className='h-2.5 bg-gray-200 rounded-full  w-32'></div>
                <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
              </div>
              <div className='flex items-center w-full '>
                <div className='h-2.5 bg-gray-200 rounded-full  w-full'></div>
                <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-2 mt-2 flex-wrap'>
          <Skeleton circle={true} width={30} height={30} />
          <Skeleton circle={true} width={30} height={30} />
          <Skeleton circle={true} width={30} height={30} />
        </div>

        <div className='mt-3 text-center '>
          <a className='bg-[#155EEF] flex items-center justify-center shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#1018280D_inset,0px_0px_0px_1px_#1018282E_inset]  border-2 border-white text-white py-[10px] px-4 rounded-lg text-sm font-medium hover:bg-blue-700 my-4'>
            Join{' '}
            <span className='px-2 flex items-center'>
              <MdArrowOutward className='text-base font-bold' />
            </span>
          </a>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default RegionalHubSkeleton;
