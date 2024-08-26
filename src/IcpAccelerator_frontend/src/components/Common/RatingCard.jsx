import React, { useState } from "react";
import RatingReview from "./RatingReview";

const RatingCard = ({ show, setShow }) => {
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const handleRating = (index) => {
    setRating(index + 1);
    setShowReview(true);
  };
  return (
    <>
      {show === true ? (
        <div className="bg-gray-100 max-h-[250px] h-[220px] rounded-lg p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-black">5.0</span>
          <div className="flex gap-2 my-5">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                onClick={() => handleRating(index)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={index < rating ? "yellow" : "none"}
                className={`w-8 h-8 cursor-pointer ${
                  index < rating ? "text-rgb(253,177,34)" : "text-gray-400"
                }`}
                stroke={index < rating ? "rgb(253,177,34)" : "currentColor"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            ))}
          </div>
          <span
            onClick={() => setShow(false)}
            className="text-sm text-gray-600 cursor-pointer"
          >
            1 review
          </span>
        </div>
      ) : (
        <RatingReview />
      )}
    </>
  );
};

export default RatingCard;
