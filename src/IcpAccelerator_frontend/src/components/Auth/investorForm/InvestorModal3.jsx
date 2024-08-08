import React from 'react';

import { useFormContext } from "react-hook-form";
import { useSelector } from 'react-redux';

const InvestorModal3 = () => {
    const { register, formState: { errors }, watch } = useFormContext();
    const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
    console.log('my hub data', getAllIcpHubs)
    return (
        <>



            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Which ICP hub you will like to be associated <span className='text-[red] ml-1'>*</span></label>
                <select
                    {...register("preferred_icp_hub")}
                    name="preferred_icp_hub"

                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Please choose an option</option>
                    {getAllIcpHubs?.map((hub) => (
            <option key={hub.id} value={`${hub.name} ,${hub.region}`} className="text-lg font-bold">
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
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Portfolio link <span className='text-[red] ml-1'>*</span></label>
                <input
                    {...register("investor_portfolio_link")}
                    type="url"
                    placeholder="Enter your portfolio url"
                    name=" investor_portfolio_link"
                    className="block w-full border border-gray-300 rounded-md p-2"

                />
                {errors?.investor_portfolio_link && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_portfolio_link?.message}
                    </span>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fund Name <span className='text-[red] ml-1'>*</span></label>
                <input
                    {...register("investor_fund_name")}
                    type="text"
                    placeholder="Enter your fund name"
                    name="investor_fund_name"
                    className="block w-full border border-gray-300 rounded-md p-2"

                />
                {errors?.investor_fund_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_fund_name?.message}
                    </span>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fund size (in million USD) <span className='text-[red] ml-1'>*</span></label>
                <input
                    {...register("investor_fund_size")}
                    type="number"
                    placeholder="Enter fund size in Millions"
                    name="investor_fund_size"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    onWheel={(e) => e.target.blur()}
                // min={0}
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
