import React from 'react';
import Skeleton from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';

const MentorEditSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='relative w-full '>
        <form>
          {/* ICP Hub */}
          <div className='my-1 relative group  rounded-lg p-2 px-3'>
            <label className='block mb-2 text-xs font-semibold text-gray-500'>
              ICP HUB YOU WILL LIKE TO BE ASSOCIATED
            </label>
            <Skeleton height={20} />
          </div>

          {/* Area of Expertise */}
          <div className='my-1 group relative  rounded-lg p-2 px-3'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Area of Expertise
            </h3>
            <div className='flex  gap-2'>
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
            </div>
          </div>

          {/* Multi Chain */}
          <div className='my-1 relative group  rounded-lg p-2 px-3'>
            <label className='block mb-1 text-xs font-semibold text-gray-500'>
              DO YOU MENTOR MULTIPLE ECOSYSTEMS
            </label>
            <Skeleton height={20} />
          </div>

          <div className='my-1 relative group  rounded-lg p-2 px-3'>
            <label className='block mb-1 text-xs font-semibold text-gray-500'>
              PLEASE SELECT THE CHAINS
            </label>
            <div className='flex  gap-2'>
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
            </div>
          </div>

          {/* Category of Mentoring Service */}
          <div className='my-1 relative group  rounded-lg p-2 px-3'>
            <label className='block mb-1 text-xs font-semibold text-gray-500'>
              CATEGORIES OF MENTORING SERVICES
            </label>
            <div className='flex  gap-2'>
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
              <Skeleton
                style={{ borderRadius: '18px' }}
                height={20}
                width={90}
              />
            </div>
          </div>

          <div className='my-1 relative group hover:bg-gray-100 rounded-lg p-2 px-3'>
            <label className='block mb-1 text-xs font-semibold text-gray-500'>
              REASON FOR JOINING THIS PLATEFORM
            </label>
            <Skeleton height={20} />
          </div>

          <div className='my-1 relative group  rounded-lg p-2 px-3'>
            <label className='block mb-2 text-xs font-semibold text-gray-500'>
              ARE YOU ICP HUB/SPOKE
            </label>
            <Skeleton height={20} />
          </div>

          <div className='my-1 relative group  rounded-lg p-2 px-3'>
            <label className='block mb-2 text-xs font-semibold text-gray-500'>
              HUB OWNER
            </label>
            <Skeleton height={20} />
          </div>

          {/* Website */}
          <div className='my-1 relative group rounded-lg p-2 px-3'>
            <label className='block mb-1 text-xs font-semibold text-gray-500'>
              WEBSITE LINK
            </label>
            <Skeleton height={20} />
          </div>

          {/* Years of Mentoring */}
          <div className='my-1 relative group  rounded-lg p-2 px-3'>
            <label className='block mb-1 text-xs font-semibold text-gray-500'>
              YEARS OF MENTORING
            </label>
            <Skeleton height={20} />
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
        </form>
      </div>
    </SkeletonThemeMain>
  );
};

export default MentorEditSkeleton;
