import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const Rating2 = () => {
  const [ratings, setRatings] = useState([0, 0, 0]); // Array to hold ratings for each question

  const handleStarClick = (questionIndex, rating) => {
    const newRatings = [...ratings];
    newRatings[questionIndex] = rating; // Update the rating for the specific question
    setRatings(newRatings);
  };

  return (
    <>
      <h1 className='text-3xl text-[#121926] font-bold mb-3'>Team</h1>

      {[ // Questions array
        "How would you rate the team's overall expertise and experience relevant to the project?",
        "How well do you think the team members work together?",
        "How strongly do you agree with this statement: \"The team demonstrates a shared passion and vision for the project.\""
      ].map((question, questionIndex) => (
        <div key={questionIndex} className="mb-4">
          <p className="text-lg">
            {questionIndex + 1}. {question} {/* Add question numbering */}
          </p>
          <div className="flex items-center justify-center">
            {Array.from({ length: 5 }).map((_, index) => {
              const ratingValue = index + 1; // Star rating from 1 to 5
              const isActive = ratings[questionIndex] >= ratingValue; // Check if star is selected
              return (
                <span
                  key={index}
                  className={`cursor-pointer text-${isActive ? 'yellow-500' : 'gray-400'} text-4xl`} // Color change based on selection
                  onClick={() => handleStarClick(questionIndex, ratingValue)} // Set rating on click
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>
      ))}

      

     
      <Toaster />
    </>
  );
};

export default Rating2;
