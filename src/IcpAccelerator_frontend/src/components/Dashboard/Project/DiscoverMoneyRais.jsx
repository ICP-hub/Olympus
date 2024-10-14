import React, { useState } from 'react';
import DiscoverFundingCard from './DiscoverFundingCard';
import useTimeout from '../../hooks/TimeOutHook';
import DiscoverFundingCardSkeleton from './DiscoverFundingCardSkeleton';

const DiscoverMoneyRaising = ({ cardData, projectId }) => {
  // Ensure that cardData is an array
  const moneyRaisedData = Array.isArray(cardData?.money_raised)
    ? cardData.money_raised
    : [];

    const [isLoading,setIsLoading]=useState(true)

    useTimeout(()=>setIsLoading(false))

  console.log('Money Raised Data:', moneyRaisedData);
  console.log('Store money-raising data', cardData);

  return (
    <div>
      <div className='flex flex-col items-end mb-4 max-w-7xl pt-4'></div>
      <div className='max-w-7xl mx-auto bg-white'>
        {moneyRaisedData.length > 0 ? isLoading ? <>
        <div className="flex justify-end">
        <button
              className='bg-blue-600 text-white px-4 py-2 rounded-lg mb-4  '
              
            >
              Request Access
            </button>
        </div>
          
        {[...Array(5)].map((_,index)=><DiscoverFundingCardSkeleton/>)}</>: (
          moneyRaisedData.map((data, index) => (
            <DiscoverFundingCard
              key={index}
              data={data}
              projectId={projectId}
            />
          ))
        ) : (
          // <p>No funding data available.</p>
          <>
            <div className='text-center py-12'>
              <div className='flex justify-center items-center'>
                <svg
                  width='154'
                  height='64'
                  viewBox='0 0 154 64'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                ></svg>
              </div>
              <h2 className='text-xl font-semibold mb-2'>
                You haven't Raised any Money yet
              </h2>
              <p className='text-gray-600 mb-2'>
                Any amount of Money Raised will live here.
              </p>
              <p className='text-gray-600 mb-6'>
                Start raising by demanding your Requirement
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverMoneyRaising;
