import React from 'react';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import {
  ArrowOutwardOutlined as ArrowOutwardOutlinedIcon,
  MoreVert,
} from '@mui/icons-material';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const ProfileCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full dlg:max-w-[440px]'>
        <div className='relative h-1 bg-gray-200'>
          <div className='absolute left-0 top-0 h-full bg-green-500 w-1/3'></div>
        </div>
        <div className='p-6 bg-gray-50 relative'>
          {/* Three-dot menu button */}
          <button className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>
            <MoreVert fontSize='small' />
          </button>
          <div className='relative w-[6rem] mx-auto mb-6'>
            <div className='relative  mx-auto rounded-full '>
              <Skeleton height={96} width={96} />
              <div className='absolute inset-0 flex items-center justify-center'>
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
            </div>
          </div>

          <h2 className='text-2xl font-semibold text-center mb-1'>
            <Skeleton height={25} />
          </h2>
          <p className='text-gray-600 text-center mb-4'>
            {' '}
            <Skeleton height={20} />
          </p>
          <button className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-6 flex items-center justify-center'>
            Get in touch
            <ArrowOutwardOutlinedIcon className='ml-1' fontSize='small' />
          </button>
        </div>

        <div className='p-6 bg-white'>
          <div className='mb-4'>
            <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
              Status
            </h3>
            <div className=''>
              <Skeleton height={20} />
            </div>
          </div>

          <div className='mb-4'>
            <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
              ASSOCIATIONS
            </h3>
            <p>
              <Skeleton height={20} />
            </p>
          </div>

          <div className='mb-4'>
            <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
              About
            </h3>
            <p className='text-sm'>
              <Skeleton height={15} count={2} />
            </p>
          </div>

          <div className='mb-4'>
            <h3 className='font-normal mb-2 text-sm text-gray-500'>
              Area Of Focus
            </h3>
            <div className='flex gap-2'>
              <div className=''>
                <Skeleton
                  height={20}
                  width={90}
                  style={{ borderRadius: '18px' }}
                />
              </div>
              <div className=''>
                <Skeleton
                  height={20}
                  width={90}
                  style={{ borderRadius: '18px' }}
                />
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <h3 className='font-normal mb-2 text-sm text-gray-500'>
              Preferred ICP Hub
            </h3>
            <div className='flex gap-2'>
              <div className=''>
                <Skeleton
                  height={20}
                  width={100}
                  style={{ borderRadius: '18px' }}
                />
              </div>
            </div>
          </div>

          <div className='mb-4 max-w-sm'>
            <h3 className='font-normal mb-2 text-sm text-gray-500'>
              Country Of Registration
            </h3>

            <div className=''>
              <Skeleton
                height={20}
                width={100}
                style={{ borderRadius: '18px' }}
              />
            </div>
          </div>
          <div>
            <h3 className='font-normal mb-2 text-sm text-gray-500'>LINKS</h3>

            <div className='flex gap-2'>
              <div className=''>
                <Skeleton circle={true} height={30} width={30} />
              </div>
              <div className=''>
                <Skeleton circle={true} height={30} width={30} />
              </div>
              <div className=''>
                <Skeleton circle={true} height={30} width={30} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default ProfileCardSkeleton;
