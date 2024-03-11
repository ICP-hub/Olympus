import React, { useState,useRef } from 'react';
import ment from "../../../assets/images/ment.jpg";
import {linkedIn} from "../Utils/Data/SvgData";

const Admindeatils = () => {
  const [selectedOption, setSelectedOption] = useState("Project Ratings");
  return (
    <div>
      <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold ml-8">
        {selectedOption}
      </div>
      <div className="p-3 flex items-center bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]">

        <div className="md:p-4">
          <img
            src={ment}
            alt="ment"
            className="w-12 aspect-square object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="px-2">
            <div className="flex items-center">
              <div className="flex items-center">
                <p className="font-[950] text-2xl pr-2">builder.fi</p>
                <svg
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.4735 1.54094C9.02098 0.64994 7.75319 1.009 6.99159 1.58095C6.67932 1.81546 6.52318 1.93272 6.43132 1.93272C6.33945 1.93272 6.18331 1.81546 5.87104 1.58095C5.10944 1.009 3.84165 0.64994 2.38909 1.54094C0.482769 2.71028 0.0514138 6.56799 4.44856 9.82259C5.28608 10.4425 5.70484 10.7524 6.43132 10.7524C7.15779 10.7524 7.57655 10.4425 8.41407 9.82259C12.8112 6.56799 12.3799 2.71028 10.4735 1.54094Z"
                    stroke="#7283EA"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-full block text-xs xxs1:hidden text-right pr-4">
                <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                  Visit
                </button>
              </div>
            </div>
            <div className="md:flex block text-xs md:text-sm text-[#737373]">
              <p className="flex font-[450] pr-4">
                Proposer: <span className="font-normal pl-2">fine_web3</span>
              </p>
              <p className="flex items-center">
                Categories:{" "}
                <span className="bg-[#B5B5B54D] mx-1 px-2 rounded-full">
                  Infrastructure
                </span>
                <span className="bg-[#B5B5B54D] mx-1 px-2 rounded-full">
                  Tooling
                </span>
              </p>
            </div>
            <div className="flex items-center text-xs md:text-sm text-[#737373]">
              <p className="flex items-center">Chains:</p>
              <p className="text-[10px] font-[450] pl-1">+6 more</p>
            </div>
          </div>

        </div>
      </div>
      <div className='flex justify-center  '>
      <div className="relative w-full md:w-[950px] ">
  <div className="absolute bottom-0 left-0 top-[-25px] w-[400.31px] h-[450px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
  <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px]  ellipse-quarter-right rounded-md "></div>
  <div className="absolute lg:md:top-[356px] top-[700px] right-0 bg-blue-100 w-[209.63px] h-[210px]  ellipse-quarter-right rounded-md rotate-90"></div>

  <div className="p-8 flex flex-col items-center h-full relative z-10 w-full">
    <div className="flex flex-col w-full">
      <div className="w-fit text-black  text-2xl font-bold font-fontUse leading-none md:ml-4 mt-8">
        Details
      </div>
      <div className='flex-row justify-center '>
        <div className='w-full flex flex-col md:flex-row'>
          <div className="w-full md:w-1/2 p-4 text-[#737373] text-lg font-light font-fontUse mb-4 text-wrap mt-2 md:ml-4 ">
            <div className='flex flex-row justify-between'>
             
             
            </div>
            <div className='mb-[-22px]'>
            <p className='flex justify-end ' >ICP Hub</p>
            <p className='flex justify-end'>Oct,2023</p>
            </div>
            <p className='font-bold  '>Builder.fi</p>
            <div class="border border-gray-400 w-full"></div>
            <div className='flex flex-row justify-between mt-2'>
              <p className='font-bold'>Jammy Anderson</p>
              {linkedIn}
            </div>
            <p>abc@123</p>
            <div class="border border-gray-400 w-full"></div>
            <div className='flex flex-row justify-between mt-2'>
              <p className='font-bold'>Country</p>
            </div>
            <div class="border border-gray-400 w-full mt-2"></div>
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row font-bold gap-2'>
                <p className=''>.Stage</p>
                <p> .Energify</p>
              </div>
            </div>
            <div class="border border-gray-400 w-full mt-2"></div>
            <button className='bg-[#B9C0F2] text-white px-4 mt-2 rounded-md font-bold'>
              Inprogress
            </button>
          </div>
          <div className='flex flex-col bg-[#B9C0F2] w-full md:w-1/2 gap-4 rounded-md p-2 text-[#737373] h-[230px] mt-8'>
            <div className='ml-4 mr-20 mt-4'>
            <div className='flex flex-row justify-between '>
              <p>Team Size</p>
              <p className='font-extrabold'>5</p>
            </div>
            <div className='flex flex-row justify-between mt-2'>
              <p>No. of Co-Founders</p>
              <p className='font-extrabold'>5</p>
            </div>
            <div className='flex flex-row justify-between mt-2'>
              <p>Referral</p>
              <p className='font-extrabold'>Events</p>
            </div>
            <div className=' flex flex-row justify-between mt-2'>
              <p>Average Experience</p>
              <p className='font-extrabold'>3 Year </p>
            </div>
            <div className='flex flex-row justify-between mt-2'>
              <p>Target Group</p>
              <p className='font-extrabold'>XYZ</p>
            </div>
            <div className='flex flex-row justify-between mt-2'>
              <p>Reason of Particifation</p>
              <p className='font-extrabold'>Funding</p>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div class="border border-gray-400 w-full mt-2 "></div>
      <div className='mt-4 ml-8 text-[#737373] text-xl'>
        <p className='font-extrabold'>Terms & Conditions</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </p>
      </div>
    </div>
  </div>
</div>

      </div>







    </div>
  )
}

export default Admindeatils