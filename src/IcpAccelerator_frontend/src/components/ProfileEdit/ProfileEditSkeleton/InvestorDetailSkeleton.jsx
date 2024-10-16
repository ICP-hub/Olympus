import React from 'react';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import Skeleton from 'react-loading-skeleton';

const InvestorDetailSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='px-1'>
        {/* Are you registered */}
        <div className='group relative  rounded-lg p-3 px-3 mt-4 mb-2'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Are you registered?
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        {/* Registered Country */}

        <div className='group relative rounded-lg my-3 p-2 px-3'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Registered Country
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        {/* ICP Hub */}
        <div className='group relative rounded-lg my-3 p-2 px-3'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              ICP Hub you will like to be associated
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        {/* ICP Investor */}
        <div className='group relative rounded-lg my-3 p-2 px-3'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Are you an existing ICP investor?
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        <div className='my-1 group relative  rounded-lg p-2 px-3'>
          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
            Type of investment
          </h3>
          <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div>
        </div>

        {/* Portfolio Link */}
        <div className='group relative  rounded-lg my-3 p-2 px-3'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Portfolio Link
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        {/* Fund Name */}
        <div className='group relative  rounded-lg my-3 p-2 px-3'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Fund Name
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        {/* Fund Size */}
        <div className='group relative  rounded-lg my-3 p-2 px-3'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Fund size (in million USD)
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        <div className='group relative  rounded-lg p-3 px-3 mt-4 mb-2'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Do you invest in multiple ecosystems
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        <div className='my-1 group relative  rounded-lg p-2 px-3'>
          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
            Please select the chains
          </h3>
          <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div>
        </div>

        <div className='my-1 group relative  rounded-lg p-2 px-3'>
          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
            Category of investment
          </h3>
          <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div>
        </div>

        {/* Website Link */}
        <div className='group relative  rounded-lg my-3 p-2 px-3'>
          <div className='flex justify-between items-center'>
            <label className='font-semibold text-xs text-gray-500 uppercase mb-1'>
              Website Link
            </label>
          </div>
          <Skeleton height={20} />
        </div>

        <div className='my-1 group relative  rounded-lg p-2 px-3'>
          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
            Which stage(s) do you invest at ?
          </h3>
          <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div>
        </div>

        <div className='my-1 group relative  rounded-lg p-2 px-3'>
          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
            What is your range of your check size ?
          </h3>
          <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div>
        </div>

        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Links
            </h3>
          </div>
          <div className='flex gap-3 rounded-full'>
            <Skeleton circle={true} height={30} width={30} />
            <Skeleton circle={true} height={30} width={30} />
            <Skeleton circle={true} height={30} width={30} />
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default InvestorDetailSkeleton;
