import React, { useState, } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useFormContext, Controller } from "react-hook-form";
import CompressedImage from "../../../component/ImageCompressed/CompressedImage"
const ProjectRegister2 = ({ isOpen, onClose, onBack }) => {
    const {
        register,
        formState: { errors },
        trigger,
        setError,
        clearErrors,
        setValue,
        control,
        watch,
        countries,
    } = useFormContext();

    const [coverPreview, setCoverPreview] = useState(null);
    const [coverData, setCoverData] = useState(null);
    const coverCreationFunc = async (file) => {
        const result = await trigger("cover");
        if (result) {
            try {
                const compressedFile = await CompressedImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCoverPreview(reader.result);
                };
                reader.onerror = (error) => {
                    console.error("FileReader error: ", error);
                    setError("cover", {
                        type: "manual",
                        message: "Failed to load the compressed cover.",
                    });
                };
                reader.readAsDataURL(compressedFile);

                const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
                setCoverData(byteArray);
            } catch (error) {
                setError("cover", {
                    type: "manual",
                    message: "Could not process cover, please try another.",
                });
            }
        } else {
            console.log("ERROR--coverCreationFunc-file", file);
        }
    };
    const clearCoverFunc = (val) => {
        let field_ids = val;
        setValue(field_ids, null);
        clearErrors(field_ids);
        setCoverData(null);
        setCoverPreview(null);
    };



    return (
        <>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Upload a Cover Photo<span className="text-red-500">*</span>
                </label>

                <div className="flex gap-2 mb-3">
                    <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden flex">
                        {coverPreview && !errors.cover ? (
                            <img
                                src={coverPreview}
                                alt="cover"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <svg
                                width="35"
                                height="37"
                                viewBox="0 0 35 37"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="bg-no-repeat"
                            >
                                <path
                                    d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                                    fill="#BBBBBB"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="flex gap-1 items-center justify-center">
                        <Controller
                            name="cover"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="cover"
                                        name="cover"
                                        onChange={(e) => {
                                            field.onChange(e.target.files[0]);
                                            coverCreationFunc(e.target.files[0]);
                                        }}
                                        accept=".jpg, .jpeg, .png"
                                    />
                                    <label
                                        htmlFor="cover"
                                        className="font-medium text-gray-700 border border-[#CDD5DF] px-4 py-1 cursor-pointer rounded"
                                    > <ControlPointIcon
                                            fontSize="small"
                                            className="items-center -mt-1 mr-2"
                                        />
                                        {coverPreview && !errors.cover
                                            ? "Change cover picture"
                                            : "Upload cover picture"}
                                    </label>

                                    {coverPreview || errors.cover ? (
                                        <button
                                            className="

                                            font-medium px-4 py-1 cursor-pointer rounded border border-red-500 items-center text-md bg-transparent text-red-500  capitalize ml-1 sm0:ml-0"

                                            onClick={() => clearCoverFunc("cover")}
                                        >
                                            clear
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>
                {errors.cover && (
                    <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                        {errors?.cover?.message}
                    </span>
                )}
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Project Website
                </label>
                <input
                    type="text"
                    {...register("project_website")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.project_website
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.project_website && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_website?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Is your project registered<span className="text-red-500">*</span>
                </label>
                <select
                    {...register("is_your_project_registered")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.is_your_project_registered
                        ? "border-red-500"
                        : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                    <option className="text-lg font-bold" value="false">
                        No
                    </option>
                    <option className="text-lg font-bold" value="true">
                        Yes
                    </option>
                </select>
                {errors.is_your_project_registered && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.is_your_project_registered.message}
                    </p>
                )}
            </div>
            {watch("is_your_project_registered") === "true" ? (
                <>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            Type of registration<span className="text-[#155EEF]">*</span>
                        </label>
                        <select
                            {...register("type_of_registration")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.type_of_registration
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        >
                            <option className="text-lg font-bold" value="">
                                Select registration type
                            </option>
                            <option className="text-lg font-bold" value="Company">
                                Company
                            </option>
                            <option className="text-lg font-bold" value="DAO">
                                DAO
                            </option>
                        </select>
                        {errors.type_of_registration && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                                {errors.type_of_registration.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            Country of registration<span className="text-[#155EEF]">*</span>
                        </label>
                        <select
                            {...register("country_of_registration")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.country_of_registration
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        >
                            <option className="text-lg font-bold" value="">
                                Select your country
                            </option>
                            {countries?.map((expert) => (
                                <option
                                    key={expert.name}
                                    value={expert.name}
                                    className="text-lg font-bold"
                                >
                                    {expert.name}
                                </option>
                            ))}
                        </select>
                        {errors?.country_of_registration && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.country_of_registration?.message}
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

export default ProjectRegister2;
