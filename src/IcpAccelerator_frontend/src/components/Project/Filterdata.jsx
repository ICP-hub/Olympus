import React, { useState, useRef } from 'react';
import { projectFilterSvg } from "../Utils/Data/SvgData";
import { OutSideClickHandler } from "../hooks/OutSideClickHandler";
import ReactSlider from "react-slider";

const Filterdata = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCountryPopupOpen, setIsCountryPopupOpen] = useState(false);
  const [isMentorPopupOpen, setMentorPopupopen] = useState(false);
  const [isVcpopup, setVcpopup] = useState(false);
  const [isLevel, setLevel] = useState(false);
  const [isGenre, setGenre] = useState(false);
  const [isrange, setrange] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Leaderboard");
  const dropdownRef = useRef(null);
  const countryPopupRef = useRef(null);
  // Const MentorPopupRef = useRef (null);

  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));
  
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
  const handleSliderChange = (index, value) => {


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

    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
  };
  const handleFileSelect = () => {
    document.getElementById('fileInput').click();
  };
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
        {selectedOption && (
          <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold ">
            {selectedOption}
          </div>
        )}

        <div className="flex justify-end gap-4 relative " >
          <div className="cursor-pointer" onClick={() => setIsPopupOpen(true)}>
            {projectFilterSvg}

            {isPopupOpen && (
              <div className="absolute w-[250px] top-full right-9 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10 ">
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
                  <style dangerouslySetInnerHTML={{ __html: customStyles }} />
                  <ReactSlider
                      className="bg-gradient-to-r from-blue-200 to-blue-600 h-1 rounded-md flex-grow"
                      marks
                      markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                      min={1}
                      max={10}
                      thumbClassName="absolute bg-white w-2 h-2 flex items-center justify-center rounded-full shadow-md -top-7" 
                      trackClassName="h-3 rounded"
                      value={sliderValues[sliderKeys[currentStep]]}
                      onChange={(value) => handleSliderChange(currentStep, value)}
                      renderThumb={(props, state) => (
                          <div {...props} className="w-4 h-12 -top-6"> 

                              <div className='w-4 h-4 rounded-full bg-white border-gradient-to-t border-4 from-blue-200 to-blue-600 mt-[16px] '></div>
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
                
                  <div className="text-gray-600 ml-4">
                      {((sliderValues[sliderKeys[currentStep]] - 2) / 8 * 100).toFixed(0)}%
                  </div>
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