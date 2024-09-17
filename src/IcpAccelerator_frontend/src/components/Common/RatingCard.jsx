import React, { useState, useEffect, useRef } from "react";
import RatingReview from "./RatingReview";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";

const RatingCard = ({  }) => {
  const [showReview, setShowReview] = useState(false);
  const [ratingCount, setRatingCount] = useState(0);
  const principal = useSelector((currState) => currState.internet.principal);
  const actor = useSelector((currState) => currState.actors.actor);
  const [ratingtosend, setRatingToSend] = useState(null);
  const isMounted = useRef(true);
  const [isDataReady, setIsDataReady] = useState(false);



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



  console.log("RATING CHILD ME JAANE K LIYE TAAYAR HAI", ratingtosend);

  return (
    <>
      {!showReview ? (
        <div className="bg-gray-100 max-h-[250px] h-[220px] rounded-lg p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-black">
            {ratingtosend?.rating ? `${ratingtosend.rating}.0` : 0}
          </span>
          <div className="flex ss1:gap-2 my-5">
            {[...Array(ratingtosend?.rating ? ratingtosend?.rating : 5)].map(
              (_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-8 lgx:w-[1.7rem] lgx:h-[1.7rem] dxl0:w-8 h-8  dxl0:w-8${
                    ratingtosend?.rating > 0
                      ? "fill-yellow-500 text-yellow-500"
                      : "fill-none text-gray-400"
                  }`}
                  fill={ratingtosend?.rating > 0 ? "#eab308" : "none"}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              )
            )}
          </div>
          <span
            onClick={() => setShowReview(true)}
            className="text-sm text-gray-600 cursor-pointer"
          >
            {ratingCount} reviews
          </span>
        </div>
      ) : (
        <div className="bg-gray-100 max-h-[250px] h-[230px] rounded-lg p-4 flex flex-col gap-4 ">
          <div className="flex gap-4 flex-shrink-0">
            {ratingtosend?.profile_pic ? (
              <img
                src={uint8ArrayToBase64(ratingtosend?.profile_pic)}
                alt="pic"
                className="rounded-full w-16 h-16 object-cover border border-gray-300"
              />
            ) : (
              ""
            )}
            <div className="flex-grow">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                {ratingtosend?.name}
              </h2>
              <div className="flex gap-1 mb-2">
                {[...Array(ratingtosend?.rating)].map((_, index) => (
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
            <p className="line-clamp-3 break-all">{ratingtosend?.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingCard;
