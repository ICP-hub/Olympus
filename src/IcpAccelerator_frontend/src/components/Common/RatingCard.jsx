import React, { useState, useEffect, useRef } from "react";
import RatingReview from "./RatingReview";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";

const RatingCard = ({ show, setShow }) => {
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [ratingCount, setRatingCount] = useState(0);
  const principal = useSelector((currState) => currState.internet.principal);
  const actor = useSelector((currState) => currState.actors.actor);
  const [ratingtosend, setRatingToSend] = useState(null);
  const [ratingtosend1, setRatingToSend1] = useState({});
  const isMounted = useRef(true);
  const [isDataReady, setIsDataReady] = useState(false);

  const handleRating = (index) => {
    setRating(index + 1);
    setShowReview(true);
  };

  // const getAllReview = async (caller) => {
  //   try {
  //     const convertedPrincipal = Principal.fromText(principal);
  //     await caller.get_review_with_count(convertedPrincipal).then((result) => {
  //       if (isMounted.current && result && result.Ok) {
  //         console.log("REVIEW API SE COUNT AAGYA HAI", result.Ok?.[1]);
  //         if (result) {
  //           const fetchedReviews = result?.Ok || [];
  //           console.log("FETCHED REVIEW FROM API", fetchedReviews);
  //           console.log(
  //             "FETCHED REVIEW FROM API KA ALG ALG DATA",
  //             fetchedReviews?.[0]?.[0]
  //           );
  //           setRatingToSend(fetchedReviews?.[0]?.[0]);
  //           setRatingCount(Number(result.Ok?.[1]));
  //           setIsDataReady(true);
  //           // const hasRated = fetchedReviews.some(
  //           //   (review) =>
  //           //     review.reviewer_principal.toString() === principal.toString()
  //           // );
  //           // setCurrentUserHasRated(hasRated);
  //         } else {
  //           setRating({});
  //           setIsDataReady(false);
  //           // setCurrentUserHasRated(false);
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     if (isMounted.current) {
  //       setRating([]);
  //       setIsDataReady(false);
  //       // setCurrentUserHasRated(false);
  //       console.log("error-in-get-all-user", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (actor) {
  //     getAllReview(actor);
  //   }

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, [actor]);

  useEffect(() => {
    if (!actor) return;
    const getAllReview = async () => {
      try {
        const convertedPrincipal = Principal.fromText(principal);
        const result = await actor.get_review_with_count(convertedPrincipal);
        if (isMounted.current && result && result.Ok) {
          const fetchedReviews = result?.Ok || [];
          setRatingToSend(fetchedReviews?.[0]?.[0]);
          setRatingCount(Number(result.Ok?.[1]));
          setIsDataReady(true);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    getAllReview();

    return () => {
      isMounted.current = false;
    };
  }, [actor, principal]);

  // useEffect(() => {
  //   if (Object.keys(ratingtosend).length > 0) {
  //     setIsDataReady(true);
  //   }
  // }, [ratingtosend]);

  console.log("RATING CHILD ME JAANE K LIYE TAAYAR HAI", ratingtosend);

  return (
    <>
      {show ? (
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
            {ratingCount} reviews
          </span>
        </div>
      ) : (
        showReview && (
          <div className="bg-gray-100 max-h-[250px] h-[230px] rounded-lg p-4 flex flex-col gap-4 ">
            <div className="flex gap-4 flex-shrink-0">
              <img
                src={ProfileImage}
                alt="pic"
                className="rounded-full w-16 h-16 object-cover border border-gray-300"
              />
              <div className="flex-grow">
                <h2 className="text-base font-semibold text-gray-800 mb-1">
                  Floyd Abernathy-Hamil
                </h2>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, index) => (
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
                </div>
              </div>
            </div>

            <div className="text-gray-600 text-xs">
              <p>
                {ratingtosend.message}
           
              </p>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default RatingCard;
