import React, { useEffect, useState, useRef } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ProfileImage from '../../../assets/Logo/ProfileImage.png';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import toast, { Toaster } from 'react-hot-toast';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { ThreeDots } from 'react-loader-spinner';
import Rating1 from '../Modals/RatingModals/Rating1';

const RatingModal = ({
  showRating,
  setShowRatingModal,
  userRatingDetail,
  cardPrincipal,
  role,
  ratingProjectId,
}) => {
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [activeTab, setActiveTab] = useState('Review');
  const [reviews, setReviews] = useState(null);
  const [loaing, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);

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
    setRating(index + 1);
    setShowReview(true);
  };

  const onSubmit = async (data) => {
    let message = data.review;
    try {
      await actor.add_review(cardPrincipal, rating, message).then((result) => {
        if (isMounted) {
          toast.success('Review added successfully');
          setIsLoading(false);
          setShowReview(false);
          setShowRatingModal(false);
        }
      });
    } catch (error) {
      if (isMounted) {
        setIsLoading(false);
        toast.error('Review not added');
        setShowRatingModal(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getAllReview = async (caller, page) => {
    // setIsFetching(true);
    try {
      // const hard_code_principal = "2vxsx-fae";
      const covertedPrincipal = Principal.fromText(principal);
      await caller.get_review(covertedPrincipal).then((result) => {
        if (isMounted) {
          console.log('review from api', result);
          if (result) {
            // Log the exact structure of result.data to verify it
            console.log('review received:', result.Ok?.[0]);
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
        console.log('error-in-get-all-user', error);
      }
    } finally {
    }
  };
  const full_name = userRatingDetail?.full_name;
  const openchat_username = userRatingDetail?.openchat_username;
  const profilepic =
    userRatingDetail?.profile_picture && userRatingDetail?.profile_picture[0]
      ? uint8ArrayToBase64(userRatingDetail?.profile_picture[0])
      : 'userpic';

  console.log('userRatingDetail =>', userRatingDetail);
  const [isRating, setIsRating] = useState(false);
  const handleRubricRating = () => {
    setActiveTab('Rubric Rating');
    setIsRating(true);
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        showRating ? 'block' : 'hidden'
      }`}
    >
      <div className='bg-white rounded-lg overflow-hidden mx-4 shadow-lg w-[500px]'>
        <div className='flex justify-end mr-4'>
          <button
            className='text-3xl text-[#121926]'
            onClick={() => setShowRatingModal(false)}
          >
            &times;
          </button>
        </div>

        {/* Tab Content */}
        {role === 'project' ? (
          userCurrentRoleStatusActiveRole === 'mentor' ||
          userCurrentRoleStatusActiveRole === 'vc' ? (
            <>
              <div className='px-6 pb-6'>
                <div className='flex justify-start border-b'>
                  <button
                    className={`py-2 px-4 ${
                      activeTab === 'Review'
                        ? 'border-b-2 border-blue-500 font-semibold text-blue-500'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('Review')}
                  >
                    Review
                  </button>

                  <button
                    className={`py-2 px-4 ${
                      activeTab === 'Rubric Rating'
                        ? 'border-b-2 border-blue-500 font-semibold text-blue-500'
                        : 'text-gray-500'
                    }`}
                    onClick={handleRubricRating}
                  >
                    Rubric Rating
                  </button>
                </div>
                {activeTab === 'Review' && (
                  <div className='flex flex-col mt-6 gap-2 items-center'>
                    <img
                      src={profilepic}
                      alt='Profile'
                      className='rounded-full w-28 h-28 mb-4'
                      loading='lazy'
                      draggable={false}
                    />
                    <h2 className='text-2xl font-bold'>{full_name}</h2>
                    <p className='text-gray-500'>{openchat_username}</p>
                    <div className='flex gap-2 my-5'>
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          onClick={() => handleRating(index)}
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill={index < rating ? 'yellow' : 'none'}
                          className={`w-8 h-8 cursor-pointer ${
                            index < rating
                              ? 'text-rgb(253,177,34)'
                              : 'text-gray-300'
                          }`}
                          stroke={
                            index < rating ? 'rgb(253,177,34)' : 'currentColor'
                          }
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
                          />
                        </svg>
                      ))}
                    </div>

                    {showReview && (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='w-full mt-4'
                      >
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
                        <div className='flex items-center justify-center mb-4'>
                          <button
                            disabled={isSubmitting}
                            type='submit'
                            className='bg-blue-600 text-white py-2 px-4 mt-3 rounded'
                          >
                            {isSubmitting ? (
                              <ThreeDots
                                visible={true}
                                height='35'
                                width='35'
                                color='#FFFEFF'
                                radius='9'
                                ariaLabel='three-dots-loading'
                                wrapperStyle={{}}
                                wrapperClassName=''
                              />
                            ) : (
                              'Submit'
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {activeTab === 'Rubric Rating' && isRating && (
                  <Rating1
                    position={'center'}
                    projectId={ratingProjectId}
                    isRating={isRating}
                    setIsRating={setIsRating}
                    setShowRatingModal={setShowRatingModal}
                  />
                )}
              </div>
            </>
          ) : (
            <div className='p-6'>
              <div className='flex flex-col mt-6 gap-2 items-center'>
                <img
                  src={profilepic}
                  alt='Profile'
                  className='rounded-full w-28 h-28 mb-4'
                  loading='lazy'
                  draggable={false}
                />
                <h2 className='text-2xl font-bold'>{full_name}</h2>
                <p className='text-gray-500'>{openchat_username}</p>
                <div className='flex gap-2 my-5'>
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => handleRating(index)}
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill={index < rating ? 'yellow' : 'none'}
                      className={`w-8 h-8 cursor-pointer ${
                        index < rating
                          ? 'text-rgb(253,177,34)'
                          : 'text-gray-300'
                      }`}
                      stroke={
                        index < rating ? 'rgb(253,177,34)' : 'currentColor'
                      }
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
                      />
                    </svg>
                  ))}
                </div>

                {showReview && (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='w-full mt-4'
                  >
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
                    <div className='flex items-center justify-center mb-4'>
                      <button
                        disabled={isSubmitting}
                        type='submit'
                        className='bg-blue-600 text-white py-2 px-4 mt-3 rounded'
                      >
                        {isSubmitting ? (
                          <ThreeDots
                            visible={true}
                            height='35'
                            width='35'
                            color='#FFFEFF'
                            radius='9'
                            ariaLabel='three-dots-loading'
                            wrapperStyle={{}}
                            wrapperClassName=''
                          />
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )
        ) : (
          <div className='p-6'>
            <div className='flex flex-col mt-6 gap-2 items-center'>
              <img
                src={profilepic}
                alt='Profile'
                className='rounded-full w-28 h-28 mb-4'
                loading='lazy'
                draggable={false}
              />
              <h2 className='text-2xl font-bold'>{full_name}</h2>
              <p className='text-gray-500'>{openchat_username}</p>
              <div className='flex gap-2 my-5'>
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    onClick={() => handleRating(index)}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill={index < rating ? 'yellow' : 'none'}
                    className={`w-8 h-8 cursor-pointer ${
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
              </div>

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
                  <div className='flex items-center justify-center mb-4'>
                    <button
                      disabled={isSubmitting}
                      type='submit'
                      className='bg-blue-600 text-white py-2 px-4 mt-3 rounded'
                    >
                      {isSubmitting ? (
                        <ThreeDots
                          visible={true}
                          height='35'
                          width='35'
                          color='#FFFEFF'
                          radius='9'
                          ariaLabel='three-dots-loading'
                          wrapperStyle={{}}
                          wrapperClassName=''
                        />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default RatingModal;
