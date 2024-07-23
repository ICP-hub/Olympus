import React, { useState, useRef, useEffect } from 'react';
import ment from "../../../../assets/images/ment.jpg";
import girl from "../../../../assets/images/girl.jpeg";
import samya from "../../../../assets/images/samya.jpg";
import Coding2 from "../../../../assets/images/Coding2.jpg";
import hover from "../../../../assets/images/hover.png";
import coding1 from "../../../../assets/images/coding1.jpeg";
import { winner } from "../../Utils/Data/SvgData";
// import { bg } from "../../Utils/Data/Longsvg";

const Projectdashboard = () => {

    const [cards, setCards] = useState([
        { id: 1, name: '' },
        { id: 2, name: '' },
        { id: 3, name: '' },
        { id: 4, name: '' },
    ]);

    const [isHovered, setIsHovered] = useState(false);
    const [percent, setPercent] = useState(0);
    const [showLine, setShowLine] = useState({});
    const tm = useRef(null);

    const gradientStops = isHovered
        ? { stop1: "#4087BF", stop2: "#3C04BA" }
        : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

    const increase = () => {
        setPercent((prevPercent) => {
            if (prevPercent >= 100) {
                clearTimeout(tm.current);
                return 100;
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

    const handleClickPlusOne = (id) => {
        setShowLine((prevShowLine) => ({
            ...prevShowLine,
            [id]: !prevShowLine[id],
        }));
    };


    const responsiveText = ` text-gray-500 mb-6 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[15px] sm:text-[15.5px] md:text-[16px.3] md1:text-[17px] md2:text-[17.5px] md3:text-[18px] lg:text-[18.5px] dlg:text-[19px] lg1:text-[15.5px] lgx:text-[20px] md:text-[20.5px] xl:text-[21px] xl2:text-[21.5px]`

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
                                        <p onClick={() => handleClickPlusOne(card.id)} className="cursor-pointer">+1 more</p>
                                    </div>
                                    {showLine[card.id] && <div className="border-t-2 border-gray-300 mt-4">QuadB Tech projects are here</div>}
                                    <button className="mt-4 bg-white text-black px-4 py-1 rounded uppercase w-full justify-center item-center drop-shadow-xl border-2 border-gray-300 font-bold hover:text-white hover:bg-[#3505B2]">Register Now</button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* End of  Live Project cards */}
                {/* invest */}
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
                                        <p onClick={() => handleClickPlusOne(card.id)} className="cursor-pointer">+1 more</p>
                                    </div>
                                    {showLine[card.id] && <div className="border-t-2 border-gray-300 mt-4">QuadB Tech projects are here</div>}
                                    <button className="mt-4 bg-white text-black px-4 py-1 rounded uppercase w-full justify-center item-center drop-shadow-xl border-2 border-gray-300 font-bold hover:text-white hover:bg-[#3505B2] ">invest</button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* End invest */}


                {/* Project register cards */}

                <div className="flex flex-wrap justify-between ">
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 relative">
                        <div className="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-2xl gap-2 bg-[#B9C0F2]">
                            <div className="p-2">
                                <img className='h-24 w-[250px] mx-auto rounded-md ' src={hover} alt='not found' />
                                <div className=''>
                                    <div className='w-2/3 text-2xl text-white mt-4'>
                                        <h1 className='ml-'>Register your Projects?</h1>
                                    </div>
                                    <p className="text-white mt-5">See a project missing? All community members are invited to submit their projects to this page.</p>
                                    <button className="mt-4 uppercase bg-[#7283EA] text-white px-4 py-2 rounded-md w-full justify-center item-center font-extrabold">Register Now</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* End of Project register cards */}



                {/* 
                Event Announcement cards */}
                <div className="flex flex-wrap justify-between rounded-lg">
                    <div className="w-full  md:w-1/3 lg:w-1/2 xl:w-1/2 p-4 relative">
                        <div className="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-xl gap-2 bg-gray-100">
                            <div className="">
                                <img className='h-[183.78px] w-full object-cover rounded-b-none rounded-lg' src={hover} alt='not found' />
                                <div className="relative">
                                    <div className=" xl:ml-[250px] lg:ml-[150px] sm:ml-[80px] absolute h-12 w-12 rounded-full left-1/2 transform -translate-x-1/2  mt-[-2rem] md:top-[calc(-2rem + 20px)] bg-[#5040A1]">
                                        <div className='w-full ml-4 mt-4 md:w-52'>
                                            {winner}
                                        </div>
                                    </div>

                                </div>
                                <div className='ml-4 '>
                                    <div className="lg:flex xl:lg:flex-row sm:flex-col xsm:flex-col md:flex-row justify-between items-center text-md">
                                        <div className='w-1/2  flex-col text-[#737373] flex p-4'>
                                            <h1 className='text-black font-bold'>RWA Projects. Part 2</h1>
                                            <p>22 Apr 2024 17:30 -22 Apr 2024 19:30</p>
                                        </div>
                                        <div className='w-1/2 flex flex-row  text-[#737373] justify-start items-start '>
                                            <div className='flex flex-row items-center space-x-2'>
                                                <img className="h-12 w-12 rounded-full" src={girl} alt='soul' />
                                                <div className='flex flex-col'>
                                                    <h1 className='font-bold'>SoulCurryArt</h1>
                                                    <p>posted 6 days ago</p>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                    {/* <div className="lg:flex xl:lg:flex-row sm:flex-col xsm:flex-col md:flex-row justify-between items-center text-md p-4">
    <div className='lg:w-60 xl:w-60 sm:w-full xsm:w-full md:w-60 flex-col text-[#737373] flex p-4'>
        <h1 className='text-black font-bold'>RWA Projects. Part 2</h1>
        <p>22 Apr 2024 17:30 - 22 Apr 2024 19:30</p>
    </div>
   
        <div className='flex flex-row items-center space-x-2'>
            <img className="h-12 w-12 rounded-full" src={girl} alt='soul' />
            <div className='flex flex-col'>
                <h1 className='font-bold'>SoulCurryArt</h1>
                <p>posted 6 days ago</p>
            </div>
       
    </div> */}


                                    <div className='w-full'>
                                        <p className="text-[#7283EA] text-xl">Overview</p>
                                        <div className='flex flex-row gap-2 text-lg'>
                                            <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p className="">Direct interaction with the instructor</p>
                                        </div>
                                        <div className='flex flex-row gap-2 text-lg'>
                                            <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p className="">Session recording after the workshop</p>
                                        </div>
                                        <div className='flex flex-row gap-2 text-lg'>
                                            <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p className="">Access on mobile and web</p>
                                        </div>
                                        <div className='flex flex-row gap-2 text-lg'>
                                            <div className="h-2 w-2 rounded-full bg-black item-center mt-2"></div>
                                            <p className="">1 hour live session</p>
                                        </div>
                                        <div className=' text-lg'>
                                            <p>Modern Cubist abstract artist, NFT artist, Art educator & bridging the Contemporary with the Digital art realms</p>
                                        </div>
                                        <div className='w-[560px] border-2 border-[#D7D7D7] mt-4 overflow-hidden'></div>
                                        <div className=' mt-2 mb-6 flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8'>
                                            <div className='flex lg:justify-between md:justify-center xl:lg:gap-16 gap-4'>
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
                                            <div className='flex xl:lg:justify-end sm:md:justify-center mr-2 text-[15px]'>
                                                <button className=" mr-8 bg-[#7283EA]  text-white px-4 py-2 rounded-md justify-center items-center font-bold">Register Now</button>
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
                    <div className='flex flex-row flex-wrap lg:flex-nowrap gap-8 w-5/8 drop-shadow-xl rounded-lg bg-gray-200 '>
                        <div className=''>
                            <img className='h-[330px] xl:w-[900px] lg:w-[700px] md:w-[900px] object-cover  rounded-lg ' src={hover} alt='not found' />
                        </div>
                        <div className='w-4/10'>
                            <div className='w-full mt-4'>
                                <div className="relative">
                                    <div className="absolute h-12 w-12 rounded-full transform -translate-x-1/2 left-[-32px] top-[calc(-2rem + 20px)] bg-[#5040A1] hidden sm:block">
                                        <div className="w-full ml-4 mt-4 md:w-52 ">
                                            {winner}
                                        </div>
                                    </div>


                                </div>
                                <div className='w-1/2  flex-col text-[#737373] flex  '>
                                    <h1 className='text-black font-bold text-[15px]'>RWA Projects. Part 2</h1>
                                    <p>22 Apr 2024 17:30</p>
                                </div>
                                <p className="text-[#7283EA] text-xl">Overview</p>
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

                {/* //End of Event Announcement part2  */}


                {/* Cards of Projects for Investors */}


                <div className="flex flex-wrap justify-between ">
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
                        <div className=" relative shadow-md rounded-lg  overflow-hidden border-2 drop-shadow-2xl gap-2 bg-white">
                            <img className=' h-24 w-full  mx-auto rounded-lg rounded-b-none' src={coding1} alt='not found' />

                            <div className='absolute lg:mt-[-30px] xl:mt-[-25px] md:mt-[-40px] mt-[-29px] flex flex-row flex-wrap  justify-between items-center text-black p-2 space-x-36'>
                                <img className='h-10 w-12 z-10 rounded-lg' src={ment} alt='Data' />
                                <p className=' lg:mt-[-1rem] md:mt-[0rem]  xl:mt-[8px] mt-[16px] md:mr-5 font-bold text-[#6B7280]'>Project 2</p>
                            </div>



                            <div className='ml-4'>

                                <div className='w-2/3 text-2xl text-black mt-8'>
                                    <h3 className=''>Dirac Finance</h3>
                                </div>
                                <div className='p-4'>
                                    <p className="text-[#6B7280] mt-2 ">Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that...</p>
                                </div>
                                <div className='flex justify-start items-start mt-4 mb-4 text-sm '>
                                    <button className="  bg-[#7283EA] text-black px-4 py-2 rounded-md font-bold ">Expand More</button>
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


                {/* impact of the tool Start */}
                <div className='flex justify-center'>
                    <div className="w-11/12 md:h-[11.5rem]  bg-gray-200 rounded-[20px]    z-10 mt-4 drop-shadow-2xl ">
                        <div className="flex  justify-center ">
                            <div className="w-5/6 px-4 md:justify-between md:items-center md:flex md:left-[-60px] md:top-[60px]  md:relative  ">
                                <div className="relative mb-4 mt-4 md:mt-0">
                                    <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                                        180+
                                    </div>
                                    <div className={`${responsiveText} left-0 top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                                        vcs
                                    </div>
                                </div>
                                <div className="relative mb-4 ">
                                    <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                                        $250M+
                                    </div>
                                    <div className={`${responsiveText} left-[53px] top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse flex justify-center`}>
                                        Hub Organisers
                                    </div>
                                </div>
                                <div className="relative mb-4">
                                    <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                                        400+
                                    </div>
                                    <div className={`${responsiveText} left-[22px] top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                                        Founders
                                    </div>
                                </div>
                                <div className="relative mb-4">
                                    <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                                        1200+
                                    </div>
                                    <div className={`${responsiveText} left-[14px] top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                                        Mentors
                                    </div>

                                </div>
                                <div className="relative mb-4">
                                    <div className="top-0 md:absolute text-center text-violet-800 md:text-4xl xl:text-5xl text-4xl font-extrabold font-fontUse">
                                        150+
                                    </div>
                                    <div className={`${responsiveText} left-[14px] top-[50px] md:absolute text-center text-neutral-500 md:text-lg font-normal font-fontUse`}>
                                        Admins
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of the tool */}

                {/* associated projects start */}'


                <div className="flex flex-wrap justify-start">
                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/3 p-4 flex flex-col gap-4">
                        <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-white">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="w-full sm:w-2/3">
                                    <img className="w-full h-full rounded-md rounded-r-none" src={coding1} alt="hh" />
                                </div>
                                <div className="flex flex-col p-2">
                                    <img className="w-12 h-12 rounded-lg" src={ment} alt="popup" />
                                    <p>Dirac Finance</p>
                                    <p>Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that...</p>
                                    <div className="flex justify-start mb-2 mt-2">
                                        <button className="w-full bg-[#3505B2] text-white font-bold rounded-md py-2">Mentorship</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Associated projects End */}


                {/* Invest projects Start */}

                <div className="flex flex-wrap justify-between ">
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
                        <div className=" shadow-md rounded-lg  overflow-hidden border-2 drop-shadow-2xl gap-2 bg-white">
                            <img className='h-24 w-full  mx-auto rounded-lg' src={coding1} alt='not found' />
                            <div className='flex justify-end mr-2'>
                                <p>project 2</p>
                            </div>

                            <div className='ml-2'>

                                <div className='text-2xl text-black flex flex-row space-x-2'>
                                    <img className=' w-14 h-14 rounded-md' src={ment} alt='No img' />
                                    <div className='flex flex-col text-[15px]'>
                                        <h3 className='font-bold'>Dirac Finance</h3>
                                        <p className='mt-[-2px]'>DeFi</p>
                                    </div>
                                </div>
                                <div className='p-4'>
                                    <p className="text-[#6B7280] mt-2 ">Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that...</p>

                                </div>
                                <div className='flex justify-center mb-2'>
                                    <p className='font-extrabold text-black text-xl'>Amount Invested</p>
                                </div>
                                <div className='bg-[#B8B8B8] rounded-md flex justify-center mr-2'>
                                    <button className='text-extrabold flex justify-center px-2 py-2 text-[#4E5999] font-bold '>$ 10000 USD</button>
                                </div>
                                <div className='flex   mt-4 mb-4 text-sm bg-[#3505B2]  rounded-md justify-center mr-2 '>
                                    <button className=" flex justify-center items-center text-white px-4 py-2 font-bold ">See projects</button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                {/* Invest Projects End */}


                {/* SamyKarim Cards start */}
                <div className="flex flex-wrap justify-between">
                    <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 p-4">
                        <div className="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-2xl gap-2 bg-white">
                        <div className='flex flex-col sm:flex-row gap-6 p-2'>
                                <img className='w-[100px] sm:w-[300.53px] rounded-md h-auto sm:h-[200.45px]  flex lg:items-center lg:justify-center  ' src={samya} alt="alt" />
                                <div className='flex flex-col w-full mt-4'>
                                    <h1 className="text-black text-2xl font-extrabold">SamyKarim</h1>
                                    <p className="text-[#737373]">Toshi, Managing Partner, Ex-Binance</p>
                                    <div className='flex flex-wrap gap-4 underline mt-6 text-[#737373]'>
                                        <p className='bg-gray-200 rounded-full py-2 px-4'>SRE</p>
                                        <p className='bg-gray-200 rounded-full py-2 px-4'>observability</p>
                                        <p className='bg-gray-200 rounded-full py-2 px-4'>Kubernetes</p>
                                    </div>
                                    <div className='w-100px border-2 text-gray-100 mt-2'></div>
                                    <div className='flex justify-end mt-6 xl:mr-8'>
                                        <button className='text-white font-bold py-2 px-4 bg-[#3505B2] rounded-md'>
                                            ReachOut
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                {/* SamyKarim Cards End */}


                {/* SamyKarim Cards start part 2 */}
                <div className="flex flex-wrap justify-between">
                    <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 p-4">
                        <div className="shadow-md rounded-lg overflow-hidden  drop-shadow-2xl gap-2 bg-[#C1CAFF]">
                            <div className='flex flex-col sm:flex-row gap-6 p-2'>
                                <img className='w-32 sm:w-[300.53px] rounded-md h-auto sm:h-[200.45px] flex lg:items-center lg:justify-center' src={samya} alt="alt" />
                                <div className='flex flex-col w-full'>
                                    <h1 className="text-black text-2xl font-extrabold">SamyKarim</h1>
                                    <p className="text-[#737373]">Toshi, Managing Partner, Ex-Binance</p>
                                    <div className='flex flex-wrap bg-white rounded-full underline mt-6 text-[#737373] justify-center'>
                                        <p className=''>SRE</p>
                                        <p className=''>observability</p>
                                        <p className=''>Kubernetes</p>
                                    </div>

                                    <div className='w-100px border-2 text-gray-900 mt-2'></div>
                                    <div className='flex justify-end mt-6 xl:mr-8'>
                                        <button className=' font-bold py-2 px-4 bg-white text-[#7283EA] rounded-md'>
                                            ReachOut
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                {/* SamyKarim Cards End part 2 */}

                {/* investors 2 Starting */}

                {/* <div className="flex flex-wrap justify-center sm:justify-between">
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
                        <div className="relative shadow-md rounded-lg overflow-hidden border-2 bg-white">
                            <img className="h-36 w-full object-cover rounded-lg" src={Coding2} alt="not found" />
                        </div>
                        <div className="absolute bg-[#FCFCFD]  w-[295px] rounded-md mt-[-2rem] p-2">
                            <div className="flex flex-row justify-between gap-2 text-black p-2 space-x-4">
                                <img className="h-10 w-12 z-10 rounded-lg" src={ment} alt="Data" />
                                <p className="font-bold text-[#6B7280]">Project 2</p>
                            </div>
                            <div className="w-full text-2xl text-black mt-4">
                                <h3 className="">Dirac Finance</h3>
                            </div>
                            <div className="">
                                <p className="text-[#6B7280]">Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that...</p>
                            </div>
                            <div className="flex justify-start items-start mt-4 mb-4 text-sm">
                                <button className="bg-[#7283EA] text-black px-4 py-2 rounded-md font-bold">Expand More</button>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* investors 2 Ending */}

                {/* Spotlight on the month Start */}
                <div className="flex flex-wrap justify-center sm:justify-between "style={{ backgroundImage: 'url(bg)' }}>
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                        <div className="relative shadow-md rounded-lg overflow-hidden border-2  p-6 ">
                            <div className='flex flex-row gap-2'>
                            <img className='border-2 rounded-lg border-blue-400 w-12 h-12 ' src={ment} alt='img' />

                                <div className='flex flex-col'>
                                    <p className='text-[#7283EA] font-bold' >Dirac Finance</p>
                                    <div className='flex flex-row gap-2 flex-wrap'>
                                        <p>DeFi</p>
                                        <p>q&a market place built on...</p>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <img className="h-6 w-6 rounded-full" src={girl} alt='No profile' />
                                        <p>0x2085...016B</p>
                                    </div>
                                </div>
                            </div>
                            <p>Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that...Beep! 2.0 by Beep! - New Era for Collaboration</p>
                            <div className='flex flex-row gap-4'>
                                <p>DAO</p>
                                <p>Infrastructure</p>
                                <p>+ 1 more</p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Spotlight on the month End */}


            </div>
        </div>
    )
}

export default Projectdashboard;
