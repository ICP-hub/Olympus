import React, { useState, useEffect } from 'react';
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

const ProjectRegister1 = ({ isOpen, onClose, onBack, }) => {
    const [formData, setFormData] = useState({
        icpHub: '',
        projectName: '',
        projectDescription: '',
        pitchDeck: ''
    });
    const { register, formState: { errors }, setValue, getValues, getAllIcpHubs, trigger } = useFormContext();




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (

        <>

            <h1 className="text-3xl text-[#121926] font-bold mb-3">Create a project</h1>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Upload a logo<span className='text-[#155EEF]'>*</span></label>
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
            <div className="mb-2 relative">
                <label className="block text-sm font-medium mb-1">Preferred ICP Hub you would like to be associated with<span className='text-[#155EEF]'>*</span></label>
                <select
                    {...register("preferred_icp_hub")}
                    defaultValue={getValues("preferred_icp_hub")}
                    className={`bg-gray-50 border-2 ${errors.preferred_icp_hub
                        ? "border-red-500 "
                        : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                {errors.preferred_icp_hub && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.preferred_icp_hub.message}
                    </p>
                )}

            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Project Name<span className='text-[#155EEF]'>*</span></label>

                <input
                    type="text"
                    {...register("project_name")}
                    className={`bg-gray-50 border-2 
                                             ${errors?.project_name
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your Project name"
                />
                {errors?.project_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_name?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Project Description (50 words)</label>

                <input
                    type="text"
                    {...register("project_description")}
                    className={`bg-gray-50 border-2 
                                             ${errors?.project_description
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Max 50 words"
                />
                {errors?.project_description && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_description?.message}
                    </span>
                )}
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Project pitch deck</label>

                <input
                    type="text"
                    {...register("project_elevator_pitch")}
                    className={`bg-gray-50 border-2 
                                             ${errors?.project_elevator_pitch
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                />
                {errors?.project_elevator_pitch && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_elevator_pitch?.message}
                    </span>
                )}
            </div>


        </>

    );
};

export default ProjectRegister1;