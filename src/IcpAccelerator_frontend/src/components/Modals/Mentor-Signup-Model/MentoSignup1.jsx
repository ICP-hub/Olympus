import React from "react";
import { useFormContext } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const MentorSignup1 = ({ imagePreview, imageCreationFunc }) => {
  const { register, formState: { errors }, setValue, trigger } = useFormContext();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue('image', file);
      trigger('image');
      imageCreationFunc(file);
    }
  };

  return (
    <>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">
          Upload a Cover Photo<span className="text-[#155EEF]">*</span>
        </label>
        <div className="flex gap-2">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Cover Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              width="35"
              height="37"
              viewBox="0 0 35 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="bg-no-repeat"
            >
              <path
                d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                fill="#BBBBBB"
              />
            </svg>
          )}
          <div className="flex gap-1 items-center justify-center">
            <div className="flex gap-1">
              <label
                htmlFor="file-upload"
                className="block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded"
              >
                <ControlPointIcon
                  fontSize="small"
                  className="items-center -mt-1"
                />{" "}
                Upload
              </label>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                name="image"
                onChange={handleImageChange}
                accept=".jpg, .jpeg, .png"
              />
              <label
                htmlFor="file-upload"
                className="block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded"
              >
                <AutoAwesomeIcon fontSize="small" className="mr-2" />
                Generate Image
              </label>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                name="image"
                onChange={handleImageChange}
                accept=".jpg, .jpeg, .png"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <label className="block mb-1">Full Name *</label>
        <input
          type="text"
          {...register("full_name")}
          className={`bg-gray-50 border-2 ${errors?.full_name ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your full name"
        />
        {errors?.full_name && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.full_name?.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label className="block mb-1">Email *</label>
        <input
          type="email"
          {...register("email")}
          className={`bg-gray-50 border-2 ${errors?.email ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your email"
        />
        {errors?.email && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.email?.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label className="block mb-1">Telegram link</label>
        <input
          type="text"
          {...register("telegram_id")}
          className={`bg-gray-50 border-2 ${errors?.telegram_id ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your telegram url"
        />
        {errors?.telegram_id && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.telegram_id?.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label className="block mb-1">Twitter link</label>
        <input
          type="text"
          {...register("twitter_url")}
          className={`bg-gray-50 border-2 ${errors?.twitter_url ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your twitter url"
        />
        {errors?.twitter_url && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.twitter_url?.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label className="block mb-1">OpenChat username</label>
        <input
          type="text"
          {...register("openchat_user_name")}
          className={`bg-gray-50 border-2 ${errors?.openchat_user_name ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your openchat username"
        />
        {errors?.openchat_user_name && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.openchat_user_name?.message}
          </span>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default MentorSignup1;
