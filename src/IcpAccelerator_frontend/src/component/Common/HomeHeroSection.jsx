import React, { useState, useEffect } from "react";

const HomeHeroSection = () => {
  return (
    <section className="text-black bg-gray-100">
      <div className="w-full px-[4%] lg1:px-[5%]">
        <div className="flex dxl:justify-end">
          <div className="w-full h-fit relative">
            <h1 className=" xl:-top-2 lg:top-2 md:top-2 sm:top-6 sm4:top-6 xxs1:top-10 dxs:top-10 ss2:top-6 top-6 z-10 absolute bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text xl2:text-[5.5rem] xl:text-[5rem] lg:text-[4.5rem] md:text-[4rem] sm:text-[3.5rem] sm4:text-[3rem] xxs1:text-[2.25rem] dxs:text-[2rem] ss2:text-[2rem] text-[1.5rem] font-fontUse font-bold">
              ACCELERATE
            </h1>
            <div className="text-black font-bold font-fontUse absolute xxs1:top-24 dxs:top-[5.875rem] ss2:top-[4.875rem] lg:top-[7rem] md:top-[7.5rem] sm:top-[7.5rem]  top-[4rem] text-[0.625rem] sm4:text-[1rem] sm:text-[0.8125rem] md:text-[0.90625rem] lg:text-[1.03125rem] xl:text-[1.1875rem] 2xl:text-[1.21875rem] line-clamp-2 text-wrap mb-9">
              Supercharging Web3 startups for breakthrough success
            </div>
            <button className="font-bold font-fontUse rounded-md my-2 bg-indigo-600 absolute text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap">
              apply for the program
            </button>
          </div>
          <div className="relative flex justify-center items-center">
            <img
              src=''
              alt="Astronaut"
              className={`z-20 w-[500px] md:w-[400px] sm:w-[300px] sxs:w-[295px] relative top-4 sxs:right-0 right-16 md:right-8 sm:right-4 transition-transform duration-1000 ease-in-out transform animate-translate-y`}
            />
            <div className="absolute top-[20px] -left-[10%] sm:-left-[18%] md:-left-[14%] sxs:left-[%] w-[320px] h-[320px] md:w-[280px] md:h-[280px] sm:w-[230px] sm:h-[230px] sxs:w-[160px] sxs:h-[160px] rounded-full bg-gradient-to-r from-purple-300/40 to-purple-600"></div>
            <div className="absolute top-[200px] sxs:top-[150px] left-[65%] sxs:left-[54%] w-[164px] h-[164px] md:w-[124px] md:h-[124px] sm:w-[94px] sm:h-[94px] sxs:w-[80px] sxs:h-[80px] rounded-full bg-gradient-to-r from-purple-900 to-blue-500 opacity-30"></div>
            <div className="absolute top-[120px] left-[45%] sxs:left-[53%] w-[190px] h-[200px] md:w-[140px] md:h-[150px] sm:w-[100px] sm:h-[110px] sxs:w-[80px] sxs:h-[80px] bg-gradient-to-b from-white/30 to-transparent rounded-lg backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
