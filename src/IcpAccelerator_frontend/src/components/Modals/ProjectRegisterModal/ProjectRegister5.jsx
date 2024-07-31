import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';


const ProjectRegister5 = ({ isOpen, onClose, onBack }) => {

    const [formData, setFormData] = useState({
        promotionvideolink: '',
        projectdiscord: '',
        projectlinkedin: '',
        whitepaper: '',
        tokenomics: '',
        projectgithub: '',

    });

    const [modalOpen, setModalOpen] = useState(isOpen || true);


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
                <h2 className="text-xs text-[#364152] mb-3">Step 5 of 6</h2>
                <form onSubmit={handleSubmit}>








                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Promotion video link</label>
                        <input
                            type="url"
                            name="promotionvideolink"
                            value={formData.promotionvideolink}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                            placeholder='https://'
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project Discord</label>
                        <input
                            type="url"
                            name="projectdiscord"
                            value={formData.projectdiscord}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                            placeholder='https://'
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project LinkedIn</label>
                        <input
                            type="url"
                            name="projectlinkedin"
                            value={formData.projectlinkedin}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                            placeholder='https://'
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Project GitHub</label>
                        <input
                            type="url"
                            name="projectgithub"
                            value={formData.projectgithub}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                            placeholder='https://'
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Tokenomics</label>
                        <input
                            type="url"
                            name="tokenomics"
                            value={formData.tokenomics}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                            placeholder='https://'
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Whitepaper</label>
                        <input
                            type="url"
                            name="whitepaper"
                            value={formData.whitepaper}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                            required
                            placeholder='https://'
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

export default ProjectRegister5;