import React, { useState, useEffect } from "react";
import HalfAstro from "../../../assets/images/astroRegular.png";
import FullAstro from "../../../assets/images/astro1.png";

const HomeHeroSection = () => {
  return (
    <section className="text-black bg-gray-100">
      <div className="w-full px-[4%] lg1:px-[5%]">
        <div className="flex dxl:justify-end">
          <div className="w-full h-fit relative">
            {/* <div className="w-[500px] xl2:w-[900px] xl:w-[700px] dxl:w-[630px] lgx:w-[600px] lg1:w-[550px] dlg:w-[525px] lg:w-[500px] md3:w-[470px] md2:w-[460px] md1:w-[450px]  md:w-[440px] sm:w-[430px] sm3:w-[400px] sm2:w-[390px] sm4:w-[380px] sm1:w-[360px] xxs1:w-[340px] xxs:w-[310px] dxs:w-[290px] ss4:w-[280px] ss3:w-[270px] ss2:w-[260px] ss1:w-[250px] ss:w-[240px] sxs3:w-[230px] sxs2:w-[220px] sxs1:w-[210px] sxs:w-[200px] sxxs:w-[190px]  h-[380px] left-[400px] top-[100px] absolute bg-fuchsia-800 rounded-full blur-[169px] xl2:left-[260px] xl:left-[280px] dxl:left-[230px] lgx:left-[200px] lg1:left-[180px] dlg:left-[170px] lg:left-[160px] md3:left-[150px] md2:left-[140px] md1:left-[130px] md:left-[120px] sm:left-[110px] sm3:left-[70px] sm2:left-[60px] sm4:left-[50px] sm1:left-[50px] xxs1:left-[45px] xxs:left-[40px] dxs:left-[35px] ss4:left-[30px] ss3:left-[25px] ss2:left-[20px] ss1:left-[15px] ss:left-[15px] sxs3:left-[15px] sxs2:left-[10px] sxs1:left-[10px] sxs:left-[5px] sxxs:left-[5px]"></div> */}
            <h1 className="left-[19px] top-[60px] z-10 absolute bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text xl2:text-[5.5rem] xl:text-[5rem] lg:text-[4.5rem] md:text-[4rem] sm:text-[3.5rem] sm4:text-[2.5rem] xxs1:text-[2rem] dxs:text-[1.5rem] ss2:text-[1.25rem] text-[1rem] font-fontUse font-bold">

              ACCELERATE
            </h1>
            <div className="line-clamp-2 text-black  xl2:text-[19.5px] xl:text-[19px] dxl:text-[18.5px] lgx:text-[18px] lg1:text-[17.5px] dlg:text-[17px] lg:text-[16.5px] md3:text-[16px] md2:text-[15.5px] md1:text-[15px] md:text-[14.5px] sm:text-[15px] sm3:text-[15px] sm2:text-[14px] sm4:text-[13.5px] sm1:text-[13px] xxs1:text-[12.5px] xxs:text-[12px] dxs:text-[12px] ss4:text-[12px] ss3:text-[12px] ss2:text-[12px] text-[10px] top-[170px] xl2:top-[169px] xl:top-[168px] dxl:top-[167px] lgx:top-[166px] lg1:top-[165px] dlg:top-[164px] lg:top-[163px] md3:top-[162px] md2:top-[161px] md1:top-[160px] md:top-[159px] sm:top-[158px] sm3:top-[145px] sm2:top-[140px] sm4:top-[140px] sm1:top-[136px] xxs1:top-[132px] xxs:top-[130px] dxs:top-[130px] ss4:top-[120px] ss3:top-[120px] ss2:top-[110px] ss1:top-[110px] ss:top-[110px] sxs3:top-[100px] sxs2:top-[100px] sxs1:top-[95px] sxs:top-[95px] sxxs:top-[95px] left-[20px] font-extrabold font-circular absolute">
              Supercharging Web3 startups for breakthrough success
            </div>

            <button className="rounded-md my-2 bg-indigo-600 absolute w-[210px] left-[19px] top-[210px] xl2:top-[209.5px] xl:top-[225px] dxl:top-[225px] lgx:top-[220px] lg1:top-[215px] dlg:top-[215px] lg:top-[210px] md3:top-[210px] ss1:top-[195px] sxs1:top-[190px]">
              <div className="text-wrap text-[13px] xl2:text-[12.8px] xl:text-[12.5px] dxl:text-[12.3px] lgx:text-[12px] lg1:text-[11.8px] dlg:text-[11.5px] lg:text-[11.3px] md3:text-[11px] md2:text-[10.8.5px] md1:text-[10.5px] md:text-[10.3px] sm:text-[10px] sm3:text-[9.8px] sm2:text-[9.5px] sm4:text-[9.5px] sm1:text-[9.5px] xxs1:text-[9.5px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] text-center text-white border-b font-fontUse uppercase px-4 font-bold py-2 break-normal">
                apply for the program
              </div>
            </button>
          </div>
          <div className="relative flex justify-center items-center">
            <img
              src={FullAstro}
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
