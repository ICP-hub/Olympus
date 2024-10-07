import React from 'react';
import { Toaster } from 'react-hot-toast';

const Rating1 = () => {
  return (
    <>


      <div className="flex flex-col items-center  ">
        <div className="relative mb-4">
          <div className="flex items-center justify-center mt-14">
            {Array.from({ length: 5 }).map((_, index) => {
              // Determine size based on the index
              let sizeClasses = 'text-[#FDB022]';
              let size = 'text-4xl'; // Default size for first and last stars
              let translateY = '-25px'; // Decrease default vertical position
              let translateX = 0; // Default horizontal position

              if (index === 2) {
                size = 'text-7xl'; // Middle star (largest)
                translateY = '-40px'; // Higher position for the middle star
              } else if (index === 1 || index === 3) {
                size = 'text-5xl'; // Side stars (smaller)
                translateY = '-35px'; // Medium position for side stars
              }

              // Adjust translateX for spacing between stars (5 times more gap)
              switch (index) {
                case 0:
                  translateX = '-300%'; // First star
                  break;
                case 1:
                  translateX = '-130%'; // Second star
                  break;
                case 2:
                  translateX = '0%'; // Middle star
                  break;
                case 3:
                  translateX = '130%'; // Fourth star
                  break;
                case 4:
                  translateX = '300%'; // Last star
                  break;
                default:
                  break;
              }

              return (
                <div
                  key={index}
                  className={`flex items-center justify-center absolute`}
                  style={{
                    transform: `translateX(${translateX}) rotate(${(index - 2) * 15}deg) translateY(${translateY})`,
                  }}
                >
                  <span className={`${sizeClasses} ${size}`}>★</span> {/* Using ★ for the star */}
                </div>
              );
            })}
          </div>
        </div>

        <h1 className=" text-[1.8rem] font-bold text-[#121926] mt-2">Welcome to Project Assessment!</h1>
        <div>
        <p className="mt-4 text-[#121926] font-semibold">
          In this module, you'll rate the project across 8 key categories.
        </p>
        <p className="mt-3 text-[#121926] text-left font-semibold">
        It should take approximately 5-10 minutes to complete.
        </p>
        <p className="mt-3 text-[#121926] font-semibold">
          Please use the 1-to-5 star scale for each question, where 1 star is the lowest rating and 5 stars is the highest.
        </p>
        <p className="mt-3 text-[#121926] font-semibold mb-4">
          Your honest feedback is appreciated!
        </p>
        </div>
      </div>

      {/* TOASTER FOR NOTIFICATIONS */}
      <Toaster />
    </>
  );
};

export default Rating1;