import React, { useState, useEffect } from "react";
import { task } from "../Utils/Data/SvgData";

const Details = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [issecpopup, setIssecpopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPopupOpen || issecpopup) {
        if (!event.target.closest(".popup")) {
          setIsPopupOpen(false);
          setIssecpopup(false);
        }
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isPopupOpen, issecpopup]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const second = () => {
    setIssecpopup(!issecpopup);
  };
  return (
    <div className="">
      <div className="flex flex-wrap md:p-8 p-2 ">
        <div className="w-[100%] md1:w-[calc(100%/2-10px)] dlg:w-[calc(100%/3-10px)]  ">
          <a
            href="#"
            className="block md:m-1 p-4 mb-4 bg-gradient-to-b overflow-hidden from-[#B9C0F2] to-[#B9C0F23B] border-2 border-blue-400 rounded-2xl shadow"
          >
            <div className="relative">
              <div className=" relative z-10 p-2">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                  Resource <br></br>
                  <span className="border-b border-[#4E5999] pb-2">PDF</span>
                </h5>
                <p className="font-[450] text-xs text-[#4E5999] py-4">
                  Give your weekend projects, side projects, hobby projects,
                  serious ventures a place to breathe, invite collaborators and
                  inspire other builders.
                </p>
                <div>
                  <button onClick={togglePopup}>{task}</button>
                </div>
              </div>
              <div className="absolute opacity-25 w-40 h-40 -left-[85px] -top-[28px] rounded-full bg-gradient-to-b from-[#3C04BA] to-[#4087BF]"></div>
              <div className="absolute opacity-25 w-40 h-40 -right-[50px] -bottom-[52px] rounded-full bg-gradient-to-r from-[#3C04BA] to-[#4087BF]"></div>
            </div>
          </a>
          {isPopupOpen && (
            <div className="relative z-10 lg:mt-[-390px] bg-opacity-60  backdrop-blur-md  border-opacity-20  p-6  w-full px-4  rounded-lg shadow-lg border-2 border-white">
              <h5 className="mb-2 text-xl font-bold text-gray-900">PDF Name</h5>
              <p className="text-gray-500">
                Lorem ipsum, or lipsum as it is sometimes known, is dummy text
                used in laying out print, graphic or web designs. The passage is
                attributed to an unknown typesetter in the 15th century who is
                thought to have scrambled parts of Cicero's De Finibus Bonorum
                et Malorum .
              </p>
            </div>
          )}
        </div>
        <div className="w-[100%] md1:w-[calc(100%/2-10px)] dlg:w-[calc(100%/3-10px)]  ">
          <a
            href="#"
            className="block md:m-1 p-4 mb-4 bg-gradient-to-b overflow-hidden from-[#B9C0F2] to-[#B9C0F23B] border-2 border-blue-400  rounded-2xl shadow"
          >
            <div className="relative">
              <div className="relative z-10 p-2">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                  Resource <br></br>
                  <span className="border-b border-[#4E5999] pb-2">PDF</span>
                </h5>
                <p className="font-[450] text-xs text-[#4E5999] py-4">
                  Give your weekend projects, side projects, hobby projects,
                  serious ventures a place to breathe, invite collaborators and
                  inspire other builders.
                </p>
                <div>
                  <button onClick={second}>{task}</button>
                </div>
              </div>
              <div className="absolute opacity-25 w-40 h-40 -left-[85px] -top-[28px] rounded-full bg-gradient-to-b from-[#3C04BA] to-[#4087BF]"></div>
              <div className="absolute opacity-25 w-40 h-40 -right-[50px] -bottom-[52px] rounded-full bg-gradient-to-r from-[#3C04BA] to-[#4087BF]"></div>
            </div>
          </a>
          {issecpopup && (
            <div className="relative z-10 lg:mt-[-390px] bg-opacity-60  backdrop-blur-md  border-opacity-20  p-6  w-full px-4  rounded-lg shadow-lg border-2 border-white">
              <h5 className="mb-2 text-xl font-bold text-gray-900 flex justify-center">
                Restricted PDF
              </h5>
              <p className="text-gray-500 flex justify-center">
                This resources is available for authorized people only.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
