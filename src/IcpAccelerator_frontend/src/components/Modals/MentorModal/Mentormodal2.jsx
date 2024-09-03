import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
const Mentormodal2 = ({ isOpen, onClose }) => {
    const [serviceCategory, setServiceCategory] = useState('Accelerator');
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(isOpen || true);
    const ServiceOptions = [
        { value: 'Servicecategory1', label: 'Servicecategory2' },

        // Add more options as needed
    ];
    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalOpen]);
    //   if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg p-6 w-[500px]">

                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-sm font-semibold text-[#364152]">Step 2 of 5</h2>
                    <button className="text-[#364152] text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
                </div>
                <h2 className="text-2xl font-bold mb-4">Create new service</h2>


                <div className="mb-4">
                    <label className="block text-sm text-[#364152] font-medium mb-1">Service category <span className="text-[red] ml-1">*</span></label>
                    <Select

                        options={ServiceOptions}
                        value={categories}
                        onChange={setCategories}
                        styles={selectStyles}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select a service category"
                    />

                </div>
                <div className="flex justify-between">
                    <button
                        type="button"
                        // onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    // onClick={handleContinue}
                    >
                        Continue<ArrowForwardIcon fontSize="small" className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Mentormodal2;
