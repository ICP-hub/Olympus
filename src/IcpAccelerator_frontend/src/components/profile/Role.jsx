import React, { useState } from 'react'
import VerifiedIcon from '@mui/icons-material/Verified';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import awtar from "../../../assets/images/icons/gitHubicon.png"
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import Modal1 from '../Modals/Project Modal/modal1';
import { animatedLeftSvgIcon, animatedRightSvgIcon, userPlusIcon } from '../Utils/Data/SvgData';

const Role = () => {
    const [role, setRole] = useState(false)
    return (
        <div className='flex flex-col'>
            <div className='flex justify-center items-center  w-full  mt-[2%] '>
                <div className='border-2 rounded-lg pb-5 text-center min-w-[280px] max-w-[350px] '>
                    <div className='w-full  bg-[#EEF2F6] rounded-l-xl rounded-r-full h-1.5 mb-4 dark:bg-[#EEF2F6]'>
                        <div className="bg-green-500 h-1.5 rounded-l-full dark:bg-gray-700 " style={{ width: "55%" }}></div></div>
                    <div className='flex justify-center'>
                        <div className="bg-gray-200  rounded-full p-4 mb-4">
                            <svg className="w-9 h-9 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>
                    <div className='mb-1 text-center'>
                        <button className='text-[#026AA2] border rounded-md text-xs p-1 font-semibold bg-[#F0F9FF] '>OLYMPIAN</button>
                    </div>
                    <div className='flex flex-col justify-center items-center mb-3'>
                        <h2 className='font-bold text-lg'><span><VerifiedIcon sx={{ fontSize: "medium", color: "#155EEF" }} /></span>Matt Bowers</h2>
                        <p className=''>@mattbowers</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <p className='font-normal'>Roles: <span className='font-medium text-sm'>0/2</span></p>
                    </div>
                </div>

            </div>
            <div className='flex justify-center  '>
                <div className="">{animatedLeftSvgIcon} </div>
                <div className="">{animatedRightSvgIcon} </div>
            </div>
            <div className="flex justify-around items-center">
                <div className='border-2 rounded-lg text-center min-w-[220px] max-w-[350px] '>
                    <div className='p-3 flex justify-center mt-5 '>
                        <AvatarGroup max={4}>
                            <Avatar alt="Remy Sharp" src={awtar} />
                            <Avatar alt="Travis Howard" src={awtar} />
                            <Avatar alt="Cindy Baker" src={awtar} />
                            <Avatar alt="Agnes Walker" src={awtar} />
                        </AvatarGroup>
                    </div>
                    <div className='mt-5 px-5'>
                        <p className='max-w-[250px] '>Extend your profile with roles to seize new opportunites</p>
                    </div>
                    <div className='my-5  px-5 flex items-center ' >
                        <button onClick={() => setRole(true)} className='border flex gap-2 justify-center rounded-md bg-[#155EEF] p-2  font-medium w-full text-white'><span className=''>{userPlusIcon} </span>Add a role </button>
                    </div>
                    {role === true && <Modal1 isOpen={role} onClose={setRole} />}
                </div>
                <div className='border-2 rounded-lg text-center min-w-[220px] max-w-[350px] '>
                    <div className='p-3 flex justify-center mt-5 '>
                        <AvatarGroup max={4}>
                            <Avatar alt="Remy Sharp" src={awtar} />
                            <Avatar alt="Travis Howard" src={awtar} />
                            <Avatar alt="Cindy Baker" src={awtar} />
                            <Avatar alt="Agnes Walker" src={awtar} />
                        </AvatarGroup>
                    </div>
                    <div className='mt-5 px-5'>
                        <p className='max-w-[250px]'>Extend your profile with roles to seize new opportunites</p>
                    </div>
                    <div className='my-5  px-5 flex items-center' >
                        <button onClick={() => setRole(true)} className='border flex gap-2 justify-center  rounded-md bg-[#155EEF] p-2  font-medium w-full text-white'><span className=''>{userPlusIcon} </span>Add a role </button>
                    </div>
                    {role === true && <Modal1 isOpen={role} onClose={setRole} />}
                </div>
            </div>
        </div>

    )
}

export default Role