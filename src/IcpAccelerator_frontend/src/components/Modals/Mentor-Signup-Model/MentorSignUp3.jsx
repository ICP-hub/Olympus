import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useFormContext } from 'react-hook-form';
import { useSelector } from "react-redux";
const MentorSignup3 = () => {
  const { register, formState: { errors }, watch, setValue, clearErrors, setError } = useFormContext();
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);
  // React.useEffect(() => {
  //   getAllIcpHubs();
  // }, [getAllIcpHubs]);
 // Mentor form states
  // Mentor from states
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
    []
  );
 useEffect(() => {
  if (multiChainNames) {
    setMultiChainOptions(
      multiChainNames.map((chain) => ({
        value: chain,
        label: chain,
      }))
    );
  } else {
    setMultiChainOptions([]);
  }
}, [multiChainNames]);

const [
  categoryOfMentoringServiceOptions,
  setCategoryOfMentoringServiceOptions,
] = useState([
  { value: "Incubation", label: "Incubation" },
  { value: "Tokenomics", label: "Tokenomics" },
  { value: "Branding", label: "Branding" },
  { value: "Listing", label: "Listing" },
  { value: "Raise", label: "Raise" },
]);
const [
  categoryOfMentoringServiceSelectedOptions,
  setCategoryOfMentoringServiceSelectedOptions,
] = useState([]);

const setCategoryOfMentoringServiceSelectedOptionsHandler = (val) => {
  setCategoryOfMentoringServiceSelectedOptions(
    val
      ? val.split(", ").map((reason) => ({ value: reason, label: reason }))
      : []
  );
};
  return (
   <>
       
          <div className="mb-2">
            <label className="block mb-1">Preferred ICP Hub you would like to be associated with *</label>
            <select
                    {...register("preferred_icp_hub")}
                    className={`bg-gray-50 border-2 ${
                      errors.preferred_icp_hub
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      Select your ICP Hub
                    </option>
                    {getAllIcpHubs?.map((hub) => (
                      <option
                        key={hub.id}
                        value={`${hub.name} ,${hub.region}`}
                        className="text-lg font-bold"
                      >
                        {hub.name}, {hub.region}
                      </option>
                    ))}
                  </select>
                  {errors.preferred_icp_hub && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.preferred_icp_hub.message}
                    </p>
                  )}
          </div>
          <div className="mb-2">
            <label className="block mb-1">
              Do you mentor multiple ecosystems *
            </label>
            <select
                    {...register("multi_chain")}
                    className={`bg-gray-50 border-2 ${
                      errors.multi_chain ? "border-red-500" : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="false">
                      No
                    </option>
                    <option className="text-lg font-bold" value="true">
                      Yes
                    </option>
                  </select>
                  {errors.multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.multi_chain.message}
                    </p>
                  )}
          </div>
          {watch("multi_chain") === "true" ? (
                  <div className="relative z-0 group mb-6">
                    <label
                      htmlFor="multi_chain_names"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Please select the chains{" "}
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
                          border: errors.multi_chain_names
                            ? "2px solid #ef4444"
                            : "2px solid #737373",
                          backgroundColor: "rgb(249 250 251)",
                          "&::placeholder": {
                            color: errors.multi_chain_names
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
                          color: errors.multi_chain_names
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
                          setValue(
                            "multi_chain_names",
                            selectedOptions
                              .map((option) => option.value)
                              .join(", "),
                            { shouldValidate: true }
                          );
                        } else {
                          setMultiChainSelectedOptions([]);
                          setValue("multi_chain_names", "", {
                            shouldValidate: true,
                          });
                          setError("multi_chain_names", {
                            type: "required",
                            message: "Atleast one chain name required",
                          });
                        }
                      }}
                    />
                    {errors.multi_chain_names && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.multi_chain_names.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <></>
                )}
          <div className="mb-2">
            <label className="block mb-1">
              Categories of mentoring services *
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
                        border: errors.category_of_mentoring_service
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        "&::placeholder": {
                          color: errors.category_of_mentoring_service
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
                        color: errors.category_of_mentoring_service
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
                    value={categoryOfMentoringServiceSelectedOptions}
                    options={categoryOfMentoringServiceOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select a service"
                    name="category_of_mentoring_service"
                    onChange={(selectedOptions) => {
                      if (selectedOptions && selectedOptions.length > 0) {
                        setCategoryOfMentoringServiceSelectedOptions(
                          selectedOptions
                        );
                        clearErrors("category_of_mentoring_service");
                        setValue(
                          "category_of_mentoring_service",
                          selectedOptions
                            .map((option) => option.value)
                            .join(", "),
                          { shouldValidate: true }
                        );
                      } else {
                        setCategoryOfMentoringServiceSelectedOptions([]);
                        setValue("category_of_mentoring_service", "", {
                          shouldValidate: true,
                        });
                        setError("category_of_mentoring_service", {
                          type: "required",
                          message: "Atleast one service name required",
                        });
                      }
                    }}
                  />
                  {errors.category_of_mentoring_service && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.category_of_mentoring_service.message}
                    </p>
                  )}
          </div>
          <Toaster />
        </>
  );
};

export default MentorSignup3;
