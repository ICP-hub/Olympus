import React from 'react';
import SkeletonThemeMain from '../../../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const DiscoverTeamSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='flex flex-col sm0:flex-row gap-6 sm0:items-center p-4 bg-white shadow-lg border border-gray-200 rounded-xl mt-3  mb-4'>
        <div className='bg-gray-100 w-full p-2 sm0:p-0 sm0:w-[30%] sm0:h-[100px] flex items-center justify-center'>
          <SkeletonTheme color='#e3e3e3'>
            <div className='relative flex flex-col items-center'>
              {/* Profile circle skeleton */}
              <div className='rounded-lg  '>
                <Skeleton circle={true} height={80} width={80} />
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

        <div className='ml-4 w-[70%] '>
          <h4 className=''>
            <Skeleton height={20}  width={"80%"} />
          </h4>
          <p className=''>
            <Skeleton height={20}   width={"80%"} />
          </p>
          <p className='mt-2'>
            <Skeleton height={16} count={2} />
          </p>

          {/* {links?.link.map((alllink, i) => {
            const icon = getSocialLogo(alllink);
            return (
              <div key={i} className='flex items-center space-x-2'>
                {icon ? (
                  <a href={alllink} target='_blank' rel='noopener noreferrer'>
                    {icon}
                  </a>
                ) : (
                  ''
                )}
              </div>
            );
          })} */}
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default DiscoverTeamSkeleton;
