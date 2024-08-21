import React, { useState, useEffect } from 'react';
import mentor from "../../../../assets/Logo/mentor.png";
import talent from "../../../../assets/Logo/talent.png";
import founder from "../../../../assets/Logo/founder.png";
import ProjectRegisterMain from '../ProjectRegisterModal/ProjectRegisterMain';
import InvestorForm from '../investorForm/InvestorForm';
import MentorSignupMain from '../Mentor-Signup-Model/MentorsignUpmain';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const Modal1 = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(isOpen);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const userCurrentRoleStatus = useSelector(
        (currState) => currState.currentRoleStatus.rolesStatusArray
    );

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
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#364152]">Filters</h2>
                    <button className="text-[#364152] text-xl" onClick={onClose}>&times;</button>
                </div>

                <div className="flex items-center gap-6 mb-4">
                    <label
                        className={`flex items-center justify-between px-2 py-2 border rounded-lg cursor-pointer hover:bg-gray-100 
                        ${selectedCategory === 'Project' ? 'bg-gray-100' : ''}`}
                        onClick={() => handleCategoryChange({ target: { value: 'Project' } })}
                    >
                        <div className="flex items-center">
                            <span className="ml-4">
                                <span className="font-semibold flex capitalize">Project</span>
                            </span>
                        </div>
                        <input
                            type="radio"
                            name="category"
                            className={`h-4 w-4 text-blue-600 border border-black rounded-full cursor-pointer 
                            ${selectedCategory === 'Project' ? 'bg-blue-600' : ''}`}
                            checked={selectedCategory === 'Project'}
                            onChange={handleCategoryChange}
                        />
                    </label>
                    <label
                        className={`flex items-center justify-between px-2 py-2 border rounded-lg cursor-pointer hover:bg-gray-100 
                        ${selectedCategory === 'Investor' ? 'bg-gray-100' : ''}`}
                        onClick={() => handleCategoryChange({ target: { value: 'Investor' } })}
                    >
                        <div className="flex items-center">
                            <span className="ml-4">
                                <span className="font-semibold flex capitalize">Investor</span>
                            </span>
                        </div>
                        <input
                            type="radio"
                            name="category"
                            className={`h-4 w-4 text-blue-600 border border-black rounded-full cursor-pointer 
                            ${selectedCategory === 'Investor' ? 'bg-blue-600' : ''}`}
                            checked={selectedCategory === 'Investor'}
                            onChange={handleCategoryChange}
                        />
                    </label>
                    <label
                        className={`flex items-center justify-between px-2 py-2 border rounded-lg cursor-pointer hover:bg-gray-100 
                        ${selectedCategory === 'Mentor' ? 'bg-gray-100' : ''}`}
                        onClick={() => handleCategoryChange({ target: { value: 'Mentor' } })}
                    >
                        <div className="flex items-center">
                            <span className="ml-4">
                                <span className="font-semibold flex capitalize">Mentor</span>
                            </span>
                        </div>
                        <input
                            type="radio"
                            name="category"
                            className={`h-4 w-4 text-blue-600 border border-black rounded-full cursor-pointer 
                            ${selectedCategory === 'Mentor' ? 'bg-blue-600' : ''}`}
                            checked={selectedCategory === 'Mentor'}
                            onChange={handleCategoryChange}
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-[#364152] font-medium mb-1">Types</label>
                    <select
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="block w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
