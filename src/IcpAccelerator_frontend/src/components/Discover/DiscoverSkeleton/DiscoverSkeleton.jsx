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
              <Skeleton circle={true} width={96} height={96} />
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
                <Skeleton width={150} height={20} />
              </h3>
              <p className='text-gray-500'>
                <Skeleton width={150} height={20} />
              </p>
            </div>
          </div>
          <div className='  w-[3.4rem]'>
            <Skeleton
              variant='rectangular'
              height={20}
              style={{ borderRadius: '0.25rem' }}
            />
          </div>
          <div className='border-t border-gray-200 my-1'></div>
          <p className='text-gray-600 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2'>
            <Skeleton count={2} height={20} />
          </p>
          <div className='flex gap-6  text-sm text-gray-500 flex-wrap'>
            <Skeleton width={100} height={20} />

            <span className='mr-2 mb-2 flex text-[#121926] items-center'>
              <Skeleton
                variant='circular'
                width={16}
                height={20}
                className='mr-1'
              />
              <Skeleton width={150} height={20} />
            </span>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
}
