import React, { useState } from 'react'
import { projectFilterSvg, remove, star } from "../Utils/Data/SvgData";

const Leaderboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Leaderboard");
  return (
    <div className="px-[4%]  w-full flex flex-col bg-gray-100 h-screen overflow-y-scroll justify-center ">


      <div className="flex items-center justify-between">
        {selectedOption && (
          <div className=" left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl  font-extrabold">
            {selectedOption}
          </div>
        )}
        <div className='flex justify-end gap-4'>
          <div
            className="cursor-pointer"
            onClick={() => setIsPopupOpen(!isPopupOpen)}
          >
            {projectFilterSvg}
          </div>
          <div className='mt-1'>
            {remove}
          </div>
        </div>

        {isPopupOpen && (
          <div className="absolute w-[250px] top-52 right-16 bg-white shadow-md rounded-lg border border-gray-200  p-3 z-10">
            <ul className="flex flex-col">
              <li>
                <button
                  // onClick={() => handleOptionClick("Projects")}
                  className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  // onClick={() => handleOptionClick("Mentors")}
                  className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start"
                >
                  Mentors
                </button>
              </li>
              <li>
                <button
                  // onClick={() => handleOptionClick("VCs")}
                  className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start"
                >
                  VCs
                </button>
              </li>
            </ul>
          </div>
        )}


      </div>


      <div className="w-full flex flex-row justify-around items-center  bg-[#B9C0F2] rounded-lg py-4 mt-6   text-lg px-6  rounded-b-none">
        <div className='w-full flex flex-row justify-around mt-4  font-bold text-white lg:text-2xl md:text-lg sm:text-s text-xms
        '>
          <div className="item">#</div>
          <div className="item">Project Name</div>
          <div className="item">URL</div>
          <div className="item">PDF</div>
          <div className="item">Upvotes</div>
          <div className="item"></div>
        </div>

      </div>
      <div className='text-[#737373] font-bold bg-white bg-opacity-30 border-l-[1px] border-r-[1px] border-[#737373] h-[600px] rounded-lg text-lg rounded-t-none overflow-y-auto'>
        <div className='w-full flex flex-row justify-around mt-4 py-4'>
          <div className='flex justify-center relative items-center'>
            <div className="item">{star}</div>
            <div className="item absolute">1</div>
          </div>
          <div className="item">Project Name</div>
          <div className="item">URL</div>
          <div className="item">PDF</div>
          <div className="item">Upvotes</div>
          <div className="item">...</div>
        </div>
        <div className='w-full flex flex-row justify-around mt-4 py-4'>
        <div className='flex justify-center relative items-center'>
            <div className="item">{star}</div>
            <div className="item absolute">2</div>
          </div>
          <div className="item">Project Name</div>
          <div className="item">URL</div>
          <div className="item">PDF</div>
          <div className="item">Upvotes</div>
          <div className="item">...</div>
        </div>
        
      </div>


    </div>
  )
}

export default Leaderboard