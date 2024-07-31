import React, { useState, useEffect } from 'react';
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Select from 'react-select';

const ProjectRegister2 = ({ isOpen, onClose, onBack }) => {
    const [formData, setFormData] = useState({
        projectWebsite: '',
        isRegistered: '',
        registrationType: '',
        registrationCountry: ''
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

    const registrationOptions = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
    ];

    const registrationTypeOptions = [
        { value: 'type1', label: 'Company' },
        { value: 'type2', label: 'DAO' },
    ];

    const countryOptions = [
        { value: 'country1', label: 'Country 1' },
        { value: 'country2', label: 'Country 2' },
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
                <h2 className="text-xs text-[#364152] mb-3">Step 2 of 6</h2>
                <h1 className="text-3xl text-[#121926] font-bold mb-3">Create a project</h1>
                <form onSubmit={handleSubmit}>
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
                            type="url"
                            name="projectWebsite"
                            value={formData.projectWebsite}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            placeholder="https://"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Is your project registered<span className='text-[#155EEF]'>*</span></label>
                        <Select
                            options={registrationOptions}
                            styles={selectStyles}
                            className="basic-select"
                            classNamePrefix="select"
                            placeholder="Select Yes or No"
                            onChange={(selectedOption) => setFormData(prevData => ({ ...prevData, isRegistered: selectedOption.value }))}
                            required
                        />
                    </div>
                    {formData.isRegistered === 'yes' && (
                        <>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Type of registration<span className='text-[#155EEF]'>*</span></label>
                                <Select
                                    options={registrationTypeOptions}
                                    styles={selectStyles}
                                    className="basic-select"
                                    classNamePrefix="select"
                                    placeholder="Select registration type"
                                    onChange={(selectedOption) => setFormData(prevData => ({ ...prevData, registrationType: selectedOption.value }))}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Country of registration<span className='text-[#155EEF]'>*</span></label>
                                <Select
                                    options={countryOptions}
                                    styles={selectStyles}
                                    className="basic-select"
                                    classNamePrefix="select"
                                    placeholder="Select your country"
                                    onChange={(selectedOption) => setFormData(prevData => ({ ...prevData, registrationCountry: selectedOption.value }))}
                                    required
                                />
                            </div>
                        </>
                    )}
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

export default ProjectRegister2;