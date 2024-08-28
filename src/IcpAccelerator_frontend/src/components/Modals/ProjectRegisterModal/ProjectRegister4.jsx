import React, { useState, useEffect } from "react";

import { useFormContext } from "react-hook-form";

// FUNCTIONAL COMPONENT FOR PROJECT REGISTRATION STEP 4
const ProjectRegister4 = ({ isOpen, onClose, onBack }) => {
  const {
    register, // HOOK FORM'S REGISTER FUNCTION TO HANDLE FORM INPUTS
    formState: { errors }, // ACCESSING FORM STATE TO HANDLE ERRORS
    watch, // HOOK FORM'S WATCH FUNCTION TO DYNAMICALLY WATCH FIELD VALUES
  } = useFormContext(); // USE FORM CONTEXT TO SHARE FORM DATA ACROSS COMPONENTS

  return (
    <>
      {/* FUNDRAISING QUESTION WITH SELECT DROPDOWN */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Have you raised any funds in past
          <span className="text-red-500">*</span>
        </label>
        {/* DROPDOWN TO SELECT WHETHER FUNDS HAVE BEEN RAISED */}
        <select
          {...register("money_raised_till_now")} // REGISTER INPUT FIELD
          className={`border border-[#CDD5DF] rounded-md shadow-sm ${
            errors.money_raised_till_now ? "border-red-500" : "border-[#737373]"
          } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="false">
            No
          </option>
          <option className="text-lg font-bold" value="true">
            Yes
          </option>
        </select>
        {/* DISPLAY ERROR MESSAGE FOR 'money_raised_till_now' FIELD */}
        {errors.money_raised_till_now && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.money_raised_till_now.message}
          </p>
        )}
      </div>

      {/* CONDITIONAL RENDERING IF FUNDS HAVE BEEN RAISED */}
      {watch("money_raised_till_now") === "true" ? (
        <>
          {/* INPUT FOR GRANTS FUNDING AMOUNT */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              <div className="flex flex-col">
                <span>
                  How much funding have you raised in grants (USD)?
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-red-500">
                  If you have not raised any grants enter 0
                </span>
              </div>
            </label>
            <input
              type="number"
              {...register("icp_grants")} // REGISTER INPUT FIELD
              className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${
                                               errors?.icp_grants
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="Enter your Grants"
              onWheel={(e) => e.target.blur()} // DISABLE MOUSE WHEEL FOR NUMBER INPUTS
              min={0} // SET MINIMUM VALUE TO 0
              defaultValue=""
            />
            {/* DISPLAY ERROR MESSAGE FOR 'icp_grants' FIELD */}
            {errors?.icp_grants && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.icp_grants?.message}
              </span>
            )}
          </div>

          {/* INPUT FOR INVESTOR FUNDING AMOUNT */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              <div className="flex flex-col">
                <span>
                  How much funding have you received from Investors (USD)?
                <span className="text-red-500">*</span>
                </span>
                <span className="text-red-500">
                  If you have not recieved any funds from Investor enter 0
                </span>
              </div>
            </label>
            <input
              type="number"
              {...register("investors")} // REGISTER INPUT FIELD
              className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${
                                               errors?.investors
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="Enter Investors"
              onWheel={(e) => e.target.blur()} // DISABLE MOUSE WHEEL FOR NUMBER INPUTS
              min={0} // SET MINIMUM VALUE TO 0
              defaultValue=""
            />
            {/* DISPLAY ERROR MESSAGE FOR 'investors' FIELD */}
            {errors?.investors && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.investors?.message}
              </span>
            )}
          </div>

          {/* INPUT FOR LAUNCHPAD FUNDING AMOUNT */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              <div className="flex flex-col">
                <span>
                  How much funding has been provided through the launchpad
                  program (USD)?<span className="text-red-500">*</span>
                </span>
                <span className="text-red-500">
                  If you have not recieved any funds from launchpad program
                  enter 0
                </span>
              </div>
            </label>
            <input
              type="number"
              {...register("raised_from_other_ecosystem")} // REGISTER INPUT FIELD
              className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${
                                               errors?.raised_from_other_ecosystem
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="Enter Launchpad"
              onWheel={(e) => e.target.blur()} // DISABLE MOUSE WHEEL FOR NUMBER INPUTS
              min={0} // SET MINIMUM VALUE TO 0
              defaultValue=""
            />
            {/* DISPLAY ERROR MESSAGE FOR 'raised_from_other_ecosystem' FIELD */}
            {errors?.raised_from_other_ecosystem && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.raised_from_other_ecosystem?.message}
              </span>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      {/* CURRENT FUNDRAISING STATUS QUESTION WITH SELECT DROPDOWN */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Are you currently raising money
          <span className="text-red-500">*</span>
        </label>
        <select
          {...register("money_raising")} // REGISTER INPUT FIELD
          className={`border border-[#CDD5DF] rounded-md shadow-sm ${
            errors.money_raising ? "border-red-500" : "border-[#737373]"
          } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="false">
            No
          </option>
          <option className="text-lg font-bold" value="true">
            Yes
          </option>
        </select>
        {/* DISPLAY ERROR MESSAGE FOR 'money_raising' FIELD */}
        {errors.money_raising && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.money_raising.message}
          </p>
        )}
      </div>

      {/* CONDITIONAL RENDERING IF MONEY IS BEING RAISED */}
      {watch("money_raising") === "true" ? (
        <>
          {/* INPUT FOR TARGET AMOUNT */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              <div className="flex flex-col">
                <span>
                  Target Amount (in Millions USD)
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-red-500 block mt-1">
                  If you are not seeking any funds, enter 0.
                </span>
              </div>
            </label>

            <input
              type="number"
              {...register("target_amount")} // REGISTER INPUT FIELD
              className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${
                                               errors?.target_amount
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="Enter your Target Amount"
              defaultValue=""
              onWheel={(e) => e.target.blur()} // DISABLE MOUSE WHEEL FOR NUMBER INPUTS
              min={0} // SET MINIMUM VALUE TO 0
            />
            {/* DISPLAY ERROR MESSAGE FOR 'target_amount' FIELD */}
            {errors?.target_amount && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.target_amount?.message}
              </span>
            )}
          </div>

          {/* INPUT FOR VALUATION */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              <div className="flex flex-col">
                <span>
                  Valuation (USD)
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-red-500 block mt-1">
                  If you do not have a valuation, enter 0.
                </span>
              </div>
            </label>
            <input
              type="number"
              {...register("valuation")} // REGISTER INPUT FIELD
              className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${
                                               errors?.valuation
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="Enter valuation (In million)"
              defaultValue=""
              onWheel={(e) => e.target.blur()} // DISABLE MOUSE WHEEL FOR NUMBER INPUTS
              min={0} // SET MINIMUM VALUE TO 0
            />
            {/* DISPLAY ERROR MESSAGE FOR 'valuation' FIELD */}
            {errors?.valuation && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.valuation?.message}
              </span>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProjectRegister4;
