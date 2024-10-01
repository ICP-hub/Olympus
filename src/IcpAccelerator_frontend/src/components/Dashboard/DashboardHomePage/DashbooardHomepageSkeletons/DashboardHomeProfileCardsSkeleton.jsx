import React from 'react';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import DashboardProfileView from '../DashboardProfileView';
import DashboardProjectCard from '../DashboardProjectCard';
import RatingReview from '../../../Common/RatingReview';
import RatingCard from '../../../Common/RatingCard';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import RatingCardSkeleton from '../../../Common/RatingCardSkeleton';
export default function DashboardHomeProfileCardsSkeleton() {
  return (
    <SkeletonThemeMain>
      <div className='grid grid-cols-1 dlg:grid-cols-2 lgx:grid-cols-3 gap-6 mt-6 lg:p-6'>
        {/* Main profile card */}
        <div className='bg-white rounded-lg shadow-sm p-6 border'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='ss2:text-xl font-bold'>Main profile</h2>
            <a className='text-blue-500 text-xs ss:font-normal '>Manage &gt;</a>
          </div>
          <div className='bg-gray-50 rounded-lg p-4 relative overflow-hidden'>
            <div className='absolute top-0 left-0 right-0 h-[5px] bg-green-500'></div>
            <div className='flex flex-col items-center pt-2'>
              <div className='w-20 h-20 bg-gray-300 rounded-full mb-3 overflow-hidden'>
                {/* <AccountCircle className="w-full h-full text-gray-400" /> */}
                <Skeleton circle={true} height={80} width={80} />
              </div>
              <span className='inline-block bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] text-xs font-semibold px-2 py-1 rounded-md mb-2'>
                <Skeleton width={50} />
              </span>
              <h3 className='sm1:text-lg font-semibold flex items-center mb-1'>
                <span className='text-blue-500 ml-1'>
                  {/* <Skeleton circle={true} height={20} width={20} /> */}
                </span>
                <Skeleton width={100} />
              </h3>
              <p className='text-gray-500'>
                <Skeleton width={80} />
              </p>
            </div>
          </div>
        </div>

        {/* Rating card */}
        <div className='bg-white rounded-lg shadow-sm p-6 border'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center'>
              <h2 className='ss2:text-xl font-bold mr-2'>Rating</h2>
              <HelpOutlineOutlinedIcon
                className='text-gray-400'
                fontSize='small'
              />
            </div>
            <a className='text-blue-500 text-xs ss:font-normal flex '>
              <span className='sxxs:hidden dxs:block lgx:hidden dxl0:block block pr-1'>
                View
              </span>{' '}
              Details &gt;
            </a>
          </div>

          <RatingCardSkeleton />
        </div>

        {/* Roles card */}
        <div className='bg-white rounded-lg shadow-sm p-6 border'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center'>
              <h2 className='ss2:text-xl font-bold mr-2'>Roles</h2>
              <HelpOutlineOutlinedIcon
                className='text-gray-400'
                fontSize='small'
              />
            </div>
            <a className='text-blue-500 text-xs ss:font-normal'>Manage &gt;</a>
          </div>
          <div className='mt-2 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
              <Skeleton circle={true} height={48} width={48} />
            </div>
          </div>
          <div className='mt-8 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
              <Skeleton circle={true} height={48} width={48} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonThemeMain>
  );
}
