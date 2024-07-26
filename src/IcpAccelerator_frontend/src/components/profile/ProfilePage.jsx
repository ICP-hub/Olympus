import React, { useState } from 'react'
import RedoIcon from '@mui/icons-material/Redo';
import ProfileDetail from './ProfileDetail';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Role from './Role';


const ProfilePage = () => {
    const [value, setValue] = useState("roles");

    const handleChange = (e, newVal) => {
        setValue(newVal)
    }

    return (
        <div className='container mx-auto mb-5'>
            <div className='flex justify-between items-center mx-[3%] h-11 my-5'>
                <div className=''>
                    <h2 className='text-2xl font-bold'>Profile</h2>
                </div>
                <div className='flex gap-4'>
                    <button className='border py-1 px-2'>View public profile </button>
                    <button className='border py-1 px-2'>Share <span><RedoIcon /></span> </button>
                </div>
            </div>
            <div className='container flex justify-evenly'>
                <div className='w-[30%] '>
                    <ProfileDetail />
                </div>
                <div className='w-[60%] '>
                    <div className=''>
                        <Box sx={{}}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                            >
                                <Tab value="roles" label="Roles" />
                                <Tab value="rating" label="Rating" />
                            </Tabs>
                        </Box>
                    </div>
                    <div className='w-full'>
                        {value === "roles" ? <Role /> : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage