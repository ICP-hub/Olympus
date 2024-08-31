import React from "react";

// IMPORTING REACT HOOK FORM CONTEXT TO ACCESS FORM METHODS
import { useFormContext } from "react-hook-form";
// IMPORTING REDUX HOOK TO ACCESS GLOBAL STATE
import { useSelector } from "react-redux";

const InvestorModal3 = () => {
  // DESTRUCTURING METHODS FROM USEFORMCONTEXT HOOK
  const {
    watch,
    register,
    clearErrors,
    countries,
    formState: { errors },
    setValue,
    setError, // FUNCTION TO WATCH SPECIFIC INPUT VALUES
  } = useFormContext();

  // ACCESSING ALL ICP HUBS FROM REDUX STATE
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);

  // WATCHING FOR CHANGES IN THE PORTFOLIO LINK INPUT
  // const watchedPortfolioLink = watch("investor_portfolio_link");
  // console.log(watchedPortfolioLink);

  return (
    <>
      {/* ICP HUB SELECTION */}
      <div className="mb-2">
        <label className="block mb-1">
          Which ICP hub you will like to be associated{" "}
          <span className="text-[red] ml-1">*</span>
        </label>
        <select
          {...register("preferred_icp_hub")}
          name="preferred_icp_hub"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Please choose an option</option>
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

      {/* PORTFOLIO LINK INPUT */}
      <div className="mb-2">
        <label className="block mb-1">
          Portfolio Link
        </label>
        <input
          type="text"
          {...register("investor_portfolio_link", {
            required: "Portfolio link is required",
            
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: "Invalid URL format"
            }
          })}
           placeholder="Enter your Portfolio url"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        {errors.investor_portfolio_link && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.investor_portfolio_link.message}
          </p>
        )}
      </div>

      {/* FUND NAME INPUT */}
      <div className="mb-2">
        <label className="block mb-1">
          Fund Name <span className="text-[red] ml-1">*</span>
        </label>
        <input
          {...register("investor_fund_name")}
          name="investor_fund_name" // REGISTERING THE INPUT
          type="text" // SPECIFYING INPUT TYPE AS TEXT
          placeholder="Enter your fund name" // PLACEHOLDER TEXT
          className="block w-full border border-gray-300 rounded-md p-2"
        />
        {errors?.investor_fund_name && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.investor_fund_name?.message} {/* ERROR MESSAGE DISPLAY */}
          </span>
        )}
      </div>

      {/* FUND SIZE INPUT */}
      <div className="mb-2">
        <label className="block mb-1">
          Fund size (in million USD) <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          {...register("investor_fund_size", {
            required: "Fund size is required",
            min: {
              value: 0,
              message: "Fund size must be at least 0",
            },
            valueAsNumber: true, // Ensures the value is treated as a number
          })}
          type="number"
          placeholder="Enter fund size in Millions"
          className="block w-full border border-gray-300 rounded-md p-2"
          onWheel={(e) => e.target.blur()} // Prevents scrolling on number input
        />
        {errors?.investor_fund_size && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.investor_fund_size?.message}
          </span>
        )}
      </div>
    </>
  );
};

export default InvestorModal3;
