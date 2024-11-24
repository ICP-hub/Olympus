import React from 'react';

const Error404 = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#FFF4ED] p-2.5'>
      <img
        src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg'
        alt='404 Not Found'
        className='w-96 h-auto'
      />
      <h1 className='text-blue-600 text-xl md:text-2xl font-semibold mt-4'>
        404 Not Found
      </h1>
      <p className='text-gray-600 text-lg md:text-2xl mt-2'>
        Whoops! That page doesn’t exist.
      </p>
    </div>
  );
};

export default Error404;
