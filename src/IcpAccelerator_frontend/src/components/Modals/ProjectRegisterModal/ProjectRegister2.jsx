import React, { useState, useEffect } from 'react';
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useFormContext } from 'react-hook-form';


const ProjectRegister2 = ({ isOpen, onClose, onBack }) => {
    const [formData, setFormData] = useState({
        projectWebsite: '',
        isRegistered: '',
        registrationType: '',
        registrationCountry: ''
    });

    const { register, formState: { errors }, setValue, watch, countries, trigger } = useFormContext();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        onClose();
    };



    return (
        <>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Upload a Cover Photo<span className='text-[#155EEF]'>*</span></label>
                <div className='flex gap-2'>
                    <img src={createprojectabc} alt="projectimg" />
                    <div className='flex gap-1 items-center justify-center'>
                        <div className="flex gap-1">
                            <label htmlFor="file-upload" className="block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded">
                                <ControlPointIcon fontSize="small" className="items-center -mt-1" /> Upload
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                name="photo"
                                className="mt-2 hidden"
                                onChange={handleChange}
                            />
                            <label htmlFor="file-upload" className="block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded">
                                <AutoAwesomeIcon fontSize="small" className="mr-2" />Generate Image
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                name="photo"
                                className="mt-2 hidden"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Project Website</label>
                <input
                    type="text"
                    {...register("project_website")}
                    className={`bg-gray-50 border-2 
                                             ${errors?.project_website
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.project_website && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_website?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Is your project registered<span className='text-[#155EEF]'>*</span></label>
                <select
                    {...register("is_your_project_registered")}
                    className={`bg-gray-50 border-2 ${errors.is_your_project_registered
                        ? "border-red-500"
                        : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                        <label className="block text-sm font-medium mb-1">Type of registration<span className='text-[#155EEF]'>*</span></label>
                        <select
                            {...register("type_of_registration")}
                            className={`bg-gray-50 border-2 ${errors.type_of_registration
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                        <label className="block text-sm font-medium mb-1">Country of registration<span className='text-[#155EEF]'>*</span></label>
                        <select
                            {...register("country_of_registration")}
                            className={`bg-gray-50 border-2 ${errors.country_of_registration
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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