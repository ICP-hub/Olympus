import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "react-select";
import { useFormContext } from "react-hook-form";

const ProjectRegister4 = ({ isOpen, onClose, onBack }) => {
    const {
        register,
        formState: { errors },
        watch,

    } = useFormContext();
    return (
        <>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Have you raised any funds in past
                    <span className="text-red-500">*</span>
                </label>
                <select
                    {...register("money_raised_till_now")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.money_raised_till_now ? "border-red-500" : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                    <option className="text-lg font-bold" value="false">
                        No
                    </option>
                    <option className="text-lg font-bold" value="true">
                        Yes
                    </option>
                </select>
                {errors.money_raised_till_now && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.money_raised_till_now.message}
                    </p>
                )}
            </div>
            {watch("money_raised_till_now") === "true" ? (
                <>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            How much funding have you raised in grants (USD)?
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            {...register("icp_grants")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${errors?.icp_grants
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="Enter your Grants"
                            onWheel={(e) => e.target.blur()}
                            min={0}
                        />
                        {errors?.icp_grants && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.icp_grants?.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            How much funding have you received from Investors (USD)?
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            {...register("investors")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${errors?.investors
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="Enter Investors"
                            onWheel={(e) => e.target.blur()}
                            min={0}
                        />
                        {errors?.investors && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.investors?.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            How much funding has been provided through the launchpad program
                            (USD)?<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            {...register("raised_from_other_ecosystem")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${errors?.raised_from_other_ecosystem
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="Enter Launchpad"
                            onWheel={(e) => e.target.blur()}
                            min={0}
                        />
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
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Are you currently raising money
                    <span className="text-red-500">*</span>
                </label>
                <select
                    {...register("money_raising")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.money_raising ? "border-red-500" : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                    <option className="text-lg font-bold" value="false">
                        No
                    </option>
                    <option className="text-lg font-bold" value="true">
                        Yes
                    </option>
                </select>
                {errors.money_raising && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.money_raising.message}
                    </p>
                )}
            </div>
            {watch("money_raising") === "true" ? (
                <>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            Target Amount (in Millions USD)
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            {...register("target_amount")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.target_amount
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="Enter your Target Amount"
                            onWheel={(e) => e.target.blur()}
                            min={0}
                        />
                        {errors?.target_amount && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.target_amount?.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            Valuation (USD)
                        </label>
                        <input
                            type="number"
                            {...register("valuation")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.valuation
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="Enter valuation (In million)"
                            onWheel={(e) => e.target.blur()}
                            min={0}
                        />
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
