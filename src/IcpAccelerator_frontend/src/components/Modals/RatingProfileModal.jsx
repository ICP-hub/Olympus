import React, { useState } from 'react';
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  review: yup.string().required("Review is required").min(10, "Review must be at least 10 characters"),
});

const RatingProfileModal = ({ isOpen, setIsOpen }) => {
  const [rating, setRating] = useState(0); 
  const [showReview, setShowReview] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (!isOpen) return null;

  const handleRating = (index) => {
    setRating(index + 1);
    setShowReview(true); 
  };

  const onSubmit = (data) => {
    alert(`Submitted rating: ${rating}\nReview: ${data.review}`);
    setIsOpen(false); 
    reset(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 mx-4 relative max-w-sm w-full">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 left-5 font-light text-3xl text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          &times;
        </button>
        <div className="flex flex-col mt-6 items-center">
          <img
            src={ProfileImage}
            alt="Profile"
            className="rounded-full w-28 h-28 mb-4"
            loading="lazy"
            draggable={false}
          />
          <h2 className="text-2xl font-bold">Matt Bower</h2>
          <p className="text-gray-500">@mattbowers</p>
          <div className="flex gap-2 my-5">
            {[...Array(5)].map((_, index) => (
              <svg
              key={index}
              onClick={() => handleRating(index)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={index < rating ? "yellow" : "none"}
              className={`w-8 h-8 cursor-pointer ${
                index < rating ? 'text-rgb(253,177,34)' : 'text-gray-300'
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

          {showReview && (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter Review
              </label>
              <textarea
                {...register("review")}
                className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:border-blue-500 ${
                  errors.review ? "border-red-500" : "border-gray-300"
                }`}
                rows="4"
                placeholder="Write your review here..."
              ></textarea>
              {errors.review && (
                <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
              )}
              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Submit 
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingProfileModal;
