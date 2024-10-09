import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
const AttendeeCardSkeleton = () => {
    return (
        <>
        <SkeletonThemeMain>
      <div className='flex flex-col sm:flex-row  p-4 bg-white shadow-md rounded-lg mb-6 transition-all items-center hover:shadow-lg'>
        <div className='flex-shrink-0 w-[70px] h-[70px]'>
          {/* <Skeleton circle={true} height={70} width={70}  className="w-full h-full rounded-full object-cover"/> */}
          <SkeletonTheme color='#e3e3e3'>
                  <div className='relative flex flex-col items-center'>
                    {/* Profile circle skeleton */}
                    <div className='rounded-full  '>
                      <Skeleton circle={true} height={70} width={70} />
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
           {/* Circular Skeleton for profile picture */}
        </div>
        <div className='sm:ml-6 flex-1 w-full'>
        <Skeleton 
  height={20} 
  width="75%"
  className="rounded-md mb-1 mt-2 sm:mt-0 " 
/>
<Skeleton 
  height={20} 
  width="60%" 
  className="rounded-md mb-1 "
/>          <div className='border-t border-gray-200 my-1'></div>
  
          <Skeleton height={10} count={2} width='100%' className='rounded- my-0.5' />
          
 


  
  
  <div class="flex flex-wrap gap-2 items-center mt-1">
 
  <div class="h-5 w-14 sm:w-16 md:w-20 lg:w-24 bg-gray-300 rounded-full"></div>
  <div class="h-5 w-14 sm:w-16 md:w-20 lg:w-24 bg-gray-300 rounded-full"></div>
  
 
  <div class="h-5 w-14 sm:w-16 md:w-20 lg:w-24 bg-gray-300 rounded-full hidden sm:block"></div>
</div>


  
          <div className='flex items-center mt-1'>
            <Skeleton height={18} width={20} className='mr-2 rounded-full' /> 
            <Skeleton height={18} width={100} className='rounded-md' /> 
          </div>
        </div>
      </div></SkeletonThemeMain>
      </>
    );
  };
  export default AttendeeCardSkeleton;