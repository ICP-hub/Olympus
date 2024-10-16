import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import LinkIcon from '@mui/icons-material/Link';
import {
  clockSvgIcon,
  coinStackedSvgIcon,
  lenseSvgIcon,
  locationSvgIcon,
} from '../../Utils/Data/SvgData';

const JobsSkeleton = () => {
  return (
    <SkeletonThemeMain color='#e3e3e3' highlightColor='#f0f0f0'>
      <div className='flex flex-col my-8 shadow-md  rounded-md p-4'>
        <div className='flex justify-between'>
          <div className='flex flex-col  sm5:w-[70%] w-full '>
            <p className='text-sm xxs:text-base text-gray-400'>
              <Skeleton width='30%' height={18} />
            </p>
            <h3 className='text-xl line-clamp-1 break-all font-bold'>
              <Skeleton width='50%' height={22} className='mt-2' />
            </h3>
            <p className='flex items-center'>
              <span>
                <SkeletonTheme color='#e3e3e3'>
                  <div className='relative flex flex-col items-center'>
                    <div className='rounded-lg  '>
                      <Skeleton
                        height={48}
                        width={48}
                        style={{ borderRadius: '18px' }}
                      />
                    </div>

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
              </span>
              <span className='line-clamp-2 break-all'>
                <Skeleton width={100} height={18} className='mt-2 ml-4' />
              </span>
            </p>
          </div>
          <div className='hidden sm5:block'>
            <div className='flex flex-col gap-4 items-center'>
              <a
                target='_blank'
                className='border rounded-md bg-[#155EEF] py-2 px-1 dxs:px-4 text-white text-center text-xs dxs:text-sm xxs:text-base'
              >
                Apply <span className='pl-1 text-white'></span>
                <ArrowOutwardIcon
                  sx={{
                    marginTop: '-2px',
                    fontSize: 'medium',
                  }}
                />
              </a>
              <button className='hover:bg-slate-300 py-2 px-3 text-[#155EEF] font-medium flex'>
                view details
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <p className='text-gray-600  overflow-hidden text-ellipsis max-h-12 line-clamp-2 break-all'>
            <Skeleton width='100%' height={15} count={2} />
          </p>
          <div className='flex gap-5 items-center flex-wrap'>
            <div className='flex items-center gap-2'>
              {' '}
              {/* {lenseSvgIcon}{' '} */}
              <Skeleton width={20} height={20} />{' '}
              <span className=''>
                <Skeleton width={65} height={20} />
              </span>{' '}
            </div>
            <div className='flex items-center gap-2'>
              {/* {locationSvgIcon} */}
              <Skeleton width={20} height={20} />{' '}
              <span className=''>
                <Skeleton width={65} height={20} />
              </span>{' '}
            </div>
            <div className='flex items-center gap-2'>
              {/* {clockSvgIcon} */}
              <Skeleton width={20} height={20} />{' '}
              <span>
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
          {/* Action Buttons */}
          <div className='sm5:hidden'>
            {' '}
            <div className='flex justify-between flex-col sm1:flex-row w-full'>
              <button className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full'>
                Apply{' '}
                <span className='ml-2 material-icons'>
                  <ArrowOutwardIcon
                    sx={{
                      marginTop: '-2px',
                      fontSize: 'medium',
                    }}
                  />
                </span>
              </button>
              <button className='hover:bg-slate-300 py-2 px-3 text-[#155EEF] shadow-lg my-1 sm1:my-0 font-medium w-full'>
                view details
              </button>
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
};

export default JobsSkeleton;
