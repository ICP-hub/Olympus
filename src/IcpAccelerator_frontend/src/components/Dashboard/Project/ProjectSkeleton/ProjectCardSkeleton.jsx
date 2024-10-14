import React from 'react';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { FaChevronRight } from 'react-icons/fa';
import { MoreVert } from '@mui/icons-material';

const ProjectCardSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <>
        <div className='mb-3 hidden md:flex '>
         
          <div className='flex items-center flex-col sm2:flex-row w-full'>
            <div
              className='w-full sm2:w-[240px] bg-gray-100 h-[195px] flex justify-center items-center rounded-2xl relative overflow-hidden'
              style={{
                backgroundImage: ``,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div
                className='absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm'
                style={{
                  borderRadius: 'inherit',
                }}
              ></div>
              <div className='relative  mx-auto rounded-full '>
                <Skeleton height={110} width={160} style={{borderRadius:"14px"}} />
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
           
            <div className='ml-4 w-full pt-4 sm2:pt-0 sm2:w-2/3 relative'>
            <div className='absolute right-0 text-gray-400'>
              <MoreVert fontSize='small' />
            </div>
            <Skeleton width='50%' height={20} className='mb-2' />
            <Skeleton width='30%' height={15} className='mb-4' />
            <hr />
            <div class='space-y-2.5 animate-pulse w-full '>
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
            <div className='flex flex-wrap mt-4 space-x-2'>
              <Skeleton width={60} height={18} style={{borderRadius:"18px"}} className='rounded-full' />
              <Skeleton width={50} height={18} style={{borderRadius:"18px"}} className='rounded-full' />
            </div>
          </div>
          </div>
        </div>

        
        <div
          className='flex md:hidden flex-col items-center  space-y-4  mx-auto pb-12'
          
        >
          <div className='bg-[#F8FAFC] rounded-lg shadow-lg w-full p-4 flex items-center mb-6 justify-between  md:hidden'>
            <div className='flex flex-col w-full ss4:flex-row items-center'>
            <div className='relative rounded-full  '>
              <Skeleton height={60} width={60} />
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
                    className='w-6 h-6 text-gray-400'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                  </svg>
                </div>
              </div>
            </div>
              <div className='ss4:ml-4 ss4:w-[70%] w-full flex flex-col'>
                <div className="">
                <Skeleton  height={18}  />
                </div>
                <div className="">
                <Skeleton  height={18}  />
                </div>
              </div>
            </div>
            <div>
              <FaChevronRight
                className='text-blue-500'
                size={20}
               
              />
            </div>
          </div>

          <button
            className='bg-blue-500 text-white  px-4 py-2 w-full md:hidden '
            
          >
            + Add new project
          </button>
        </div>
      </>

      {/* <div className='mb-3 hidden md:block'>
        <div className='flex items-center flex-col sm2:flex-row'>
          <div className='w-full sm2:w-[240px] h-[195px] flex justify-center items-center rounded-2xl relative overflow-hidden'>
            <Skeleton className='w-full h-full rounded-2xl' />
          </div>
          <div className='ml-4 w-full pt-4 sm2:pt-0 sm2:w-2/3 relative'>
            <div className='absolute right-0 text-gray-400'>
              <MoreVert fontSize='small' />
            </div>
            <Skeleton width='50%' height={24} className='mb-2' />
            <Skeleton width='30%' height={20} className='mb-4' />
            <hr />
            <Skeleton width='80%' height={16} className='mt-4 mb-2' />
            <Skeleton width='90%' height={14} className='mb-2' />
            <Skeleton width='85%' height={14} className='mb-2' />
            <div className='flex flex-wrap mt-4 space-x-2'>
              <Skeleton width={60} height={20} className='rounded-full' />
              <Skeleton width={50} height={20} className='rounded-full' />
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center space-y-4 mx-auto pb-12 md:hidden'>
        <div className='bg-[#F8FAFC] rounded-lg shadow-lg w-full p-4 flex items-center mb-6 justify-between'>
          <div className='flex items-center'>
            <Skeleton circle={true} width={48} height={48} />
            <div className='ml-4'>
              <Skeleton width={100} height={20} className='mb-2' />
              <Skeleton width={70} height={16} />
            </div>
          </div>
          <div>
            <FaChevronRight className='text-blue-500' size={20} />
          </div>
        </div>

        <Skeleton width='100%' height={40} />
      </div> */}
    </SkeletonThemeMain>
  );
};

export default ProjectCardSkeleton;
