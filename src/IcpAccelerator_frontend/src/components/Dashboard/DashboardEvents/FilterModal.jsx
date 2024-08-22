import React, { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FilterModal = ({ isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to reset overflow when modal is closed
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const ServiceOptions = [
        { value: 'Accepted', label: 'Accepted' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Pending', label: 'Pending' },
        // Add more options as needed
    ];

    return (
        
            <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
                <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-2000 ease-out ${isOpen ? 'opacity-100 delay-1000' : 'opacity-0'}`} onClick={onClose}></div>
                <div
                    className={`fixed top-0 right-0 h-full bg-white w-[500px] p-6 shadow-lg transform transition-transform ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    style={{ transitionDuration: '2s' }}
                >

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#364152]">Filters</h2>
                    <button className="text-[#364152] text-xl" onClick={onClose}>&times;</button>
                </div>

                <div className="flex items-center gap-6 mb-4">
                    <label className="flex items-center text-sm text-[#364152] font-medium">
                        <input
                            type="radio"
                            name="category"
                            value="Project"
                            checked={selectedCategory === 'Project'}
                            onChange={handleCategoryChange}
                            className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                        />
                        Project
                    </label>
                    <label className="flex items-center text-sm text-[#364152] font-medium">
                        <input
                            type="radio"
                            name="category"
                            value="Investor"
                            checked={selectedCategory === 'Investor'}
                            onChange={handleCategoryChange}
                            className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                        />
                        Investor
                    </label>
                    <label className="flex items-center text-sm text-[#364152] font-medium">
                        <input
                            type="radio"
                            name="category"
                            value="Mentor"
                            checked={selectedCategory === 'Mentor'}
                            onChange={handleCategoryChange}
                            className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                        />
                        Mentor
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-[#364152] font-medium mb-1">Types</label>
                    <select
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="block w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-3"
                    >
                        <option value="">All</option>
                        {ServiceOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Apply<ArrowForwardIcon fontSize="small" className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
