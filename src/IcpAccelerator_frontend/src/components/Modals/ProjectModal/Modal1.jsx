import React, { useState, useEffect } from 'react';
import founder from "../../../../assets/Logo/mentor.png";
import mentor from "../../../../assets/Logo/talent.png";
import project from "../../../../assets/Logo/founder.png";
import investor from "../../../../assets/Logo/investor.png";
import ProjectRegisterMain from '../ProjectRegisterModal/ProjectRegisterMain';
import MentorSignupMain from '../Mentor-Signup-Model/MentorsignUpmain';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import InvestorForm from '../investorForm/InvestorForm';

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
        setModalOpen(true);
        setSelectedRole(null);
        setShowRoleModal(false);
    }
}, [isOpen]);

const roles = [
    { name: 'user', image: founder, description: 'List your project, build connections, find investments' },
    { name: 'project', image: project, description: 'List your project, build connections, find investments' },
    { name: 'vc', image: investor, description: 'Find promising projects, build your portfolio' },
    { name: 'mentor', image: mentor, description: 'Provide consultations, build professional network' },
];

function mergeData(backendData, additionalData) {
    return backendData.map(item => {
        const additionalInfo = additionalData.find(data => data.name.toLowerCase() === item.name.toLowerCase());
        return additionalInfo ? { ...item, ...additionalInfo } : item;
    });
}

const mergedData = mergeData(userCurrentRoleStatus, roles);

const handleRoleSelect = (role) => {
    setSelectedRole(role);
};

const handleContinue = () => {
    setModalOpen(false);
    setShowRoleModal(true);
};

const isRoleApproved = (roles, specificRoles) => {
  return roles.some(
    (role) =>
      specificRoles.includes(role.name) && role.approval_status === "approved"
  );
};

const renderSelectedModal = () => {
    switch (selectedRole) {
        case 'project':
            return <ProjectRegisterMain />;
        case 'vc':
            return <InvestorForm />;
        case 'mentor':
            return <MentorSignupMain />;
        default:
            return null;
    }
};


   

const clickEventHandler = async (roleName, status) => {
    if (status === "request") {
        navigate(redirectPath(roleName));
        onClose();
    } else if (status === "switch") {
        setIsChecked(false)
        await dispatch(
            switchRoleRequestHandler({
                roleName,
                newStatus: "active",
            })
        );
        onClose();
    } else {
    }
};

return (
  <>
    {modalOpen && (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[500px] mx-4 md:mx-0">
          <div className="flex justify-end mr-4">
            <button
              className="text-3xl text-[#121926]"
              onClick={() => {
                onClose();
                setModalOpen(false);
              }}
            >
              &times;
            </button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Choose a role</h2>
            <p className="text-gray-600 mb-6">
              Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque
              convallis quam feugiat non viverra.
            </p>
            {/* <div className="flex flex-col space-y-2">
                            {mergedData.map((role, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center justify-between px-2 border rounded-lg cursor-pointer hover:bg-gray-100 
             ${role.approval_status === 'approved' ? 'opacity-50 cursor-not-allowed' : ''} 
             ${role.approval_status === 'default' ? 'opacity-100' : ''}`}
                                    onClick={() => {
                                        if (role.approval_status !== 'approved') {
                                            handleRoleSelect(role.name);
                                        }
                                    }}
                                >
                                    <div className="flex items-center py-2">
                                        <img src={role.image} alt={role.name} className="rounded-full"    loading="lazy"
                    draggable={false}/>
                                        <div className="flex">
                                            <span className="ml-4">
                                                <span className="font-semibold -mt-2 justify-start flex capitalize">{role.name ==='vc'?'investor':role.name}</span>
                                                <span className="block text-gray-600 text-sm line-clamp-2 break-all">{role.description}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="role"
                                            className={`h-4 w-4 text-blue-600 border border-black rounded-full cursor-pointer 
                 ${role.approval_status === 'approved' ? 'text-blue-600 bg-blue-600' : ''} 
                 ${selectedRole === role.name ? 'bg-blue-600' : ''}`}
                                            checked={selectedRole === role.name}
                                            onChange={() => handleRoleSelect(role.name)}
                                            disabled={role.approval_status === 'approved'}
                                        />
                                        {selectedRole === role.name && (
                                            <div className="rounded-full"></div>
                                        )}
                                    </div>
                                </label>

                            ))}
                        </div> */}
            <div className="flex flex-col space-y-2">
              {mergedData.map((role, index) => (
                <label
                  key={index}
                  className={`flex items-center justify-between px-2 border rounded-lg cursor-pointer hover:bg-gray-100 
             ${
               role.approval_status === "approved" ||
               (role.name === "project" &&
                 isRoleApproved(mergedData, ["vc", "mentor"]))
                 ? "opacity-50 cursor-not-allowed"
                 : ""
             } 
             ${role.approval_status === "default" ? "opacity-100" : ""}`}
                  onClick={() => {
                    if (
                      role.approval_status !== "approved" &&
                      !(
                        role.name === "project" &&
                        isRoleApproved(mergedData, ["vc", "mentor"])
                      )
                    ) {
                      handleRoleSelect(role.name);
                    }
                  }}
                >
                  <div className="flex items-center py-2">
                    <img
                      src={role.image}
                      alt={role.name}
                      className="rounded-full"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="flex">
                      <span className="ml-4">
                        <span className="font-semibold -mt-2 justify-start flex capitalize">
                          {role.name === "vc" ? "investor" : role.name}
                        </span>
                        <span className="block text-gray-600 text-sm line-clamp-2 break-all">
                          {role.description}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="role"
                      className={`h-4 w-4 text-blue-600 border border-black rounded-full cursor-pointer 
                     ${
                       role.approval_status === "approved"
                         ? "text-blue-600 bg-blue-600"
                         : ""
                     } 
                     ${selectedRole === role.name ? "bg-blue-600" : ""}`}
                      checked={selectedRole === role.name}
                      onChange={() => handleRoleSelect(role.name)}
                      disabled={
                        role.approval_status === "approved" ||
                        (role.name === "project" &&
                          isRoleApproved(mergedData, ["vc", "mentor"]))
                      }
                    />
                    {selectedRole === role.name && (
                      <div className="rounded-full"></div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`mt-6 w-full text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                            ${
                              !selectedRole
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600"
                            }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )}

    {showRoleModal && renderSelectedModal()}
  </>
);
};

export default Modal1;