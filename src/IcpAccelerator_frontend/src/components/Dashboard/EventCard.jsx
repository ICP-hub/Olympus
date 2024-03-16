import React from 'react'
import hover from "../../../assets/images/hover.png";
import { winner } from "../Utils/Data/SvgData";
import girl from "../../../assets/images/girl.jpeg";


const EventCard = () => {
  return (
    <div className='flex flex-row flex-wrap lg:flex-nowrap gap-8 w-full drop-shadow-xl rounded-lg bg-gray-200 h-96 mb-8'>
                        <div className='w-3/4'>
                            <img className='w-full h-full object-fill rounded-lg ' src={hover} alt='not found' />
                        </div>
                        <div className='w-1/4'>
                            <div className="p-4">
                            <div className='w-full mt-4'>
                                <div className="relative">
                                    <div className="absolute h-12 w-12 rounded-full transform -translate-x-1/2 left-[-48px] top-[calc(-2rem + 20px)] bg-[#5040A1] hidden sm:block">
                                        <div className="w-full ml-4 mt-4 md:w-52 ">
                                            {winner}
                                        </div>
                                    </div>
                                </div>
                                <div className='w-1/2  flex-col text-[#737373] flex  '>
                                    <h1 className='text-black font-bold text-[15px] text-nowrap'>RWA Projects. Part 2</h1>
                                    <p>22 Apr 2024 17:30</p>
                                </div>
                                <p className="text-[#7283EA] text-xl">This event includes</p>
                                <div className='flex flex-row gap-2'>
                                    <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p className="">Direct interaction with the instructor</p>
                                </div>
                                <div className='flex flex-row gap-2'>
                                    <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p className="">Session recording after the workshop</p>
                                </div>
                                <div className='flex flex-row gap-2'>
                                    <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p className="">Access on mobile and web</p>
                                </div>
                                <div className='flex flex-row gap-2'>
                                    <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p className="">1 hour live session</p>
                                </div>

                                <div className='flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8 mt-2'>
                                    <div className='flex lg:justify-start gap-4 '>
                                        <div className='flex flex-col font-bold'>
                                            <p className='text-[#7283EA]'>Date</p>
                                            <p className='text-black'>25 Oct 2021</p>
                                        </div>
                                        <div className='flex flex-col font-bold'>
                                            <p className='text-[#7283EA]'>Time</p>
                                            <p className='text-black'>7:30 pm</p>
                                        </div>
                                        <div className='flex flex-col font-bold'>
                                            <p className='text-[#7283EA]'>Duration</p>
                                            <p className='text-black'>60 min</p>
                                        </div>

                                    </div>


                                </div>
                                <div className='flex justify-center items-center '>
                                    <button className='mb-2 uppercase bg-[#7283EA] mr-2 text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm mt-2 '>Register now</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
  )
}

export default EventCard