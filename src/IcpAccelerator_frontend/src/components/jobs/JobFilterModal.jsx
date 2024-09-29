import React, { useState } from 'react';
import { motion } from 'framer-motion';

const JobFilterModal = ({ openDetail, setOpenDetail }) => {
  const [occupation, setOccupation] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    internship: false,
  });

  const handleOccupationChange = (event) => {
    const { name, checked } = event.target;
    setOccupation((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const [isRemote, setIsRemote] = useState(false);

  const handleRemoteChange = (e) => {
    setIsRemote(e.target.checked);
  };

  return (
    // <div className="md1:hidden lg:flex lgx:hidden lg:pr-[1%] transition-transform duration-300 ease-in-out transform translate-y-0 fixed inset-0 flex items-end justify-end bg-black bg-opacity-50">
    //   <div className="bg-white rounded-t-3xl w-full lg:max-w-[75%] p-6 space-y-6 shadow-lg">
    //     <div className="flex justify-between items-center">
    //       <h2 className="text-xl font-semibold">Filters</h2>
    //       <button
    //         onClick={() => setOpenDetail(false)}
    //         className="text-gray-600 text-4xl "
    //       >
    //         &times;
    //       </button>
    //     </div>

    //     <div className="space-y-2">
    //       <label className="block text-sm font-medium text-gray-700">
    //         Department
    //       </label>
    //       <select className="w-full border rounded p-2 text-gray-700">
    //         <option>Select role</option>
    //       </select>
    //     </div>

    //     <div className="space-y-2">
    //       <label className="block text-sm font-medium text-gray-700">
    //         Occupation
    //       </label>
    //       <div className="flex flex-col space-y-1">
    //         <label className="inline-flex items-center">
    //           <input
    //             type="checkbox"
    //             className="form-checkbox h-5 w-5 border text-indigo-600 border-gray-300 rounded"
    //             name="fullTime"
    //             checked={occupation.fullTime}
    //             onChange={handleOccupationChange}
    //           />
    //           <span className="ml-2">Full-time</span>
    //         </label>
    //         <label className="inline-flex items-center">
    //           <input
    //             type="checkbox"
    //             className="form-checkbox h-5 w-5 border text-indigo-600 border-gray-300 rounded"
    //             name="partTime"
    //             checked={occupation.partTime}
    //             onChange={handleOccupationChange}
    //           />
    //           <span className="ml-2">Part-time</span>
    //         </label>
    //         <label className="inline-flex items-center">
    //           <input
    //             type="checkbox"
    //             className="form-checkbox h-5 w-5 border text-indigo-600 border-gray-300 rounded"
    //             name="contract"
    //             checked={occupation.contract}
    //             onChange={handleOccupationChange}
    //           />
    //           <span className="ml-2">Contract</span>
    //         </label>
    //         <label className="inline-flex items-center">
    //           <input
    //             type="checkbox"
    //             className="form-checkbox h-5 w-5 text-indigo-600 border border-gray-300 rounded"
    //             name="internship"
    //             checked={occupation.internship}
    //             onChange={handleOccupationChange}
    //           />
    //           <span className="ml-2">Internship</span>
    //         </label>
    //       </div>
    //     </div>

    //     <div className="space-y-2">
    //       <label className="block text-sm font-medium text-gray-700">
    //         Location
    //       </label>
    //       <input
    //         type="text"
    //         placeholder="Start typing"
    //         className="w-full border rounded p-2"
    //       />
    //       <label className="inline-flex items-center">
    //         <input
    //           type="checkbox"
    //           className="h-5 w-5 text-indigo-600 border-2 border-gray-300 rounded"
    //           checked={isRemote}
    //           onChange={handleRemoteChange}
    //         />
    //         <span className="ml-2">Remote</span>
    //       </label>
    //     </div>

    //     <div className="space-y-2">
    //       <label className="block text-sm font-medium text-gray-700">
    //         Salary
    //       </label>
    //       <div className="flex items-center space-x-2">
    //         <div className="flex items-center border rounded pl-1 focus-within:border-2 focus-within:border-gray-800">
    //           $
    //           <input
    //             type="text"
    //             placeholder="From"
    //             className="w-full ml-3 p-2 border-none focus:outline-none "
    //           />
    //         </div>
    //         <span className="px-4">-</span>
    //         <div className="flex items-center border rounded pl-1 focus-within:border-2 focus-within:border-gray-800">
    //           $
    //           <input
    //             type="text"
    //             placeholder="To"
    //             className="w-full ml-3 p-2 border-none focus:outline-none"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <motion.div
      className='md1:hidden lg:flex lgx:hidden fixed inset-0 z-30 p-6 overflow-hidden'
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div
        className='fixed inset-0 bg-black opacity-50 transition-opacity duration-300'
        // onClick={() => setOpenDetail(false)}
      ></div>
      <motion.div className='fixed bottom-0 w-full lg:w-[75%] dlg:w-[77%] lg1:w-[78%] dlg:ml-[2%] lg1:ml-[3%] right-0 bg-white z-40 p-6 rounded-t-3xl '>
        <div className='bg-white rounded-t-3xl w-full p-6 space-y-6 '>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>Filters</h2>
            <button
              onClick={() => setOpenDetail(false)}
              className='text-gray-600 text-4xl'
            >
              &times;
            </button>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Department
            </label>
            <select className='w-full border rounded p-2 text-gray-700'>
              <option>Select role</option>
              <option value='hr'>Human Resources</option>
              <option value='it'>IT</option>
              <option value='finance'>Finance</option>
            </select>
          </div>

          {/* <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Occupation</label>
        
        <div className="flex flex-col space-y-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className=" h-5 w-5 border text-indigo-600 border-gray-300 rounded"
                name="fullTime"
                checked={occupation.fullTime}
                onChange={handleOccupationChange}
              />
              <span className="ml-2">Full-time</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className=" h-5 w-5 border text-indigo-600 border-gray-300 rounded"
                name="partTime"
                checked={occupation.partTime}
                onChange={handleOccupationChange}
              />
              <span className="ml-2">Part-time</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 border text-indigo-600 border-gray-300 rounded"
                name="contract"
                checked={occupation.contract}
                onChange={handleOccupationChange}
              />
              <span className="ml-2">Contract</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 text-indigo-600 border border-gray-300 rounded"
                name="internship"
                checked={occupation.internship}
                onChange={handleOccupationChange}
              />
              <span className="ml-2">Internship</span>
            </label>
          </div>
      </div> */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Occupation
            </label>
            <div className='flex flex-col space-y-1'>
              <label className='inline-flex items-center'>
                <input
                  type='checkbox'
                  className='hidden'
                  name='fullTime'
                  checked={occupation.fullTime}
                  onChange={handleOccupationChange}
                />
                <span
                  className={`h-5 w-5 border border-gray-300 rounded flex items-center justify-center 
        ${occupation.fullTime ? 'bg-blue-500' : 'bg-white'}`}
                >
                  {occupation.fullTime && (
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  )}
                </span>
                <span className='ml-2'>Full-time</span>
              </label>

              <label className='inline-flex items-center'>
                <input
                  type='checkbox'
                  className='hidden'
                  name='partTime'
                  checked={occupation.partTime}
                  onChange={handleOccupationChange}
                />
                <span
                  className={`h-5 w-5 border border-gray-300 rounded flex items-center justify-center 
        ${occupation.partTime ? 'bg-blue-500' : 'bg-white'}`}
                >
                  {occupation.partTime && (
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  )}
                </span>
                <span className='ml-2'>Part-time</span>
              </label>

              <label className='inline-flex items-center'>
                <input
                  type='checkbox'
                  className='hidden'
                  name='contract'
                  checked={occupation.contract}
                  onChange={handleOccupationChange}
                />
                <span
                  className={`h-5 w-5 border border-gray-300 rounded flex items-center justify-center 
        ${occupation.contract ? 'bg-blue-500' : 'bg-white'}`}
                >
                  {occupation.contract && (
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  )}
                </span>
                <span className='ml-2'>Contract</span>
              </label>

              <label className='inline-flex items-center'>
                <input
                  type='checkbox'
                  className='hidden'
                  name='internship'
                  checked={occupation.internship}
                  onChange={handleOccupationChange}
                />
                <span
                  className={`h-5 w-5 border border-gray-300 rounded flex items-center justify-center 
        ${occupation.internship ? 'bg-blue-500' : 'bg-white'}`}
                >
                  {occupation.internship && (
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  )}
                </span>
                <span className='ml-2'>Internship</span>
              </label>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Location
            </label>
            <input
              type='text'
              placeholder='Start typing'
              className='w-full border rounded p-2'
            />

            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                className='hidden'
                checked={isRemote}
                onChange={handleRemoteChange}
              />
              <span
                className={`h-5 w-5 border border-gray-300 rounded flex items-center justify-center 
        ${isRemote ? 'bg-blue-500' : 'bg-white'}`}
              >
                {isRemote && (
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </span>
              <span className='ml-2'>Remote</span>
            </label>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Salary
            </label>
            <div className='flex items-center space-x-2'>
              <div className='flex items-center border rounded pl-1 focus-within:border-2 focus-within:border-gray-800'>
                $
                <input
                  type='text'
                  placeholder='From'
                  className='w-full ml-3 p-2 border-none focus:outline-none'
                />
              </div>
              <span className='px-4'>-</span>
              <div className='flex items-center border rounded pl-1 focus-within:border-2 focus-within:border-gray-800'>
                $
                <input
                  type='text'
                  placeholder='To'
                  className='w-full ml-3 p-2 border-none focus:outline-none'
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobFilterModal;
