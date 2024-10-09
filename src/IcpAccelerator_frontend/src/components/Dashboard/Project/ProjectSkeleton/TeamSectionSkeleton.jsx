import React from 'react';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Delete } from '@mui/icons-material';


const TeamSectionSkeleton = () => {
  return (
    <SkeletonThemeMain>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-full'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs flex justify-around w-full text-gray-700 uppercase bg-gray-50 dark:text-gray-400'>
            <tr className='flex justify-between w-full'>
              <th
                scope='col'
                className='text:sm sm3:text-base sm3:px-4 py-2 sm:px-6 sm:py-3'
              >
                Name
              </th>
              <th
                scope='col'
                className='text:sm sm3:text-base sm3:px-4 py-2 sm:px-6 sm:py-3'
              >
                Status
              </th>
              <th
                scope='col'
                className='text:sm sm3:text-base sm3:px-4 py-2 sm:px-6 sm:py-3'
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white w-full justify-between flex border-b hover:bg-gray-50'>
              <th
                scope='row'
                className='flex flex-col sm1:flex-row w-1/3 items-center sm1:px-4 py-2 sm:px-6 sm:py-4 text-gray-900  dark:text-white'
              >
                <div className='relative  rounded-full '>
                  <Skeleton circle={true} height={50} width={50} />
                  <div className='absolute inset-0 flex items-center '>
                    <div
                      className='flex items-center justify-center border-2 rounded-full border-gray-300 w-6 h-6 absolute mt-0.5'
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#e3e3e3',
                      }}
                    >
                      <svg
                        className='w-4 h-4 text-gray-400'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='ps-2 sm:ps-3 '>
                  <p className='line-clamp-1 break-all font-medium text-[#121926] text-xs sm3:text-sm'>
                    <Skeleton  width={80} height={20} />
                  </p>
                  <p className='line-clamp-1 break-all text-xs sm:text-sm text-gray-500'>
                    <Skeleton   width={80} height={15} />
                  </p>
                </div>
              </th>
              <td className='flex items-center justify-around w-1/3 sm3:px-4 py-2 sm:px-6 sm:py-4'>
                <div className='flex items-center'>
                  <div className='h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500 mr-1 sm:mr-2'></div>
                  <span className='hidden sm3:block px-1.5 sm:px-2 py-1 rounded text-xs sm:text-sm font-medium bg-[#ecfdf3da] border-2 border-[#6ceda0] text-green-800'>
                    Active
                  </span>
                </div>
              </td>
              <td className='px-4 w-1/3 flex items-center justify-end flex-grow-0 py-2 sm:px-6 sm:py-4'>
                <button
                  className='text-gray-400 text-center hover:text-gray-600'
                  onClick={() => onDelete(principle)}
                >
                  <Delete fontSize='small' />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SkeletonThemeMain>
  );
};

export default TeamSectionSkeleton;
