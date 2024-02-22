import React from "react";
import logo from "../../../assets/Logo/icpLogo2.png";
import BigLogo from "../../../assets/Logo/bigLogo.png";

const SubmitSection = () => {
  return (
    <div className="w-full h-fit bg-indigo-300 rounded-md shadow top-[-130px]">
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 ellipse-quarter-left rounded-md"></div>
        <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-600 w-36 h-36  ellipse-quarter-right rounded-md"></div>
        <div className="p-8 flex flex-col justify-between items-center md:flex-row md:justify-start h-fit">
          <div className="flex flex-col md:m-8 md:ml-0 sm:m-4 sm:ml-0 w-1/4 relative">
            <img src={BigLogo} alt="BigLogo" className="object-contain w-24 h-auto " />
            <h1 className="text-xl md:text-5xl lg:text-4xl xl:text-5xl font-bold text-white">INTERNET COMPUTER</h1>
          </div>
          <div className="flex flex-col w-full md:w-3/4">
            <div className="w-fit h-fit text-white text-2xl font-bold font-fontUse leading-none md:ml-14">
              Stay in loop!
            </div>
            <div className="w-fit h-20 text-white text-lg font-light font-fontUse mb-4 md:lg:line-clamp-0 line-clamp-3 text-wrap mt-2 md:ml-14">
              Get a weekly overview of the crypto market, updates about
              <br /> Outlier Ventures,exclusive invites to upcoming events, plus
              a <br />
              selection of fresh job opportunities from our OV Ecosystem <br />{" "}
              Careers page.
            </div>
            <div className="flex flex-row z-10 md:flex-row items-center gap-2 md:items-center md:ml-14">
              <input
                type="email"
                placeholder="Your Email"
                className="placeholder:text-white   bg-transparent border-b border-white border-2 rounded-lg focus:outline-none focus:border-violet-800 w-4/5 xl:lg:md:ml-0 xl:lg:md:w-96 px-4 py-2"
              />
              <button type="submit" className="bg-white text-violet-900 font-bold px-4 py-2  rounded-md text-lg md:ml-2">SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitSection;
