import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";

import { useSelector } from "react-redux";
import { LanguageIcon } from "../../UserRegistration/DefaultLink";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaMedium,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
const EventReg3 = ({formData}) => {
  console.log('formData',formData)

  const { register, formState: { errors }, setValue, clearErrors, setError, control } = useFormContext();
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  // USE useFieldArray HOOK FOR DYNAMICALLY ADDING/REMOVING LINKS
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contact_links",
  });

  // FUNCTION TO DETERMINE AND RETURN THE APPROPRIATE LOGO BASED ON THE URL
  const getLogo = (url) => {
    try {
      const domain = new URL(url).hostname.split(".").slice(-2).join(".");
      const size = "size-8";
      const icons = {
        "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
        "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
        "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
        "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
        "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
        "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
        "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
        "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
        "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
        "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
        "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
        "medium.com": <FaMedium className={`text-black ${size}`} />,
      };
      return icons[domain] || <LanguageIcon />;
    } catch (error) {
      return <LanguageIcon />;
    }
  };

  const [rubricEligibilityOptions, setRubricEligibilityOptions] = useState([
    {
      value: "1",
      label: "One (1)",
    },
    {
      value: "2",
      label: "Two (2)",
    },
    {
      value: "3",
      label: "Three (3)",
    },
    {
      value: "4",
      label: "Four (4)",
    },
    {
      value: "5",
      label: "Five (5)",
    },
    {
      value: "6",
      label: "Six (6)",
    },
    {
      value: "7",
      label: "Seven (7)",
    },
    {
      value: "8",
      label: "Eight (8)",
    },
    {
      value: "9",
      label: "Nine (9)",
    },
  ]);
  const [
    rubricEligibilitySelectedOptions,
    setRubricEligibilitySelectedOptions,
  ] = useState([]);

  const [interestedFundingTypeOptions, setInterestedFundingTypeOptions] =
    useState([
      {
        value: "Grants",
        label: "Grants",
      },
      { value: "Investments", label: "Investments" },
    ]);
  const [
    interestedFundingTypeSelectedOptions,
    setInterestedFundingTypeSelectedOptions,
  ] = useState([]);


  useEffect(() => {
    if (areaOfExpertise) {
      setInterestedDomainsOptions(
        areaOfExpertise.map((expert) => ({
          value: expert.name,
          label: expert.name,
        }))
      );
    } else {
      setInterestedDomainsOptions([]);
    }
  }, [areaOfExpertise]);

  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);

  useEffect(() => {
    if (formData) {
        setCohorttValuesHandler(formData);
    }
}, [formData]);

// FUNCTION TO SET INITIAL FORM VALUES BASED ON PROVIDED formData
const setCohorttValuesHandler = (val) => {
    console.log('val', val);
    if (val) {
        setValue("rubric_eligibility", val?.rubric_eligibility ? val?.rubric_eligibility : "");
        setValue("tags", val?.tags ? val?.tags : "");
        setValue("funding_type", val?.funding_type ? val?.funding_type : "");
        setInterestedDomainSelectedOptionsHandler(val.tags ?? null);
        setInterestedFundingTypeSelectedOptionsHandler(val.funding_type ?? null);
        setRubricEligibilitySelectedOptionsHandler(val.rubric_eligibility ?? null);
        
    }
};
const setInterestedDomainSelectedOptionsHandler = (val) => {
  setInterestedDomainsSelectedOptions(
      val ? val.split(", ").map((chain) => ({ value: chain, label: chain })) : []
  );
};
const setInterestedFundingTypeSelectedOptionsHandler = (val) => {
  setInterestedFundingTypeSelectedOptions(
      val ? val.split(", ").map((chain) => ({ value: chain, label: chain })) : []
  );
};
const setRubricEligibilitySelectedOptionsHandler = (val) => {
  setRubricEligibilitySelectedOptions(
      val ? val.split(", ").map((chain) => ({ value: chain, label: chain })) : []
  );
};

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

      <div className="mb-2">
        <label
          htmlFor="rubric_eligibility"
          className="block text-sm font-medium mb-1"
        >
          Level on rubric required for eligibility{" "}
          <span className="text-red-500">*</span>
        </label>
        <ReactSelect
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided, state) => ({
              ...provided,
              paddingBlock: "2px",
              borderRadius: "8px",
              border: errors.rubric_eligibility
                ? "1px solid #ef4444"
                : "1px solid #737373",
              backgroundColor: "rgb(249 250 251)",
              "&::placeholder": {
                color: errors.rubric_eligibility
                  ? "#ef4444"
                  : "currentColor",
              },
              display: "flex",
              overflowX: "auto",
              maxHeight: "43px",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              overflow: "scroll",
              maxHeight: "40px",
              scrollbarWidth: "none",
            }),
            placeholder: (provided, state) => ({
              ...provided,
              color: errors.rubric_eligibility
                ? "#ef4444"
                : "rgb(107 114 128)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "white",
              border: "2px solid #CDD5DF",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
            }),
          }}
          value={rubricEligibilitySelectedOptions}
          options={rubricEligibilityOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select a tag"
          name="rubric_eligibility"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setRubricEligibilitySelectedOptions(selectedOptions);
              clearErrors("rubric_eligibility");
              setValue(
                "rubric_eligibility",
                selectedOptions
                  .map((option) => option.value)
                  .join(", "),
                { shouldValidate: true }
              );
            } else {
              setRubricEligibilitySelectedOptions([]);
              setValue("rubric_eligibility", "", {
                shouldValidate: true,
              });
              setError("rubric_eligibility", {
                type: "required",
                message: "Selecting a rubric eligibility is required",
              });
            }
          }}
        />
        {errors.rubric_eligibility && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.rubric_eligibility.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label
          htmlFor="tags"
          className="block text-sm font-medium mb-1"
        >
          Tags <span className="text-red-500">*</span>
        </label>
        <ReactSelect
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided, state) => ({
              ...provided,
              paddingBlock: "2px",
              borderRadius: "8px",
              border: errors.tags
                ? "1px solid #ef4444"
                : "1px solid #737373",
              backgroundColor: "rgb(249 250 251)",
              "&::placeholder": {
                color: errors.tags ? "#ef4444" : "currentColor",
              },
              display: "flex",
              overflowX: "auto",
              maxHeight: "43px",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              overflow: "scroll",
              maxHeight: "40px",
              scrollbarWidth: "none",
            }),
            placeholder: (provided, state) => ({
              ...provided,
              color: errors.tags ? "#ef4444" : "rgb(107 114 128)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "white",
              border: "2px solid #CDD5DF",
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
          placeholder="Select a tag"
          name="tags"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setInterestedDomainsSelectedOptions(selectedOptions);
              clearErrors("tags");
              setValue(
                "tags",
                selectedOptions
                  .map((option) => option.value)
                  .join(", "),
                { shouldValidate: true }
              );
            } else {
              setInterestedDomainsSelectedOptions([]);
              setValue("tags", "", { shouldValidate: true });
              setError("tags", {
                type: "required",
                message: "Selecting a tag is required",
              });
            }
          }}
        />
        {errors.tags && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.tags.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label
          htmlFor="funding_type"
          className="block text-sm font-medium mb-1"
        >
          Funding type <span className="text-red-500">*</span>
        </label>
        <ReactSelect
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided, state) => ({
              ...provided,
              paddingBlock: "2px",
              borderRadius: "8px",
              border: errors.funding_type
                ? "1px solid #ef4444"
                : "1px solid #737373",
              backgroundColor: "rgb(249 250 251)",
              "&::placeholder": {
                color: errors.funding_type
                  ? "#ef4444"
                  : "currentColor",
              },
              display: "flex",
              overflowX: "auto",
              maxHeight: "43px",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              overflow: "scroll",
              maxHeight: "40px",
              scrollbarWidth: "none",
            }),
            placeholder: (provided, state) => ({
              ...provided,
              color: errors.funding_type
                ? "#ef4444"
                : "rgb(107 114 128)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "white",
              border: "2px solid #CDD5DF",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
            }),
          }}
          value={interestedFundingTypeSelectedOptions}
          options={interestedFundingTypeOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select funding type"
          name="funding_type"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setInterestedFundingTypeSelectedOptions(
                selectedOptions
              );
              clearErrors("funding_type");
              setValue(
                "funding_type",
                selectedOptions
                  .map((option) => option.value)
                  .join(", "),
                { shouldValidate: true }
              );
            } else {
              setInterestedFundingTypeSelectedOptions([]);
              setValue("funding_type", "", { shouldValidate: true });
              setError("funding_type", {
                type: "required",
                message: "Selecting a type is required",
              });
            }
          }}
        />
        {errors.funding_type && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.funding_type.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label
          htmlFor="funding_amount"
          className="block text-sm font-medium mb-1"
        >
          Select funding amount{" "}
          <span className="text-red-500">*</span>
        </label>
        <select
          name="funding_amount"
          id="funding_amount"
          {...register("funding_amount")}
          className={`bg-gray-50 border ${errors.funding_amount
            ? "border-red-500"
            : "border-[#737373]"
            } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          onFocus={() => handleFocus("funding_amount")}
          onBlur={() => handleBlur("funding_amount")}
        >
          <option className="text-lg font-bold" value="">
            Select Amount of Funding
          </option>
          <option value="1k-5k" className="text-lg font-normal">
            1k-5k
          </option>
          <option value="5k-25k" className="text-lg font-normal">
            5k-25k
          </option>
          <option value="25k- 100k" className="text-lg font-normal">
            25k-100k
          </option>
          <option value="100k+" className="text-lg font-normal">
            100k+
          </option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Links
        </label>
        <div className="relative">
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-2">
              <Controller
                name={`contact_links[${index}].link`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex items-center w-full">
                    <div className="flex items-center space-x-2 w-full">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        {field.value && getLogo(field.value)}
                      </div>
                      <input
                        {...register("contact_links")}
                        type="text"
                        placeholder="Enter your social media URL"
                        className={`p-2 border ${fieldState.error ? "border-red-500" : "border-gray-300"} rounded-md w-full`}
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ contact_links: "" })}
            className="flex items-center p-1 text-[#155EEF]"
          >
            <FaPlus className="mr-1" /> Add Another Link
          </button>
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default EventReg3;
