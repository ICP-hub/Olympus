import React, { useEffect, useState } from 'react';

const WarningMessage = () => {
  const [showWarning, setShowWarning] = useState(false);

  // useEffect(() => {
  //   const checkScreenSize = () => {
  //     const laptopScreenWidth = 1024;
  //     // const mobileScreenWidth = 768;
  //     const screenWidth = window.innerWidth;
  //     // >= mobileScreenWidth && screenWidth
  //     if (screenWidth  < laptopScreenWidth) {
  //       setShowWarning(true);
  //     } else {
  //       setShowWarning(false);
  //     }
  //   };

  //   checkScreenSize();
  //   window.addEventListener('resize', checkScreenSize);

  //   return () => window.removeEventListener('resize', checkScreenSize);
  // }, []);

  if (!showWarning) return null;

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-100'>
      <div className='mt-10 bg-[#FEF5EE] text-red-700 text-center px-4 py-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold pb-5'>Warning🚨</h2>
        <p className='text-[#000]'>
          This website is best viewed on a laptop screen😥
        </p>
        {/* <button 
          className="mt-2 px-4 py-2 bg-red-700 text-white rounded" 
          onClick={() => setShowWarning(false)}
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default WarningMessage;
