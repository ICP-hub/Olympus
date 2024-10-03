import React from 'react';
import Skeleton from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import { userCircleSvgIcon } from '../../Utils/Data/SvgData';
import VerifiedIcon from '@mui/icons-material/Verified';


const ProfilePageSkeleton = () => {
  return <div>ProfilePageSkeleton</div>;
};

export default ProfilePageSkeleton;

// Skeleton for the Header
export const HeaderSkeleton = () => (
  <SkeletonThemeMain>
    <div className='my-4 w-full'>
      <Skeleton width='90%' height={30} />
    </div>
  </SkeletonThemeMain>
);

// Skeleton for the Profile Details
export const ProfileSkeleton = () => (
  <SkeletonThemeMain>
    <div className='container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full '>
      <div className='px-6 py-2 md:p-6 bg-gray-50'>
        {/* Skeleton for Profile Image */}
        <div className='relative w-24 h-24 mx-auto rounded-full mb-4'>
          <Skeleton circle={true} height={96} width={96} />
          <div className='absolute inset-0 flex items-center justify-center'>
          {userCircleSvgIcon}
          </div>
        </div>

        {/* Skeleton for Verified Icon and Name */}
        <div className='flex items-center justify-center mb-1'>
          <Skeleton circle={true} width={20} height={20} className='mr-1' />
          <Skeleton width={120} height={25} />
        </div>

        {/* Skeleton for Username */}
        <p className='text-center mb-4'>
          <Skeleton width={140} height={20} />
        </p>

        {/* Skeleton for Button */}
        <div className='flex items-center justify-center mb-6'>
          <button
            type='button'
            // onClick={handleGetInTouchClick}
            className='w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className='ml-1' fontSize='small' />
          </button>
        </div>
      </div>
      <div className='mb-4 px-4 py-2 '>
        <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
          Roles
        </h3>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='bg-[#F0F9FF] text-[#026AA2] rounded-md text-xs font-medium'>
          <Skeleton width={100} height={25} />
          </span>
          <span className='bg-[#F0F9FF]  text-[#026AA2]  rounded-md text-xs font-medium uppercase'>
            <Skeleton width={100} height={25} />
          </span>
        </div>
      </div>
      <div className='px-1 py-4'>
        {/* Skeleton for full name */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              full name
            </h3>
          </div>
          <Skeleton height={30} />
        </div>

        {/* Skeleton for openchat_username */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              openchat_username
            </h3>
          </div>
          <Skeleton height={30} />
        </div>

        {/* Skeleton for Email */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Email
            </h3>
          </div>
          <Skeleton height={30} />
        </div>

        {/* Skeleton for About */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              About
            </h3>
          </div>
          <Skeleton height={20} count={2} />
        </div>

        {/* Skeleton for Location */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Location
            </h3>
          </div>
          <Skeleton height={30} />
        </div>

        {/* Skeleton for Type of Profile */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Type of Profile
            </h3>
          </div>
          <div className='flex  gap-2'>
            <Skeleton style={{borderRadius:"18px"}} height={30} width={90}  />
            <Skeleton style={{borderRadius:"18px"}} height={30} width={90}  />
          </div>
        </div>

        {/* Skeleton for Interests */}
        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Interests
            </h3>
          </div>
          <div className='flex gap-2'>
          <Skeleton style={{borderRadius:"18px"}} height={30} width={90}  />
          <Skeleton style={{borderRadius:"18px"}} height={30} width={90}  />
          </div>
        </div>

        <div className='mb-4 group  rounded-lg p-2 px-3'>
          <div className='flex justify-between'>
            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
              Links
            </h3>
          </div>
          <div className='flex gap-3 rounded-full'>
            <Skeleton circle={true} height={30} width={30} />
            <Skeleton circle={true} height={30} width={30} />
            <Skeleton circle={true} height={30} width={30} />
          </div>
        </div>
      </div>
    </div>
  </SkeletonThemeMain>
);

// Skeleton for Tabs
export const TabSkeleton = () => (
  <div className='flex space-x-4 mb-4'>
    <Skeleton width={80} height={30} />
    <Skeleton width={80} height={30} />
    <Skeleton width={80} height={30} />
  </div>
);

// Skeleton for Content
export const ContentSkeleton = () => (
  <div className='mt-4'>
    <Skeleton width='100%' height={200} />
    <Skeleton width='80%' height={20} className='mt-4' />
    <Skeleton width='90%' height={20} />
    <Skeleton width='85%' height={20} />
  </div>
);
