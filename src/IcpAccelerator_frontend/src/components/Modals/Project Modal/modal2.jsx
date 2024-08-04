import React, { useState, useEffect } from 'react';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateProjectModal2 from '../../Home/modal3'; // Ensure the import is correct
import { useNavigate } from 'react-router-dom';
import Modal1 from './modal1';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState('');
    const [username, setUsername] = useState('');
    const [suggestedUsernames, setSuggestedUsernames] = useState([
        'cypherpunk_labs',
        'cypherpunk1',
        'cypherpunk_official'
    ]);

    const [modalOpen, setModalOpen] = useState(isOpen || true);
    const [showCreateProjectModal2, setShowCreateProjectModal2] = useState(false);
    const [showModal1, setShowModal1] = useState(false);

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

    const handleBack = () => {
        setShowModal1(true);
        setModalOpen(false);
    }

    const handleContinue = () => {
        setShowCreateProjectModal2(true);
        setModalOpen(false); // Close the current modal
    };

    const handleCloseCreateProjectModal2 = () => {
        setShowCreateProjectModal2(false);
        setModalOpen(true); // Reopen the current modal
    };

    const handleBackToStep1 = () => {
        setShowCreateProjectModal2(false);
        setModalOpen(true); // Reopen the current modal
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[500px]">
                    <div className="flex justify-end mr-4">
                        <button className='text-3xl text-[#121926]' onClick={() => setModalOpen(false)}>&times;</button>
                    </div>
                    <div className="p-6">
                        <h2 className="text-sm text-[#364152]">Step 1 of 2</h2>
                        <h1 className="text-4xl text-[#121926] font-bold mb-4">Create a project</h1>
                        <div className="mb-4">
                            <label htmlFor="project-name" className="block text-sm font-medium text-[#121926]">
                                Project name <span className='text-[#155EEF]'>*</span>
                            </label>
                            <input
                                type="text"
                                id="project-name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="mt-1 p-2 block w-full border border-[#CDD5DF] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder='Cyperhunks Labs'
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username<span className='text-[#155EEF]'>*</span>
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">@</span>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-7 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder='cyperhunkslabs'
                                />
                            </div>
                            <p className="mt-2 text-sm text-green-600">This username is available</p>
                            <ul className="mt-2 text-sm text-blue-600 space-y-1">
                                {suggestedUsernames.map((name, index) => (
                                    <li key={index} className="cursor-pointer hover:underline">
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex justify-between ">
                            <button
                                onClick={handleBack}
                                className="text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 border border-[#CDD5DF]"
                            >
                                <ArrowBackIcon fontSize="small" className="mr-2" /> Back
                            </button>
                            <button
                                onClick={handleContinue}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Continue <ArrowForwardIcon fontSize="small" className="mr-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showCreateProjectModal2 && (
                <CreateProjectModal2 isOpen={showCreateProjectModal2} onClose={handleCloseCreateProjectModal2} onBack={handleBackToStep1} />
            )}
            {showModal1 && (
                <Modal1 isOpen={showModal1} onClose={() => setShowModal1(false)} />
            )}
        </>
    );
};

export default CreateProjectModal;
