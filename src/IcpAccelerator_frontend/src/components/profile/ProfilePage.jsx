import React from 'react'
import ProfileDetail from './ProfileDetail';
// import forward from "../../../../assets/images/icons/Icon.png"

const ProfilePage = () => {
    return (
        <div className='container mx-auto'>
            <div className='flex mx-auto justify-between items-center h-11 my-5'>
                <div className=''>
                    <h2 className='text-2xl font-bold'>Profile</h2>
                </div>
                <div className='flex gap-4'>
                    <button className='border py-1 px-2'>View public profile </button>
                    <button className='border py-1 px-2'>Share <span><img src="" alt='forward' /></span> </button>
                </div>
            </div>
            <div className='container'>
                <div className=''>
                    <ProfileDetail />
                </div>
                <div className=''>

                </div>
            </div>
        </div>
    )
}

export default ProfilePage