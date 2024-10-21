import React from 'react';
import SkeletonThemeMain from '../../../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
export default function DiscoverUserModalSkeleton({
  openDetail,
  setOpenDetail,
  userData,
}) {
  return (
    <SkeletonThemeMain>
      <div className='flex justify-center p-6'>
        <div className='container border bg-white rounded-lg shadow-sm h-full overflow-y-scroll w-full '>
          <div className='flex flex-col w-full p-6 bg-gray-100'>
            <div className='flex gap-3 justify-center'>
              <SkeletonTheme color='#e3e3e3'>
                <div className='relative flex flex-col items-center'>
                  {/* Profile circle skeleton */}
                  <div className='rounded-full  '>
                    <Skeleton circle={true} height={96} width={96} />
                  </div>

                  {/* Icon in the center of the circle */}
                  <div
                    className='flex items-center justify-center border-2 rounded-full border-gray-300 w-12 h-12 absolute mt-0.5'
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: '#e3e3e3',
                    }}
                  >
                    <svg
                      className='w-8 h-8 text-gray-400'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                    </svg>
                  </div>
                </div>
              </SkeletonTheme>
            </div>

            <div className='flex gap-3 justify-center'>
              <Skeleton width={80} />
            </div>
            <p className='text-gray-600 text-center mb-2 '>
              <Skeleton width={80} />
            </p>
            <a className='w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'>
              Get in touch
              <ArrowOutwardOutlinedIcon className='ml-1' fontSize='small' />
            </a>
          </div>

          <div className='p-6 bg-white'>
            <div className='mb-2 p-2'>
              <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                Roles
              </h3>
              <div className='flex space-x-2'>
                <Skeleton width={80} height={20} />
              </div>
            </div>
            <hr />

            <div className=' '>
              <div className='mb-2 group relative  rounded-lg p-2 '>
                <h3 className='font-semibold mb-1 text-xs text-gray-500 uppercase'>
                  Email
                </h3>

                <div className='flex flex-wrap items-center'>
                  <p className='mr-2 text-sm'>
                    {' '}
                    <Skeleton width={150} />
                  </p>
                  {/* <VerifiedIcon
                            className='text-blue-500 mr-2 w-2 h-2'
                            fontSize='small'
                          /> */}
                </div>
              </div>

              {/* About Section */}
              <div className='mb-2 group relative  rounded-lg p-2 '>
                <h3 className='font-semibold mb-1 text-xs text-gray-500 uppercase'>
                  About
                </h3>
                <div>
                  <p className='text-sm line-clamp-3 hover:line-clamp-6'>
                    <div className='space-y-2.5 animate-pulse w-full '>
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
                  </p>
                </div>
              </div>
              <div className='mb-2 group relative  rounded-lg p-2 '>
                <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                  Type of Profile
                </h3>

                <div className='flex items-center'>
                  <Skeleton width={100} />
                </div>
              </div>
              <div className='mb-2 group relative  rounded-lg p-2 '>
                <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                  Reason to Join Platform
                </h3>
                <div>
                  <div className='flex flex-wrap gap-2'>
                    <Skeleton width={80} />
                  </div>
                </div>
              </div>
              <div className='mb-2 group relative  rounded-lg p-2 '>
                <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                  Area of Interest
                </h3>
                <div>
                  <div className='flex flex-wrap gap-2'>
                    <Skeleton width={80} />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className='mb-2 group relative  rounded-lg p-2 '>
                <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                  Location
                </h3>
                <div className='flex gap-2'>
                  {/* <Skeleton width={20} /> */}
                  <Skeleton width={100} />
                </div>
              </div>

              <div className='p-2 group relative  rounded-lg'>
                <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase '>
                  LINKS
                </h3>
                <div className='flex items-center gap-3'>
                  <Skeleton circle height={30} width={30} />
                  <Skeleton circle height={30} width={30} />
                  <Skeleton circle height={30} width={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
}
