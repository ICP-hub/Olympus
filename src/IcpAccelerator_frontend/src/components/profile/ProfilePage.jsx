import React, { useState } from 'react'
import RedoIcon from '@mui/icons-material/Redo';
import ProfileDetail from './ProfileDetail';

import Role from './Role';
import { shareSvgIcon } from '../Utils/Data/SvgData';


const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("roles");

    const handleChange = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className='container mx-auto mb-5 bg-white'>
            <div className='flex justify-between items-center mx-[3%] h-11 my-5'>
                <div className=''>
                    <h2 className='text-2xl font-bold'>Profile</h2>
                </div>
                <div className='flex gap-4'>
                    <button className='border py-1 px-2 border-b-2 font-medium'>View public profile </button>
                    <button className='border border-b-2 py-1 flex items-center gap-2 px-2 font-medium'>Share <span>{shareSvgIcon}
                    </span> </button>
                </div>
            </div>
            <div className='container flex justify-evenly'>
                <div className='w-[30%] '>
                    <ProfileDetail />
                </div>
                <div className='w-[60%] '>
                    <div className="flex justify-start border-b">
                        <button
                            className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === 'roles' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-400'}`}
                            onClick={() => handleChange('roles')}
                        >
                            Roles
                        </button>
                        <button
                            className={`px-4 py-2 focus:outline-none font-medium ${activeTab === 'rating' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-400'}`}
                            onClick={() => handleChange('rating')}
                        >
                            Rating
                        </button>
                    </div>
                    <div className='w-full'>
                        {activeTab === "roles" ? <Role /> : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage