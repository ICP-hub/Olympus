import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
        borderColor: '#3b82f6', // Tailwind border-blue-500
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

const Mentormodal1 = ({ isOpen, onClose }) => {
    const [primaryExpertise, setPrimaryExpertise] = useState('');
    const [secondaryExpertise, setSecondaryExpertise] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [tools, setTools] = useState([]);
    const [education, setEducation] = useState('');
    const [discipline, setDiscipline] = useState('');
    const [showFoundermodal2, setShowFoundermodal2] = useState(false);
    const [modalOpen, setModalOpen] = useState(isOpen || true);

    const categoryOptions = [
        { value: 'DeFi', label: 'DeFi' },
        { value: 'GameFi', label: 'GameFi' },
        // Add more options as needed
    ];
    const yearOptions = [
        { value: '1-2', label: '1-2' },
        { value: '3-5', label: '3-5' },
        { value: '5-10', label: '5-10' },
        // Add more options as needed
    ];
    const DisciplineOptions = [
        { value: 'Strict', label: 'Strict' },

        // Add more options as needed
    ];
    const ExpertiseOptions = [
        { value: 'Enterpreneurship', label: 'Enterpreneurship' },

        // Add more options as needed
    ];
    const EducationOptions = [
        { value: 'Bachelor of Science', label: 'Bachelor of Science' },
        { value: 'Bachelor of Technology', label: 'Bachelor of Technology' },

        // Add more options as needed
    ];

    const skillOptions = [
        { value: 'Funding', label: 'Funding' },
        { value: 'Tokenomics', label: 'Tokenomics' },
        // Add more options as needed
    ];

    const toolOptions = [
        { value: 'Tool1', label: 'Tool1' },
        { value: 'Tool2', label: 'Tool2' },
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

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg w-[550px] p-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-semibold text-[#364152]">Step 1 of 5</h2>
                    <button className="text-[#364152] text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
                </div>
                <h1 className="text-3xl font-bold mb-3">Expertise</h1>
                <p className="text-[#697586] mb-4">Tell others a bit about your founding expertise. You can update it later.</p>
                <form>
                    <div className="mb-2 relative">
                        <label className="block text-sm text-[#364152] font-medium mb-1">Primary expertise <span className="text-[#155EEF]">*</span></label>
                        <Select
                            options={ExpertiseOptions}
                            value={primaryExpertise}
                            onChange={setPrimaryExpertise}
                            styles={selectStyles}
                            className="basic-single-select"
                            classNamePrefix="select"
                            placeholder="Add your Expertise"
                        />

                    </div>
                    <div className="mb-2">
                        <button className="text-[#004EEB] text-sm" type="button">Add secondary expertise</button>
                    </div>
                    <div className="mb-2 relative w-[40%]">
                        <label className="block text-sm text-[#364152] font-medium mb-1">Years of experience <span className="text-[#155EEF]">*</span></label>

                        <Select


                            options={yearOptions}
                            value={yearsOfExperience}
                            onChange={setYearsOfExperience}
                            styles={selectStyles}
                            className="basic-single-select"
                            classNamePrefix="select"
                            placeholder="Add Experience"
                        />

                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-[#364152]">Relevant categories <span className="text-[#155EEF]">*</span></label>
                        <Select
                            isMulti
                            options={categoryOptions}
                            value={categories}
                            onChange={setCategories}
                            styles={selectStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Add Relevant Categories"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1  text-[#364152]">Relevant skills</label>
                        <Select
                            isMulti
                            options={skillOptions}
                            value={skills}
                            onChange={setSkills}
                            styles={selectStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Add your Skills"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-[#364152]">Relevant tools</label>
                        <Select
                            isMulti
                            options={toolOptions}
                            value={tools}
                            onChange={setTools}
                            styles={selectStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Add Tools"
                        />
                    </div>
                    <div className="mb-2 relative">
                        <label className="block text-sm font-medium mb-1 text-[#364152]">Education</label>
                        <Select
                            options={EducationOptions}
                            value={education}
                            onChange={setEducation}
                            styles={selectStyles}
                            className="basic-single-select"
                            classNamePrefix="select"
                            placeholder="Add Education"
                        />


                    </div>
                    <div className="mb-2 relative">
                        <Select
                            options={DisciplineOptions}
                            value={discipline}
                            onChange={setDiscipline}
                            styles={selectStyles}
                            className="basic-single-select"
                            classNamePrefix="select"
                            placeholder="Add Discipline"
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
                </form>
            </div>

        </div>
    );
};
export default Mentormodal1;