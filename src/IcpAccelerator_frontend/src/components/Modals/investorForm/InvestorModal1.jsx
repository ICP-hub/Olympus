import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import Select from "react-select";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";

const InvestorModal1 = ({ formData }) => {
  // DESTRUCTURING HOOKS AND METHODS FROM useFormContext
  const {
    register,
    clearErrors,
    watch,
    countries,
    formState: { errors },
    setValue,
    setError,
  } = useFormContext();

  // INVESTOR FORM STATES FOR SELECTED OPTIONS
  const [typeOfInvestSelectedOptions, setTypeOfInvestSelectedOptions] =
    useState([]);
  // INVESTOR FORM OPTIONS FOR TYPE OF INVESTMENT
  const [typeOfInvestOptions, setTypeOfInvestOptions] = useState([
    { value: "Direct", label: "Direct" },
    { value: "SNS", label: "SNS" },
    { value: "both", label: "both" },
  ]);

  // HANDLER TO SET SELECTED INVESTMENT TYPE OPTIONS
  const setTypeOfInvestSelectedOptionsHandler = (val) => {
    setTypeOfInvestSelectedOptions(
      val
        ? val
            .split(", ")
            .map((interest) => ({ value: interest, label: interest }))
        : []
    );
  };

  // STATE TO STORE OPTIONS FOR MULTI-CHAIN SELECTION
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  // STATE TO STORE SELECTED MULTI-CHAIN OPTIONS
  const [
    investedInMultiChainSelectedOptions,
    setInvestedInMultiChainSelectedOptions,
  ] = useState([]);
  // SELECTING MULTI-CHAIN NAMES FROM REDUX STORE
  const multiChainNames = useSelector((currState) => currState.chains.chains);

  // EFFECT TO UPDATE MULTI-CHAIN OPTIONS WHEN multiChainNames CHANGES
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

  // EFFECT TO SET INITIAL FORM VALUES IF formData EXISTS
  useEffect(() => {
    if (formData) {
      setInvestorValuesHandler(formData);
    }
  }, [formData]);

  // FUNCTION TO SET INITIAL FORM VALUES BASED ON PROVIDED formData
  const setInvestorValuesHandler = (val) => {
    console.log("val", val);
    if (val) {
      setValue(
        "existing_icp_investor",
        val?.existing_icp_investor === true || val?.existing_icp_investor === "true"
          ? "true"
          : "false"
      );
      setValue("investment_type", val.investment_type ? val?.investment_type : "");
      setValue(
        "invested_in_multi_chain",
        val?.invested_in_multi_chain === true || val?.invested_in_multi_chain === "true"
          ? "true"
          : "false"
      );
      setValue(
        "invested_in_multi_chain_names",
        val?.invested_in_multi_chain_names ? val?.invested_in_multi_chain_names : ""
      );
      setMultiChainSelectedOptionsHandler(val.invested_in_multi_chain_names ?? null);
      setTypeOfInvestSelectedOptionsHandler(val.investment_type ?? null);
    }
  };

  // FUNCTION TO SET SELECTED MULTI-CHAIN OPTIONS BASED ON PROVIDED VALUE
  const setMultiChainSelectedOptionsHandler = (val) => {
    setInvestedInMultiChainSelectedOptions(
      val
        ? val.split(", ").map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };

  return (
    <>
      {/* MODAL HEADER */}
      <h1 className="text-3xl text-[#121926] font-bold mb-3">
        Create an Investor
      </h1>

      {/* INVESTOR REGISTERED FIELD */}
      <div className="mb-2">
        <label className="block mb-1">
          Are you Registered ?<span className="text-[red] ml-1">*</span>
        </label>
        <select
          {...register("investor_registered")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option className="text-lg" value="false">
            No
          </option>
          <option className="text-lg" value="true">
            Yes
          </option>
        </select>
        {errors.investor_registered && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.investor_registered.message}
          </p>
        )}
      </div>

      {/* CONDITIONAL RENDERING OF REGISTERED COUNTRY FIELD IF INVESTOR IS REGISTERED */}
      {watch("investor_registered") === "true" && (
        <div className="mb-2">
          <label className="block mb-1">
            Registered Country<span className="text-[red]">*</span>
          </label>
          <select
            {...register("registered_country")}
            name="registered_country"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Please choose an option</option>
            {countries?.map((country) => (
              <option
                key={country.name}
                value={`${country.name}`}
                className="text-lg"
              >
                {country.name}
              </option>
            ))}
          </select>
          {errors.registered_country && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.registered_country.message}
            </p>
          )}
        </div>
      )}

      {/* EXISTING ICP INVESTOR FIELD */}
      <div className="mb-2">
        <label className="block mb-1">
          Are you an existing ICP investor?
        </label>
        <select
          {...register("existing_icp_investor")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option className="text-lg" value="false">
            No
          </option>
          <option className="text-lg" value="true">
            Yes
          </option>
        </select>
        {errors.existing_icp_investor && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.existing_icp_investor.message}
          </p>
        )}
      </div>

      {/* CONDITIONAL RENDERING OF TYPE OF INVESTMENT FIELD IF INVESTOR IS EXISTING ICP INVESTOR */}
      {watch("existing_icp_investor") === "true" && (
        <div className="mb-2">
          <label className="block mb-1">
            Type of investment<span className="text-[red] ml-1">*</span>
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
                border: errors.investment_type
                  ? "2px solid #ef4444"
                  : "2px solid #737373",
                backgroundColor: "rgb(249 250 251)",
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
                color: errors.investment_type ? "#ef4444" : "rgb(107 114 128)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }),
              multiValue: (provided) => ({
                ...provided,
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "white",
                border: "1px solid gray",
                borderRadius: "5px",
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                display: "inline-flex",
                alignItems: "center",
              }),
            }}
            value={typeOfInvestSelectedOptions}
            options={typeOfInvestOptions}
            classNamePrefix="select"
            className="basic-multi-select w-full text-start"
            placeholder="Select an investment type"
            name="investment_type"
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setTypeOfInvestSelectedOptions(selectedOptions);
                clearErrors("investment_type");
                setValue(
                  "investment_type",
                  selectedOptions.map((option) => option.value).join(", "),
                  { shouldValidate: true }
                );
              } else {
                setTypeOfInvestSelectedOptions([]);
                setValue("investment_type", "", {
                  shouldValidate: true,
                });
                setError("investment_type", {
                  type: "required",
                  message: "At least one investment type required",
                });
              }
            }}
          />
          {errors.investment_type && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.investment_type.message}
            </p>
          )}
        </div>
      )}

      {/* MULTI-CHAIN INVESTMENT FIELD */}
      <div className="mb-2">
        <label className="block mb-1">
          Do you invest in multiple ecosystems?
          <span className="text-[red] ml-1">*</span>
        </label>
        <select
          {...register("invested_in_multi_chain")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option className="text-lg" value="false">
            No
          </option>
          <option className="text-lg" value="true">
            Yes
          </option>
        </select>
        {errors.invested_in_multi_chain && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.invested_in_multi_chain.message}
          </p>
        )}
      </div>

      {/* CONDITIONAL RENDERING OF MULTI-CHAIN NAMES FIELD IF INVESTING IN MULTIPLE ECOSYSTEMS */}
      {watch("invested_in_multi_chain") === "true" && (
        <div className="mb-2">
          <label className="block mb-1">
            Please select the chains <span className="text-[red] ml-1">*</span>
          </label>
          <Select
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
                color: errors.invested_in_multi_chain_names ? "#ef4444" : "rgb(107 114 128)",
                 
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
            value={investedInMultiChainSelectedOptions}
            options={multiChainOptions}
            classNamePrefix="select"
            className="basic-multi-select w-full text-start"
            placeholder="Select a chain"
            name="invested_in_multi_chain_names"
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setInvestedInMultiChainSelectedOptions(selectedOptions);
                clearErrors("invested_in_multi_chain_names");
                setValue(
                  "invested_in_multi_chain_names",
                  selectedOptions.map((option) => option.value).join(", "),
                  { shouldValidate: true }
                );
              } else {
                setInvestedInMultiChainSelectedOptions([]);
                setValue("invested_in_multi_chain_names", "", {
                  shouldValidate: true,
                });
                setError("invested_in_multi_chain_names", {
                  type: "required",
                  message: "At least one chain name required",
                });
              }
            }}
          />
          {errors.invested_in_multi_chain_names && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.invested_in_multi_chain_names.message}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default InvestorModal1;
