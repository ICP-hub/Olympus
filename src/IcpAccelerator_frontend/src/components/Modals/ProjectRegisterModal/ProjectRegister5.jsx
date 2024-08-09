import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

const ProjectRegister5 = ({ isOpen, onClose, onBack }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Promotion video link
                </label>
                <input
                    type="text"
                    {...register("promotional_video")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.promotional_video
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.promotional_video && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.promotional_video?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Project Discord
                </label>
                <input
                    type="text"
                    {...register("project_discord")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.project_discord
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.project_discord && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_discord?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Project LinkedIn
                </label>
                <input
                    type="text"
                    {...register("project_linkedin")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.project_linkedin
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.project_linkedin && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_linkedin?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Project GitHub</label>
                <input
                    type="text"
                    {...register("github_link")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.github_link
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.github_link && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.github_link?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Tokenomics</label>
                <input
                    type="text"
                    {...register("token_economics")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${errors?.token_economics
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.token_economics && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.token_economics?.message}
                    </span>
                )}
            </div>
        </>
    );
};

export default ProjectRegister5;
