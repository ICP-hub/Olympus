import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useFormContext } from "react-hook-form";
const EventReg3 = () => {
    const { register, formState: { errors },  setValue, clearErrors, setError } = useFormContext();
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
  return (
    <>
     
      <div className="mb-2">
      <label
                    htmlFor="rubric_eligibility"
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
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
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
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
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
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
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
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
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
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
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
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
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Select funding amount{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="funding_amount"
                    id="funding_amount"
                    {...register("funding_amount")}
                    className={`bg-gray-50 border-2 ${
                      errors.funding_amount
                        ? "border-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    onFocus={() => handleFocus("funding_amount")}
                    onBlur={() => handleBlur("funding_amount")}
                  >
                    <option className="text-lg font-bold" value="">
                      Select Amount of Funding
                    </option>
                    <option value="1k-5k" className="text-lg font-bold">
                      1k-5k
                    </option>
                    <option value="5k-25k" className="text-lg font-bold">
                      5k-25k
                    </option>
                    <option value="25k- 100k" className="text-lg font-bold">
                      25k-100k
                    </option>
                    <option value="100k+" className="text-lg font-bold">
                      100k+
                    </option>
                  </select>
      </div>
      <div className="mb-2"></div>
      <Toaster />
    </>
  );
};

export default EventReg3;
