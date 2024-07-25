import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link } from "react-router-dom"
const ProfileDetail = () => {
    return (
        <div className='container max-w-[400px] w-[30%] '>
            <div className='relative rounded-lg pb-5 mb-2 bg-[#EEF2F6]'>
                <div className='w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700'>
                    <div className="bg-green-500 h-1.5 rounded-full dark:bg-gray-700 " style={{ width: "65%" }}></div></div>
                <div className='absolute top-5 right-4'><MoreVertIcon /></div>
                <div className='flex justify-center'>
                    <div className="bg-gray-200  rounded-full p-4 mb-4">
                        <svg className="w-9 h-9 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center mb-5'>
                    <h2 className='font-bold text-lg'><span><VerifiedIcon sx={{ color: "#155EEF" }} /></span>Matt Bowers</h2>
                    <p className=''>@mattbowers</p>
                </div>
                <div className='flex justify-center items-center'>
                    <button className='border rounded-md bg-[#155EEF] py-1 px-5  text-white'>Get in touch <span className='pl-1 text-white'></span><ArrowOutwardIcon /></button>
                </div>
            </div>
            <div className='p-4'>
                <div className='p-1'>
                    <h3 className='text-xs pb-2 font-normal text-gray-400'>ROLES</h3>
                    <button className='text-[#026AA2] border rounded-lg text-xs p-1 font-semibold bg-[#B9E6FE] '>OLYMPIAN</button>
                </div>
                <hr />
                <div className='p-1 '>
                    <h3 className='text-xs pb-2 font-normal text-gray-400'>EMAIL</h3>
                    <div className='flex p-1'> <p className=' text-sm '>mail@gmail.com <span className=''><VerifiedIcon sx={{ color: "#155EEF", size: "xtraSmall" }} /></span></p>
                        <button className=' text-xs font-normal'>HIDDEN</button></div>
                </div>
                <div className=''>
                    <h3 className=''>TAGLINE</h3>
                    <p className=''>Founder & CEO Cypherpunks Lab</p>
                </div>
                <div className=''>
                    <h3 className=''>ABOUT</h3>
                    <p className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, corporis!</p>
                </div>
                <div className=''>
                    <h3 className=''>INTERESTS</h3>
                    <div className='flex'>
                        <button className='' >WEB3</button>
                        <button className='' >Cryptography</button>
                    </div>
                </div>
                <div className=''>
                    <h3 className=''>LOCATION</h3>
                    <p className=''><span className=''><LocationOnOutlinedIcon /></span>San Diego,CA</p>
                </div>
                <div className=''>
                    <h3 className=''>TIMEZONE</h3>
                    <button className=''><span className=''>+</span>Add timezone</button>
                </div>
                <div className=''>
                    <h3 className=''>LANGUAGES</h3>
                    <button className=''><span className=''>+</span>Add languages</button>
                </div>
                <div className=''>
                    <h3 className=''>LINKS</h3>
                    <div className=''>
                        <Link to={"#"}>
                            <img src='../../../../assets/images/icons/Linkedinicon.png' alt='LinkedIn' />
                        </Link>
                        <Link to={"#"}>
                            <img src='../../../../assets/images/icons/gitHubicon.png' alt='gitHub' />
                        </Link>
                        <Link to={"#"}>
                            <img src='../../../../assets/images/icons/telegramicon.png' alt='Telegram' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileDetail