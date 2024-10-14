import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import { Star } from '@mui/icons-material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
export default function DiscoverSkeleton() {
  return (
    <SkeletonThemeMain>
      <div className='sm:pr-6 sm:pt-6 sm:pb-6 my-10 md1:my-0 w-full  rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row'>
        <div className=' w-full sm:w-[272px] relative'>
          <div className='w-full sm:max-w-[250px] sm:w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between overflow-hidden'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <SkeletonTheme color='#e3e3e3'>
                <div className='relative flex flex-col items-center'>
                  {/* Profile circle skeleton */}
                  <div className='rounded-full  '>
                    <Skeleton circle={true} width={96} height={96} />
                  </div>

                  {/* Icon in the center of the circle */}
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
                      className='w-6 h-6 text-gray-400'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                    </svg>
                  </div>
                </div>
              </SkeletonTheme>
            </div>
          </div>
          <div className='absolute cursor-pointer bottom-0 right-[6px] flex items-center bg-gray-100 p-1'>
            <Star className='text-yellow-400 w-4 h-4' />
            <span className='text-sm font-medium'>Rate Us</span>
          </div>
        </div>
        <div className='flex-grow mt-5 md1:mt-0 sm:ml-[25px] w-full'>
          <div className='flex justify-between items-start mb-2'>
            <div>
              <h3 className='text-xl font-bold'>
                <Skeleton width={150} height={15} />
              </h3>
              <p className='text-gray-500'>
                <Skeleton width={150} height={15} />
              </p>
            </div>
          </div>
          <div className='  w-[3.4rem]'>
            <Skeleton
              variant='rectangular'
              height={15}
              style={{ borderRadius: '0.25rem' }}
            />
          </div>
          <div className='border-t border-gray-200 my-1'></div>
          <p className='text-gray-600 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2'>
          <div class='space-y-2.5 animate-pulse w-full mt-2 '>
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
          </p>
          <div className='flex gap-6  text-sm text-gray-500 flex-wrap'>
            <Skeleton width={100} height={15} />

            <span className='mr-2 mb-2 flex text-[#121926] items-center'>
              <Skeleton
                variant='circular'
                width={16}
                height={15}
                className='mr-1'
              />
              <Skeleton width={150} height={15} />
            </span>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
}
