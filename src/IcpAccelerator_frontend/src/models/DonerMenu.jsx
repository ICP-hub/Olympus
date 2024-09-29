import React, { useState } from 'react';

const DonerMenu = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleBlur = () => {
    setIsHovered(false);
  };

  return (
    <div className='menu__wrapper flex flex-col justify-center items-center flex-1'>
      <div
        className={`menu__item--doner flex flex-col text-center items-center ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleHover}
        onMouseLeave={handleBlur}
        onFocus={handleHover}
        onBlur={handleBlur}
      >
        <div className='line h-0.5 w-4 bg-black mt-0.5'></div>
        <div className='line h-0.5 w-3 bg-black mt-0.5'></div>
        <div className='line h-0.5 w-2 bg-black mt-0.5'></div>
      </div>
      {/* Additional Tailwind CSS styles */}
      {/* <style>
        {`
          .menu__item--doner.hovered .line:nth-child(1) {
            transform: rotate(45deg) translate(12px, 12px);
          }
          .menu__item--doner.hovered .line:nth-child(2) {
            width: 20px;
            transform: rotate(-45deg) translate(-12px, -1.5px);
          }
          .menu__item--doner.hovered .line:nth-child(3) {
            transform: rotate(-45deg) translate(25px, -14px);
          }
        `}
      </style> */}
    </div>
  );
};

export default DonerMenu;
