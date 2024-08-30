import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import Select from "react-select";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

// MENTOR SIGNUP FORM COMPONENT
const MentorSignup1 = ({ formData }) => {
  // USE FORM CONTEXT HOOK FOR FORM MANAGEMENT AND VALIDATION
  const { register, formState: { errors }, watch, setValue, clearErrors, setError, getValues } = useFormContext();

  // RETRIEVE ICP HUBS AND CHAIN NAMES FROM REDUX STORE
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);

  // STATE MANAGEMENT FOR MULTICHAIN OPTIONS AND SELECTED VALUES
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState([]);

  // STATIC CATEGORY OPTIONS FOR MENTORING SERVICES
  const [categoryOfMentoringServiceOptions] = useState([
    { value: "Incubation", label: "Incubation" },
    { value: "Tokenomics", label: "Tokenomics" },
    { value: "Branding", label: "Branding" },
    { value: "Listing", label: "Listing" },
    { value: "Raise", label: "Raise" },
  ]);
  const [categoryOfMentoringServiceSelectedOptions, setCategoryOfMentoringServiceSelectedOptions] = useState([]);

  // HANDLER TO SET SELECTED CATEGORIES OF MENTORING SERVICES
  const setCategoryOfMentoringServiceSelectedOptionsHandler = (val) => {
    setCategoryOfMentoringServiceSelectedOptions(
      val ? val.split(", ").map((reason) => ({ value: reason, label: reason })) : []
    );
  };

  // HANDLER TO SET SELECTED MULTICHAIN OPTIONS
  const setMultiChainSelectedOptionsHandler = (val) => {
    setMultiChainSelectedOptions(
      val ? val.split(", ").map((chain) => ({ value: chain, label: chain })) : []
    );
  };

  // EFFECT TO POPULATE MULTICHAIN OPTIONS FROM REDUX STORE
  useEffect(() => {
    if (multiChainNames) {
      setMultiChainOptions(multiChainNames.map((chain) => ({ value: chain, label: chain })));
    } else {
      setMultiChainOptions([]);
    }
  }, [multiChainNames]);

  // RETRIEVE MENTOR DATA FROM REDUX STORE
  const mentorFullData = useSelector((currState) => currState.mentorData.data[0]);

  // EFFECT TO SET FORM VALUES BASED ON PASSED FORM DATA
  useEffect(() => {
    if (formData) {
      setMentorValuesHandler(formData);
    }
  }, [formData]);

  // HANDLER TO SET FORM VALUES FOR MENTOR SIGNUP FORM
  const setMentorValuesHandler = (val) => {
    console.log('val',val)
    if (val) {
      setValue("category_of_mentoring_service", val.category_of_mentoring_service ?? "");
      setCategoryOfMentoringServiceSelectedOptionsHandler(val.category_of_mentoring_service ?? null);
      setValue("multi_chain", val.multi_chain === true || val.multi_chain === 'true' ? 'true' : 'false');
      setValue("multi_chain_names", val.multi_chain_names ? val.multi_chain_names : "");
      setMultiChainSelectedOptionsHandler(val.multi_chain_names ?? null);
    }
  };

  // FORM RENDERING LOGIC
  return (
    <>
      <h1 className="text-3xl text-[#121926] font-bold mb-3">Create a Mentor</h1>

      {/* ICP HUB SELECTION */}
      <div className="mb-2">
        <label className="block mb-1">
          Preferred ICP Hub you would like to be associated with <span className="text-red-500">*</span>
        </label>
        <select
          {...register("preferred_icp_hub")}
          className={`bg-gray-50 border rounded-md shadow-sm ${
            errors.preferred_icp_hub ? "border-red-500 " : " border-[#CDD5DF] "
          } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="">
            Select your ICP Hub
          </option>
          {getAllIcpHubs?.map((hub) => (
            <option key={hub.id} value={`${hub.name} ,${hub.region}`} className="text-lg font-bold">
              {hub.name}, {hub.region}
            </option>
          ))}
        </select>
        {errors.preferred_icp_hub && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">{errors.preferred_icp_hub.message}</p>
        )}
      </div>

      {/* MULTICHAIN MENTORING SELECTION */}
      <div className="mb-2">
        <label className="block mb-1">
          Do you mentor multiple ecosystems <span className="text-red-500">*</span>
        </label>
        <select
          {...register("multi_chain")}
          onChange={(e) => {
            const value = e.target.value === "true" ? "true" : "false";
            setValue("multi_chain", value);
          }}
          className={`bg-gray-50 border rounded-md shadow-sm ${
            errors.multi_chain ? "border-red-500" : "border-[#CDD5DF]"
          } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="false">
            No
          </option>
          <option className="text-lg font-bold" value="true">
            Yes
          </option>
        </select>
        {errors.multi_chain && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">{errors.multi_chain.message}</p>
        )}
      </div>

      {/* CHAIN SELECTION FOR MULTICHAIN MENTORING */}
      {watch("multi_chain") === "true" && (
        <div className="relative z-0 group mb-2">
          <label
            htmlFor="multi_chain_names"
            className="block mb-1"
          >
            Please select the chains <span className="text-red-500">*</span>
          </label>
          <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (provided) => ({
                ...provided,
                paddingBlock: "2px",
                borderRadius: "8px",
                border: errors.multi_chain_names ? "1px solid #ef4444" : "1px solid #CDD5DF",
                backgroundColor: "rgb(249 250 251)",
                display: "flex",
                overflowX: "auto",
                maxHeight: "43px",
                "&::-webkit-scrollbar": { display: "none" },
              }),
              valueContainer: (provided) => ({
                ...provided,
                overflow: "scroll",
                maxHeight: "40px",
                scrollbarWidth: "none",
              }),
              placeholder: (provided) => ({
                ...provided,
                color: errors.multi_chain_names ? "#ef4444" : "rgb(107 114 128)",
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
            value={multiChainSelectedOptions}
            options={multiChainOptions}
            classNamePrefix="select"
            className="basic-multi-select w-full text-start"
            placeholder="Select a chain"
            name="multi_chain_names"
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setMultiChainSelectedOptions(selectedOptions);
                clearErrors("multi_chain_names");
                setValue("multi_chain_names", selectedOptions.map((option) => option.value).join(", "), {
                  shouldValidate: true,
                });
              } else {
                setMultiChainSelectedOptions([]);
                setValue("multi_chain_names", "", { shouldValidate: true });
                setError("multi_chain_names", {
                  type: "required",
                  message: "At least one chain name required",
                });
              }
            }}
          />
          {errors.multi_chain_names && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">{errors.multi_chain_names.message}</p>
          )}
        </div>
      )}

      {/* CATEGORY OF MENTORING SERVICES SELECTION */}
      <div className="mb-2">
        <label className="block mb-1">
          Categories of mentoring services <span className="text-red-500">*</span>
        </label>
        <ReactSelect
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided) => ({
              ...provided,
              paddingBlock: "2px",
              borderRadius: "8px",
              border: errors.category_of_mentoring_service ? "1px solid #ef4444" : "1px solid #CDD5DF",
              backgroundColor: "rgb(249 250 251)",
              display: "flex",
              overflowX: "auto",
              maxHeight: "43px",
              "&::-webkit-scrollbar": { display: "none" },
            }),
            valueContainer: (provided) => ({
              ...provided,
              overflow: "scroll",
              maxHeight: "40px",
              scrollbarWidth: "none",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: errors.category_of_mentoring_service ? "#ef4444" : "rgb(107 114 128)",
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
          value={categoryOfMentoringServiceSelectedOptions}
          options={categoryOfMentoringServiceOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select a service"
          name="category_of_mentoring_service"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setCategoryOfMentoringServiceSelectedOptions(selectedOptions);
              clearErrors("category_of_mentoring_service");
              setValue(
                "category_of_mentoring_service",
                selectedOptions.map((option) => option.value).join(", "),
                { shouldValidate: true }
              );
            } else {
              setCategoryOfMentoringServiceSelectedOptions([]);
              setValue("category_of_mentoring_service", "", { shouldValidate: true });
              setError("category_of_mentoring_service", {
                type: "required",
                message: "At least one service name required",
              });
            }
          }}
        />
        {errors.category_of_mentoring_service && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">{errors.category_of_mentoring_service.message}</p>
        )}
      </div>

      {/* TOASTER FOR NOTIFICATIONS */}
      <Toaster />
    </>
  );
};

export default MentorSignup1;
