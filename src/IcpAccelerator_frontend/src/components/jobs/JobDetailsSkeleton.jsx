import React, { useState } from 'react';
import SkeletonThemeMain from '../Common/SkeletonTheme';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { TfiEmail } from 'react-icons/tfi';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const JobDetailsSkeleton = () => {
  const [showDetails, setShowDetails] = useState(false);
  const handleToggle = () => {
    setShowDetails(!showDetails);
  };

  return (
    <SkeletonThemeMain>
      <div className='flex flex-col md:flex-row justify-evenly px-[1%]  overflow-y-auto'>
        <div className='border md:h-fit rounded-lg w-full md:w-[30%] '>
          <div className='py-6 px-5 border flex flex-col justify-center rounded-t-lg bg-[#EEF2F6]'>
            <div className='relative  mx-auto rounded-full '>
              <Skeleton circle={true} height={50} width={50} />
              <div className='absolute inset-0 flex items-center justify-center'>
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
            <p className='mb-2'>
              {' '}
              <Skeleton height={20} />
            </p>
            <div className='mb-3'>
              <Skeleton height={20} />
            </div>
            <div className=''>
              <a className='block border rounded-md bg-[#155EEF]  py-2 w-full text-white text-center'>
                Apply <span className=' text-white'></span>
                <ArrowOutwardIcon
                  sx={{ marginTop: '-2px', fontSize: 'medium' }}
                />
              </a>
            </div>
          </div>
          <div className=' bg-white md:hidden  rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full'>
            {!showDetails ? (
              <button
                onClick={handleToggle}
                className=' font-bold py-2 px-4 rounded w-full flex justify-center items-center '
              >
                Show details
                <FaChevronDown className='ml-2' />
              </button>
            ) : (
              <>
                <div className='p-3 '>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>DATE</h3>
                    <h4 className='text-sm font-medium'>
                      <Skeleton height={20} />
                    </h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>CATEGORY</h3>
                    <h4 className='text-sm font-medium'>
                      <Skeleton height={20} />
                    </h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>LOCATION</h3>
                    <h4 className='text-sm font-medium'>
                      <Skeleton height={20} />
                    </h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>OCCUPATION</h3>
                    <h4 className='text-sm font-medium'>
                      <Skeleton height={20} />
                    </h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>CONTACT</h3>
                    <h4 className='text-sm  font-medium flex items-center'>
                      <TfiEmail />
                      <span className='ml-2 w-[94%] truncate break-all'>
                        <Skeleton height={20} />
                      </span>
                    </h4>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  className='font-bold py-2 px-4 rounded w-full flex justify-center items-center mt-4 '
                >
                  Hide details <FaChevronUp className='ml-2' />
                </button>
              </>
            )}
          </div>
          <div className='p-3 hidden md:block'>
            <div className='p-2'>
              <h3 className='text-gray-400 mb-2 text-sm'>DATE</h3>
              <h4 className='text-sm font-medium'>
                <Skeleton height={20} />
              </h4>
            </div>
            <div className='p-2'>
              <h3 className='text-gray-400 mb-2 text-sm'>CATEGORY</h3>
              <h4 className='text-sm font-medium'>
                <Skeleton height={20} />
              </h4>
            </div>
            <div className='p-2'>
              <h3 className='text-gray-400 mb-2 text-sm'>LOCATION</h3>
              <h4 className='text-sm font-medium'>
                <Skeleton height={20} />
              </h4>
            </div>
            <div className='p-2'>
              <h3 className='text-gray-400 mb-2 text-sm'>OCCUPATION</h3>
              <h4 className='text-sm font-medium'>
                <Skeleton height={20} />
              </h4>
            </div>
            <div className='p-2'>
              <h3 className='text-gray-400 mb-2 text-sm'>CONTACT</h3>
              {/* <h4 className='text-sm  font-medium flex items-center'>
                <TfiEmail />
                <span className='ml-2 w-[94%] truncate break-all'>
                  <Skeleton height={20} />
                </span>
              </h4> */}
              <div className='truncate break-all'>
                <Skeleton height={20} />
              </div>
            </div>
          </div>
        </div>
        <div className='border rounded-lg p-3 w-full md:w-[65%] overflow-y-auto   h-full'>
          {/* <div className='break-words whitespace-normal overflow-y-auto'>
            <Skeleton height={15} count={5} />
            
          </div> */}
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

            <div className='flex items-center w-full'>
              <div className='h-2.5 bg-gray-200 rounded-full  w-32'></div>
              <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
              <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
            </div>

            <div className='flex items-center w-full'>
              <div className='h-2.5 bg-gray-200 rounded-full  w-32'></div>
              <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
              <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
            </div>

            <div className='flex items-center w-full '>
              <div className='h-2.5  bg-gray-300 rounded-full w-32'></div>
              <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
              <div className='h-2.5 ms-2 bg-gray-200 rounded-full  w-full'></div>
            </div>
            <div className='flex items-center w-full max-w-[480px]'>
              <div className='h-2.5 bg-gray-200 rounded-full  w-full'></div>
              <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
              <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default JobDetailsSkeleton;
