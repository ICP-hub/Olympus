import React, { useState, useEffect } from 'react';
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Dropdown from "../../../../assets/Logo/Dropdown.png"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import Select from 'react-select';

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

const Foundermodal3 = ({ isOpen, onClose, onBack }) => {
    const [categories, setCategories] = useState([]);
    const [stage, setstage] = useState('');
    const [formData, setFormData] = useState({
        tagline: '',
        about: '',
        category: 'Infrastructure',
        stage: 'MVP',
        links: ['']
    });
    // Ensure the modal is open by default if `isOpen` is not provided
    const [modalOpen, setModalOpen] = useState(isOpen || true);

    // Effect to manage body scroll
    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling
        }

        // Cleanup function to ensure scrolling is restored
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalOpen]);
    const categoryOptions = [
        { value: 'Infrastructure', label: 'Infrastructure' },

        // Add more options as needed
    ];
    const stageOptions = [
        { value: 'MVP', label: 'MVP' },

        // Add more options as needed
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLinkChange = (index, value) => {
        const newLinks = [...formData.links];
        newLinks[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            links: newLinks,
        }));
    };


    const handleAddLink = () => {
        setFormData((prevData) => ({
            ...prevData,
            links: [...prevData.links, ''],
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
                <h2 className="text-xs text-[#364152]">Step 3 of 3</h2>
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
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Tagline<span className='text-[#155EEF]'>*</span></label>
                        <input
                            type="text"
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            maxLength={50}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">About<span className='text-[#155EEF]'>*</span></label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            maxLength={500}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-2 relative">
                        <label className="block text-sm font-medium mb-1">Category<span className='text-[#155EEF]'>*</span></label>
                        <Select

                            options={categoryOptions}
                            value={categories}
                            onChange={setCategories}
                            styles={selectStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Add Relevant Categories"
                        />

                    </div>
                    <div className="mb-2 relative">
                        <label className="block text-sm font-medium mb-1">Stage<span className='text-[#155EEF]'>*</span></label>
                        <Select

                            options={stageOptions}
                            value={stage}
                            onChange={setstage}
                            styles={selectStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Add Relevant Categories"
                        />   </div>
                    <div className="mb-2 relative">
                        <label className="text-sm font-medium mb-1 flex items-center">Links</label>
                        {formData.links.map((link, index) => (
                            <div key={index} className="relative">
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md p-2 pr-10"
                                    required
                                />
                                {/* <ArrowDropDownIcon className="absolute right-2 top-1/2 transform w-5 h-5 text-gray-400 pointer-events-none" /> */}
                                <img src={Dropdown} alt="img" className="absolute  top-1/2 transform -translate-y-1/2  " />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddLink}
                            className="text-blue-500 text-sm"
                        >
                            Add another link
                        </button>
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
                            onClick={onClose}
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Complete <CheckIcon fontSize="medium" className="ml-2" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Foundermodal3;
