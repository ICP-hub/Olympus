import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';

const UserGeneralDetailSkeleton = () => {
  return (
    <SkeletonThemeMain>
    <div className='container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full '>
     
      <div className='px-1 py-4'>
        {/* Skeleton for full name */}
        {/* <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              full name
            </h3>
          </div>
          <Skeleton height={30} />
        </div> */}

        {/* Skeleton for openchat_username */}
        {/* <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              openchat_username
            </h3>
          </div>
          <Skeleton height={30} />
        </div> */}

        {/* Skeleton for Email */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Email
            </h3>
          </div>
          <Skeleton height={30} />
        </div>

        {/* Skeleton for About */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              About
            </h3>
          </div>
          <Skeleton height={20} count={2} />
        </div>

        {/* Skeleton for Location */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Location
            </h3>
          </div>
          <Skeleton height={30} />
        </div>

        {/* Skeleton for Type of Profile */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Type of Profile
            </h3>
          </div>
          <div className='flex  gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={30} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={30} width={90} />
          </div>
        </div>

        {/* Skeleton for Interests */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Interests
            </h3>
          </div>
          <div className='flex gap-2'>
            <Skeleton style={{ borderRadius: '18px' }} height={30} width={90} />
            <Skeleton style={{ borderRadius: '18px' }} height={30} width={90} />
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
    </div>
  </SkeletonThemeMain>
  )
}

export default UserGeneralDetailSkeleton