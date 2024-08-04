import React from "react";
import { useFormContext } from "react-hook-form";

const RegisterForm2 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className="overflow-y-auto">
        <div className="mb-6">

          <h1 className="text-4xl font-bold  text-[#121926]">
s your email?
          </h1>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3">
            <label
              htmlFor="email"
              className=" font-semibold block text-[#121926]"
            >
              Email <span className="text-[#155EEF]">*</span>
            </label>

            <input
              type="email"
              {...register("email")}
              className={`bg-gray-50 border-2 

                                                ${errors?.email
                  ? "border-red-500"
                  : "border-[#737373]"
                } mt-1 p-2 border border-gray-300 rounded w-full`}

              placeholder="Enter your email"
            />
            {errors?.email && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.email?.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default RegisterForm2;
