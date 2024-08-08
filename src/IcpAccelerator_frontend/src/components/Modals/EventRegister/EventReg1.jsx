import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { formFields1 } from "./EventFormData1";
import { useFormContext } from "react-hook-form";
const EventReg1 = () => {
    const { register, formState: { errors }, watch, setValue, clearErrors, setError, getValues } = useFormContext();
    const [inputType, setInputType] = useState("date");
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
      <h1 className="text-3xl text-[#121926] font-bold mb-3">
        Create a Event
      </h1>
      <div className="mb-2">
        {formFields1?.map((field) => (
          <div key={field.id} className="relative z-0 group mb-6">
            <label
              htmlFor={field.id}
              className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
            >
              {field.label}{" "}
              <span
                className={`${
                  field.label === "Eligibility Cirteria" ? "hidden" : "flex"
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
                className={`bg-gray-50 border-2 ${
                  errors[field.name]
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                className={`bg-gray-50 border-2 ${
                  errors[field.name]
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
    
     
     
      <Toaster />
    </>
  );
};

export default EventReg1;