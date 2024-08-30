import React from 'react';
import Avatar from '@mui/material/Avatar';

const RollingComponent = ({ isToggled, toggle, image }) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id="expand-toggle3"
        className="hidden"
        checked={isToggled}
        onChange={toggle}
      />
      <label
        htmlFor="expand-toggle3"
        className="block w-14 h-8 mx-auto bg-white rounded-full cursor-pointer transition-all duration-500 hover:bg-[#F7FAFC]"
      >
        <div className="relative w-full h-full rounded-full">
          <div
            className={`absolute inset-0 w-1/2 h-full transform rounded-full transition-transform duration-500 ease-in-out ${
              isToggled ? 'translate-x-full' : ''
            }`}
          >
            <Avatar
              alt="Rolling Avatar"
              src={image}
              sx={{
                width: 30,
                height: 30,
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'transform 0.5s ease-in-out',
                transform: isToggled
                  ? 'translate(-50%, -50%) rotate(360deg)'
                  : 'translate(-50%, -50%) rotate(0deg)',
              }}
            />
          </div>
        </div>
      </label>
    </div>
  );
};

export default RollingComponent;
