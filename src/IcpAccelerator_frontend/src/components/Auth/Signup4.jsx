import React, { useState } from 'react';
import Aboutcard from "../Auth/Aboutcard"
import Layer1 from "../../../assets/Logo/Layer1.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


const ProfileForm = () => {
    const [formData, setFormData] = useState({
        photo: '',
        tagline: 'Founder & CEO at Cypherpunk Labs',
        about: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non vivamus massa fringilla.',
        interests: ['Web3', 'Cryptography', 'Blockchain'],
        location: 'San Diego, CA',
        links: {
            linkedin: '',
            github: '',
            telegram: '',
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            links: {
                ...formData.links,
                [name]: value,
            },
        });
    };

    return (
        <div className="py-16 flex items-center justify-center bg-[#FFF4ED] rounded-xl">
            <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-6xl">
                <div className="w-1/2 p-8">
                    <div className="mb-6">
                        <img src={Layer1} alt="logo" />
                    </div>
                    <div className='mx-12'>
                        <h2 className=" font-semibold mb-2 mt-16 ">Step 3 of 3</h2>

                        <h2 className="text-3xl font-bold mb-4">Tell about yourself</h2>
                        <label className="block text-sm font-medium mb-2">Upload a photo<span className='text-[#155EEF]'>*</span></label>
                        <div className=" flex gap-3">
                            <label htmlFor="file-upload" className="block font-medium text-gray-700 border border-gray-500 px-4 py-2 cursor-pointer rounded">
                                <ControlPointIcon fontSize="medium" className="-ml-2" />   Upload
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                name="photo"
                                className="mt-2 hidden"
                                onChange={handleChange}
                            />
                            <label htmlFor="file-upload" className="block font-medium text-gray-700 border border-gray-500 px-4 py-2 cursor-pointer rounded">
                                <AutoAwesomeIcon fontSize="medium" className="mr-2" />Generate Image
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                name="photo"
                                className="mt-2 hidden"
                                onChange={handleChange}
                            />

                        </div>
                        <p className='text-red-500 mb-4'>Delete image *</p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Tagline <span className='text-[#155EEF]'>*</span></label>
                            <input
                                type="text"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">About <span className='text-[#155EEF]'>*</span></label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full h-24"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Interests <span className='text-[#155EEF]'>*</span></label>
                            <input
                                type="text"
                                name="interests"
                                value={formData.interests.join(', ')}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        interests: e.target.value.split(',').map((i) => i.trim()),
                                    })
                                }
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Location <span className='text-[#155EEF]'>*</span></label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Links </label>
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="LinkedIn URL"
                                value={formData.links.linkedin}
                                onChange={handleLinkChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <input
                                type="text"
                                name="github"
                                placeholder="GitHub URL"
                                value={formData.links.github}
                                onChange={handleLinkChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <input
                                type="text"
                                name="telegram"
                                placeholder="Telegram URL"
                                value={formData.links.telegram}
                                onChange={handleLinkChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className='flex justify-between'>
                            <button type="submit" className=" py-2 px-4  text-gray-600 rounded hover:text-black justify-end  "> <ArrowBackIcon fontSize="medium" className="mr-2" />Back </button>
                            <button type="submit" className=" py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 justify-end border-2 border-[#B2CCFF]">Complete </button>

                        </div>
                    </div>
                </div>
                <Aboutcard />
            </div>
        </div>

    );
};

export default ProfileForm;
