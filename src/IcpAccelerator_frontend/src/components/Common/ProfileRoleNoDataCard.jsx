import React from 'react';
import user from '../../../assets/Logo/mentor.png';

const ProfileRoleNoDataCard = () => {
  return (
    <div className='bg-[#EEF2F6] shadow-md rounded-lg p-6  w-full md:w-3/4 h-60 flex flex-col items-center text-center relative mb-6 md:mb-0'>
      <div className='flex justify-center items-center'>
        <div className='bg-gray-200 w-20 h-20 rounded-full mb-4 flex justify-center items-center'>
          {/* <svg
                  className="w-9 h-9 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24" 
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg> */}
          <img
            src={user}
            alt='User Profile'
            className='w-20 h-20 rounded-full mb-4'
            loading='lazy'
            draggable={false}
          />
        </div>
      </div>
      <div className='text-blue-600 bg-blue-100 rounded-full px-3 py-1 inline-block text-xs font-semibold mb-2'>
        User
      </div>
      <h3 className='text-gray-700 font-semibold mb-4 text-sm  dxl0:text-base'>
        You can't have any another role, You're registered as a Project
      </h3>
    </div>
  );
};

export default ProfileRoleNoDataCard;
