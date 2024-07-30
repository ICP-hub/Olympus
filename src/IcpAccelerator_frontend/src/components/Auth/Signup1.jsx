import { setUncaughtExceptionCaptureCallback } from 'process';
import React from 'react';
import Layer1 from "../../../assets/Logo/Layer1.png";
import Aboutcard from "../Auth/Aboutcard"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
<<<<<<< Updated upstream

=======
import { Link } from "react-router-dom"
import AboutcardSkeleton from '../LatestSkeleton/AbourcardSkeleton';
>>>>>>> Stashed changes
const Signupmain = () => {
    return (
        <>
            <div className="py-16 flex items-center justify-center bg-[#FFF4ED] rounded-xl">
                <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-6xl">
                    <div className="w-1/2 p-8">
                        <div className="mb-6">
                            <img src={Layer1} alt="logo" />
                            <h2 className="  mb-2 mt-16 mx-12 text-[#364152]" >Step 1 of 3</h2>
                            <h1 className="text-4xl font-bold mx-12 text-[#121926]">What is your name?</h1>
                        </div>
                        <form className="space-y-4 mx-12">
                            <div className='flex justify-between space-x-2 gap-3'>
                                <div >
                                    <label className=" font-semibold block text-[#121926]">First name <span className='text-[#155EEF]'>*</span></label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full " placeholder="First name" />
                                </div>
                                <div >
                                    <label className="font-semibold block text-[#121926]">Last name <span className='text-[#155EEF]'>*</span></label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="Last name" />
                                </div>
                            </div>
                            <div>

                                <label className="block font-semibold text-[#121926]">Username <span className='text-[#155EEF]'>*</span></label>
                                <div className="flex items-center border border-gray-300 rounded">
                                    <span className="p-2 bg-gray-100 text-gray-600">@</span>
                                    <input type="text" className="p-2 w-full" placeholder="Username" />
                                </div>
                            </div>
<<<<<<< Updated upstream
                            <div className='flex justify-between'>
                                <button type="submit" className=" py-2 px-4  text-gray-600 rounded hover:text-black justify-end  "> <ArrowBackIcon fontSize="medium" className="mr-2" />Back</button>
                                <button type="submit" className=" py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 justify-end border-2 border-[#B2CCFF]">Continue <ArrowForwardIcon fontSize="medium" className="ml-2" /></button>
=======
                            <div className='flex justify-end'>
                                {/* <button type="submit" className=" py-2 px-4  text-gray-600 rounded hover:text-black justify-end  "> <ArrowBackIcon fontSize="medium" className="mr-2" />Back</button> */}
                                <Link to='/sign-up-step2'> <button type="submit" className=" py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 justify-end border-2 border-[#B2CCFF]">Continue <ArrowForwardIcon fontSize="medium" className="" /></button></Link>
>>>>>>> Stashed changes

                            </div>
                        </form>
                    </div>
                    {/* <Aboutcard /> */}
                    <AboutcardSkeleton />
                </div>

            </div>

        </>


    )
}
export default Signupmain;