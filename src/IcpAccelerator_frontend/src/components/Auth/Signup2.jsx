
import React from 'react';
import Layer1 from "../../../assets/Logo/Layer1.png";
import Aboutcard from "../Auth/Aboutcard";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, useNavigate } from "react-router-dom";



const Signupmain2 = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="py-16 flex items-center justify-center bg-[#FFF4ED] rounded-xl">
                <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-6xl">
                    <div className="w-1/2 p-8">
                        <div className="mb-6">
                            <img src={Layer1} alt="logo" />
                            <h2 className="  mb-2 mt-16 mx-12 text-[#364152]">Step 2 of 3</h2>
                            <h1 className="text-4xl font-bold mx-12 text-[#121926]">What's your email?</h1>
                        </div>
                        <form className="space-y-4 mx-12">
                            {/* <div className='flex justify-between'> */}
                            <div >
                                <label className=" font-semibold block text-[#121926]">Email <span className='text-[#155EEF]'>*</span></label>
                                <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="First name" />
                            </div>

                            <div className='flex justify-between'>
                                <button type="button" onClick={() => navigate(-1)} className=" py-2  pr-4  text-gray-600 rounded hover:text-black justify-end hover:bg-gray-100 "> <ArrowBackIcon fontSize="medium" className='mr-2' />Back </button>
                                <Link to='/sign-up-step3-complete-profile'><button type="submit" className="px-4 py-2  bg-[#D1E0FF] text-white rounded hover:bg-blue-600 justify-end border-2 border-[#B2CCFF]">Continue <ArrowForwardIcon fontSize="medium" className="ml-2" /></button></Link>

                            </div>
                        </form>
                    </div>
                    <Aboutcard />
                </div>

            </div>

        </>


    )
}
export default Signupmain2;