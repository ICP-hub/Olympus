import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link } from "react-router-dom"
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

const ProfileDetail = () => {
    return (
        <div className='container  max-w-[400px]  border-2 rounded-xl'>
            <div className='relative rounded-t-lg pb-5 mb-2 bg-[#EEF2F6]'>
                <div className='w-full  bg-[#EEF2F6] rounded-l-xl rounded-r-full h-1.5 mb-4 dark:bg-[#EEF2F6]'>
                    <div className="bg-green-500 h-1.5 rounded-l-full dark:bg-gray-700 " style={{ width: "65%" }}></div></div>
                <div className='absolute top-5 right-4'><MoreVertIcon /></div>
                <div className='flex justify-center'>
                    <div className="bg-gray-200  rounded-full p-4 mb-4">
                        <svg className="w-9 h-9 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center mb-5'>
                    <h2 className='font-bold text-lg'><span><VerifiedIcon sx={{ color: "#155EEF", fontSize: "medium" }} /></span>Matt Bowers</h2>
                    <p className=''>@mattbowers</p>
                </div>
                <div className='flex justify-center items-center'>
                    <button className='border rounded-md bg-[#155EEF] py-1 px-5  text-white'>Get in touch <span className='pl-1 text-white'></span><ArrowOutwardIcon sx={{ marginTop: "-6px", fontSize: "medium" }} /></button>
                </div>
            </div>
            <div className='p-4'>
                <div className='p-1'>
                    <h3 className='text-xs pb-2 font-normal text-gray-400'>ROLES</h3>
                    <button className='text-[#026AA2] border rounded-md text-xs p-1 font-semibold bg-[#F0F9FF] '>OLYMPIAN</button>
                </div>
                <hr />
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>EMAIL</h3>
                    <div className='flex gap-2'>
                        <p className=' text-sm font-medium '>mail@gmail.com <span className='ml-2'><VerifiedIcon sx={{ color: "#155EEF", fontSize: "small" }} /></span></p>
                        <button className=' text-xs font-medium border p-1 rounded-md bg-[#F0F9FF]  '>HIDDEN</button></div>
                </div>
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>TAGLINE</h3>
                    <p className='text-sm font-medium '>Founder & CEO Cypherpunks Lab</p>
                </div>
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>ABOUT</h3>
                    <p className='text-sm font-medium '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, corporis!</p>
                </div>
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>INTERESTS</h3>
                    <div className='flex gap-2'>
                        <button className='border-2 rounded-3xl  px-2 text-sm font-medium ' >Web3</button>
                        <button className='border-2 rounded-3xl py-1 px-2 text-sm font-medium ' >Cryptography</button>
                    </div>
                </div>
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>LOCATION</h3>
                    <p className='text-sm font-medium'><span className='mr-2'><LocationOnOutlinedIcon sx={{ color: "gray" }} /></span>San Diego,CA</p>
                </div>
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>TIMEZONE</h3>
                    <button className='text-sm font-medium w-full border rounded-lg mx-auto p-1 bg-gray-100 text-start'><span className='p-2 font-normal text-2xl'>+</span>Add timezone</button>
                </div>
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>LANGUAGES</h3>
                    <button className='text-sm font-medium w-full border rounded-lg mx-auto p-1 bg-gray-100 text-start'><span className='p-2 font-normal text-2xl'>+</span>Add languages</button>
                </div>
                <div className='p-1 mt-2'>
                    <h3 className='text-xs pb-2 text-gray-400 font-normal'>LINKS</h3>
                    <div className='flex gap-3'>
                        <Link to={"#"}>
                            <LinkedInIcon sx={{ color: "gray" }} />
                        </Link>
                        <Link to={"#"}>
                            <GitHubIcon sx={{ color: "gray" }} />
                        </Link>
                        <Link to={"#"}>
                            <TelegramIcon sx={{ color: "gray" }} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileDetail