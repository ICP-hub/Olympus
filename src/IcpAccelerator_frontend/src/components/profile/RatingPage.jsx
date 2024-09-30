// import React, { useState, useEffect, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useSelector } from 'react-redux';
// import { Principal } from '@dfinity/principal';
// import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
// import toast from 'react-hot-toast';
// import { ThreeDots } from 'react-loader-spinner';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
// import RatingPageProfileSkeleton from './skeletonProfile/RatingPageProfileSkeleton';


// const RatingPage = () => {
//   const [rating, setRating] = useState(0);
//   const [showReview, setShowReview] = useState(false);
//   const [currentUserHasRated, setCurrentUserHasRated] = useState(null);
//   const actor = useSelector((currState) => currState.actors.actor);
//   const [reviews, setReviews] = useState([]);
//   const isMounted = useRef(true);
//   const [isLoading,setIsLoading]=useState(true)
//   const principal = useSelector((currState) => currState.internet.principal);
//   const userFullData = useSelector((currState) => currState.userData.data.Ok);

//   const schema = yup.object().shape({
//     review: yup
//       .string()
//       .required('Review is required')
//       .min(10, 'Review must be at least 10 characters'),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const handleRating = (index) => {
//     if (!currentUserHasRated) {
//       setRating(index + 1);
//       setShowReview(true);
//     }
//   };

//   const onSubmit = async (data) => {
//     let message = data.review;
//     try {
//       const convertedPrincipalId = Principal.fromText(principal);
//       await actor
//         .add_review(convertedPrincipalId, rating, message)
//         .then((result) => {
//           if (isMounted.current) {
//             console.log('review from api', result);
//             console.log('review sent successfully');
//             toast.success('Review sent successfully');
//             setShowReview(false);
//             setReviews((prevReviews) => [
//               ...prevReviews,
//               { rating, message, reviewer_principal: principal },
//             ]);
//             setIsLoading(false)
//             setCurrentUserHasRated(true);
//           }
//         });
//     } catch (error) {
//       if (isMounted.current) {
//         toast.error('Error in posting review');
//         console.log('error-in-post-review', error);
//       }
//     }
//   };

//   const getAllReview = async (caller) => {
//     try {
//       const convertedPrincipal = Principal.fromText(principal);
//       await caller.get_review(convertedPrincipal).then((result) => {
//         if (isMounted.current) {
//           console.log('review from api', result);
//           if (result) {
//             const fetchedReviews = result?.Ok || [];
//             setReviews(fetchedReviews);
//             setIsLoading(false)

//             const hasRated = fetchedReviews.some(
//               (review) =>
//                 review.reviewer_principal.toString() === principal.toString()
//             );
//             setCurrentUserHasRated(hasRated);
//           } else {
//             setReviews([]);
//             setIsLoading(false)
//             setCurrentUserHasRated(false);
//           }
//         }
//       });
//     } catch (error) {
//       if (isMounted.current) {
//         setReviews([]);
//         setIsLoading(false);
//         setCurrentUserHasRated(false);
//         console.log('error-in-get-all-user', error);
//       }
//     }
//   };

//   useEffect(() => {
//     if (actor) {
//       getAllReview(actor);
//     }

//     return () => {
//       isMounted.current = false;
//     };
//   }, [actor]);

//   // if (currentUserHasRated === null) {
//   //   return (
//   //   <RatingPageProfileSkeleton/>
//   // )}

//   const userPic =
//     userFullData?.profile_picture && userFullData?.profile_picture[0]
//       ? uint8ArrayToBase64(userFullData?.profile_picture[0])
//       : 'userpic';

//   console.log('userFullData', userFullData);
//   return (
//     <div className='p-3 sm0:p-6'>
//       <div className='flex flex-col mt-6 items-center'>
//         <img
//           src={userFullData?.profile_picture[0]}
//           alt='Profile'
//           className='rounded-full w-16 h-16 sm:w-16 sm:h-16 md:w-28 md:h-28 mb-4'
//           loading='lazy'
//           draggable={false}
//         />
//         <h2 className='line-clamp-1 break-all sm3:text-2xl font-bold'>
//           {userFullData.full_name}{' '}
//         </h2>
//         <p className='line-clamp-1 break-all text-gray-500'>
//           {userFullData.openchat_username}
//         </p>
//         {!currentUserHasRated && (
//           <button className='flex gap-2 my-5'>
//             {[...Array(5)].map((_, index) => (
//               <svg
//                 key={index}
//                 onClick={() => handleRating(index)}
//                 xmlns='http://www.w3.org/2000/svg'
//                 viewBox='0 0 24 24'
//                 fill={index < rating ? 'yellow' : 'none'}
//                 className={`sm0:w-8 sm0:h-8 w-6 h-6 cursor-pointer ${
//                   index < rating ? 'text-rgb(253,177,34)' : 'text-gray-300'
//                 }`}
//                 stroke={index < rating ? 'rgb(253,177,34)' : 'currentColor'}
//               >
//                 <path
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                   d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
//                 />
//               </svg>
//             ))}
//           </button>
//         )}

//         {showReview && (
//           <form onSubmit={handleSubmit(onSubmit)} className='w-full mt-4'>
//             <label className='block text-gray-700 text-sm font-bold mb-2'>
//               Enter Review
//             </label>
//             <textarea
//               {...register('review')}
//               className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:border-blue-500 ${
//                 errors.review ? 'border-red-500' : 'border-gray-300'
//               }`}
//               rows='4'
//               placeholder='Write your review here...'
//             ></textarea>
//             {errors.review && (
//               <p className='text-red-500 text-sm mt-1'>
//                 {errors.review.message}
//               </p>
//             )}
//             <div className='flex items-center justify-center mb-4 '>
//               <button
//                 disabled={isSubmitting}
//                 type='submit'
//                 className='bg-blue-600 text-white py-2 px-4 rounded'
//               >
//                 {isSubmitting ? (
//                   <ThreeDots
//                     visible={true}
//                     height='35'
//                     width='35'
//                     color='#FFFEFF'
//                     radius='9'
//                     ariaLabel='three-dots-loading'
//                   />
//                 ) : (
//                   'Submit'
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//       <hr className='mt-4' />
//       {reviews && 
//         reviews.map((review, indx) => {
//           console.log('review', review);
//           const profilepic =
//             review?.profile_pic && review?.profile_pic
//               ? uint8ArrayToBase64(review?.profile_pic)
//               : 'pic';
//           return (
//             <div
//               key={indx}
//               className='bg-gray-100 rounded-lg p-2 sm0:p-4 flex mt-4 flex-col gap-4 '
//             >
//               <div className='flex gap-2 sm0:gap-4 flex-shrink-0'>
//                 <img
//                   src={profilepic}
//                   alt='pic'
//                   className='rounded-full w-8 h-8 xxs:w-12 xxs:h-12 sm0:w-12 sm0:h-12 sm:w-16 sm:h-16  object-cover border border-gray-300'
//                   loading='lazy'
//                   draggable={false}
//                 />
//                 <div className='flex-grow'>
//                   <h2 className='text-base font-semibold text-gray-800 mb-1'>
//                     {review.name}
//                   </h2>
//                   <div className='flex gap-1 mb-2'>
//                     {[...Array(Math.floor(review.rating))].map((_, index) => (
//                       <svg
//                         key={index}
//                         xmlns='http://www.w3.org/2000/svg'
//                         viewBox='0 0 24 24'
//                         className='w-4 h-4 text-yellow-400'
//                         fill='currentColor'
//                       >
//                         <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
//                       </svg>
//                     ))}
//                     {review.rating % 1 !== 0 && (
//                       <svg
//                         xmlns='http://www.w3.org/2000/svg'
//                         viewBox='0 0 24 24'
//                         className='w-4 h-4 text-yellow-400'
//                         fill='currentColor'
//                       >
//                         <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
//                       </svg>
//                     )}
//                     {[...Array(5 - Math.ceil(review.rating))].map(
//                       (_, index) => (
//                         <svg
//                           key={index}
//                           xmlns='http://www.w3.org/2000/svg'
//                           viewBox='0 0 24 24'
//                           className='xxs:w-4 xxs:h-4 w-4 h-4 text-gray-400'
//                           fill='currentColor'
//                         >
//                           <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
//                         </svg>
//                       )
//                     )}
//                   </div>

//                   <div className='text-gray-600 text-xs '>
//                     <p className='text-xs sm0:text-sm font-normal break-all line-clamp-2 '>
//                       {review.message}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
       

//     </div>
//   );
// };

// export default RatingPage;

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import toast from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
import {ProfileSkeleton} from './skeletonProfile/RatingPageProfileSkeleton'; 
import { ReviewSkeleton } from './skeletonProfile/RatingPageProfileSkeleton';  
import RatingPageProfileSkeleton from './skeletonProfile/RatingPageProfileSkeleton';

const RatingPage = () => {
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [currentUserHasRated, setCurrentUserHasRated] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Main loading state
  const [reviewsLoading, setReviewsLoading] = useState(true); // Loading state for reviews
  const actor = useSelector((currState) => currState.actors.actor);
  const [reviews, setReviews] = useState([]);
  const isMounted = useRef(true);
  const principal = useSelector((currState) => currState.internet.principal);
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const [numSkeletons, setNumSkeletons] = useState(1);

  const schema = yup.object().shape({
    review: yup
      .string()
      .required('Review is required')
      .min(10, 'Review must be at least 10 characters'),
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

  const onSubmit = async (data) => {
    let message = data.review;
    try {
      const convertedPrincipalId = Principal.fromText(principal);
      await actor
        .add_review(convertedPrincipalId, rating, message)
        .then((result) => {
          if (isMounted.current) {
            console.log('review from api', result);
            toast.success('Review sent successfully');
            setShowReview(false);
            setReviews((prevReviews) => [
              ...prevReviews,
              { rating, message, reviewer_principal: principal },
            ]);
            setIsLoading(false);
            setReviewsLoading(false);
            setCurrentUserHasRated(true);
          }
        });
    } catch (error) {
      if (isMounted.current) {
        toast.error('Error in posting review');
        console.log('error-in-post-review', error);
      }
    }
  };

  const getAllReview = async (caller) => {
    try {
      const convertedPrincipal = Principal.fromText(principal);
      await caller.get_review(convertedPrincipal).then((result) => {
        if (isMounted.current) {
          console.log('review from api', result);
          if (result) {
            const fetchedReviews = result?.Ok || [];
            setReviews(fetchedReviews);
            setIsLoading(false);
            setReviewsLoading(false);

            const hasRated = fetchedReviews.some(
              (review) =>
                review.reviewer_principal.toString() === principal.toString()
            );
            setCurrentUserHasRated(hasRated);
          } else {
            setReviews([]);
            setIsLoading(false);
            setReviewsLoading(false);
            setCurrentUserHasRated(false);
          }
        }
      });
    } catch (error) {
      if (isMounted.current) {
        setReviews([]);
        setIsLoading(false);
        setReviewsLoading(false);
        setCurrentUserHasRated(false);
        console.log('error-in-get-all-user', error);
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

  // Display the profile skeleton while data is loading
  // if (currentUserHasRated===null) {
  //   return <RatingPageProfileSkeleton />;
  // }
  const updateNumSkeletons = () => {
    if (window.innerWidth >= 1100) {
      setNumSkeletons(3);
    } else if (window.innerWidth >= 768) {
      setNumSkeletons(2);
    } else {
      setNumSkeletons(1);
    }
  };

  useEffect(() => {
    updateNumSkeletons();
    window.addEventListener("resize", updateNumSkeletons);
    return () => {
      window.removeEventListener("resize", updateNumSkeletons);
    };
  }, []);

  const userPic =
    userFullData?.profile_picture && userFullData?.profile_picture[0]
      ? uint8ArrayToBase64(userFullData?.profile_picture[0])
      : 'userpic';

  return (
    <div className='p-3 sm0:p-6'>
      {/* User Profile Section */}
      <div className='flex flex-col mt-6 items-center'>
        {isLoading ? (
          <ProfileSkeleton />
        ) : isLoading && currentUserHasRated===null ? <RatingPageProfileSkeleton/>: (
          <>
          <img
            src={userFullData?.profile_picture[0]}
            alt='Profile'
            className='rounded-full w-16 h-16 sm:w-16 sm:h-16 md:w-28 md:h-28 mb-4'
            loading='lazy'
            draggable={false}
          />
          <h2 className='line-clamp-1 break-all sm3:text-2xl font-bold'>
          {userFullData.full_name}{' '}
        </h2>
        <p className='line-clamp-1 break-all text-gray-500'>
          {userFullData.openchat_username}
        </p>
        {/* Rating Section */}
        {!currentUserHasRated && (
          <button className='flex gap-2 my-5'>
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                onClick={() => handleRating(index)}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill={index < rating ? 'yellow' : 'none'}
                className={`sm0:w-8 sm0:h-8 w-6 h-6 cursor-pointer ${
                  index < rating ? 'text-rgb(253,177,34)' : 'text-gray-300'
                }`}
                stroke={index < rating ? 'rgb(253,177,34)' : 'currentColor'}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
                />
              </svg>
            ))}
          </button>
        )}
        </>
        )}

        {/* Review Form */}
        {showReview && (
          <form onSubmit={handleSubmit(onSubmit)} className='w-full mt-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Enter Review
            </label>
            <textarea
              {...register('review')}
              className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.review ? 'border-red-500' : 'border-gray-300'
              }`}
              rows='4'
              placeholder='Write your review here...'
            ></textarea>
            {errors.review && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.review.message}
              </p>
            )}
            <div className='flex items-center justify-center mb-4 '>
              <button
                disabled={isSubmitting}
                type='submit'
                className='bg-blue-600 text-white py-2 px-4 rounded'
              >
                {isSubmitting ? (
                  <ThreeDots
                    visible={true}
                    height='35'
                    width='35'
                    color='#FFFEFF'
                    radius='9'
                    ariaLabel='three-dots-loading'
                  />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews Section */}
      <hr className='mt-4' />

      {/* Loading Skeleton for Reviews */}
      {reviewsLoading ? (
         
        <ReviewSkeleton count={numSkeletons} />
      ) : (
        reviews.map((review, indx) => {
          const profilepic =
            review?.profile_pic && review?.profile_pic
              ? uint8ArrayToBase64(review?.profile_pic)
              : 'pic';
          return (
            <div
              key={indx}
              className='bg-gray-100 rounded-lg p-2 sm0:p-4 flex mt-4 flex-col gap-4'
            >
              <div className='flex flex-col sm0:flex-row justify-center sm0:justify-normal items-center sm0:items-start gap-2 sm0:gap-4 flex-shrink-0'>
                <img
                  src={profilepic}
                  alt='pic'
                  className='rounded-full w-8 h-8 xxs:w-12 xxs:h-12 sm0:w-12 sm0:h-12 sm:w-16 sm:h-16 object-cover border border-gray-300'
                  loading='lazy'
                  draggable={false}
                />
                <div className='flex-grow'>
                  <h2 className='text-base font-semibold text-gray-800 mb-1'>
                    {review.name}
                  </h2>
                  <div className='flex gap-1 mb-2'>
                    {[...Array(Math.floor(review.rating))].map((_, index) => (
                      <svg
                        key={index}
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        className='w-4 h-4 text-yellow-400'
                        fill='currentColor'
                      >
                        <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                      </svg>
                    ))}
                    {review.rating % 1 !== 0 && (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        className='w-4 h-4 text-yellow-400'
                        fill='currentColor'
                      >
                        <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                      </svg>
                    )}
                    {[...Array(5 - Math.ceil(review.rating))].map(
                      (_, index) => (
                        <svg
                          key={index}
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          className='xxs:w-4 xxs:h-4 w-4 h-4 text-gray-400'
                          fill='currentColor'
                        >
                          <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                        </svg>
                      )
                    )}
                  </div>

                  <div className='text-gray-600 text-xs'>
                    <p className='text-xs sm0:text-sm font-normal break-all line-clamp-2'>
                      {review.message}
                    </p>
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

export default RatingPage;
