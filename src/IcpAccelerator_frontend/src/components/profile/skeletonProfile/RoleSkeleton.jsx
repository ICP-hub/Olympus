import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../Common/SkeletonTheme'
import VerifiedIcon from '@mui/icons-material/Verified';


const RoleSkeleton = () => {
  return (
    <SkeletonThemeMain>
        
        <div className='flex justify-center items-center w-full mt-[2%]'>
          <div className='border-2 rounded-lg shadow-md md:shadow-none pb-5 text-center   md:min-w-[280px] w-full md:max-w-[350px] mb-6 md:mb-0 md:mt-6'>
            <div className='w-full bg-[#EEF2F6] rounded-l-xl rounded-r-full h-1.5 mb- dark:bg-[#EEF2F6]'>
              <div className='relative h-1 bg-gray-200'>
                <div className='absolute left-0 top-0 h-full bg-green-500 w-1/3'></div>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='bg-gray-200 rounded-full mb-4 mt-2'>
                <Skeleton  circle={true} width={60} height={60} />
              </div>
            </div>
            <div className='mb-1 text-center'>
              <button className='text-[#026AA2] border rounded-md text-xs p-1 font-semibold bg-[#F0F9FF]'>
                OLYMPIAN
                {/* <Skeleton width={100} height={20} /> */}
              </button>
            </div>
            <div className='flex flex-col justify-center items-center mb-3'>
              <h2 className='flex  font-bold text-lg line-clamp-1 break-all'>
              <Skeleton circle={true} width={20} height={20} className='mr-1' />
                <Skeleton width={100} height={20} />
              </h2>
              <p className='line-clamp-1 break-all'>
                {/* {userFullData?.openchat_username[0]} */}
                <Skeleton width={120} height={20} />
              </p>
            </div>
            <div className='flex flex-wrap justify-center items-center'>
              <p className='font-normal'>
                Role :
              </p>
              <span className='flex flex-wrap justify-center gap-3'>
                    <Skeleton  width={50} height={20} />
                    <Skeleton  width={50} height={20} />
                    <Skeleton  width={50} height={20} />
                </span>
            </div>
          </div>
        </div>
        
     
    </SkeletonThemeMain>
  )
}

export default RoleSkeleton

const ProfileAddRoleSkeleton=()=>{
  return (
    <div className='border-2 rounded-lg text-center mb-6 md:mb-0 shadow-md w-full'>
    
    <div className='p-3 flex justify-center mt-5'>
      <div className='flex '>
        <Skeleton circle={true} height={40} width={40} />
        <Skeleton style={{marginLeft:"-10px"}} circle={true} height={40} width={40} />
        <Skeleton style={{marginLeft:"-10px"}} circle={true} height={40} width={40} />
        <Skeleton style={{marginLeft:"-10px"}} circle={true} height={40} width={40} />
      </div>
    </div>
    
    
    <div className='dxs:mt-5 px-5 text-sm dxs:text-[18px]'>
      <Skeleton count={2} />
    </div>

    <div className='my-3 dxs:my-5 mx-5 '>
      <Skeleton height={30} width={'100%'} />
    </div>
  </div>
  )
}
export {ProfileAddRoleSkeleton}

const ProfileRoleSkeleton=()=>{
  return (
    <div className='border-2 rounded-lg text-center mb-6 md:mb-0 shadow-md w-full'>
    
    <div className='p-3 flex justify-center mt-5'>
      <div className='flex '>
        <Skeleton circle={true} height={70} width={70} />
      </div>
    </div>
    <div className=' flex items-center justify-center  mx-5 '>
      <Skeleton height={25} width={100} />
    </div>
    
    <div className='dxs:mt-5 mb-3 px-5 text-sm dxs:text-[18px]'>
      <Skeleton count={2} />
    </div>

    
  </div>
  )
}
export {ProfileRoleSkeleton}