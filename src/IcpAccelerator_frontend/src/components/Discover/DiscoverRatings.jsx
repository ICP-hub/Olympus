// import React, { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { Principal } from "@dfinity/principal";

// const DiscoverRatings = () => {
//     const actor = useSelector((currState) => currState.actors.actor);
//     const [reviews, setReviews] = useState(null);
//     const principal = useSelector((currState) => currState.internet.principal);
//     const isMounted = useRef(true);
//     const [loaing, setIsLoading] = useState(true);



//     const getAllReview = async (caller, page) => {
//         // setIsFetching(true);
//         try {
//           // const hard_code_principal = "2vxsx-fae";
//           const covertedPrincipal = Principal.fromText(principal);
//           await caller.get_review(covertedPrincipal).then((result) => {
//             if (isMounted) {
//               console.log("review from api", result);
//               if (result) {
//                 // Log the exact structure of result.data to verify it
//                 console.log("review received:", result.Ok?.[0]);
//                 setReviews(result?.Ok);
//               } else {
//                 setReviews([]);
//               }
//               setIsLoading(false);
//             }
//           });
//         } catch (error) {
//           if (isMounted) {
//             setReviews([]);
//             setIsLoading(false);
//             console.log("error-in-get-all-user", error);
//           }
//         } finally {
//         }
//       };
    
//       useEffect(() => {
//         let isMounted = true;
    
//         if (actor) {
//           getAllReview(actor, isMounted);
//         } else {
//           getAllReview(IcpAccelerator_backend);
//         }
    
//         return () => {
//           isMounted = false;
//         };
//       }, [actor]);

//   return (
//     <div className='p-6'>
//         {reviews &&
//         reviews.map((review, indx) => {
//           const profilepic =
//             review?.profile_picture && review?.profile_picture[0]
//               ? uint8ArrayToBase64(review?.profile_picture[0])
//               : "default-profile.png";
//           return (
//             <div key={indx} className="bg-gray-100 rounded-lg p-4 flex mt-4 flex-col gap-4 ">
//               <div className="flex gap-4 flex-shrink-0">
//                 <img
//                   src={profilepic}
//                   alt="pic"
//                   className="rounded-full w-16 h-16 object-cover border border-gray-300"
//                 />
//                 <div className="flex-grow">
//                   <h2 className="text-base font-semibold text-gray-800 mb-1">
//                     {review.name}
//                   </h2>
//                   <div className="flex gap-1 mb-2">
//                     {[...Array(Math.floor(review.rating))].map((_, index) => (
//                       <svg
//                         key={index}
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         className="w-4 h-4 text-yellow-400"
//                         fill="currentColor"
//                       >
//                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                       </svg>
//                     ))}
//                     {review.rating % 1 !== 0 && (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         className="w-4 h-4 text-yellow-400"
//                         fill="currentColor"
//                       >
//                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                       </svg>
//                     )}
//                     {[...Array(5 - Math.ceil(review.rating))].map(
//                       (_, index) => (
//                         <svg
//                           key={index}
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           className="w-4 h-4 text-gray-400"
//                           fill="currentColor"
//                         >
//                           <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                         </svg>
//                       )
//                     )}
                    
//                   </div>

//                   <div className="text-gray-600 text-xs">
//                     <p>{review.message}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   )
// }

// export default DiscoverRatings
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";

const DiscoverRatings = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [reviews, setReviews] = useState(null);
  const principal = useSelector((currState) => currState.internet.principal);
  const isMounted = useRef(true); // useRef to track mounted state
  const [loading, setIsLoading] = useState(true);

  const getAllReview = async (caller) => {
    try {
      const convertedPrincipal = Principal.fromText(principal);
      await caller.get_review(convertedPrincipal).then((result) => {
        if (isMounted.current) {
          console.log("review from api", result);
          if (result) {
            console.log("review received:", result.Ok?.[0]);
            setReviews(result?.Ok);
          } else {
            setReviews([]);
          }
          setIsLoading(false);
        }
      });
    } catch (error) {
      if (isMounted.current) {
        setReviews([]);
        setIsLoading(false);
        console.log("error-in-get-all-user", error);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true; // set current property to true on mount

    if (actor) {
      getAllReview(actor);
    } else {
      getAllReview(IcpAccelerator_backend);
    }

    return () => {
      isMounted.current = false; // set current property to false on unmount
    };
  }, [actor]);

  return (
    <div className="p-6">
      {reviews &&
        reviews?.map((review, index) => {
          const profilepic =
            review?.profile_picture && review?.profile_picture[0]
              ? uint8ArrayToBase64(review?.profile_picture[0])
              : "default-profile.png";
          return (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-4 flex mt-4 flex-col gap-4"
            >
              <div className="flex gap-4 flex-shrink-0">
                <img
                  src={profilepic}
                  alt="pic"
                  className="rounded-full w-16 h-16 object-cover border border-gray-300"
                  loading="lazy"
                  draggable={false}
                />
                <div className="flex-grow">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    {review.name}
                  </h2>
                  {review.rating !== undefined && review.rating !== null ? (
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
                  ) : (
                    <div className="text-gray-600 text-sm">No rating found</div>
                  )}
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

export default DiscoverRatings;
