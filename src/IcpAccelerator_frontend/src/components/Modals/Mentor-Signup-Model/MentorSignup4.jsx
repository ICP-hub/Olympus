import React from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
const MentorSignup4 = () => {
  const { register, formState: { errors }, watch } = useFormContext();
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);

  return (
    <>
      <div className="mb-2">
        <label className="block mb-1">Are you ICP Hub/Spoke  <span className="text-red-500">*</span></label>
        <select
          {...register("icp_hub_or_spoke")}
          className={`bg-gray-50 border rounded-md shadow-sm ${errors.icp_hub_or_spoke ? "border-red-500" : "border-[#CDD5DF]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="false">
            No
          </option>
          <option className="text-lg font-bold" value="true">
            Yes
          </option>
        </select>
        {errors.icp_hub_or_spoke && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.icp_hub_or_spoke.message}
          </p>
        )}
      </div>
      {watch("icp_hub_or_spoke") === "true" && (
        <div className="mb-2">
          <label className="block mb-1">Hub Owner  <span className="text-red-500">*</span></label>
          <select
            {...register("hub_owner")}
            className={`bg-gray-50 border rounded-md shadow-sm ${errors.hub_owner ? "border-red-500 placeholder:text-red-500" : "border-[#CDD5DF]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
          {errors.hub_owner && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.hub_owner.message}
            </p>
          )}
        </div>
      )}
      <div className="mb-2">
        <label className="block mb-1">Website link</label>
        <input
          type="text"
          {...register("mentor_website_url")}
          className={`bg-gray-50 border rounded-md shadow-sm ${errors.mentor_website_url ? "border-red-500" : "border-[#CDD5DF]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your website URL"
        />
        {errors.mentor_website_url && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.mentor_website_url.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label className="block mb-1">Years of mentoring  <span className="text-red-500">*</span></label>
        <input
          type="number"
          {...register("years_of_mentoring", { valueAsNumber: true })}
          className={`bg-gray-50 border rounded-md shadow-sm ${errors.years_of_mentoring ? "border-red-500" : "border-[#CDD5DF]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your mentoring experience years"
          min={0}
          onWheel={(e) => e.target.blur()} // Prevents scrolling
        />
        {errors.years_of_mentoring && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.years_of_mentoring.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <label className="block mb-1">LinkedIn link  <span className="text-red-500">*</span></label>
        <input
          type="text"
          {...register("mentor_linkedin_url")}
          className={`bg-gray-50 border rounded-md shadow-sm ${errors.mentor_linkedin_url ? "border-red-500" : "border-[#CDD5DF]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your LinkedIn URL"
        />
        {errors.mentor_linkedin_url && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.mentor_linkedin_url.message}
          </span>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default MentorSignup4;
