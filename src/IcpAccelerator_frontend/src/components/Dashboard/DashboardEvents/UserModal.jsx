import React from 'react';
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { LinkedIn, GitHub, Telegram ,} from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';

const UserModal = ({ openDetail, setOpenDetail, userData }) => {

    return (
<div
  className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 ${
    openDetail ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
  }`}
>
{openDetail && userData && 
            <div className={`mx-auto w-full sm0:w-auto lg1:w-[30%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${openDetail ? 'translate-x-0' : 'translate-x-full'} z-20`}>
                <div className='p-5 '>
                    <CloseIcon sx={{ cursor: "pointer" }} onClick={() => setOpenDetail(false)} />
                </div>
                <div className='container h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto'>
                    <div className="flex justify-center p-4">
                        <div className="container bg-white rounded-lg shadow-sm p-4 overflow-hidden w-full max-w-[400px]">
                            <div className="p-6 bg-gray-100">
                                <img src={userData.profileImage} alt={userData.fullname} className="w-24 h-24 mx-auto rounded-full mb-4" />
                                <div className="flex items-center justify-center mb-1">
                                    <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
                                    <h2 className="text-xl font-semibold">{userData.fullname}</h2>
                                </div>
                                <p className="text-gray-600 text-center mb-4">@{userData.username}</p>
                                <div className="flex justify-center items-center">
                                    <a 
                                        href={`mailto:${userData.email}`} // Use mailto link to open email client
                                        className="w-[80%] text-center h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
                                    >
                                        Get in touch
                                        <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
                                    </a>
                                </div>
                            </div>
                            <div className="p-0 bg-white">
                                <div className="my-3">
                                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Roles</h3>
                                    <div className="flex space-x-2">
                                        <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">OLYMPIAN</span>
                                    </div>
                                </div>
                                <hr />
                                <div className='px-1'>
                                    
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase mt-2">About</h3>
                                        <p className="text-sm">{userData.about}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Interests</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {userData.interests.map((interest) => (
                                                <span key={interest} className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 ">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Reason to join</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {userData.reason.map((reasontojoin) => (
                                                <span key={reasontojoin} className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 ">
                                                    {reasontojoin}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Location</h3>
                                        <div className="flex items-center">
                                            <PlaceOutlinedIcon className="text-gray-500 mr-1" fontSize="small" />
                                            <p className="text-sm">{userData.location}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">LINKS</h3>
                                        <div className="flex items-center space-x-8">
                                            <a href={userData.email} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                <EmailIcon className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                                            </a>
                                            {/* <a href={userData.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                <GitHub className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                                            </a>
                                            <a href={userData.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                <Telegram className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                                            </a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
};

export default UserModal;
