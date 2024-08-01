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
        <>


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

        </>
    );
};

export default ProjectRegister4;