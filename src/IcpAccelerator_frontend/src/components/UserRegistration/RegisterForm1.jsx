
import React, { useState, useEffect } from "react";

import { useFormContext } from "react-hook-form";
import { generateUsername } from 'unique-username-generator';


const RegisterForm1 = () => {

  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const [suggestions, setSuggestions] = useState([]);
  const username = watch('openchat_user_name', '');

  useEffect(() => {
    if (username) {

      const newSuggestions = [
        generateUsername("-", 2, 10, username),
        generateUsername("@", 1, 16, username),
        generateUsername("_", 2, 20, username)
      ];
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [username]);

  const handleSuggestionClick = (suggestion) => {
    setValue("openchat_user_name", suggestion);
    setSuggestions([]);
  };

  return (
    <>
      <div className="overflow-y-auto">
        <div className="mb-6">

          <h1 className="text-4xl font-bold  text-[#121926]">

            What is your name?
          </h1>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3">
            <label
              htmlFor="full_name"
              className=" font-semibold block text-[#121926]"
            >
              Full Name <span className="text-[#155EEF]">*</span>
            </label>
            <input
              type="text"
              {...register("full_name")}

              className={`bg-gray-50 border-2 ${errors?.full_name ? "border-red-500" : "border-[#737373]"
                } mt-1 p-2 border border-gray-300 rounded w-full `}

              placeholder="Enter your full name"
            />
            {errors?.full_name && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.full_name?.message}
              </span>
            )}
          </div>
          <div>
            <label

              htmlFor="openchat_user_name"
              className="block font-semibold text-[#121926]">
              Username <span className="text-[#155EEF]">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <span className="p-2 bg-gray-100 text-gray-600">@</span>
              <input
                type="text"
                {...register("openchat_user_name")}
                className={`bg-gray-50  
                                                ${errors?.openchat_user_name
                    ? "border-red-500 "
                    : "border-[#737373]"
                  } p-2 w-full`}
                placeholder="Enter your username"
              />
            </div>
            {errors?.openchat_user_name && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.openchat_user_name?.message}
              </span>
            )}

          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="text-[#155EEF] font-bold cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RegisterForm1;
