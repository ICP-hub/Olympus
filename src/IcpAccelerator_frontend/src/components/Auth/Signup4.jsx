import React, { useState } from 'react';
import Aboutcard from "../Auth/Aboutcard";
import Layer1 from "../../../assets/Logo/Layer1.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import DoneIcon from '@mui/icons-material/Done';
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';
import { FaLinkedin, FaTwitter, FaGithub, FaTelegram, FaFacebook, FaInstagram } from 'react-icons/fa';

const selectStyles = {
    control: (provided) => ({
        ...provided,
        borderColor: '#CDD5DF', // Tailwind border-gray-300
        borderRadius: '0.375rem', // Tailwind rounded-md
    }),
    controlIsFocused: (provided) => ({
        ...provided,
        borderColor: 'black', // Tailwind border-blue-500
        boxShadow: 'none',
    }),
    multiValue: (provided) => ({
        ...provided,
        borderColor: '#CDD5DF', // Tailwind bg-gray-200
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#1f2937', // Tailwind text-gray-700
    }),
};



const ProfileForm = () => {
    const [Categories, setCategories] = useState([]);
    const [profileCategories, setProfileCategories] = useState([]);
    const [reasonCategories, setReasonCategories] = useState([]);
    const navigate = useNavigate();
    const reasonOptions = [
        { value: 'Project listing and promotion', label: 'Project listing and promotion' },
        { value: 'Mentoring', label: 'Mentoring' },
        { value: 'Incubation', label: 'Incubation' },
        { value: 'Funding', label: 'Funding' },
        { value: 'Jobs', label: 'Jobs' }
        // Add more options as needed
    ];
    const InteresttypeOptions = [
        { value: 'Defi', label: 'Defi' },
        { value: 'Tooling', label: 'Tooling' },
        { value: 'NFTs', label: 'NFTs' }
        // Add more options as needed
    ];
    const ProfiletypeOptions = [
        { value: 'Individual', label: 'Individual' },
        { value: 'DAO', label: 'DAO' },
        { value: 'Company', label: 'Company' }
        // Add more options as needed
    ];

    const [formData, setFormData] = useState({
        photo: '',
        about: 'add your about section',
        interests: [''],
        location: 'San Diego, CA',
        links: {
            linkedin: '',
            twitter: '',
            github: ''
        },
        reason: [''],
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

    const getLogo = (url) => {
        if (url.includes("linkedin.com")) {
            return <FaLinkedin className="text-blue-600" />;
        } else if (url.includes("twitter.com")) {
            return <FaTwitter className="text-blue-400" />;
        } else if (url.includes("github.com")) {
            return <FaGithub className="text-gray-700" />;
        } else if (url.includes("telegram.com")) {
            return <FaTelegram className="text-blue-400" />;
        } else if (url.includes("facebook.com")) {
            return <FaFacebook className="text-blue-400" />;
        } else if (url.includes("instagram.com")) {
            return <FaInstagram className="text-pink-950" />
        } else {
            return null;
        }
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
                                <ControlPointIcon fontSize="medium" className="-ml-2" /> Upload
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
                            <label className="block text-sm font-medium text-gray-700">Why do you want to join this platform ? <span className='text-[#155EEF]'>*</span></label>
                            <Select
                                options={reasonOptions}
                                value={reasonCategories}
                                onChange={setReasonCategories}
                                styles={selectStyles}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Add your reason"
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
                            <Select
                                isMulti
                                options={InteresttypeOptions}
                                name="interest"
                                value={Categories}
                                onChange={setCategories}
                                styles={selectStyles}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Add your interest"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Type of Profile<span className='text-[#155EEF]'>*</span></label>
                            <Select
                                name="reason"
                                isMulti
                                options={ProfiletypeOptions}
                                value={profileCategories}
                                onChange={setProfileCategories}
                                styles={selectStyles}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Add your interest"
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
                            <div className=" relative mt-2">

                                <input
                                    type="text"
                                    name="linkedin"
                                    placeholder="Enter your URL"
                                    value={formData.links.linkedin}
                                    onChange={handleLinkChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2  ">{getLogo(formData.links.linkedin)}</div>
                            </div>
                            {/* <div className="flex items-center">
                                <input
                                    type="text"
                                    name="twitter"
                                    placeholder="Twitter URL"
                                    value={formData.links.twitter}
                                    onChange={handleLinkChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                /> */}
                            {/* <div className="ml-2">{getLogo(formData.links.twitter)}</div> */}
                            {/* </div> */}
                            {/* <div className="flex items-center">
                                <input
                                    type="text"
                                    name="github"
                                    placeholder="GitHub URL"
                                    value={formData.links.github}
                                    onChange={handleLinkChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                />
                                <div className="ml-2">{getLogo(formData.links.github)}</div>
                            </div> */}
                        </div>
                        <div className='flex justify-between'>

                            <button type="button" onClick={() => navigate(-1)} className=" py-2  pr-4  text-gray-600 rounded hover:text-black justify-end hover:bg-gray-100 ">
                                <ArrowBackIcon fontSize="medium" className='mr-2' />Back
                            </button>
                            <Link to='/dashboard'>
                                <button type="submit" className="px-4 py-2  bg-[#D1E0FF] text-white rounded hover:bg-blue-600 justify-end border-2 border-[#B2CCFF]">Complete <DoneIcon fontSize="medium" /></button>
                            </Link>

                        </div>
                    </div>
                </div>
                <Aboutcard />
            </div>
        </div>
    );
};

export default ProfileForm;
