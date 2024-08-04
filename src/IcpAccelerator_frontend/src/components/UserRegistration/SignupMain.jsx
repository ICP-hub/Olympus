import React from 'react';
import Layer1 from "../../../assets/Logo/Layer1.png";
import nfidrightside from "../../../assets/Logo/nfidrightside.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Link } from "react-router-dom"
const Signupmain1 = () => {
    return (
        <>
            <div className="py-16 flex items-center justify-center bg-[#FFF4ED] rounded-xl">
                <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-6xl relative">
                    <div className="w-1/2 p-8">
                        <div className="mb-6">
                            <img src={Layer1} alt="logo" />
                        </div>
                        <div className='flex justify-between'>
                                <button type="submit" className=" py-2 px-4  text-gray-600 rounded hover:text-black justify-end  "> <ArrowBackIcon fontSize="medium" className="mr-2" />Back</button>
                              <Link to='/sign-up-step1'> <button type="submit" className=" py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 justify-end border-2 border-[#B2CCFF]">Continue <ArrowForwardIcon fontSize="medium" className="ml-2" /></button></Link>

                            </div>
                    </div>
                   
                    <div className="w-1/2 h-screen bg-gradient-to-r from-[#ECE9FE] to-[#FFFFFF] items-center justify-center rounded-r-2xl relative">
                        <div className="flex justify-center ">
                            <img src={nfidrightside} alt="Olympus Key" className='w-[355px] h-[355px] mt-8' />
                        </div>
                        <div className="absolute inset-0    justify-center top-80 z-10">
                            <div className='bg-white w-[80%]  p-8  mx-auto rounded-lg shadow-lg'>
                                <h2 className="text-xl font-bold mb-4 text-center">Your universal key to Olympus ecosystem</h2>
                                <p className="text-gray-600 text-center mb-6">
                                    Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>Sign in everywhere</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>Maintain your privacy</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>Protect your identity</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>Secure your assets</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Signupmain1;
