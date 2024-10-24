import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Toaster } from 'react-hot-toast';
import RatingMain from './RatingMain'; // Import the RatingMain component

const Rating1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Controls visibility of Rating1 modal
  const [isRatingMainOpen, setIsRatingMainOpen] = useState(false); // Controls visibility of RatingMain modal

  // Close the current modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle continue button to switch from Rating1 to RatingMain
  const handleContinue = () => {
    setIsModalOpen(false); // Close Rating1 modal
    setIsRatingMainOpen(true); // Open RatingMain modal
  };

  return (
    <>
      {/* Only show Rating1 if isModalOpen is true */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-start bg-black bg-opacity-50'>
          <div className='relative bg-white rounded-lg shadow-lg w-[500px] p-6'>
            {/* Close Button */}
            <button
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </button>

            <div className='flex flex-col items-center mt-14'>
              <div className='relative '>
                <div className='flex items-center justify-center mt-14'>
                  {Array.from({ length: 5 }).map((_, index) => {
                    let sizeClasses = 'text-[#FDB022]';
                    let size = 'text-4xl';
                    let translateY = '-25px';
                    let translateX = 0;

                    if (index === 2) {
                      size = 'text-7xl';
                      translateY = '-40px';
                    } else if (index === 1 || index === 3) {
                      size = 'text-5xl';
                      translateY = '-35px';
                    }

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
                        <span className={`${sizeClasses} ${size}`}>★</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <h1 className='text-[1.8rem] font-bold text-[#121926] mt-2'>
                Welcome to Project Assessment!
              </h1>
              <div>
                <p className='mt-4 text-[#121926] font-semibold'>
                  In this module, you'll rate the project across 8 key
                  categories.
                </p>
                <p className='mt-3 text-[#121926] text-left font-semibold'>
                  It should take approximately 5-10 minutes to complete.
                </p>
                <p className='mt-3 text-[#121926] font-semibold'>
                  Please use the 1-to-5 star scale for each question, where 1
                  star is the lowest rating and 5 stars is the highest.
                </p>
                <p className='mt-3 text-[#121926] font-semibold mb-4'>
                  Your honest feedback is appreciated!
                </p>
              </div>

              {/* Continue Button */}
              <div className='flex justify-center my-6'>
                <button
                  onClick={handleContinue}
                  className='py-2 px-4 bg-blue-600 text-white rounded'
                >
                  Continue
                </button>
              </div>
            </div>

            <Toaster />
          </div>
        </div>
      )}

      {/* Show RatingMain if isRatingMainOpen is true */}
      {isRatingMainOpen && <RatingMain />}
    </>
  );
};

export default Rating1;
