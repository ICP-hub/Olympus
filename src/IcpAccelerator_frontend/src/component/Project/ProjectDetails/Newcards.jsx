import React, { useState } from 'react'
import girl from "../../../../assets/images/girl.jpeg";
import { linkedInSvg } from '../../Utils/Data/SvgData';
import { Star, colorStar } from '../../Utils/Data/SvgData';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const Newcards = () => {
  // const [percentage, setPercentage] = useState(3);
  const percentage = 10;

  return (
    <div>
      {/* Joined Projects start */}

      <div className="flex flex-wrap justify-between p-4">
        <div className="w-full sm:w-full md:w-full lg:w-1/4 xl:w-1/4 p-4">

          <div className=" relativeshadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-[#FFB5B8] h-24 ">


            <div className=' absolute flex  flex-row gap 2 p-4  gap-4 justify-center'>
              <img className='h-12 w-12 rounded-md   flex  ' src={''} alt='No Img' />
              <div className='flex-row flex-wrap flex '>
                <p className='text-black font-bold text-2xl'>DeFi</p>
                <p>q&a market place built on...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Joined Projects End */}

      {/* // SamyKarim Part 1 Start */}
      {/* <div className="flex flex-wrap justify-between p-4">
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
      </div> */}
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
              {colorStar}
              {colorStar}
              {colorStar}
              {colorStar}
            </div>
            <div className='flex flex-col sm:flex-row lg:flex-col ml-0 sm:ml-0 lg:ml-12'>
              <p className='font-bold text-xl'>“Great work”</p>
              <p className='text-[#737373]'>The Student Side Dashboard provides students with access to the assigned tests and assessments created by their respective teachers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall rating part2 Cards Ending */}
    </div>
  )
}

export default Newcards;