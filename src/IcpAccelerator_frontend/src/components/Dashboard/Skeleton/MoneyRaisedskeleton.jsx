import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const MoneyRaisedSkeleton = () => {
  return (
    <>
      <div className='bg-[#D9DBF3] border my-4 mr-[4%] pt-4 px-10 rounded-3xl w-[80%] mb-12'>
        <div className='flex justify-between'>
          <Skeleton width={150} height={30} />
          <Skeleton width={20} height={20} />
        </div>
        <div className='flex items-center mb-4 mt-2'>
          <div className='flex-1  rounded-full h-2 relative'>
            <Skeleton width='100%' height={10} />
            {/* <Skeleton circle={true} width={20} height={20} className="absolute -top-[6px]" /> */}
          </div>
          <Skeleton width={50} height={20} className='ml-2 mt-[13px]' />
        </div>
      </div>
      <div className='flex flex-wrap justify-between mr-[4%] gap-5'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='bg-white rounded-3xl p-6 mb-4 flex gap-5'>
            <Skeleton width={100} height={20} className='mt-2' />
            <Skeleton width={40} height={30} />
          </div>
        ))}
      </div>
    </>
  );
};
