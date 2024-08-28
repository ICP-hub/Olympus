import React, { useEffect, useState, useRef } from "react";
import StarIcon from "@mui/icons-material/Star";
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";


const RatingPage = ({}) => {
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);
  const [reviews, setReviews] = useState(null);
  const [loaing, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const principal = useSelector((currState) => currState.internet.principal);

  const schema = yup.object().shape({
    review: yup
      .string()
      .required("Review is required")
      .min(10, "Review must be at least 10 characters"),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // if (!isOpen) return null;

  const handleRating = (index) => {
    setRating(index + 1);
    setShowReview(true);
  };

  const onSubmit = async (data) => {
    let message = data.review;
    try {
      await actor.add_review(rating, message).then((result) => {
        if (isMounted) {
          console.log("review from api", result);
          console.log("review send Successfully");
          setIsLoading(false);
          setShowReview(false);
        }
      });
    } catch (error) {
      if (isMounted) {
        setIsLoading(false);
        console.log("error-in-post-review", error);
      }
    } finally {
    }
  };

  const getAllReview = async (caller, page) => {
    // setIsFetching(true);
    try {
      // const hard_code_principal = "2vxsx-fae";
      const covertedPrincipal = Principal.fromText(principal);
      await caller.get_review(covertedPrincipal).then((result) => {
        if (isMounted) {
          console.log("review from api", result);
          if (result) {
            // Log the exact structure of result.data to verify it
            console.log("review received:", result.Ok?.[0]);
            setReviews(result?.Ok);
          } else {
            setReviews([]);
          }
          setIsLoading(false);
        }
      });
    } catch (error) {
      if (isMounted) {
        setReviews([]);
        setIsLoading(false);
        console.log("error-in-get-all-user", error);
      }
    } finally {
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllReview(actor, isMounted);
    } else {
      getAllReview(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);

  const postAllReview = async (data) => {
    // setIsFetching(true);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col mt-6 items-center">
        <img
          src={ProfileImage}
          alt="Profile"
          className="rounded-full w-28 h-28 mb-4"
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
                index < rating ? "text-rgb(253,177,34)" : "text-gray-300"
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
              <p className="text-red-500 text-sm mt-1">
                {errors.review.message}
              </p>
            )}
            <div className="flex items-center justify-center mb-4 ">
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
      <hr/>
      {reviews &&
        reviews.map((review, indx) => {
          const profilepic =
            review?.profile_pic && review?.profile_pic[0]
              ? uint8ArrayToBase64(review?.profile_pic[0])
              : "hijdfhuf";
          return (
            <div key={indx} className="bg-gray-100 rounded-lg p-4 flex mt-4 flex-col gap-4 ">
              <div className="flex gap-4 flex-shrink-0">
                <img
                  src={profilepic}
                  alt="pic"
                  className="rounded-full w-16 h-16 object-cover border border-gray-300"
                />
                <div className="flex-grow">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    {review.name}
                  </h2>
                  <div className="flex gap-1 mb-2">
                    {[...Array(Math.floor(review.rating))].map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    {review.rating % 1 !== 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    )}
                    {[...Array(5 - Math.ceil(review.rating))].map(
                      (_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      )
                    )}
                    
                  </div>

                  <div className="text-gray-600 text-xs">
                    <p>{review.message}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default RatingPage;
