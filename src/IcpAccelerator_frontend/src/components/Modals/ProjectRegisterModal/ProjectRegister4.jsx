import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Select from 'react-select';

const ProjectRegister4 = ({ isOpen, onClose, onBack }) => {
    const [formData, setFormData] = useState({
        raisedFundsInPast: '',
        currentlyRaisingMoney: '',
        grantFunding: '',
        investorFunding: '',
        launchpadFunding: '',
        targetAmount: '',
        valuation: '',
        projectDiscord: ''
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

    const yesNoOptions = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
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
                <h2 className="text-xs text-[#364152] mb-3">Step 4 of 6</h2>
                <h1 className="text-3xl text-[#121926] font-bold mb-3">Create a project</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Have you raised any funds in past<span className='text-[#155EEF]'>*</span></label>
                        <Select
                            options={yesNoOptions}
                            styles={selectStyles}
                            className="basic-select"
                            classNamePrefix="select"
                            placeholder="Select Yes or No"
                            onChange={(selectedOption) => setFormData(prevData => ({ ...prevData, raisedFundsInPast: selectedOption.value }))}
                            required
                        />
                    </div>
                    {formData.raisedFundsInPast === 'yes' && (
                        <>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">How much funding have you raised in grants (USD)?<span className='text-[#155EEF]'>*</span></label>
                                <input
                                    type="number"
                                    name="grantFunding"
                                    value={formData.grantFunding}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">How much funding have you received from Investors (USD)?<span className='text-[#155EEF]'>*</span></label>
                                <input
                                    type="number"
                                    name="investorFunding"
                                    value={formData.investorFunding}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">How much funding has been provided through the launchpad program (USD)?<span className='text-[#155EEF]'>*</span></label>
                                <input
                                    type="number"
                                    name="launchpadFunding"
                                    value={formData.launchpadFunding}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Are you currently raising money<span className='text-[#155EEF]'>*</span></label>
                        <Select
                            options={yesNoOptions}
                            styles={selectStyles}
                            className="basic-select"
                            classNamePrefix="select"
                            placeholder="Select Yes or No"
                            onChange={(selectedOption) => setFormData(prevData => ({ ...prevData, currentlyRaisingMoney: selectedOption.value }))}
                            required
                        />
                    </div>
                    {formData.currentlyRaisingMoney === 'yes' && (
                        <>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Target Amount (in Millions USD)<span className='text-[#155EEF]'>*</span></label>
                                <input
                                    type="number"
                                    name="targetAmount"
                                    value={formData.targetAmount}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Enter your Target Amount"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Valuation (USD)</label>
                                <input
                                    type="number"
                                    name="valuation"
                                    value={formData.valuation}
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Enter valuation (in million)"
                                />
                            </div>
                        </>
                    )}
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project Discord</label>
                        <input
                            type="url"
                            name="projectDiscord"
                            value={formData.projectDiscord}
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
                            Continue<ArrowForwardIcon fontSize="medium" className="ml-2" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectRegister4;