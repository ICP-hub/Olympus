import React from 'react';
import user from '../../../assets/Logo/mentor.png';

const ProfileRoleNoDataCard = () => {
  return (
    // <div className='bg-[#EEF2F6] shadow-md rounded-lg p-6  w-full md:w-3/4 h-60 flex flex-col items-center text-center relative mb-6 md:mb-0'>
    //   <div className='flex justify-center items-center'>
    //     <div className=' w-20 h-20 rounded-full mb-4 flex justify-center items-center'>

    //       <img
    //         src={user}
    //         alt='User Profile'
    //         className='w-20 h-20 rounded-full mb-4'
    //         loading='lazy'
    //         draggable={false}
    //       />
    //     </div>
    //   </div>
    //   <div className='text-blue-600 bg-blue-100 rounded-full px-3 py-1 inline-block text-xs font-bold mb-2'>
    //     USER
    //   </div>
    <div className='bg-[#EEF2F6] shadow-md rounded-lg p-6  w-full md:w-3/4 h-60 flex flex-col items-center text-center relative mb-6 md:mb-0'>
      <img
        src={user}
        alt='User Profile'
        className='w-20 h-20 rounded-full mb-4'
        loading='lazy'
        draggable={false}
      />
      <div className='bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2'>
        USER
      </div>
      <h3 className='text-gray-700 font-semibold mb-4 text-[12px] sxs1:text-sm  dxl0:text-base'>
        You can't have any another role, You're registered as a Project
      </h3>
    </div>
  );
};

export default ProfileRoleNoDataCard;
