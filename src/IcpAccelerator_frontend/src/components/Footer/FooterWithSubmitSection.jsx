import React from "react";
import logo from "../../../assets/Logo/icpLogo2.png";
import BigLogo from "../../../assets/Logo/bigLogo.png"

const FooterWithSubmitSection = () => {
  return (

    <div className="flex justify-center">
    <div className="w-11/12 h-fit bg-indigo-300 rounded-md shadow relative top-[-130px]">
      <div className="absolute bottom-0 left-0 bg-gradient-to-br from-indigo-300 to-purple-600 w-[13rem] h-[13rem] rounded-full ml-[-38px] mb-[-28px] "></div>
      <div className="absolute bottom-10 right-0 bg-gradient-to-br from-indigo-100 to-purple-600 w-[9rem] h-[9rem] rounded-full mb-[10rem] mr-[-1.5rem]"></div> 
      <div className="p-8 flex justify-between items-center h-fit">
        <div className="flex flex-col dxl:m-8 md1:m-4 sm1:m-3 w-1/4 -left-4 relative">
          <img src={BigLogo} alt="BigLogo" className="object-contain w-24 h-auto " />
          <h1 className="text-3xl md:text-5xl lg:text-4xl xl:text-5xl font-bold text-white">INTERNET COMPUTER</h1>
        </div>
        <div className="flex flex-col justify-between w-3/4">
          <div className="w-fit h-fit text-white text-2xl font-bold font-fontUse leading-none  xl:ml-14">
            Stay in loop!
          </div>
          <div className="w-fit h-20 text-white text-lg font-light font-fontUse mb-4 truncate text-wrap mt-2 xl:ml-14">
            Get a weekly overview of the crypto market, updates about<br/> Outlier Ventures,exclusive invites to upcoming events, plus a <br />selection of fresh job opportunities from our OV Ecosystem <br/> Careers page.
          </div>
          <div className="flex gap-2">
          <input type="email" placeholder=" Your Email " className=" xl:ml-14 placeholder:text-white bg-transparent border-b border-white border-2 rounded-lg focus:outline-none focus:border-violet-800 w-96 " />

            <button type="submit" className=" bg-white text-violet-900 font-bold px-4 py-2 rounded-md text-lg">SUBMIT</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
    
 
  );
};

export default FooterWithSubmitSection;
