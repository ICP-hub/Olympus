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
  const [selectedOption, setSelectedOption] = useState('pending');
  const sliderKeys = ['key1'];


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsPopupOpen(false);
  };
  const handleSliderChange = (index, value) => {
    const key = sliderKeys[index];
    const newSliderValuesProgress = { ...sliderValuesProgress, [key]: value === 9 ? 100 : Math.floor(value * 11) };
    setSliderValuesProgress(newSliderValuesProgress)
  };



  return (
    <div className='p-8'>
      <div>
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
      <div className='px-8'>
        <div className="flex flex-col xl:flex-row items-center bg-gray-200  rounded-lg mt-8   text-lg p-4 hover:bg-blue-300">
          <img src={ment} alt="Mentor" className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0" />
          <div className="flex flex-col lg:flex-row justify-evenly w-full items-center lg:items-start ">
            <p className="font-bold mr-0 lg:mr-[18px] mb-2 lg:mb-0">builder.fi</p>
            <p className="truncate mr-0 lg:mr-[18px] mb-2 lg:mb-0">q&a market place built on </p>
            <p className="truncate mr-0 lg:mr-[18px] mb-2 lg:mb-0"> DAO.infrastructure +1 more</p>
            {sliderKeys.map((key, index) => (
              <div key={key} className="mx-4 flex items-center w-36   ">
                <Line
                  strokeWidth={0.2}
                  percent={sliderValuesProgress[key]}
                  strokeColor="bg-black"
                  className="line-horizontal"
                />
                <div className="text-black font-bold text-[15px]  font-fontUse ml-2">
                  {sliderValuesProgress[key]}%
                </div>
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    id="Star 1"
                    d="M7.04894 0.92705C7.3483 0.00573921 8.6517 0.00573969 8.95106 0.92705L10.0206 4.21885C10.1545 4.63087 10.5385 4.90983 10.9717 4.90983H14.4329C15.4016 4.90983 15.8044 6.14945 15.0207 6.71885L12.2205 8.75329C11.87 9.00793 11.7234 9.4593 11.8572 9.87132L12.9268 13.1631C13.2261 14.0844 12.1717 14.8506 11.388 14.2812L8.58778 12.2467C8.2373 11.9921 7.7627 11.9921 7.41221 12.2467L4.61204 14.2812C3.82833 14.8506 2.77385 14.0844 3.0732 13.1631L4.14277 9.87132C4.27665 9.4593 4.12999 9.00793 3.7795 8.75329L0.979333 6.71885C0.195619 6.14945 0.598395 4.90983 1.56712 4.90983H5.02832C5.46154 4.90983 5.8455 4.63087 5.97937 4.21885L7.04894 0.92705Z"
                    fill="black"
                  />
                </svg>
              </div>
            ))}
            <p className=" text-gray-600 ml-0 lg:ml-[18px] mb-2 lg:mb-0 text-lg">Level 8</p>
            <button className='border text-[#737373] p-[5px] px-3 rounded-md border-[#C7C7C7] mb-2 lg:mb-0'>▲ 50</button>
            <button className=" px-2 py-1 bg-[#3505B2] text-white rounded">View</button>
          </div>
        </div>
      </div>
      <div className='px-8'>
        <div className="flex flex-col xl:flex-row items-center bg-gray-200  rounded-lg mt-8   text-lg p-4 hover:bg-blue-300">
          <img src={ment} alt="Mentor" className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0" />
          <div className="flex flex-col lg:flex-row justify-evenly w-full items-center lg:items-start ">
            <p className="font-bold mr-0 lg:mr-[18px] mb-2 lg:mb-0">builder.fi</p>
            <p className="truncate mr-0 lg:mr-[18px] mb-2 lg:mb-0">q&a market place built on </p>
            <p className="truncate mr-0 lg:mr-[18px] mb-2 lg:mb-0"> DAO.infrastructure +1 more</p>
            <div className="bg-black h-1 w-36 rounded-[18px] mb-2 lg:mb-0 mt-3"></div>
            <p className=" text-gray-600 ml-0 lg:ml-[18px] mb-2 lg:mb-0 text-lg">Level 8</p>

            <button className='border text-[#737373] p-[5px] px-3 rounded-md border-[#C7C7C7] mb-2 lg:mb-0'>▲ 50</button>
            <button className=" px-2 py-1 bg-[#3505B2] text-white rounded">View</button>
          </div>
        </div>
      </div>
      <div className='px-8'>
        <div className="flex flex-col xl:flex-row items-center bg-gray-200  rounded-lg mt-8   text-lg p-4 hover:bg-blue-300">
          <img src={ment} alt="Mentor" className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0" />
          <div className="flex flex-col lg:flex-row justify-evenly w-full items-center lg:items-start ">
            <p className="font-bold mr-0 lg:mr-[18px] mb-2 lg:mb-0">builder.fi</p>
            <p className="truncate mr-0 lg:mr-[18px] mb-2 lg:mb-0">q&a market place built on </p>
            <p className="truncate mr-0 lg:mr-[18px] mb-2 lg:mb-0"> DAO.infrastructure +1 more</p>
            <div className="bg-black h-1 w-36 rounded-[18px] mb-2 lg:mb-0 mt-3"></div>
            <p className=" text-gray-600 ml-0 lg:ml-[18px] mb-2 lg:mb-0 text-lg">Level 8</p>

            <button className='border text-[#737373] p-[5px] px-3 rounded-md border-[#C7C7C7] mb-2 lg:mb-0'>▲ 50</button>

            <button className=" px-2 py-1 bg-[#3505B2] text-white rounded">View</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Mentors;
