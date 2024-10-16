import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';

const LatestJobSkeleton = ({ jobCount }) => {
  return  (
    <SkeletonThemeMain color='#e3e3e3' highlightColor='#f0f0f0'>
      {[...Array(jobCount)].map((_, index) => (

      <div className='flex flex-col my-4 bg-white rounded-lg shadow px-4 '>
        <Skeleton width='50%' height={20} className="mt-2" />

        <div className='flex justify-between items-center mt-1'>
          <Skeleton width={150} height={20} />
          <div className='flex gap-4 items-center'>
            <Skeleton circle={true} height={20} width={20} />
            <Skeleton circle={true} height={20} width={20} />
          </div>
        </div>

        {/* Middle Section: Logo and Job Details */}
        <div className='flex items-center gap-3 my-2'>
          {/* <Skeleton circle={true} height={48} width={48} />
           */}
            <SkeletonTheme color='#e3e3e3'>
                  <div className='relative flex flex-col items-center'>
                    {/* Profile circle skeleton */}
                    
                      <div className='rounded-lg  '>
                      <Skeleton  height={48} width={48} style={{ borderRadius: '18px' }}/>
                    </div>

                    {/* Icon in the center of the circle */}
                    <div
                      className='flex items-center justify-center border-2 rounded-full border-gray-300 w-9 h-9 absolute mt-0.5'
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
          <Skeleton width={130} height={23} />
        </div>

        {/* Description */}
        <Skeleton width='100%' height={15} count={2} className='my-1' />

        {/* Bottom Section: Job Attributes */}
        {/* <div className='flex gap-3 items-center flex-wrap mb-2'>
          <Skeleton width={60} height={20} />
          <Skeleton width={60} height={20} />
          <Skeleton width={60} height={20} />
          <Skeleton width={60} height={20} />
        </div> */}
        <div className='flex gap-5 items-center flex-wrap mb-2'>
            <div className='flex items-center gap-2'>
              {' '}
              {/* {lenseSvgIcon}{' '} */}
              <Skeleton width={20} height={20} />
              {' '}
              <span className=''>
                <Skeleton width={65} height={20} />
              </span>{' '}
            </div>
            <div className='flex items-center gap-2'>
              {/* {locationSvgIcon} */}
              <Skeleton width={20} height={20} />

              {' '}
              <span className=''>
                <Skeleton width={65} height={20} />
              </span>{' '}
            </div>
            <div className='flex items-center gap-2'>
              {/* {clockSvgIcon} */}
              <Skeleton width={20} height={20} />

              {' '}
              <span >
                <Skeleton width={65} height={20} />
              </span>{' '}
            </div>
            <div className='flex items-center gap-2'>
              <span className='flex'>
                {/* <LinkIcon />/ */}
                <Skeleton width={20} height={20} />

              </span>{' '}
            </div> 
          </div>
      </div>
        ))}
    </SkeletonThemeMain>
  );
};

export default LatestJobSkeleton;
