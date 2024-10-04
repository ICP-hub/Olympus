import React from 'react';

const RatingComponent = () => {
  return (
    <div className='max-w-lg md:max-w-xl lg:max-w-3xl mx-auto bg-white p-4 md:p-6 border rounded-lg shadow-lg mt-5'>
      {/* Overall Score */}
      <div className='flex justify-between items-center border-b pb-4 mb-4'>
        <div>
          <h2 className='text-base md:text-lg lg:text-xl font-semibold'>
            Overall score:
          </h2>
          <p className='text-gray-500 text-sm md:text-base lg:text-lg'>
            15 votes
          </p>
        </div>

        <div className='flex items-center'>
          <div className='text-yellow-400 mr-2 text-sm md:text-lg lg:text-xl'>
            {/* Stars */}
            <span>⭐⭐⭐⭐⭐</span>
          </div>
          <span className='text-lg md:text-xl lg:text-2xl font-bold'>4.9</span>
        </div>
      </div>

      {/* Category and Roles */}
      <div className='flex space-x-2 md:space-x-4 my-4'>
        <p className='text-gray-500 text-sm md:text-base '>Group scores by:</p>
        <p className='text-gray-500 text-sm md:text-base lg:text-lg'>
          Category
        </p>
        <p className='text-blue-500 text-sm md:text-base lg:text-lg'>Roles</p>
      </div>

      {/* Group Scores */}
      <div className='space-y-3 md:space-y-4'>
        <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
          <span className='font-medium text-sm md:text-base lg:text-lg'>
            Self-report:
          </span>
          <div className='flex items-center'>
            <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
              ⭐⭐⭐⭐⭐
            </span>
            <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
              5.0
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
          <span className='font-medium text-sm md:text-base lg:text-lg'>
            Peers:
          </span>
          <div className='flex items-center'>
            <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
              ⭐⭐⭐⭐⭐
            </span>
            <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
              4.9
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
          <span className='font-medium text-sm md:text-base lg:text-lg'>
            Mentors:
          </span>
          <div className='flex items-center'>
            <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
              ⭐⭐⭐⭐
            </span>
            <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
              4.5
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
          <span className='font-medium text-sm md:text-base lg:text-lg'>
            Investors:
          </span>
          <div className='flex items-center'>
            <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
              ⭐⭐⭐⭐
            </span>
            <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
              4.0
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
          <span className='font-medium text-sm md:text-base lg:text-lg'>
            Users:
          </span>
          <div className='flex items-center'>
            <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
              ⭐⭐⭐⭐⭐
            </span>
            <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
              5.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingComponent;
