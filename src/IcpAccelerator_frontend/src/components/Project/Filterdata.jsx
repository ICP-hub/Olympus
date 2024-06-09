import React, { useState, useRef } from 'react';
import { projectFilterSvg } from "../Utils/Data/SvgData";
import { OutSideClickHandler } from "../hooks/OutSideClickHandler";
import ReactSlider from "react-slider";

const Filterdata = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCountryPopupOpen, setIsCountryPopupOpen] = useState(false);
  const [isMentorPopupOpen, setMentorPopupopen] = useState(false);
  const [isVcpopup, setVcpopup] = useState(false);
  const [isLevel, setLevel] = useState(false);
  const [isGenre, setGenre] = useState(false);
  const [isrange, setrange] = useState(false);
  const dropdownRef = useRef(null);
  const countryPopupRef = useRef(null);
  // Const MentorPopupRef = useRef (null);

  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));
  

  const handleLevelButtonClick = () => {
    setIsCountryPopupOpen(false);
    setMentorPopupopen(false);
    setVcpopup(false);
    setrange(false);
    setGenre(false);
    setLevel((prevState) => !prevState);
  };
  
  const handleMentorButtonClick = () => {
    setIsCountryPopupOpen(false);
    setLevel(false);
    setVcpopup(false);
    setrange(false);
    setGenre(false);
    setMentorPopupopen((prevState) => !prevState);
  };
  
  const handleVCButtonClick = () => {
    setIsCountryPopupOpen(false);
    setLevel(false);
    setMentorPopupopen(false);
    setrange(false);
    setGenre(false);
    setVcpopup((prevState) => !prevState);
  };
  
  const handleInvestmentRangeButtonClick = () => {
    setIsCountryPopupOpen(false);
    setLevel(false);
    setMentorPopupopen(false);
    setVcpopup(false);
    setGenre(false);
    setrange((prevState) => !prevState);
  };
  
  const handleGenreButtonClick = () => {
    setIsCountryPopupOpen(false);
    setLevel(false);
    setMentorPopupopen(false);
    setVcpopup(false);
    setrange(false);
    setGenre((prevState) => !prevState);
  };
  
  const handleCountryButtonClick = () => {
    setLevel(false);
    setMentorPopupopen(false);
    setVcpopup(false);
    setrange(false);
    setGenre(false);
    setIsCountryPopupOpen((prevState) => !prevState);
    
    
  };
  
  return (
    <div>
      <div className="flex items-center justify-between">
     

        <div className="flex justify-end gap-4 relative " >
          <div className="cursor-pointer" onClick={() => setIsPopupOpen(true)}>
            {projectFilterSvg}

            {isPopupOpen && (
              <div className="absolute w-[250px] top-full right-0 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10 ">
                <ul className="flex flex-col">
                  <li>
                    <button
                      className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start" 
                      onClick={handleCountryButtonClick }
                    >
                      Country
                    </button>
                  </li>
                  <li>
                    <button
                      className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start"
                      onClick={handleLevelButtonClick}
                    >
                      Level
                    </button>
                  </li>
                  <li>
                    <button
                      className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start"
                      onClick={handleMentorButtonClick}
                    >
                      Mentor
                    </button>
                  </li>
                  <li>
                    <button
                      className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start"
                      onClick={handleVCButtonClick}
                    >
                      VC
                    </button>
                  </li>
                  <li>
                    <button
                      className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start"
                      onClick={handleInvestmentRangeButtonClick}
                    >
                      Investment Range
                    </button>
                  </li>
                  <li>
                    <button
                      className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start"
                      onClick={handleGenreButtonClick}
                    >
                      Genre
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Country popup Start */}
        {isCountryPopupOpen && (
          <div className="absolute w-[250px] top-60 md:right-[345px] bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10" ref={countryPopupRef}>
            <ul className="flex flex-col">
              <li>
                <button
                  className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"

                >
                  India
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Australia
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  London
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Africa
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Germany                    </button>
              </li>
              <li>
                <button className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start">
                  Russia
                </button>
              </li>
            </ul>
          </div>
        )}
        {/* Country popup End */}

        {/* Mentor popup start */}
        {isMentorPopupOpen && (
          <div className="absolute w-[250px] top-96 md:right-[345px] bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10" ref={countryPopupRef}>
            <ul className="flex flex-col">
              <li>
                <button
                  className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"

                >
                  Mr. Dave
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Ms. Lucy            </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Prof. Mack
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Mr. Dave
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Ms. Lucy                    </button>
              </li>
              <li>
                <button className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start">
                  Prof. Mack
                </button>
              </li>
            </ul>
          </div>
        )}
        {/* Mentor Popup End */}
        {/* Vc popup Start */}
        {isVcpopup && (
          <div className="absolute w-[250px] top-[430px] md:right-[345px] bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10" ref={countryPopupRef}>
            <ul className="flex flex-col">
              <li>
                <button
                  className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"

                >
                  Prof. Mack            </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Mr. Dave            </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Prof. Mack
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Mr. Dave
                </button>
              </li>
              <li>
                <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                  Ms. Lucy                    </button>
              </li>

            </ul>
          </div>
        )}
        {/* Vc popup End */}
        {/* Levelpopup Start */}
        {isLevel && (
          <div className="absolute w-1/2 top-12 ml-24  bg-white shadow-md rounded-lg border border-gray-200 p-3 mt-32 z-10" ref={countryPopupRef}>
            <div className='flex flex-wrap flex-row gap-2 md:space-x-2'>
              <p className='bg-gray-400 rounded-full px-2'>Level 1</p>
              <p className='bg-gray-400 rounded-full px-2'>Level 2</p>
              <p className='bg-gray-400 rounded-full px-2' >Level 3</p>
              <p className='bg-gray-400 rounded-full px-2'>Level 4</p>
              <p className='bg-gray-400 rounded-full px-2'>Level 5</p>
              <p className='bg-gray-400 rounded-full px-2'>Level 6</p>

            </div>
          </div>
        )}
        {/* Levelpopup END */}
        {/* Genrepopup Start  */}
        {isGenre && (
          <div className="absolute w-1/2 md:top-24 ml-24 top-60 bg-white shadow-md rounded-lg border border-gray-200 p-3 mt-36 z-10" ref={countryPopupRef}>
            <div className='flex flex-wrap flex-row gap-2 md:space-x-2'>
              <p className='bg-gray-400 rounded-full px-2'> Art</p>
              <p className='bg-gray-400 rounded-full px-2'>Web3</p>
              <p className='bg-gray-400 rounded-full px-2' >Meta</p>
              <p className='bg-gray-400 rounded-full px-2'>Analytics</p>
              <p className='bg-gray-400 rounded-full px-2'>DOA</p>
              <p className='bg-gray-400 rounded-full px-2'>DeFi</p>

            </div>
          </div>
        )}
        {/* Genrepopup End */}
      {/* scroll bar Start */}
        {isrange && (


<div className="absolute w-[250px] top-[430px] md:right-[345px] bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10" ref={countryPopupRef}>
          <div className='flex flex-col '>
              <div className='flex flex-row flex-wrap justify-ceneter items-center'>
                  <h1 className='text-[#252641]  text-2xl'>Select range</h1>
                  <div className=' '>
                    
                  </div>
              </div>
              <div className="relative my-2 flex items-center">
                 
              </div>
           
          </div>
      </div>
  
)}
{/* Scroll bar End */}
      </div>
    </div>
  )
}

export default Filterdata