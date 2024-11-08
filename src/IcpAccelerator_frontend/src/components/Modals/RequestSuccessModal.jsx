import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../../assets/images/Org.png';

const RequestSuccessModal = ({ openDetail, setOpenDetail }) => {
  // if (!openDetail) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-gray-800 opacity-50 fixed inset-0'></div>

      <div className='bg-white mx-4 rounded-lg shadow-lg p-6 max-w-lg relative z-10'>
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
          onClick={() => setOpenDetail(false)}
        >
          <CloseIcon sx={{ cursor: 'pointer' }} />
        </button>

        <div className='flex items-center mx-4 space-x-4 mt-3 mb-6'>
          <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 12l-2-2m0 0l-2 2m2-2v6"
              />
            </svg> */}
            <img src={logo} alt='logo' className='w-10 h-10 rounded-full' />
          </div>
          <h2 className='text-lg font-medium'>Cypherpunk Labs</h2>
        </div>
        <h2 className='text-2xl mt-4  mx-4 mb-6 font-bold'>Request title</h2>

        <div className='bg-green-100 p-4 mx-4 flex flex-col items-center justify-center rounded-lg mb-6'>
          <div className='bg-green-500 p-2 rounded-full inline-block'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          <p className='text-lg font-semibold'>Success message</p>
          <p className='mt-2 text-gray-600 text-center'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
            pariatur, ipsum dolor.
          </p>
        </div>

        <div className='flex w-full justify-center '>
          <button
            className='mt-4 w-[90%]  bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition'
            onClick={() => setOpenDetail(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestSuccessModal;
