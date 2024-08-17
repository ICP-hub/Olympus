import React, { useEffect, useRef } from 'react'
import EastIcon from '@mui/icons-material/East';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { briefcaseSvgIcon, userSvgIcon } from '../Utils/Data/SvgData';


const DiscoverMenu = ({ setDiscoverMenu, discoverMenu }) => {
    // const discoverRef = useRef(null);
    // useEffect(() => {
    //     function checkOutSideClick(e) {
    //         if (discoverRef.current && !discoverRef.current.contains(e.target)) {
    //             setDiscoverMenu(false);
    //         }
    //     }
    //     document.addEventListener("click", checkOutSideClick);

    //     return () => {
    //         document.removeEventListener("click", checkOutSideClick);
    //     };
    // }, [discoverMenu]);
    return (
        <div  className='absolute top-11 border rounded-xl w-[280px] z-40'>
            <div className=' bg-white border rounded-t-xl p-3'>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <div className=''><RocketLaunchOutlinedIcon sx={{ color: "gray" }} /></div>
                    <div className=''>
                        <h3 className='font-bold'>Projects</h3>
                        <p className='text-sm'>Lorem, ipsum dolor sit consectetur adipisicing elit.</p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <p className='text-lg'>{briefcaseSvgIcon}</p>
                    <div className=''>
                        <h3 className='font-bold'>Investors</h3>
                        <p className='text-sm'>Lorem, ipsum dolor consectetur adipisicing elit</p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <WorkspacePremiumOutlinedIcon sx={{ color: "gray" }} />
                    <div className=''>
                        <h3 className='font-bold'>Mentors</h3>
                        <p className='text-sm'>Lorem, ipsum dolor consectetur adipisicing elit. </p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <p className='text-xl'>{userSvgIcon}</p>
                    <div className=''>
                        <h3 className='font-bold'>Talent</h3>
                        <p className='text-sm'>Lorem, ipsum dolor consectetur adipisicing elit.</p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    {/* <FontAwesomeIcon icon="fa-light fa-chart-line" /> */}
                    <TrendingUpOutlinedIcon />
                    <div className=''>
                        <h3 className='font-bold'>Accelerators</h3>
                        <p className='text-sm'>Lorem, ipsum dolor consectetur adipisicing elit.</p>
                    </div>
                </div>
            </div>
            <div className='flex justify-center rounded-b-xl items-center bg-[#F8FAFC] w-full p-6  '>
                <h3 className='text-base text-[#004EEB]'>Explore platform <span className='pl-1'><EastIcon sx={{ color: "#004EEB" }} /></span></h3>
            </div>
        </div>
    )
}

export default DiscoverMenu