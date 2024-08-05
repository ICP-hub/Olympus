
import React, { useState, useEffect } from 'react';
import mentor from "../../../../assets/Logo/mentor.png";
import talent from "../../../../assets/Logo/talent.png";
import founder from "../../../../assets/Logo/founder.png";
import CreateProjectModal2 from "../../Home/modal2"; // Import the correct modal component
import { useNavigate } from 'react-router-dom';
const Modal1 = ({ isOpen, onClose }) => {
    const [modalOpen, setModalOpen] = useState(isOpen || true);
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    // Define the roles and their corresponding images
    const roles = [
        { name: 'Founder', image: founder, description: 'List your project, build connections, find investments' },
        { name: 'Investor', image: talent, description: 'Find promising projects, build your portfolio' },
        { name: 'Mentor', image: mentor, description: 'Provide consultations, build professional network' },
        // { name: 'Talent', image: talent, description: 'Find gigs or full-time job, build reputation' },
    ];

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

   
    const handleContinue = () => {
        if (selectedRole) {
            const currentLocation = window.location.pathname;
            switch (selectedRole) {
                case 'Founder':
                    navigate('/dashboard/project-sign-up', { state: { background: currentLocation } });
                    break;
                case 'Investor':
                    navigate('/dashboard/investor-sign-up', { state: { background: currentLocation } });
                    break;
                case 'Mentor':
                    navigate('/dashboard/mentor-sign-up', { state: { background: currentLocation } });
                    break;
                default:
                    break;
            }
            onClose(false);
        }
    };
    
    return (
        <>
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[500px]">
                    <div className="flex justify-end mr-4">
                        <button className='text-3xl text-[#121926]' onClick={() => onClose(false)}>&times;</button>
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Choose a role</h2>
                        <p className="text-gray-600 mb-6">
                            Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra.
                        </p>
                        <div className="flex flex-col space-y-2">
                            {roles.map((role, index) => (
                                <label key={index} className="flex items-center justify-between px-2 border rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => handleRoleSelect(role.name)}>
                                    <div className="flex items-center">
                                        <img src={role.image} alt={role.name} className="rounded-full mr-4" />
                                        <div>
                                            <span className="ml-4">
                                                <span className=" font-semibold -mt-2 justify-start flex">{role.name}</span>
                                                <span className="block text-gray-600 text-sm">{role.description}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="role"
                                            className={`h-4 w-4 text-blue-600 border border-black rounded-full cursor-pointer ${selectedRole === role.name ? 'bg-blue-600' : ''}`}
                                            checked={selectedRole === role.name}
                                            readOnly
                                        />
                                        {selectedRole === role.name && (
                                            <div className="rounded-s-full"></div>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                        <button
                             onClick={handleContinue}
                            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
            {/* {showCreateProjectModal && (
                <CreateProjectModal2 isOpen={showCreateProjectModal} onClose={handleCloseCreateProjectModal} />
            )} */}
        </>
    );
};

export default Modal1;

