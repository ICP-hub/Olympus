import React, { useState } from 'react';

export default function RequestStatus({ close }) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectionChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleApply = () => {
    console.log('Selected Value:', selectedValue);
    close(); // Call the close function to trigger any external closing actions
  };

  return (
    <div
      className={`fixed top-0 right-0 inset-0 z-50 transition-opacity duration-700 ease-in-out opacity-100 bg-opacity-30 bg-black backdrop-blur-xs`}
    >
      <div
        className={`transition-transform duration-300 ease-in-out transform translate-x-0 mx-auto w-[25%] absolute right-0 top-0 z-10 bg-white h-screen flex flex-col`}
      >
        <div className='p-5 mb-5 flex justify-start'>
          <button className='text-gray-500' onClick={close}>
            Close
          </button>
        </div>
        <div className='container p-5 flex-grow'>
          <h2 className='text-lg font-semibold text-gray-800'>
            {' '}
            Request Status
          </h2>
          <div className='mb-4'>
            <label className='flex items-center text-sm text-gray-700 font-medium mb-2'>
              <input
                type='radio'
                name='category'
                value='accepted'
                onChange={handleSelectionChange}
                className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
              />
              Accepted
            </label>
            <label className='flex items-center text-sm text-gray-700 font-medium mb-2'>
              <input
                type='radio'
                name='category'
                value='rejected'
                onChange={handleSelectionChange}
                className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
              />
              Rejected
            </label>
            <label className='flex items-center text-sm text-gray-700 font-medium'>
              <input
                type='radio'
                name='category'
                value='pending'
                onChange={handleSelectionChange}
                className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
              />
              Pending
            </label>
          </div>
        </div>
        <div className='p-5'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
