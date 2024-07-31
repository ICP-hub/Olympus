import React, { useState, useEffect } from 'react';
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Select from 'react-select';

const ProjectRegister1 = ({ isOpen, onClose, onBack }) => {
    const [formData, setFormData] = useState({
        icpHub: '',
        projectName: '',
        projectDescription: '',
        pitchDeck: ''
    });
    const [modalOpen, setModalOpen] = useState(isOpen || true);

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: '#CDD5DF',
            borderRadius: '0.375rem',
        }),
        controlIsFocused: (provided) => ({
            ...provided,
            borderColor: 'black',
            boxShadow: 'none',
        }),
    };

    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalOpen]);

    const icpHubOptions = [
        { value: 'hub1', label: 'ICP Hub 1' },
        { value: 'hub2', label: 'ICP Hub 2' },
    ];

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

    const handleBack = () => {
        onBack();
        setModalOpen(false);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4">
                <div className="flex justify-end mr-4">
                    <button className='text-2xl text-[#121926]' onClick={() => setModalOpen(false)}>&times;</button>
                </div>
                <h2 className="text-xs text-[#364152] mb-3">Step 1 of 6</h2>
                <h1 className="text-3xl text-[#121926] font-bold mb-3">Create a project</h1>
                <form onSubmit={handleSubmit}>
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
                        <Select
                            options={icpHubOptions}
                            styles={selectStyles}
                            className="basic-select"
                            classNamePrefix="select"
                            placeholder="Select your ICP Hub"
                            onChange={(selectedOption) => setFormData(prevData => ({ ...prevData, icpHub: selectedOption.value }))}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project Name<span className='text-[#155EEF]'>*</span></label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter your Project name"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project Description (50 words)</label>
                        <textarea
                            name="projectDescription"
                            value={formData.projectDescription}
                            onChange={handleChange}
                            maxLength={50}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Max 50 words"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project pitch deck</label>
                        <input
                            type="url"
                            name="pitchDeck"
                            value={formData.pitchDeck}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            placeholder="https://"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                        >
                            <ArrowBackIcon fontSize="medium" className="ml-2" /> Back
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Continue <ArrowForwardIcon fontSize="medium" className="ml-2" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectRegister1;