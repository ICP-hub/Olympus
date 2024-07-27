import { setUncaughtExceptionCaptureCallback } from 'process';
import React from 'react';
import Layer1 from "../../../assets/Logo/Layer1.png";
import Aboutcard from "../Auth/Aboutcard"
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Link} from "react-router-dom"
const Signupmain3 = () => {

    const [code, setCode] = useState(new Array(5).fill(""));

    const handleChange = (e, index) => {
        if (isNaN(e.target.value)) return false;
        setCode([...code.map((d, idx) => (idx === index ? e.target.value : d))]);
    };
    return (
        <>
            <div className="py-16 flex items-center justify-center bg-[#FFF4ED] rounded-xl">
                <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-6xl">
                    <div className="w-1/2 p-8">
                        <div className="mb-6">
                            <img src={Layer1} alt="logo" />
                            <h2 className=" font-semibold mb-2 mt-16 mx-12">Step 2 of 3</h2>
                            <h1 className="text-3xl font-bold mx-12">Verify email</h1>
                        </div>
                        <form className="space-y-4 mx-12">
                            <div className="flex flex-col  space-y-4">
                                <div className="flex space-x-2">
                                    {code.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            className="w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={data}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-gray-600">
                                Didn’t receive the code? <a href="#" className="text-blue-600">Send again</a>
                            </div>


                            <div className='flex justify-between'>
                                <button type="submit" className=" py-2 px-4  text-gray-600 rounded hover:text-black justify-end text-lg "><ArrowBackIcon fontSize="medium" className="mr-2" />Back</button>
                               <Link to='/sign-up-step3-complete-profile'> <button type="submit" className=" py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 justify-end border-2 border-[#B2CCFF]">Continue <ArrowForwardIcon fontSize="medium" className="ml-2" /></button></Link>

                            </div>
                        </form>
                    </div>
                    <Aboutcard />
                </div>

            </div>

        </>


    )
}
export default Signupmain3;