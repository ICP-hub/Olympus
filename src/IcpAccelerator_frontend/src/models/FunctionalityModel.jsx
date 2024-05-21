import React, { useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import Animation from "../../../admin_frontend/assets/image/Animation.gif";
import { close } from "../components/Utils/Data/SvgData";

function FunctionalityModel({
  onModal,
  para,
  action,
  onClose,
  onClick,
  isSubmitting,
}) {
  if (!onModal) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F3F4F6] z-40 rounded-xl h-auto md:w-[50%]">
        <div className="justify-end flex">
          <button className="p-2" onClick={onClose}>
            {close}
          </button>
        </div>
        <div className="flex flex-col justify-center items-center p-8 ">
          <div className="center-text">
            <img src={Animation} alt="image" className="md:w-1/2" />
            <p className="text-[#00227A] font-[600] leading-[20px]">{para}</p>
          </div>
          <div className="flex justify-center text-[15px] pt-[40px]">
            <button
              onClick={onClose}
              className="px-4 py-1 bg-white text-blue-800 font-bold rounded-lg border-2 border-blue-800 ml-12"
            >
              Cancel
            </button>
            <button
              onClick={onClick}
              disabled={isSubmitting}
              className="px-4 py-1 bg-[#3505B2] text-white font-bold rounded-lg ml-3"
            >
              {isSubmitting ? (
                <ThreeDots
                  visible={true}
                  height="35"
                  width="35"
                  color="#ffffff"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{ justifyContent: "center" }}
                  wrapperclassName=""
                />
              ) : (
                `${action}`
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FunctionalityModel;
