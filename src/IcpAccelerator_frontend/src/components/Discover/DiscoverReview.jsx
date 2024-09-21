import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import NoDataFound from "../Dashboard/DashboardEvents/NoDataFound";

const DiscoverReview = (userData, principalId) => {
  console.log("principal discover pe", principalId);
  console.log("userdata discoverreview pe ", userData);
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [currentUserHasRated, setCurrentUserHasRated] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);
  const [reviews, setReviews] = useState([]);
  const isMounted = useRef(true);
  const userFullData = userData.userData;

  const schema = yup.object().shape({
    review: yup
      .string()
      .required("Review is required")
      .min(10, "Review must be at least 10 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRating = (index) => {
    if (!currentUserHasRated) {
      setRating(index + 1);
      setShowReview(true);
    }
  };

  const getAllReview = async (caller) => {
    try {
      const convertedPrincipal = userData?.principalId;
      console.log("Principal inside get Function", convertedPrincipal);
      await caller.get_review(convertedPrincipal).then((result) => {
        if (isMounted.current) {
          console.log("review from api", result);
          if (result) {
            const fetchedReviews = result?.Ok || [];
            setReviews(fetchedReviews);

            const hasRated = fetchedReviews.some(
              (review) =>
                review.reviewer_principal.toString() ===
                convertedPrincipal.toString()
            );
            setCurrentUserHasRated(hasRated);
          } else {
            setReviews([]);
            setCurrentUserHasRated(false);
          }
        }
      });
    } catch (error) {
      if (isMounted.current) {
        setReviews([]);
        setCurrentUserHasRated(false);
        console.log("error-in-get-all-user", error);
      }
    }
  };

  useEffect(() => {
    if (actor) {
      getAllReview(actor);
    }

    return () => {
      isMounted.current = false;
    };
  }, [actor]);

  if (currentUserHasRated === null) {
    return <div>Loading...</div>;
  }

  const userPic =
    userFullData?.profile_picture && userFullData?.profile_picture[0]
      ? uint8ArrayToBase64(userFullData?.profile_picture[0])
      : "userpic";
  console.log("USER PROFILE PIC", userPic);

  return (
    <div className="md:p-6">
      {reviews.length === 0 ? (
        <div className="text-center "><NoDataFound message="No Review Found"/></div>
      ) : (
        reviews.map((review, index) => {
          const profilepic =
            review?.profile_pic && review?.profile_pic
              ? uint8ArrayToBase64(review?.profile_pic)
              : "pic";
          return (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-4 flex md1:mt-4 flex-col gap-4 "
            >
              <div className="flex gap-4 flex-shrink-0">
                <img
                  src={profilepic}
                  alt="pic"
                  className="rounded-full w-12 h-12 ss:w-16 ss:h-16 object-cover border border-gray-300"
                  loading="lazy"
                  draggable={false}
                />
                <div className="flex-grow">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    {review.name}
                  </h2>
                  <div className="flex gap-1 mb-2">
                    {[...Array(Math.floor(review.rating))]?.map((_, index) => (
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
                      </svg>
                    )}
                    {[...Array(5 - Math.ceil(review.rating))]?.map(
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
        })
      )}
    </div>
  );
};

export default DiscoverReview;

