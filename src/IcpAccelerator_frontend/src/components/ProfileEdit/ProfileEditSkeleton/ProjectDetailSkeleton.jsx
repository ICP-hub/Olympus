import React from 'react'
import SkeletonThemeMain from '../../Common/SkeletonTheme'
import Skeleton from 'react-loading-skeleton';

const ProjectDetailSkeleton = () => {
  return (
    <SkeletonThemeMain>
          {/* Reason for Joining This Platform */}
          <div className='group relative rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start mb-2'>
                Reason for joining this platform
              </label>
            </div>
            <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div> 
          </div>

          {/* Preferred ICP Hub */}
          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Preferred ICP Hub you would like to be associated with
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          {/* Project Name */}
          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Project Name
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          {/* Project Description */}
          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Project Description
              </label>
            </div>
            <div class='space-y-2.5 animate-pulse w-full '>
            <div class='flex items-center w-full'>
              <div class='h-2.5 bg-gray-200 rounded-full  w-32'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
            </div>
            <div class='flex items-center w-full '>
              <div class='h-2.5 bg-gray-200 rounded-full  w-full'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
            </div>
          </div>
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Project Elevator pitch
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Project Website
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Is your Project registered
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Type of registration
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Country of registration
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Are you also multichain
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Please select the chains
              </label>
            </div>
            <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div> 
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Live on icp Mainnet
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                DApp link
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Weekly active users
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Revenue (in million usd)
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Interests
              </label>
            </div>
            <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={20} width={90} />
          </div> 
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Promotional video
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          <div className='group relative  rounded-lg p-2 px-3 mb-2'>
            <div className='flex justify-between items-center'>
              <label className='block font-semibold text-xs text-gray-500 uppercase'>
                Toconomics
              </label>
            </div>
            <Skeleton height={20} />
          </div>

          {/* Social Links */}
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
          

    </SkeletonThemeMain>
  )
}

export default ProjectDetailSkeleton