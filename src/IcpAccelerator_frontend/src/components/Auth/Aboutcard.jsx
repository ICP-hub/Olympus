import React from 'react';
import Layer1 from "../../../assets/Logo/Layer1.png";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
const Aboutcard = () => {
    return (
        <div className="w-1/2 bg-gradient-to-r from-[#ECE9FE] to-[#FFFFFF] items-center justify-center rounded-r-2xl">



            <div className="bg-white mx-auto my-10  rounded-lg shadow-md w-3/4">
                <div className='w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700'>
                    <div className="bg-green-500 h-1.5 rounded-full dark:bg-gray-700 " style={{ width: "45%" }}></div></div>
                <div className='p-6'>
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-200 rounded-full p-4 mb-4">
                            <svg className="w-9 h-9 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold">Matt Bowers</h2>
                        <span className="">@mattbowers</span>
                    </div>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-gray-700 pb-2">Roles</label>
                            <span className="bg-[#EFF4FF]  text-blue-600  border border-blue-300 rounded-lg px-4 pb-1 font-semibold">OLYMPIAN</span>
                        </div>
                        <div>
                            <label className="block text-gray-700 pb-2">Email</label>

                            <input type="text" className="mt-1 p-2 text-gray-700 border border-gray-300 rounded w-full bg-gray-100" placeholder="example@example.com" />
                        </div>
                        <div>
                            <label className="block text-gray-700 pb-2">About</label>

                            <input type="text" className="mt-1 p-2 text-gray-700 border border-gray-300 rounded w-full bg-gray-100" placeholder="Write about yourself" />
                        </div>
                        <label className="block text-gray-700">Interests</label>
                        <div className="flex space-x-2">

                            <div className="bg-gray-100 p-2 rounded-full border border-gray-300 hover:bg-gray-300">
                                Sports
                            </div>
                            <div className="bg-gray-100 p-2 rounded-full border border-gray-300 hover:bg-gray-300 ">
                                Music
                            </div>

                        </div>
                        <div>
                            <label className="block text-gray-700 pb-2">Location</label>

                            <input type="text" className="mt-1 p-2 text-gray-700 border border-gray-300 rounded w-full bg-gray-100" placeholder="City, Country" />
                        </div>
                        <label className="block text-gray-700">Links</label>
                        <div className="flex space-x-2">

                            <div className=" p-2 rounded flex items-center justify-center">

                                <LinkedInIcon fontSize="large" style={{ color: 'gray' }} className="hover:bg-gray-300" />
                            </div>
                            <div className="  rounded flex items-center justify-center">

                                <GitHubIcon fontSize="large" style={{ color: 'gray' }} />
                            </div>
                            <div className="p-2 rounded flex items-center justify-center">

                                <TelegramIcon fontSize="large" style={{ color: 'gray' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Aboutcard;