
import React, { useState, useEffect } from 'react'
import ment from '../../../assets/images/ment.jpg';
import { task } from '../Utils/Data/SvgData';

const Details = () => {
  const [selectedOption, setSelectedOption] = useState('Pending');
  const [activeWord, setActiveWord] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [issecpopup, setIssecpopup] = useState(false);
  const [isthirpopup, setIsthirpopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPopupOpen || issecpopup || isthirpopup) {

        if (!event.target.closest('.popup')) {
          setIsPopupOpen(false);
          setIssecpopup(false);
          setIsthirpopup(false);
        }
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isPopupOpen, issecpopup, isthirpopup]);


  const handleMouseEnter = (word) => {
    setActiveWord(word);
  };

  const handleMouseLeave = () => {
    setActiveWord('');
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const second = () => {
    setIssecpopup(!issecpopup);
  }
  const third = () => {
    setIsthirpopup(!isthirpopup)
  }
  return (
    <div className=''>
      <div className="flex w-auto items-center flex-wrap justify-between bg-gray-200 rounded-lg mt-8 text-lg p-4 gap-6 hover:bg-blue-300">
        <img src={ment} alt="Mentor" className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0" />

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

      </div>
      <div className="flex flex-wrap justify-start gap-4 mt-4 p-8">
        <div
          className={`cursor-pointer group font-bold ${activeWord === 'Project Details' && 'underline'
            }`}
          onMouseEnter={() => handleMouseEnter('Project Details')}
          onMouseLeave={handleMouseLeave}
        >
          Project Details
        </div>
        <div
          className={`cursor-pointer group font-bold ${activeWord === 'Team Members' && 'underline'
            }`}
          onMouseEnter={() => handleMouseEnter('Team Members')}
          onMouseLeave={handleMouseLeave}
        >
          Team Members
        </div>
        <div
          className={`cursor-pointer group font-bold ${activeWord === 'Resources' && 'underline'
            }`}
          onMouseEnter={() => handleMouseEnter('Resources')}
          onMouseLeave={handleMouseLeave}
        >
          Resources
        </div>
      </div>
      <div class="flex flex-wrap p-8  ">
        <div class="w-full sm:w-1/3 ">
          <a href="#" class="block max-w-sm p-6  mb-4 bg-gradient-to-b from-blue-300 to-opacity-25 border-2 border-blue-400  rounded-lg shadow">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Resource PDF</h5>
            <p class="font-normal text-blue-700">Give your weekend projects, side projects, hobby projects, serious ventures a place to breathe, invite collaborators and inspire other builders.</p>
            <div>
      <button onClick={togglePopup}>{task}</button>
    </div>
          </a>
          {isPopupOpen && (
            <div className="lg:mt-[-390px] bg-opacity-60  backdrop-blur-md  border-opacity-20  p-6  w-full px-4  rounded-lg shadow-lg border-2 border-white">
              <h5 className="mb-2 text-xl font-bold text-gray-900">PDF Name</h5>
              <p className="text-gray-500">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum .
              </p>
            </div>
          )}
        </div>
        <div class="w-full sm:w-1/3">
          <a href="#" class="block max-w-sm p-6 mb-4  bg-gradient-to-b from-blue-300 to-opacity-25  border-2 border-blue-400 rounded-lg shadow">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Advanced Resource PDF</h5>
            <p class="font-normal text-blue-700">Give your weekend projects, side projects, hobby projects, serious ventures a place to breathe, invite collaborators and inspire other builders.</p>
            <div>
      <button onClick={second}>{task}</button>
    </div>
          </a>
          {issecpopup && (
            <div className="lg:mt-[-390px] bg-opacity-60  backdrop-blur-md  border-opacity-20  p-6  w-full px-4  rounded-lg shadow-lg border-2 border-white">
              <h5 className="mb-2 text-xl font-bold text-gray-900 flex justify-center">Restricted PDF</h5>
              <p className="text-gray-500 flex justify-center">This resources is available for authorized people only.
              </p>
            </div>
          )}
        </div>
        <div className="w-full sm:w-1/3">
          <a href="#" class="block max-w-sm p-6  bg-gradient-to-b from-blue-300 to-opacity-25 border-2 border-blue-400 rounded-lg shadow">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Resource PDF</h5>
            <p class="font-normal text-blue-700">Give your weekend projects, side projects, hobby projects, serious ventures a place to breathe, invite collaborators and inspire other builders.</p>
            <div>
      <button onClick={third}>{task}</button>
    </div>
          </a>
          {isthirpopup && (
            <div className="lg:mt-[-390px] bg-opacity-60  backdrop-blur-md  border-opacity-20  p-6  w-full px-4  rounded-lg shadow-lg border-2 border-white">
              <h5 className="mb-2 text-xl font-bold text-gray-900">PDF Name</h5>
              <p className="text-gray-500">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum .
              </p>
            </div>
          )}

        </div>

      </div>


    </div>
  )
}

export default Details;