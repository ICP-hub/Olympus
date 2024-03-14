import React, { useState, useRef, useEffect } from 'react';
import ment from "../../../../assets/images/ment.jpg";
import girl from "../../../../assets/images/girl.jpeg";

import hover from "../../../../assets/images/hover.png";
import coding1 from "../../../../assets/images/coding1.jpeg";
import { winner } from "../../Utils/Data/SvgData";
const Projectdashboard = () => {
    const cards = [
        { id: 1, name: '' },
        { id: 2, name: '' },
        { id: 3, name: '' },
        { id: 4, name: '' },
    ];
    const [isHovered, setIsHovered] = useState(false);
    const [percent, setPercent] = useState(0);
    const [showLine, setShowLine] = useState(false);
    const tm = useRef(null);

    const gradientStops = isHovered
        ? { stop1: "#4087BF", stop2: "#3C04BA" } // Hover gradient colors
        : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

    const increase = () => {
        setPercent((prevPercent) => {
            if (prevPercent >= 100) {
                clearTimeout(tm.current);
                return 100; // Ensure we don't exceed 100%
            }
            return prevPercent + 1;
        });
    };

    useEffect(() => {
        if (percent < 100) {
            tm.current = setTimeout(increase, 10);
        }
        return () => clearTimeout(tm.current);
    }, [percent]);

    const handleClickPlusOne = () => {
        setShowLine(true);
    };

    return (
        <div className='overflow-hidden px-[4%] py-[4%]'>
            <div>
                <h1 className="bg-gradient-to-r from-blue-900 to-sky-400 text-transparent bg-clip-text font-bold text-lg">
                    Live Projects
                </h1>
            </div>

            <div className='overflow-hidden px-[2%] py-[4%]'>
                {/* Live Project cards */}
                <div className="flex flex-wrap justify-between ">
                    {cards.map((card) => (
                        <div key={card.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 relative">
                            <div className="bg-white shadow-md rounded-lg overflow-hidden  border-2  drop-shadow-2xl gap-2">
                                <div className="p-4">
                                    <div className='flex flex-row justify-between gap-2  text-black  h-12 w-12 '>
                                        <img className='rounded-lg' src={ment} alt='profile' />
                                        <h1 className='flex items-end font-bold'>builder.fi</h1>
                                        <img className='h-6 w-6 rounded-full items-end flex mt-5' src={girl} alt='not found' />
                                        <p className='items-end flex text-wrap text-[10px] truncate line-clamp-2'>0x2085...6B</p>
                                    </div>
                                    <div className="flex items-center xl:w-[250px]  lg:w-[150px] md:w-[50px] w-[120px] mt-4">
                                        <svg
                                            width="100%"
                                            height="7"
                                            className="rounded-lg"
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            <defs>
                                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop
                                                        offset="0%"
                                                        style={{ stopColor: gradientStops.stop1, stopOpacity: 1 }}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        style={{ stopColor: gradientStops.stop2, stopOpacity: 1 }}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <rect
                                                x="0"
                                                y="0"
                                                width={`${percent}%`}
                                                height="10"
                                                fill="url(#gradient1)"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 mt-4">Internet Identity 110,000+ users
                                        Distrikt is a completely decentralized, community-owned Web3 social media platform. Users of the platform will soon be able to vote on upgrades, and no user data will ever be mined or sold. Create your account, secured by Internet Identity today.</p>
                                    <div className='flex dlex-row gap-2 '>
                                        <p>.DAO</p>
                                        <p>.Infrastructure</p>
                                        <p onClick={handleClickPlusOne} className='cursor-pointer'>+1 more</p>
                                    </div>
                                    {showLine && <div className="border-t-2 border-gray-300 mt-4">QuadB Tech projects are here</div>}
                                    <button className="mt-4 bg-white text-black px-4 py-1 rounded uppercase  w-full justify-center item-center drop-shadow-xl border-2 border-gray-300 font-bold">Register Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* End of  Live Project cards */}



                {/* Project register cards */}

                <div className="flex flex-wrap justify-between ">
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 relative">
                        <div className="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-2xl gap-2 bg-[#B9C0F2]">
                            <div className="p-2">
                                <img className='h-24 w-[250px] mx-auto rounded-md ' src={hover} alt='not found' />
                                <div className='ml-4'>
                                    <div className='w-2/3 text-2xl text-white mt-4'>
                                        <h1 className='ml-'>Register your Projects?</h1>
                                    </div>
                                    <p className="text-white mt-5 p-2">See a project missing? All community members are invited to submit their projects to this page.</p>
                                    <button className="mt-4 uppercase bg-[#7283EA] text-white px-4 py-2 rounded-md w-full justify-center item-center font-extrabold">Register Now</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* End of Project register cards */}



                {/* 
                Event Announcement cards */}
                <div class="flex flex-wrap justify-between rounded-lg">
                    <div className="w-full  md:w-1/3 lg:w-1/2 xl:w-1/2 p-4 relative">
                        <div class="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-2xl gap-2 bg-gray-100">
                            <div class="">
                                <img class='h-[183.78px] w-full object-cover rounded-b-none rounded-lg' src={hover} alt='not found' />
                                <div class="relative">
                                    {/* <div class="absolute h-12 w-12 rounded-full left-1/2 transform -translate-x-1/2  mt-[-2rem] md:top-[calc(-2rem + 20px)] bg-[#5040A1]">
                                        <div class='w-full ml-4 mt-4 md:w-52'>
                                            {winner}
                                        </div>
                                    </div> */}

                                </div>
                                <div class='ml-4 '>
                                    <div class="lg:flex xl:lg:flex-row sm:flex-col xsm:flex-col md:flex-row justify-between items-center text-md">
                                        <div class='w-1/2  flex-col text-[#737373] flex p-4'>
                                            <h1 class='text-black font-bold'>RWA Projects. Part 2</h1>
                                            <p>22 Apr 2024 17:30 -22 Apr 2024 19:30</p>
                                        </div>
                                        <div class='w-1/2 flex flex-row  text-[#737373] justify-start items-start '>
                                            <div class='flex flex-row items-center space-x-2'>
                                                <img class="h-12 w-12 rounded-full" src={girl} alt='soul' />
                                                <div className='flex flex-col'>
                                                    <h1 class='font-bold'>SoulCurryArt</h1>
                                                    <p>posted 6 days ago</p>
                                                </div>
                                                {/* <p>posted 6 days ago</p> */}
                                            </div>

                                        </div>
                                    </div>

                                    {/* <div class="lg:flex xl:lg:flex-row sm:flex-col xsm:flex-col md:flex-row justify-between items-center text-md p-4">
    <div class='lg:w-60 xl:w-60 sm:w-full xsm:w-full md:w-60 flex-col text-[#737373] flex p-4'>
        <h1 class='text-black font-bold'>RWA Projects. Part 2</h1>
        <p>22 Apr 2024 17:30 - 22 Apr 2024 19:30</p>
    </div>
   
        <div class='flex flex-row items-center space-x-2'>
            <img class="h-12 w-12 rounded-full" src={girl} alt='soul' />
            <div class='flex flex-col'>
                <h1 class='font-bold'>SoulCurryArt</h1>
                <p>posted 6 days ago</p>
            </div>
       
    </div> */}
                                    

                                    <div class='w-full'>
                                        <p class="text-[#7283EA] text-xl">This event includes</p>
                                        <div class='flex flex-row gap-2 text-lg'>
                                            <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p class="">Direct interaction with the instructor</p>
                                        </div>
                                        <div class='flex flex-row gap-2 text-lg'>
                                            <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p class="">Session recording after the workshop</p>
                                        </div>
                                        <div class='flex flex-row gap-2 text-lg'>
                                            <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p class="">Access on mobile and web</p>
                                        </div>
                                        <div class='flex flex-row gap-2 text-lg'>
                                            <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p class="">1 hour live session</p>
                                        </div>
                                        <div className=' text-lg'>
                                            <p>Modern Cubist abstract artist, NFT artist, Art educator & bridging the Contemporary with the Digital art realms</p>
                                        </div>
                                        <div class='w-[700px] border-2 border-[#D7D7D7] mt-4 overflow-hidden'></div>
                                        <div class='flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8'>
                                            <div className='flex lg:justify-between md:justify-center xl:lg:gap-16 gap-4'>
                                                <div class='flex flex-col font-bold'>
                                                    <p class='text-[#7283EA]'>Date</p>
                                                    <p class='text-black'>25 Oct 2021</p>
                                                </div>
                                                <div class='flex flex-col font-bold'>
                                                    <p class='text-[#7283EA]'>Time</p>
                                                    <p class='text-black'>7:30 pm</p>
                                                </div>
                                                <div class='flex flex-col font-bold'>
                                                    <p class='text-[#7283EA]'>Duration</p>
                                                    <p class='text-black'>60 min</p>
                                                </div>
                                            </div>
                                            <div class='flex xl:lg:justify-end sm:md:justify-center mr-2 text-[10px]'>
                                                <button class="mt-2 mb-2 mr-8 uppercase bg-[#7283EA]  text-white px-4 py-2 rounded-md justify-center items-center font-extrabold">Register Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* //End of Event Announcement   */}

                {/* Event Announcement part2 */}
                <div>
                    <div class='flex flex-row flex-wrap  gap-8 w-6/10 drop-shadow-2xl rounded-lg bg-gray-200 '>
                        <div class=''>
                            <img class='h-[330px] xl:w-[900px] lg:w-[700px] object-cover  rounded-lg ' src={hover} alt='not found' />
                        </div>
                        <div class='w-4/10'>
                            <div class='w-full mt-4'>
                                <div class="relative">
                                    <div class="absolute h-12 w-12 rounded-full  transform -translate-x-1/2  left-[-32px] md:top-[calc(-2rem + 20px)] bg-[#5040A1]">
                                        <div class='w-full ml-4 mt-4 md:w-52'>
                                            {winner}
                                        </div>
                                    </div>

                                </div>
                                <div class='w-1/2  flex-col text-[#737373] flex '>
                                    <h1 class='text-black font-bold text-[15px]'>RWA Projects. Part 2</h1>
                                    <p>22 Apr 2024 17:30</p>
                                </div>
                                <p class="text-[#7283EA] text-xl">This event includes</p>
                                <div class='flex flex-row gap-2'>
                                    <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p class="">Direct interaction with the instructor</p>
                                </div>
                                <div class='flex flex-row gap-2'>
                                    <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p class="">Session recording after the workshop</p>
                                </div>
                                <div class='flex flex-row gap-2'>
                                    <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p class="">Access on mobile and web</p>
                                </div>
                                <div class='flex flex-row gap-2'>
                                    <div class="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                    <p class="">1 hour live session</p>
                                </div>
                               
                                <div class='flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8 mt-2'>
                                    <div className='flex lg:justify-start gap-4 '>
                                        <div class='flex flex-col font-bold'>
                                            <p class='text-[#7283EA]'>Date</p>
                                            <p class='text-black'>25 Oct 2021</p>
                                        </div>
                                        <div class='flex flex-col font-bold'>
                                            <p class='text-[#7283EA]'>Time</p>
                                            <p class='text-black'>7:30 pm</p>
                                        </div>
                                        <div class='flex flex-col font-bold'>
                                            <p class='text-[#7283EA]'>Duration</p>
                                            <p class='text-black'>60 min</p>
                                        </div>

                                    </div>


                                </div>
                                <div className='flex justify-center items-center '>
                                    <button className=' uppercase bg-[#7283EA] mr-2 text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm mt-2 '>Register now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* //End of Event Announcement part2  */}


                {/* Cards of Projects for Investors */}


                <div className="flex flex-wrap justify-between ">
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
                        <div className=" relative shadow-md rounded-lg  overflow-hidden border-2 drop-shadow-2xl gap-2 bg-white">
                        <img className=' h-24 w-full  mx-auto rounded-lg rounded-b-none' src={coding1} alt='not found' />
                           
                        <div className='absolute mt-[-25px] flex flex-row justify-between items-center text-black p-2 space-x-36'>
    <img className='h-10 w-12 z-10 rounded-lg' src={ment} alt='Data' />
    <p className='mt-4 font-bold text-[#6B7280]'>Project 2</p>
</div>



                            <div className='ml-4'>

                                <div className='w-2/3 text-2xl text-black mt-8'>
                                    <h3 className=''>Dirac Finance</h3>
                                </div>
                                <div className='p-4'>
                                <p className="text-[#6B7280] mt-2 ">Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that...</p>
                                </div>
                                <div className='flex justify-start items-start mt-4 mb-4 text-sm '>
                                    <button className=" uppercase bg-[#7283EA] text-black px-4 py-2 rounded-md font-bold ">Expand More</button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                {/* End Cards of Projects for Investors */}




                {/* Testimonial cards  Start */}
                <div className='w-full bg-[#B9C0F2] rounded-lg '>

                    <div className="flex flex-wrap justify-center">
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 flex flex-col gap-4">
                            <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-white p-4">

                                <div className='flex flex-row space-x-4 justify-center items-center'>
                                    <img className='rounded-full w-12 h-12' src={girl} alt='user' />
                                    <div className='flex flex-col'>
                                        <p>James Danial.</p>
                                        <p>15 Mar 2022</p>
                                    </div>

                                </div>
                                <div className='text-black mt-10 mb-8'>
                                    <p className="  ">Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice.</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 flex flex-col gap-4">
                            <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-white p-4">

                                <div className='flex flex-row space-x-4 justify-center items-center'>
                                    <img className='rounded-full w-12 h-12' src={girl} alt='user' />
                                    <div className='flex flex-col'>
                                        <p>James Danial.</p>
                                        <p>15 Mar 2022</p>
                                    </div>

                                </div>
                                <div className='text-black mt-10 mb-8'>
                                    <p className="  ">Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice.</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 flex flex-col gap-4">
                            <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-white p-4">

                                <div className='flex flex-row space-x-4 justify-center items-center'>
                                    <img className='rounded-full w-12 h-12' src={girl} alt='user' />
                                    <div className='flex flex-col'>
                                        <p>James Danial.</p>
                                        <p>15 Mar 2022</p>
                                    </div>

                                </div>
                                <div className='text-black mt-10 mb-8'>
                                    <p className="  ">Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice.</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 flex flex-col gap-4">
                            <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-white p-4">

                                <div className='flex flex-row space-x-4 justify-center items-center'>
                                    <img className='rounded-full w-12 h-12' src={girl} alt='user' />
                                    <div className='flex flex-col'>
                                        <p>James Danial.</p>
                                        <p>15 Mar 2022</p>
                                    </div>

                                </div>
                                <div className='text-black mt-10 mb-8'>
                                    <p className="  ">Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice.</p>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
                {/* End Testimonial cards */}




            </div>
        </div>
    )
}

export default Projectdashboard;
