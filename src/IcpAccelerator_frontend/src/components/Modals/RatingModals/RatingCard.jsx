import React, { useState } from 'react';

const RatingCard = ({
  title,
  description,
  onRatingChange,
  currentRating,
  step,
  totalSteps,
}) => {
  const [selectedRating, setSelectedRating] = useState(currentRating || 0);

  // Handle rating selection
  const handleSelect = (rating) => {
    setSelectedRating(rating);
    onRatingChange(rating);
  };

  return (
    <div>
      {/* Rating Buttons */}
      <div className='flex space-x-2 gap-0.5 flex-wrap justify-center mb-6'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleSelect(num)}
            className={`w-10 h-10 rounded-md flex items-center justify-center border ${
              selectedRating === num
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Level and Description */}
      <div className='bg-gray-100 p-4 rounded-lg mb-6'>
        <h3 className='text-blue-600 font-semibold inline'>Level {step} -</h3>
        <span className='text-gray-700 font-medium inline'>{title}</span>
        <p className='text-gray-500 mt-2'>{description}</p>
      </div>
    </div>
  );
};

export default RatingCard;
