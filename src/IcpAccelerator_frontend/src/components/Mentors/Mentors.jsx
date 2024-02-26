import React, { useState } from 'react';
import filter from '../../../assets/images/filter.png';
import ment from '../../../assets/images/ment.jpg';
import { Line } from "rc-progress";
import Profile from "../../../assets/images/Ellipse 1382.svg";
import ReactSlider from "react-slider";
import Astro from "../../../assets/images/AstroLeft.png";

const Mentors = () => {
  const [sliderValuesProgress, setSliderValuesProgress] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Pending');
  const sliderKeys = ['key1'];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsPopupOpen(false);
  };

  const handleSliderChange = (index, value) => {
    const key = sliderKeys[index];
    const newSliderValuesProgress = { ...sliderValuesProgress, [key]: value === 9 ? 100 : Math.floor(value * 11) };
    setSliderValuesProgress(newSliderValuesProgress);
  };

  return (
    <div className='px-[4%] py-[4%] w-full'>
      <div className=''>
        <div className='flex justify-end mr-11 '>
          <img
            src={filter}
            alt="Filter"
            className="absolute  h-[40px] cursor-pointer lg:md:top-28"
            onClick={() => setIsPopupOpen(!isPopupOpen)}
          />
        </div>
        {isPopupOpen && (
          <div className="absolute  right-5 lg:right-28 w-[250px]  bg-white shadow-md  rounded-lg border border-gray-200 top-20 mt-20 p-3">
            <div className="flex flex-col">
              <button
                onClick={() => handleOptionClick('Accepted')}
                className="  border-[#9C9C9C] py-[18px] border-b-2 w-[230px]  font-bold  px-4 focus:outline-none text-xl flex justify-start"
              >
                Accepted
              </button>
              <button
                onClick={() => handleOptionClick('Declined')}
                className=" border-[#9C9C9C] py-[18px] w-[230px] border-b-2  px-4 font-bold focus:outline-none text-xl flex justify-start"
              >
                Declined
              </button>
              <button
                onClick={() => handleOptionClick('Pending')}
                className=" px-4 font-bold   py-[18px] focus:outline-none text-xl flex justify-start"
              >
                Pending
              </button>
            </div>
          </div>
        )}
        {selectedOption && (
          <div className=" left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text ml-8 text-xl  font-bold">
            {selectedOption}
          </div>
        )}
      </div>

      <div className=''>
        <div className="flex w-auto items-center flex-wrap justify-between bg-gray-200 rounded-lg mt-8 text-lg p-4 gap-6 hover:bg-blue-300">
          <img src={ment} alt="Mentor" className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0" />
          {/* <div className="flex flex-col lg:flex-row justify-between w-full items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4"> */}
          <p className="font-bold">builder.fi</p>

          <p className="truncate">q&a market place built on </p>
          <p className="truncate"> DAO.infrastructure +1 more</p>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-gray-300 to-gray-900 h-1 w-44 rounded-[18px] mb-2 lg:mb-0 mt-3"></div>
            <div className="text-gray-600 text-xs ml-2">Level 9</div>
          </div>


          <div className='flex space-x-4 flex-wrap md:flex-nowrap'>
            <button className='border text-[#737373] p-[5px] px-3 rounded-md border-[#C7C7C7] text-nowrap'>▲ 50</button>
            {selectedOption === 'Accepted' && (
              <button className="px-2 bg-[#3505B2] text-white font-bold rounded-lg">View</button>
            )}
            {selectedOption === 'Pending' && (
              <>
                <button className="px-2 bg-white text-blue-800 font-bold rounded-lg border-2 border-blue-800">Reject</button>
                <button className="px-2 bg-[#3505B2] text-white font-bold rounded-lg">Accept</button>
              </>
            )}
            {selectedOption === 'Declined' && (
              <button></button>
            )}
          </div>
          {/* </div> */}
        </div>
      </div>


    </div>
  );
}

export default Mentors;
