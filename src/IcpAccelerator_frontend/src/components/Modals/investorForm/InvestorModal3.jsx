import React from "react";

// IMPORTING REACT HOOK FORM CONTEXT TO ACCESS FORM METHODS
import { useFormContext } from "react-hook-form";
// IMPORTING REDUX HOOK TO ACCESS GLOBAL STATE
import { useSelector } from "react-redux";

const InvestorModal3 = () => {
  // DESTRUCTURING METHODS FROM USEFORMCONTEXT HOOK
  const {
    register, // FUNCTION TO REGISTER INPUTS WITH REACT-HOOK-FORM
    formState: { errors }, // OBJECT TO TRACK FORM ERRORS
    watch, // FUNCTION TO WATCH SPECIFIC INPUT VALUES
  } = useFormContext();

  // ACCESSING ALL ICP HUBS FROM REDUX STATE
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);

  // WATCHING FOR CHANGES IN THE PORTFOLIO LINK INPUT
  const watchedPortfolioLink = watch("investor_portfolio_link");
  console.log(watchedPortfolioLink);

  return (
    <>
      {/* ICP HUB SELECTION */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Which ICP hub you will like to be associated{" "}
          <span className="text-[red] ml-1">*</span>
        </label>
        <select
          {...register("preferred_icp_hub")} // REGISTERING THE SELECT INPUT
          name="preferred_icp_hub" // NAME OF THE INPUT FIELD
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Please choose an option</option>
          {getAllIcpHubs?.map((hub) => (
            <option
              key={hub.id} // UNIQUE KEY FOR EACH OPTION
              value={`${hub.name} ,${hub.region}`} // VALUE OF THE OPTION
              className="text-lg font-bold"
            >
              {hub.name}, {hub.region} {/* DISPLAYING HUB NAME AND REGION */}
            </option>
          ))}
        </select>
        {errors.preferred_icp_hub && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.preferred_icp_hub.message} {/* ERROR MESSAGE DISPLAY */}
          </p>
        )}
      </div>

      {/* PORTFOLIO LINK INPUT */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Portfolio link <span className="text-[red] ml-1">*</span>
        </label>
        <input
          {...register("investor_portfolio_link")} // REGISTERING THE INPUT
          type="url" // SPECIFYING INPUT TYPE AS URL
          placeholder="Enter your portfolio url" // PLACEHOLDER TEXT
          name=" investor_portfolio_link" // NAME OF THE INPUT FIELD
          className="block w-full border border-gray-300 rounded-md p-2"
        />
        {errors?.investor_portfolio_link && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.investor_portfolio_link?.message} {/* ERROR MESSAGE DISPLAY */}
          </span>
        )}
      </div>

      {/* FUND NAME INPUT */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Fund Name <span className="text-[red] ml-1">*</span>
        </label>
        <input
          {...register("investor_fund_name")} // REGISTERING THE INPUT
          type="text" // SPECIFYING INPUT TYPE AS TEXT
          placeholder="Enter your fund name" // PLACEHOLDER TEXT
          name="investor_fund_name" // NAME OF THE INPUT FIELD
          className="block w-full border border-gray-300 rounded-md p-2"
        />
        {errors?.investor_fund_name && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.investor_fund_name?.message} {/* ERROR MESSAGE DISPLAY */}
          </span>
        )}
      </div>

      {/* FUND SIZE INPUT */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Fund size (in million USD) <span className="text-[red] ml-1">*</span>
        </label>
        <input
          {...register("investor_fund_size")} // REGISTERING THE INPUT
          type="number" // SPECIFYING INPUT TYPE AS NUMBER
          placeholder="Enter fund size in Millions" // PLACEHOLDER TEXT
          name="investor_fund_size" // NAME OF THE INPUT FIELD
          className="block w-full border border-gray-300 rounded-md p-2"
          onWheel={(e) => e.target.blur()} // PREVENTING SCROLLING ON NUMBER INPUT
        />
        {errors?.investor_fund_size && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.investor_fund_size?.message} {/* ERROR MESSAGE DISPLAY */}
          </span>
        )}
      </div>
    </>
  );
};

export default InvestorModal3;
