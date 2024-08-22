import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { formFields2 } from "./EventFormData";
import { useCountries } from "react-countries";
import { useFormContext } from "react-hook-form";

const EventReg2 = ({ formData }) => {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const { countries } = useCountries();
  const [inputType, setInputType] = useState("date");

  // Watch the value of the 'area' field
  const selectedArea = watch("area");

  useEffect(() => {
    // Set the default value for the 'area' field when the component mounts
    setValue("area", formData.area || "");
  }, [formData.area, setValue]);

  const handleFocus = (field) => {
    if (field.onFocus) {
      setInputType(field.onFocus);
    }
  };

  const handleBlur = (field) => {
    if (field.onBlur) {
      setInputType(field.onBlur);
    }
  };

  return (
    <>
      <div className="mb-2">
        {formFields2?.map((field) => (
          <div key={field.id} className="relative z-0 group mb-2">
            <label
              htmlFor={field.id}
              className="text-sm font-medium mb-1 flex"
            >
              {field.label}{" "}
              <span
                className={`${field.label === "Eligibility Cirteria" ? "hidden" : "flex"
                  } text-red-500`}
              >
                *
              </span>
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                id={field.id}
                {...register(field.name)}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${errors[field.name]
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={field.placeholder}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
              ></textarea>
            ) : (
              <input
                type={field.id === "date_of_birth" ? inputType : field.type}
                name={field.name}
                id={field.id}
                {...register(field.name)}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${errors[field.name]
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={field.placeholder}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
              />
            )}
            {errors[field.name] && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors[field.name].message}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mb-2">
        <label
          htmlFor="area"
          className="block text-sm font-medium mb-1"
        >
          Select area <span className="text-red-500">*</span>
        </label>
        <select
          name="area"
          id="area"
          {...register("area")}
          className={`border border-[#CDD5DF] rounded-md shadow-sm 
            ${errors?.area
              ? "border-red-500 "
              : "border-[#737373]"
            } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          onFocus={() => handleFocus({ name: "area" })}
          onBlur={() => handleBlur({ name: "area" })}
        >
          <option value="">Select Area</option>
          <option value="global">Global</option>
          <option value="country">Country</option>
        </select>
      </div>
      {selectedArea === "country" ? (
        <div className="relative z-0 group mb-6">
          <label
            htmlFor="country"
            className="block text-sm font-medium mb-1"
          >
            Select Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            id="country"
            {...register("country")}
            className={`bg-gray-50 border-2 ${errors.country ? "border-red-500" : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onFocus={() => handleFocus("country")}
            onBlur={() => handleBlur("country")}
          >
            <option className="text-lg font-bold" value="">
              Select your country
            </option>
            {countries?.map((expert) => (
              <option
                key={expert.name}
                value={expert.name}
                className="text-lg font-bold"
              >
                {expert.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        ""
      )}
      <Toaster />
    </>
  );
};

export default EventReg2;
