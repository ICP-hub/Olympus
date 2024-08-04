import React from "react";
import ReactSelect from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useFormContext } from 'react-hook-form';
import { useCountries } from "react-countries";

const MentorSignup2 = ({
  interestedDomainsOptions,
  interestedDomainsSelectedOptions,
  setInterestedDomainsSelectedOptions,
  clearErrors,
  setValue,
  setError,
  typeOfProfileOptions,
  reasonOfJoiningOptions,
  reasonOfJoiningSelectedOptions,
  setReasonOfJoiningSelectedOptions
}) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const { countries } = useCountries();

  return (
    <>
      <div className="mb-2">
        <label className="block mb-1">Bio (50 words)</label>
        <textarea
          {...register("bio")}
          className={`bg-gray-50 border-2 ${
            errors?.bio ? "border-red-500" : "border-[#737373]"
          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your bio"
          rows={3}
        ></textarea>
        {errors?.bio && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.bio?.message}
          </span>
        )}
      </div>

      <div className="mb-2">
        <label className="block mb-1">Country *</label>
        <select
          {...register("country")}
          className={`bg-gray-50 border-2 ${
            errors.country ? "border-red-500" : "border-[#737373]"
          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="">
            Select your country
          </option>
          {countries?.map((country) => (
            <option
              key={country.name}
              value={country.name}
              className="text-lg font-bold"
            >
              {country.name}
            </option>
          ))}
        </select>
        {errors?.country && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.country?.message}
          </span>
        )}
      </div>

      <div className="mb-2">
        <label className="block mb-1">
          Domains you are interested in *
        </label>
        <ReactSelect
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided) => ({
              ...provided,
              borderRadius: "8px",
              border: errors.domains_interested_in
                ? "2px solid #ef4444"
                : "2px solid #737373",
              backgroundColor: "rgb(249 250 251)",
              "&::placeholder": {
                color: errors.domains_interested_in
                  ? "#ef4444"
                  : "currentColor",
              },
            }),
            valueContainer: (provided) => ({
              ...provided,
              overflow: "scroll",
              maxHeight: "40px",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: errors.domains_interested_in
                ? "#ef4444"
                : "rgb(107 114 128)",
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
            }),
          }}
          value={interestedDomainsSelectedOptions}
          options={interestedDomainsOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select domains you are interested in"
          name="domains_interested_in"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setInterestedDomainsSelectedOptions(selectedOptions);
              clearErrors("domains_interested_in");
              setValue(
                "domains_interested_in",
                selectedOptions
                  .map((option) => option.value)
                  .join(", "),
                { shouldValidate: true }
              );
            } else {
              setInterestedDomainsSelectedOptions([]);
              setValue("domains_interested_in", "", {
                shouldValidate: true,
              });
              setError("domains_interested_in", {
                type: "required",
                message: "Selecting an interest is required",
              });
            }
          }}
        />
        {errors.domains_interested_in && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.domains_interested_in.message}
          </span>
        )}
      </div>

      <div className="mb-2">
        <label className="block mb-1">Type of profile *</label>
        <select
          {...register("type_of_profile")}
          className={`bg-gray-50 border-2 ${
            errors.type_of_profile
              ? "border-red-500"
              : "border-[#737373]"
          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="">
            Select profile type
          </option>
          {typeOfProfileOptions &&
            typeOfProfileOptions.map((option, index) => (
              <option
                className="text-lg font-bold"
                key={index}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
        </select>
        {errors.type_of_profile && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.type_of_profile.message}
          </p>
        )}
      </div>

      <div className="mb-2">
        <label className="block mb-1">
          Why do you want to join this platform? *
        </label>
        <ReactSelect
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided) => ({
              ...provided,
              borderRadius: "8px",
              border: errors.reasons_to_join_platform
                ? "2px solid #ef4444"
                : "2px solid #737373",
              backgroundColor: "rgb(249 250 251)",
              "&::placeholder": {
                color: errors.reasons_to_join_platform
                  ? "#ef4444"
                  : "currentColor",
              },
            }),
            valueContainer: (provided) => ({
              ...provided,
              overflow: "scroll",
              maxHeight: "40px",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: errors.reasons_to_join_platform
                ? "#ef4444"
                : "rgb(107 114 128)",
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
            }),
          }}
          value={reasonOfJoiningSelectedOptions}
          options={reasonOfJoiningOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select your reasons to join this platform"
          name="reasons_to_join_platform"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setReasonOfJoiningSelectedOptions(selectedOptions);
              clearErrors("reasons_to_join_platform");
              setValue(
                "reasons_to_join_platform",
                selectedOptions
                  .map((option) => option.value)
                  .join(", "),
                { shouldValidate: true }
              );
            } else {
              setReasonOfJoiningSelectedOptions([]);
              setValue("reasons_to_join_platform", "", {
                shouldValidate: true,
              });
              setError("reasons_to_join_platform", {
                type: "required",
                message: "Selecting a reason is required",
              });
            }
          }}
        />
        {errors.reasons_to_join_platform && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.reasons_to_join_platform.message}
          </span>
        )}
      </div>

      <Toaster />
    </>
  );
};

export default MentorSignup2;
