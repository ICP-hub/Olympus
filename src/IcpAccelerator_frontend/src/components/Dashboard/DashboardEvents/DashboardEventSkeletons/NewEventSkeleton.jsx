import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';

const NewEventSkeleton = ({ eventsCount }) => {
  return (
    <SkeletonThemeMain>
      <div className="max-w-7xl mx-auto bg-white">
        <div className="hidden md:flex flex-col md:items-end mb-8 pt-4">
      
            <button
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
            
            >
              + Add new Cohort
            </button>
          
        </div>

        {Array.from({ length: eventsCount }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center gap-4 w-full relative">
               
                <SkeletonTheme color='#e3e3e3'>
              <div className='relative flex flex-col items-center w-full md:w-[240px] bg-[#e3e3e3] rounded-md'>
                {/* Skeleton for the banner */}
                <Skeleton
                 height={172} width="full" className="mb-2"
                />

                {/* Centered text */}
                <div className='flex items-center justify-center absolute inset-0 rounded-md'>
                  <h2 className='text-4xl font-bold text-gray-500'>
                    Banner
                  </h2>
                </div>
              </div>
            </SkeletonTheme>

                <div className="w-full md:w-2/3 mt-3 md:-mt-2">
                  <Skeleton height={24} width="30%" className="rounded-md mb-2" />
                  <Skeleton height={20} width="100%" className="rounded-md mb-2" />
                  <Skeleton height={15} count={3} width="100%" className="rounded-md mb-1" />
                  <div className="flex gap-3 items-center mt-2">
                    <Skeleton height={20} width={60} className="rounded-md" />
                    <Skeleton height={20} width={60} className="rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonThemeMain>
  );
};

export default NewEventSkeleton;
