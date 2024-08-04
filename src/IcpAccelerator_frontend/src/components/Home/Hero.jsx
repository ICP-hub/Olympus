import React from "react";
import df_logo from "../../../assets/Logo/df_logo.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import SplineViewerComponent from "./SplineViewerComponent";

const HeroSection = () => {
  const { setModalOpen } = useOutletContext();
  const principal = useSelector((currState) => currState.internet.principal);

  const manageHandler = () => {
    setModalOpen(!principal);
  };

  return (
    <section className="bg-[#FEF5EE] relative overflow-hidden">
      <div className="container mx-auto z-10 relative"> 
        <div className="max-w-7xl w-full py-12 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex flex-col md:flex-row items-start">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 pt-16">
              <div className="max-w-[640px]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#121926] text-xl font-normal">
                    Backed by
                  </span>
                  <img
                    src={df_logo}
                    alt="Backed by Dfinity"
                    className="h-6"
                  />
                </div>
                <h1 className="text-6xl md:text-7xl font-bold text-[#121926] leading-tight mb-4">
                  Peak of{" "}
                  <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Web3
                  </span>{" "}
                  Acceleration
                </h1>
                <p className="text-xl font-medium text-[#364152] mb-6">
                  OLYMPUS is the first on-chain Web3 acceleration platform
                  connecting founders, investors, mentors and talents across
                  different ecosystems.
                </p>
                <button
                  onClick={manageHandler}
                  className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-[4px] hover:bg-blue-700 transition duration-300"
                >
                  Get started <ArrowForwardIcon className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <SplineViewerComponent />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      {/* <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FEF5EE] to-transparent"></div> */}

    </section>
  );
}

export default HeroSection;
