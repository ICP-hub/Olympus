import React from 'react';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { MdArrowOutward } from 'react-icons/md';

const RegionalHubSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='bg-white rounded-lg shadow-lg p-4 min-w-[260px] w-[30%] '>
        <div>
          <div className='relative mx-auto rounded-full mb-4'>
            <Skeleton circle={true} height={60} width={60} />
          </div>
          <div>
            <h3 className='text-lg font-semibold line-clamp-1 break-all'>
              <Skeleton height={20} />
            </h3>
            <p className='text-sm text-gray-600 mt-2  line-clamp-2 break-all'>
              <Skeleton height={15} count={2} />
            </p>
          </div>
        </div>

        <div className='flex gap-2 mt-2 flex-wrap'>
          <Skeleton circle={true} width={30} height={30} />
          <Skeleton circle={true} width={30} height={30} />
          <Skeleton circle={true} width={30} height={30} />
        </div>

        <div className='mt-3 text-center '>
          <a className='bg-[#155EEF] flex items-center justify-center shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#1018280D_inset,0px_0px_0px_1px_#1018282E_inset]  border-2 border-white text-white py-[10px] px-4 rounded-[4px] text-sm font-medium hover:bg-blue-700 my-4'>
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
