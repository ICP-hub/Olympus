import React from 'react'
import SkeletonThemeMain from '../../../../Common/SkeletonTheme'
import   Skeleton from 'react-loading-skeleton'
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';


const DiscoverMentorProfileSkeleton = () => {
  return (
    <SkeletonThemeMain>
        <div className='px-6 py-2 md:p-6 bg-gray-50'>
        {/* Skeleton for Profile Image */}
        <div className='relative w-24 h-24 mx-auto rounded-full mb-4'>
          <Skeleton circle={true} height={96} width={96} />
          <div className='absolute inset-0 flex items-center justify-center'>
            {/* {userCircleSvgIcon} */}
            <div
              className='flex items-center justify-center border-2 rounded-full border-gray-300 w-10 h-10 absolute mt-0.5'
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#e3e3e3',
              }}
            >
              <svg
                className='w-5 h-5 text-gray-400'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
              </svg>
            </div>
          </div>
        </div>

        {/* Skeleton for Verified Icon and Name */}
        <div className='flex items-center justify-center mb-1'>
          <Skeleton circle={true} width={20} height={20} className='mr-1' />
          <Skeleton width={120} height={25} />
        </div>

        {/* Skeleton for Username */}
        <p className='text-center mb-4'>
          <Skeleton width={140} height={20} />
        </p>

        {/* Skeleton for Button */}
        <div className='flex items-center justify-center mb-6'>
          <button
            type='button'
            // onClick={handleGetInTouchClick}
            className='w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className='ml-1' fontSize='small' />
          </button>
        </div>
      </div>
    </SkeletonThemeMain>
  )
}

export default DiscoverMentorProfileSkeleton
