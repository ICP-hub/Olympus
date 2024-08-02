import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';


const ProjectRegister5 = ({ isOpen, onClose, onBack }) => {

    const [formData, setFormData] = useState({
        promotionvideolink: '',
        projectdiscord: '',
        projectlinkedin: '',
        whitepaper: '',
        tokenomics: '',
        projectgithub: '',

    });


    const { register, formState: { errors }, setValue, trigger } = useFormContext();






    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        onClose();
    };


    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4">
                <div className="flex justify-end mr-4">
                    <button className='text-2xl text-[#121926]' onClick={() => setModalOpen(false)}>&times;</button>
                </div>
                <h2 className="text-xs text-[#364152] mb-3">Step 5 of 6</h2>
                <form onSubmit={handleSubmit}>








                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Promotion video link</label>
                        <input
                            type="text"
                            {...register("promotional_video")}
                            className={`bg-gray-50 border-2 
                                             ${errors?.promotional_video
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="https://"
                        />
                        {errors?.promotional_video && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.promotional_video?.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project Discord</label>
                        <input
                            type="text"
                            {...register("project_discord")}
                            className={`bg-gray-50 border-2 
                                             ${errors?.project_discord
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="https://"
                        />
                        {errors?.project_discord && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.project_discord?.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project LinkedIn</label>
                        <input
                            type="text"
                            {...register("project_linkedin")}
                            className={`bg-gray-50 border-2 
                                             ${errors?.project_linkedin
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                            className={`bg-gray-50 border-2 
                                             ${errors?.github_link
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                            className={`bg-gray-50 border-2 
                                             ${errors?.token_economics
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="https://"
                        />
                        {errors?.token_economics && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.token_economics?.message}
                            </span>
                        )}
                    </div>



                </form>
            </div>
        </div>
    );
};

export default ProjectRegister5;