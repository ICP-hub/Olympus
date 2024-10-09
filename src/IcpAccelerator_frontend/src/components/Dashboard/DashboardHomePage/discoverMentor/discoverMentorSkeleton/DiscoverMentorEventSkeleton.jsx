import React from 'react'
import SkeletonThemeMain from '../../../../Common/SkeletonTheme'
import   Skeleton from 'react-loading-skeleton'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

const DiscoverMentorEventSkeleton = () => {
  return (
    <SkeletonThemeMain>
        <div
            
            className='relative mb-4 bg-white shadow-md border rounded-lg p-4'
          >
            <div className='relative  mx-auto rounded-lg mb-4'>
          <Skeleton  height={140}  />
          <div className='absolute inset-0 flex items-center justify-center'>
            {/* {userCircleSvgIcon} */}
            <div
              className='flex items-center justify-center border-2 rounded-full border-gray-300 w-16 h-16 absolute mt-0.5'
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#e3e3e3',
              }}
            >
              <svg
                className='w-10 h-10 text-gray-400'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
              </svg>
            </div>
          </div>
        </div>
            <div className='p-2 flex bg-white rounded absolute top-6 left-6 z-10 justify-between items-start'>
              <div>
                <p className='rounded-md inline-block text-sm font-semibold '>
                  <Skeleton  height={20} />
                </p>
                <p className='text-sm text-gray-600'>Start at 15:00 GMT+4</p>
              </div>
            </div>
            <div className='mt-4'>
              <span className='border text-gray-700 text-xs font-medium px-2 py-1 rounded-xl'>
                Workshop
              </span>
            </div>
            <h3 className='mt-2 text-lg font-bold text-gray-900'>
              <Skeleton   height={20} />
            </h3>
            <div className='mt-2 text-gray-600 text-sm line-clamp-6 hover:line-clamp-none'>
            <Skeleton   height={20} />
            </div>
            <div className='mt-4 flex items-center space-x-4'>
              <span className='text-sm text-gray-600 flex items-center'>
                <PlaceOutlinedIcon
                  sx={{ fontSize: 'medium', marginTop: '-2px' }}
                />
                <Skeleton   height={20} />
              </span>
              <span className='text-sm text-gray-600'>
              <Skeleton   height={20} />
              </span>
            </div>
          </div>
    </SkeletonThemeMain>
  )
}

export default DiscoverMentorEventSkeleton