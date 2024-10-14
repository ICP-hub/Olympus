import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';

const MoneyRaisedCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='relative flex flex-col xxs:flex-row items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300'>
        <div className={`flex-shrink-0 w-full xxs:w-[180px]`}>
          <Skeleton  height={80} width={120} />
        </div>

        {/* Details Section */}
        <div
          className={`w-full mt-2 xxs:mt-0 flex-grow flex justify-between xxs:flex-col xxs:justify-center  transition-all duration-300 `}
        >
          <div className='flex justify-between items-center'>
            <p className='text-xs xxs:text-base sm5:text-lg font-semibold text-gray-900'>
              <Skeleton width={100} height={15} />
            </p>
          </div>
          <p className='text-xs xxs:text-sm text-gray-500 mt-1'>
            <Skeleton width={100} height={15} />
          </p>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default MoneyRaisedCardSkeleton;
