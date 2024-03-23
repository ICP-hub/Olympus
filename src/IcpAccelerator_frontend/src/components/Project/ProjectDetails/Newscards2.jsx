import React, { useState } from 'react'
import girl from "../../../../assets/images/girl.jpeg";
// import { linkedInSvg } from '../../Utils/Data/SvgData';
import { Star, colorStar } from '../../Utils/Data/SvgData';
import { coloralert, library } from '../../../../../admin_frontend/src/components/Utils/AdminData/SvgData';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import ment from "../../../../assets/images/ment.jpg";
import { Line } from "rc-progress";
import ReactSlider from "react-slider";




const Newscards2 = () => {
    // const [percentage, setPercentage] = useState(3);
    const percentage = 50;
    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = 80;
    const [sliderValuesProgress, setSliderValuesProgress] = useState({
        Team: 0,
        ProblemAndVision: 0,
        ValueProp: 0,
        Product: 0,
        Market: 0,
        BusinessModel: 0,

        Scale: 0,
        Exit: 0,
    });
    const [sliderValues, setSliderValues] = useState({
        Team: 0,
        ProblemAndVision: 0,
        ValueProp: 0,
        Product: 0,
        Market: 0,
        BusinessModel: 0,
        Scale: 0,
        Exit: 0,
    });
    const sliderKeys = [
        "Team",
        "ProblemAndVision",
        "ValueProp",
        "Product",
        "Market",
        "BusinessModel",
        "Scale",
        "Exit",
    ];
    const customStyles = `
  .slider-mark::after {
    content: attr(data-label);
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    white-space: nowrap;
    font-size: 0.75rem;
    color: #fff;
    padding: 0.2rem 0.4rem; 
    border-radius: 0.25rem;
  }
`;

    const handleSliderChange = (index, value) => {
        // console.log('index',index)
        // console.log('index',value)

        const key = sliderKeys[index];
        const newSliderValues = { ...sliderValues, [key]: value };
        setSliderValues(newSliderValues);
        const newSliderValuesProgress = {
            ...sliderValuesProgress,
            [key]: value === 9 ? 100 : Math.floor((value / 9) * 100),
        };
        setSliderValuesProgress(newSliderValuesProgress);
    };
    const handleFileInputChange = (event) => {
        // Handle selected file here
        const selectedFile = event.target.files[0];
        console.log('Selected file:', selectedFile);
    };
    const handleFileSelect = () => {
        document.getElementById('fileInput').click();
    };
    return (
        <div>
            {/* // SamyKarim Part 1 Start */}
            <div className="flex flex-wrap justify-between p-4">
                <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 p-4">

                    <div className=" relativeshadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-white h-32 ">

                        <div className=" shadow-md rounded-lg overflow-hidden  drop-shadow-2xl gap-2 bg-[#CDDDFC] h-16 mb-[-2rem]">

                        </div>
                        <div className=' absolute flex  flex-row gap 2 p-4 mt[-20px] gap-4'>
                            <img className='h-20 w-20 rounded-full border-2 border-white mt-[-2rem]' src={girl} alt='No Img' />
                            <div className='flex-col flex mt-4'>
                                <p className='text-black font-bold text-2xl'>SamyKarim</p>
                                <p>Mentor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* // SamyKarim part 1 End */}


            {/* // SamyKarim part 2 Start */}

            <div className="flex flex-wrap justify-between p-4">
                <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 p-4">

                    <div className=" relativeshadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-white h-32 ">

                        <div className=" shadow-md rounded-lg overflow-hidden  drop-shadow-2xl gap-2 bg-[#3505B2] h-16 mb-[-2rem]">

                        </div>
                        <div className=' absolute flex  flex-row gap 2 p-4 mt[-20px] gap-4'>
                            <img className='h-20 w-20 rounded-full border-2 border-white mt-[-2rem]' src={girl} alt='No Img' />
                            <div className='flex-col flex mt-4'>
                                <p className='text-black font-bold text-2xl'>SamyKarim</p>
                                <p>Investor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* // SamyKarim part 2 End */}

            {/* Overall circlular   part1 Cards  Start */}
            <div className="flex flex-wrap justify-between">
                <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 p-4">
                    <div className="shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-[#C1CAFF] p-4">
                        <div className='flex flex-row justify-between flex-wrap'>
                            <p className='text-2xl text-black font-extrabold'>Overall Rating</p>
                            <p className='text-[#737373] flex items-center'>10 October, 2023</p>
                        </div>
                        <div className='flex flex-row gap-6 flex-wrap items-center'>
                            <div>
                                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#FF6347" />
                                            <stop offset="100%" stopColor="#32CD32" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <CircularProgressbar
                                    className="w-24 h-24"
                                    value={percentage}
                                    strokeWidth={8}
                                    text={`${percentage}%`}
                                    styles={buildStyles({
                                        strokeLinecap: "round",
                                        pathTransitionDuration: 0.5,
                                        pathColor: `url(#progressGradient)`,
                                        trailColor: "",
                                        textColor: "#737373", // Set the color of the text
                                        textSize: "24px", // Set the size of the text
                                    })}
                                />
                            </div>
                            <div className='flex flex-row justify-center items-center gap-2'>
                                {/* Assuming Star is defined elsewhere */}
                                {Star}
                                {Star}
                                {Star}
                            </div>
                        </div>
                        <p className='text-[#737373]'>On basis of all Community ratings</p>
                    </div>
                </div>
            </div>

            {/* Overall rating part1 Cards Ending */}



            {/* Overall rating part2 Cards Start */}
            <div className="flex flex-wrap justify-center sm:justify-between">
                <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 p-4">
                    <div className="shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-white p-4">
                        <div className='flex flex-row justify-start sm:justify-start lg:justify-start flex-wrap gap-2 items-center'>
                            <img className='h-14 w-14 rounded-full' src={girl} alt='No img' />
                            <div className='flex flex-col'>
                                <p className='text-2xl text-black font-extrabold'>SamyKarim</p>
                                <p className='text-[#737373] flex items-center'>10 October, 2023</p>
                            </div>
                            <div className='w-12 h-12'>
                                {colorStar}
                                {colorStar}
                                {colorStar}
                                {colorStar}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row lg:flex-col ml-0 sm:ml-0 lg:ml-12'>
                            <p className='font-bold text-xl'>“Great work”</p>
                            <p className='text-[#737373]'>The Student Side Dashboard provides students with access to the assigned tests and assessments created by their respective teachers.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overall rating part2 Cards Ending */}

            {/* Joined Projects start */}

            <div className="flex flex-wrap justify-between p-4">
                <div className="w-full sm:w-full md:w-full lg:w-1/4 xl:w-1/4 p-4">

                    <div className=" relative shadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-[#FFB5B8] h-24 ">


                        <div className=' absolute flex  flex-row gap 2 p-4  gap-4 justify-center'>
                            <img className='h-12 w-12 rounded-md   flex  ' src={ment} alt='No Img' />
                            <div className='flex-row flex-wrap flex '>
                                <p className='text-black font-bold text-2xl'>DeFi</p>
                                <p>q&a market place built on...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Joined Projects End */}

            {/* Rating cards Start */}


            <div className="flex flex-wrap justify-center p-4">
                <div className="w-full md:w-[400px]">

                    <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-2xl bg-gray-200 p-4">
                        <div className='flex flex-col'>
                            <h1 className='text-black font-bold text-xl'>Ratings</h1>
                            <div className='flex flex-row flex-wrap gap-2 items-center space-x-12'>
                                <p className='font-extrabold text-2xl text-[#3505B2]'>3/5</p>
                                <div className="flex items-center hover:text-blue-800 w-16 h-16">
                                    {colorStar}
                                    {colorStar}
                                    {colorStar}
                                </div>

                            </div>
                            <div className='flex flex-col'>
                                <p>Comment</p>
                                <textarea
                                    className="w-full bg-gray-400 p-2 rounded placeholder-gray-500 py-4 flex h-auto font-bold"
                                    placeholder="Type here"
                                ></textarea>
                                <div className='bg-[#3505B2] rounded-md mt-4 flex justify-center'>
                                    <button className='text-white font-bold items-center py-2'>Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Cards End */}
            {/* Pitch Deck Cards Start */}
            <div className="flex flex-wrap justify-between p-4">
                <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 p-4">

                    <div className=" relative shadow-md rounded-lg overflow-hidden  border-2 border-blue-700  drop-shadow-xl gap-2   " style={{ backgroundImage: 'linear-gradient(to bottom, #B9C0F2 23%, #E9E9E9 100%)' }}>
                        <div className='p-4'>
                            <div className='flex flex-col line-clamp-2 text-white font-bold'>
                                <p className='text-2xl'>Pitch</p>
                                <p className='text-2xl'>Deck</p>
                                <div className='w-12 border-2  mt-2 '></div>
                                <p className='text-[#4E5999]'>Give your weekend projects, side projects, hobby projects, serious ventures a place to breathe, invite collaborators and inspire other builders.</p>
                                <div className='flex flex-row items-center'>
                                    <div className='flex-grow'>{library}</div>
                                    <button className='bg-[#3505B2] text-white font-bold px-2 rounded-md py-2'>View</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>


            {/* Pitch Deck Carsd End */}
            {/* icp grants cards Start */}

            <div className="rounded-lg flex justify-center  items-center flex-col h-[80px] lg:md:w-[236px] w-[340px] bg-gray-400  drop-shadow-xl border-2  cursor-pointer" >
                <div className="flex  flex-row items-center justify-start font-bold text-lg text-black gap-8">

                    <p className="flex justify-start">ICP Grants</p>
                    <p className="font-extrabold -[59px] h-[62px] flex  text-2xl justify-center items-center flex-grow">35</p>
                </div>
            </div>
            {/* icp grants Cards End */}


            {/* Targeted Funds progressbar Start */}
            <div className="flex flex-wrap justify-between p-4">
                <div className="w-full p-4">
                    <div className="relative shadow-md rounded-2xl overflow-hidden drop-shadow-xl gap-2 bg-[#B9C0F2]  p-4">
                        <div className='flex flex-col  flex-wrap font-bold text-black text-xl'>
                            <div className='flex flex-row'>
                                <h1 className=''>Targeted Funds</h1>
                                <div className='flex-grow'></div>
                                <p>1,00,000</p>
                            </div>
                            <div className='flex flex-col w-full'>
                                <div className="relative my-8 flex items-center">
                                    <style dangerouslySetInnerHTML={{ __html: customStyles }} />
                                    <ReactSlider
                                        className="bg-gradient-to-r from-blue-200 to-purple-400 h-3 rounded-md flex-grow" // Increased height to 3
                                        marks
                                        markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                                        min={2}
                                        max={10}
                                        thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                                        trackClassName="h-3 rounded" // Adjusted height to match the slider height
                                        value={sliderValues[sliderKeys[currentStep]]}
                                        onChange={(value) => handleSliderChange(currentStep, value)}
                                        renderThumb={(props, state) => (
                                            <div {...props} className="w-12 h-12 -top-6"> {/* Adjusted size and top position */}
                                                <div className='w-4 h-4 rounded-full bg-gradient-to-r from-blue-200 to-purple-400 mt-5  border-white border-2'></div> {/* Adjusted size */}
                                            </div>
                                        )}
                                        renderMark={({ key, style }) => (
                                            <div
                                                key={key > 0 ? key : ''}
                                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                                style={{ ...style, top: "0px" }}
                                            >
                                                {key > 0 ?
                                                    <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                                        <span></span>
                                                        <div className="relative group">
                                                            <span className="cursor-pointer"></span>
                                                            <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                                                <div className="relative z-10 p-2"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ''}
                                            </div>
                                        )}
                                    />
                                    {/* Render the percentage sign dynamically */}
                                    <div className="text-gray-600 ml-4">
                                        {((sliderValues[sliderKeys[currentStep]] - 2) / 8 * 100).toFixed(0)}%
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Progress Bar */}



            {/* Targeted Funds progressbar End */}



            {/* Self Rating Bar Start */}
            <div className="flex flex-wrap justify-between p-4">
                <div className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 p-4">

                    <div className=" relative shadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-gray-200  p-4 ">
                        <div className='flex flex-col '>
                            <div className='flex flex-row flex-wrap justify-between items-center'>
                                <h1 className='text-[#252641] font-bold text-2xl'>Self Rating</h1>
                                <div className=' '>
                                    {coloralert}
                                </div>
                            </div>
                            <div className="relative my-8 flex items-center">
                                <style dangerouslySetInnerHTML={{ __html: customStyles }} />
                                <ReactSlider
                                    className="bg-gradient-to-r from-blue-200 to-blue-600 h-3 rounded-md flex-grow" // Increased height to 3
                                    marks
                                    markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                                    min={2}
                                    max={10}
                                    thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                                    trackClassName="h-3 rounded" // Adjusted height to match the slider height
                                    value={sliderValues[sliderKeys[currentStep]]}
                                    onChange={(value) => handleSliderChange(currentStep, value)}
                                    renderThumb={(props, state) => (
                                        <div {...props} className="w-12 h-12 -top-6"> {/* Adjusted size and top position */}
                                            <div className='w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 '></div> {/* Adjusted size */}
                                        </div>
                                    )}
                                    renderMark={({ key, style }) => (
                                        <div
                                            key={key > 0 ? key : ''}
                                            className="slider-mark bg-transparent rounded-md h-1 w-1"
                                            style={{ ...style, top: "0px" }}
                                        >
                                            {key > 0 ?
                                                <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                                    <span></span>
                                                    <div className="relative group">
                                                        <span className="cursor-pointer"></span>
                                                        <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                                            <div className="relative z-10 p-2"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''}
                                        </div>
                                    )}
                                />
                                {/* Render the percentage sign dynamically */}
                                <div className="text-gray-600 ml-4">
                                    {((sliderValues[sliderKeys[currentStep]] - 2) / 8 * 100).toFixed(0)}%
                                </div>
                            </div>
                            <p className='text-[#737373]'>4 out of 9 rubric levels</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Self Rating Bar End */}
            {/* Announcement Start */}
            <div className="flex flex-wrap justify-start p-4">
                <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 p-4">

                    <div className=" relative shadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-white bg-opacity-40 border border-white border-opacity-20   p-4 ">
                        <div className='flex flex-col'>
                            <h1 className='text-bold text-black text-xl'>Announcement</h1>


                            <div className=' relative flex flex-row  flex-wrap  w-full justify-between'>
                                <div className='flex flex-col xl:w-[50%]'>
                                    <p className='mt-4'>Tittle</p>
                                    <input
                                        type="text"
                                        className=" w-full bg-white p-2 rounded placeholder-gray-500 py-4 flex h-12"
                                        placeholder="Type here"
                                    />
                                </div>
                                <div className=' bg-[#E9E9E9]  mt-4 rounded-lg border-2 border-black p-2 '>
                                    <div className='flex justify-center '>
                                        <div className=' relative w-16 h-16 rounded-full bg-gray-300 mt-5 flex justify-center items-center '></div>

                                        <div className=' absolute  flex justify-center items-center mt-8' onClick={handleFileSelect}>
                                            {library}
                                        </div>

                                    </div>


                                    <div className='flex  flex-col text-black font-bold justify-center items-center flex-wrap'>
                                        <p>Upload Cover Image (19:6)</p>
                                        <p>Drop your file here or browse</p>

                                    </div>
                                </div>

                            </div>
                            <div className='flex flex-col xl:w-[50%] xl:lg:md:mt-[-55px]'>
                                <p className='mt-4'>Description</p>
                                <input
                                    type="text"
                                    className="w-full bg-white p-2 rounded placeholder-gray-500 py-4 flex h-auto"
                                    placeholder="Type here"
                                />
                            </div>


                            <button className='bg-[#3505B2] text-white font-bold mt-4 rounded-md py-2 px-8 w-[50%]'>Upload</button>


                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Announcement End */}


            {/* // General Query card Start */}
            <div className="flex flex-wrap justify-center p-4">
                <div className="w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 p-4">
                    <div className="relative shadow-md rounded-lg overflow-hidden drop-shadow-xl gap-2 bg-white bg-opacity-40 border-opacity-20 p-4 border-2 border-black">

                        <div className="flex justify-start font-bold text-black text-xl">
                            <p>Name</p>
                        </div>

                        <div className="w-full flex flex-col sm:flex-row">
                            <p className="mb-2 sm:mb-0">General Inquiry</p>
                            <p className="sm:ml-2 text-[#737373] line-clamp-2">The Student Side Dashboard provides students with access to the assigned tests and assessments created by their respective teachers. Students can log in to their accounts, view a list of available tests, and choose the tests they want to attempt.</p>
                        </div>

                        <div className="flex flex-wrap w-full space-x-4 mt-4">
                            <p className='text-[#737373]'>Register your interest here:</p>
                            <button className="bg-[#7283EA] underline rounded-full px-4 text-white">Interested</button>
                        </div>

                        <div className="flex flex-wrap w-full justify-between mt-4">
                            <p className="text-[#737373]">About the Company</p>
                            <div className="bg-gray-200 w-[70%] py-2 rounded-lg flex sm:justify-start p-4">
                                <p className='text-[#737373]'>We work with many partners!</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap w-full justify-between mt-4 gap-2">
                            <p className="text-[#737373]">Responsibilities</p>
                            <div className="bg-gray-200 w-[70%] py-2 rounded-lg flex justify-start p-4">
                                <div className="flex flex-col">
                                    <div className='text-[#737373]'>
                                        <ul className='list-disc p-2'>
                                            <li>Submit a general inquiry for our recruitment support!</li>
                                        </ul>
                                    </div>

                                    <div className='text-[#737373]'>
                                        <ul className='list-disc p-2'>
                                            <li>We might have something in the works that could suit you.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-wrap w-full justify-between mt-4 gap-2">
                            <p className="text-[#737373]">Requirements</p>
                            <div className="bg-gray-200 w-[70%] py-2 rounded-lg flex justify-start p-4">

                                <div className='text-[#737373]'>
                                    <ul className='list-disc p-2'><li>Fill out the form with your CV and LinkedIn, and we'll get back to you!</li></ul></div>
                            </div>
                        </div>

                        <div className="flex flex-wrap w-full justify-between mt-4">
                            <p className="text-[#737373]">Location</p>
                            <div className="bg-gray-200 w-[70%] py-2 rounded-lg flex justify-start p-4">
                                <p className='text-[#737373]'>N/A</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap w-full justify-between mt-4">
                            <p className="text-[#737373]">TAGS</p>
                            <div className="bg-gray-200 w-[70%] py-2 rounded-lg flex justify-start p-4">
                                <p className='text-[#737373]'>N/A</p>
                            </div>
                        </div>
                        <div className='flex justify-end items-center mt-2'>
                            <button className='px-4 text-white bg-[#3505B2] py-2 rounded-lg'>Post</button>
                        </div>

                    </div>
                </div>
            </div>

            {/* General Query Card End */}

        </div>
    )
}

export default Newscards2;


