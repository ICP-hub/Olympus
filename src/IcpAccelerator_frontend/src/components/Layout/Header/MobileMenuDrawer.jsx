import React from 'react'
import EastIcon from '@mui/icons-material/East';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const MobileMenuDrawer = ({ openMenu, setOpenMenu }) => {
    return (
        <div className='container absolute top-0 left-0 w-[220px] h-full border  bg-gray-300 z-50'>
            <div className='flex mt-[10%] px-1 flex-wrap mb-2 justify-between '>
                <button className=' p-2 font-semibold'>Log in </button>
                <button className='border rounded bg-[#155EEF] p-2 font-semibold text-white'>Get started <span className='pl-1 text-white'><EastIcon /></span></button>
            </div>
            <ul className='flex flex-col mx-auto '>
                <li className='ml-3 p-1 border-b '>Discover<span
                ><NavigateNextIcon /></span> </li>
                <li className='ml-3 p-1 border-b'>Events</li>
                <li className='ml-3 p-1 border-b'>Blogs</li>
                <li className='ml-3 p-1 border-b'>Company <span><NavigateNextIcon /></span></li>
            </ul>

        </div>
    )
}

export default MobileMenuDrawer