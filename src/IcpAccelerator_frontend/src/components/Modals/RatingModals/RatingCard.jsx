import React, { useState } from 'react';

const RatingCard = ({ levels, onRatingChange, currentRating }) => {
  const [selectedRating, setSelectedRating] = useState(currentRating || 1);

  const handleSelect = (rating) => {
    setSelectedRating(rating);
    onRatingChange(rating);
  };

  const getBackgroundClass = (num) => {
    if (selectedRating === num) {
      return 'bg-blue-600 text-white';
    } else if (selectedRating > num) {
      switch (selectedRating - num) {
        case 1:
          return 'bg-blue-500 text-white';
        case 2:
          return 'bg-blue-400 text-white';
        case 3:
          return 'bg-blue-300 text-white';
        case 4:
          return 'bg-blue-200 text-white';
        default:
          return 'bg-blue-100 text-white';
      }
    } else {
      return 'bg-white text-gray-600 border-gray-300';
    }
  };

  return (
    <div>
      <div className='flex space-x-2 gap-0.5 flex-wrap justify-center mb-6'>
        {levels.map((level) => (
          <button
            key={level?.id}
            onClick={() => handleSelect(level?.id)}
            className={`w-10 h-10 rounded-md flex items-center justify-center border ${getBackgroundClass(level?.id)}`}
          >
            {level?.id}
          </button>
        ))}
      </div>

      {levels.map(
        (level) =>
          selectedRating === level?.id && (
            <div key={level?.id} className='bg-gray-100 p-4 rounded-lg mb-6'>
              <h3 className='text-blue-600 font-semibold inline'>
                Level {level?.id} -{' '}
              </h3>
              <span className='text-gray-700 font-medium inline'>
                {level?.title}
              </span>
              <p className='text-gray-500 mt-2'>{level?.desc}</p>
            </div>
          )
      )}
    </div>
  );
};

export default RatingCard;
