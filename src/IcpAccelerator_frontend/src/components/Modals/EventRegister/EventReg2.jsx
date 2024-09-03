import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { formFields2 } from "./EventFormData";
import { useCountries } from "react-countries";
import { useFormContext } from "react-hook-form";

const EventReg2 = ({ formData, singleEventData }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger, // Import the trigger method
  } = useFormContext();
  const { countries } = useCountries();
  const [inputType, setInputType] = useState("date");
  const [selectCountry, setSelectCountry] = useState("");
  const [selectArea, setSelectArea] = useState("");

  // Watch the value of the 'area' field
  const selectedArea = watch("area");

  useEffect(() => {
    if (formData || singleEventData) {
      const areaValue = singleEventData?.country ? "country" : "Global";
      setValue("area", areaValue);
      setSelectArea(areaValue);

      const countryValue = singleEventData?.country || "";
      setValue("country", countryValue);
      setSelectCountry(countryValue);
    }
  }, [formData, singleEventData, setValue]);

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

  const handleAreaChange = async (e) => {
    const areaValue = e.target.value;
    setSelectArea(areaValue);
    setValue("area", areaValue);

    if (areaValue === "Global") {
      setSelectCountry("");
      setValue("country", "");
    }

    // Trigger validation for the country field when the area field changes
    if (areaValue === "country") {
      await trigger("country");
    }
  };

  const handleCountryChange = async(e) => {
    const countryValue = e.target.value;
    setSelectCountry(countryValue);
    setValue("country", countryValue);

    // Trigger validation when the country field changes
    await trigger("country");
  };

  return (
    <>
      <div className="mb-2">
        {formFields2?.map((field) => (
          <div key={field.id} className="relative z-0 group mb-2">
            <label htmlFor={field.id} className="text-sm font-medium mb-1 flex">
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
                {...register(field.name, { required: `${field.label} is required` })}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${
                    errors[field.name]
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
                {...register(field.name, { required: `${field.label} is required` })}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${
                    errors[field.name]
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
        <label htmlFor="area" className="block text-sm font-medium mb-1">
          Select area 
        </label>
        <select
          name="area"
          id="area"
          {...register("area")}
          onChange={handleAreaChange}
          value={selectArea}
          className={`border border-[#CDD5DF] rounded-md shadow-sm 
        ${
          errors?.area ? "border-red-500 " : "border-[#737373]"
        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option value="">Select Area</option>
          <option value="Global">Global</option>
          <option value="country">Country</option>
        </select>
        {errors.area && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.area.message}
          </span>
        )}
      </div>
      {selectedArea === "country" && (
        <div className="relative z-0 group mb-6">
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Select Country 
          </label>
          <select
            name="country"
            id="country"
            {...register("country")}
            onChange={handleCountryChange}
            value={selectCountry}
            className={`bg-gray-50 border-2 ${
              errors.country ? "border-red-500" : "border-[#737373]"
            } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
          {errors.country && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors.country.message}
            </span>
          )}
        </div>
      )}

      <Toaster />
    </>
  );
};

export default EventReg2;
