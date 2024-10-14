import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ProjectAssociationSkeleton = () => {
  return (
    <div className='p-4 border-2 bg-white rounded-lg mb-4'>
      <div className='flex'>
        <div className='flex flex-col'>
          <div className='w-12 h-12'>
            <Skeleton height={55} width={55} circle={true}></Skeleton>
          </div>
        </div>
        <div className='w-full'>
          <div className='flex flex-col w-full pl-4 '>
            <div className='flex justify-between'>
              <p className='text-gray-500 font-bold'>
                <Skeleton height={30} width={150}></Skeleton>
              </p>
              <p className='text-gray-400 font-thin'>
                <Skeleton height={25} width={150}></Skeleton>
              </p>
            </div>
            <div className='min-h-4 line-clamp-3 text-gray-400'>
              <p>
                <Skeleton height={25} width='20%'></Skeleton>
              </p>
            </div>

            <div className='flex justify-end pt-4'>
              <div className='flex gap-4'>
                <div className=' px-2 py-1 rounded-md  '>
                  <Skeleton height={30} width={100}></Skeleton>
                </div>

                <div className=' px-2 py-1 rounded-md  '>
                  <Skeleton height={30} width={100}></Skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
