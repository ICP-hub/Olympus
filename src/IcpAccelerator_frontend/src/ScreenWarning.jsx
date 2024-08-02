import React, { useEffect, useState } from 'react';

const WarningMessage = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const laptopScreenWidth = 1024;
      const mobileScreenWidth = 768;
      const screenWidth = window.innerWidth;

      if (screenWidth >= mobileScreenWidth && screenWidth < laptopScreenWidth) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999px]">
      <div className="mt-10 bg-yellow-300 text-red-700 text-center p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Warning</h2>
        <p>This website is best viewed on a laptop screen.</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-700 text-white rounded" 
          onClick={() => setShowWarning(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WarningMessage;
