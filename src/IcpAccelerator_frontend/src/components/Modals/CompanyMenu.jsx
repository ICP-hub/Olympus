import React, { useEffect, useRef } from 'react'
import EastIcon from '@mui/icons-material/East';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const CompanyMenu = ({ setCompanyMenu, companyMenu }) => {
    const companyRef = useRef();
    useEffect(() => {
        function checkOutSideClick(e) {
            if (companyRef.current && !companyRef.current.contains(e.target)) {
                setCompanyMenu(false);
            }
        }
        document.addEventListener("click", checkOutSideClick);

        return () => {
            document.removeEventListener("click", checkOutSideClick);
        };
    }, [companyMenu]);
    return (
        <div ref={companyRef} className='absolute top-11 border rounded-xl w-[280px] z-40'>
            <div className=' bg-white border rounded-t-xl p-3'>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <div> <PhoneIphoneOutlinedIcon sx={{ color: "gray" }} /></div>
                    <div className=''>
                        <h3 className='font-bold'>Blog</h3>
                        <p className='text-sm'>The latest industry news, updates and info.</p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <AutoAwesomeOutlinedIcon sx={{ color: "gray" }} />
                    <div className=''>
                        <h3 className='font-bold'>Customer stories</h3>
                        <p className='text-sm'>Learn how our Customers are making big changes.</p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <PlayCircleFilledWhiteOutlinedIcon sx={{ color: "gray" }} />
                    <div className=''>
                        <h3 className='font-bold'>Video tutorials</h3>
                        <p className='text-sm'>Get up and running on new features and techniques. </p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <NoteAddOutlinedIcon sx={{ color: "gray" }} />
                    <div className=''>
                        <h3 className='font-bold'>Documentation</h3>
                        <p className='text-sm'>All the boring stuff that you(hopefully won't) need .</p>
                    </div>
                </div>
                <div className='flex gap-3 p-2 hover:bg-slate-100  rounded-md '>
                    <SportsSoccerOutlinedIcon sx={{ color: "gray" }} />
                    <div className=''>
                        <h3 className='font-bold'>Help and support</h3>
                        <p className='text-sm'>Learn, fix a problem and get answers to your questions.</p>
                    </div>
                </div>
            </div>
            <div className='flex justify-center rounded-b-xl items-center bg-[#F8FAFC] w-full p-6  '>
                <h3 className='text-base text-[#004EEB]'>All resources <span className='pl-1'><EastIcon sx={{ color: "#004EEB" }} /></span></h3>
            </div>
        </div>
    )
}

export default CompanyMenu