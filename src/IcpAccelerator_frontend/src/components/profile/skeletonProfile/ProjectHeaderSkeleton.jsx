import React from 'react';
import { FaPlus } from 'react-icons/fa';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';

const ProjectHeaderSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='p-6 bg-gray-50'>
        <div className='relative w-24 h-24 mx-auto rounded-full mb-4 group'>
          <div className='relative w-24 h-24 mx-auto rounded-full mb-4'>
            <Skeleton circle={true} height={96} width={96} />
            <div className='absolute inset-0 flex items-center justify-center'>
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
          <div className='absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <FaPlus className='text-white text-xl' />
            <input
              id='file-upload'
              type='file'
              className='absolute inset-0 opacity-0 cursor-pointer'
              accept='image/*'
            />
          </div>
        </div>
        <div className='flex items-center justify-center mb-1'>
          <VerifiedIcon className='text-blue-500 mr-1' fontSize='small' />
          <h2 className='text-xl font-semibold'>
            <Skeleton height={25} />
          </h2>
        </div>
        <p className='text-gray-600 text-center mb-4'>
          <Skeleton height={25} />
        </p>
        <button className='w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'>
          Get in touch
          <ArrowOutwardOutlinedIcon className='ml-1' fontSize='small' />
        </button>
      </div>
    </SkeletonThemeMain>
  );
};

export default ProjectHeaderSkeleton;
