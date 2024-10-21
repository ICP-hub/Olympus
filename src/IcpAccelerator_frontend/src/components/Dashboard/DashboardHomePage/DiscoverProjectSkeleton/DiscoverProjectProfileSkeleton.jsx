import React from 'react';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';

const DiscoverProjectProfileSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='bg-slate-200 p-6'>
        <div className='flex justify-center'>
          <SkeletonTheme color='#e3e3e3'>
            <div className='relative flex flex-col items-center'>
              {/* Profile circle skeleton */}
              <div className='rounded-lg  '>
                <Skeleton height={96} width={96} />
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

        <div className='text-center mt-2'>
          <span className='text-xs font-medium text-[#3538CD] border bg-blue-50 rounded-lg px-3 py-1'>
            Looking for funding
          </span>
        </div>

        <div className='text-center mt-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            <Skeleton height={20} />
          </h2>
          {/* <p className="text-gray-500">@cypherpunklabs</p> */}
        </div>

        <div className='text-center w-full mt-6'>
          {/* <button className="bg-transparent border border-[#3505B2] text-[#3505B2] text-sm font-[950] px-2 py-1 rounded-md">
            Get in touch{" "}
          </button> */}
          <a className='w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'>
            Get in touch
            <ArrowOutwardOutlinedIcon className='ml-1' fontSize='small' />
          </a>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default DiscoverProjectProfileSkeleton;
