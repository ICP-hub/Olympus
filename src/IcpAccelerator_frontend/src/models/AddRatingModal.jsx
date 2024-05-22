import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ThreeDots } from "react-loader-spinner";

const schema = yup
  .object({
    rating: yup
      .number()
      .required("Rating is required")
      .min(0, "Rating must be at least 0")
      .max(5, "Rating must be no more than 5"),
    ratingDescription: yup.string().required("Description is required"),
  })
  .required();

const AddRatingModal = ({ onRatingClose, onSubmitHandler, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      rating: 0,
    },
  });

  const changeRating = (newRating) => {
    console.log(newRating);
    setRating(newRating);
    setValue("rating", newRating);
    if (newRating < 0 || newRating > 5) {
      setError("rating", {
        type: "custom",
        message: "Rating must be between 0 and 5",
      });
    } else {
      clearErrors("rating");
    }
  };

  useEffect(() => {
    setValue("rating", rating);
    if (rating < 0 || rating > 5) {
      setError("rating", {
        type: "custom",
        message: "Rating must be between 0 and 5",
      });
    } else {
      clearErrors("rating");
    }
  }, [rating, setValue, setError, clearErrors]);

  const ratingPercentage = (watch("rating") / 5) * 100;

  // console.log("rating", rating);
  // console.log(errors);

  const onSubmit = (data) => {
    console.log(data);
    onSubmitHandler(data);
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 ">
                Community Ratings
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                onClick={onRatingClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <div className="flex flex-row flex-wrap gap-2 items-center space-x-12">
                    <CircularProgressbar
                      value={ratingPercentage}
                      text={`${rating}/5`}
                      className="w-16 h-16 font-extrabold text-md"
                      strokeWidth={8}
                      styles={buildStyles({
                        strokeLinecap: "round",
                        pathTransitionDuration: 0.5,
                        pathColor: `#2247AF`,
                        trailColor: "#d6d6d6",
                        textColor: "#3505B2",
                      })}
                    />
                    <div className="flex items-center hover:text-blue-800 w-16 h-16">
                      {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                          <button
                            key={index}
                            className={
                              index <= rating
                                ? "text-blue-800"
                                : "text-gray-300 dark:text-gray-500"
                            }
                            onClick={() => changeRating(index)}
                          >
                            <svg
                              className="w-6 h-6 ms-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {errors.rating && (
                    <span className="mt-1 text-sm text-red-500 font-bold">
                      {errors.rating.message}
                    </span>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="ratingDescription"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  hover:whitespace-normal truncate overflow-hidden hover:text-left"
                  >
                    Comment
                  </label>
                  <textarea
                    {...register("ratingDescription")}
                    rows="4"
                    className={`bg-gray-50 border-2 ${
                      errors.ratingDescription
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Write a review"
                  ></textarea>
                  {errors.ratingDescription && (
                    <span className="mt-1 text-sm text-red-500 font-bold">
                      {errors.ratingDescription.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-[#3505B2] rounded-md mt-4 flex justify-center">
                <button
                  className="text-white font-bold items-center py-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ThreeDots
                      visible={true}
                      height="35"
                      width="35"
                      color="#FFFEFF"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperclassName=""
                    />
                  ) : (
                    "Add Rating"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRatingModal;
