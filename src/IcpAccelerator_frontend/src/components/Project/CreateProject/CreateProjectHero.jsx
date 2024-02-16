import React, { useState, useEffect } from "react";
import HalfAstro from "../../../../assets/images/astroRegular.png";
import FullAstro from "../../../../assets/images/astro1.png";

const CreateProjectHero = () => {
  const [translate, setTranslate] = useState("translate-y-0");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTranslate((prevTranslate) =>
        prevTranslate === "translate-y-0" ? "translate-y-5" : "translate-y-0"
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="text-black body-font bg-violet-800 flex flex-col justify-between h-[400px] relative">
      {/* Content Above Blurred Circle */}
      <div className="w-full p-[3%] md:px-[4%] lg1:px-[5%] flex flex-row justify-between items-start">
        <div className="flex-col w-3/8">
          <p className="mt-8 ml-2  text-white text-[20px] xl2:text-[19.5px] xl:text-[19px] dxl:text-[18.5px] lgx:text-[18px] lg1:text-[17.5px] dlg:text-[17px] lg:text-[16.5px] md3:text-[16px] md2:text-[15.5px] md1:text-[15px] md:text-[14.5px] sm:text-[15px] sm3:text-[15px] sm2:text-[14px] sm4:text-[13.5px] sm1:text-[13px] xxs1:text-[12.5px] xxs:text-[12px] dxs:text-[12px] ss4:text-[12px] ss3:text-[12px] ss2:text-[12px] ss1:text-[12px] ss:text-[12px] sxs3:text-[12px] sxs2:text-[12px] sxs1:text-[12px] sxs:text-[12px] sxxs:text-[12px]   font-normal font-circular ">
            You are one step close to{" "}
          </p>
          <h1 className="ml-2 md:ml-0  text-white text-[90px] xl2:text-[88px] xl:text-[85px] dxl:text-[82px] lgx:text-[80px] lg1:text-[78px] dlg:text-[75px] lg:text-[72px] md3:text-[70px] md2:text-[68px] md1:text-[65px] md:text-[54px] sm:text-[52px] sm3:text-[51px] sm2:text-[48px] sm4:text-[42px] sm1:text-[42px] xxs1:text-[38px] xxs:text-[37px] dxs:text-[36px] ss4:text-[36px] ss3:text-[32px] ss2:text-[33px] ss1:text-[33px] ss:text-[30px] sxs3:text-[26px] sxs2:text-[25px] sxs1:text-[25px] sxs:text-[25px] sxxs:text-[25px] font-fontUse font-bold">
            Create Project
          </h1>
          <button className="rounded-sm border border-white  w-[210px]">
            <div className=" text-[13px] xl2:text-[12.8px] xl:text-[12.5px] dxl:text-[12.3px] lgx:text-[12px] lg1:text-[11.8px] dlg:text-[11.5px] lg:text-[11.3px] md3:text-[11px] md2:text-[10.8.5px] md1:text-[10.5px] md:text-[10.3px] sm:text-[10px] sm3:text-[9.8px] sm2:text-[9.5px] sm4:text-[9.5px] sm1:text-[9.5px] xxs1:text-[9.5px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] text-center text-white border-b font-fontUse uppercase px-4 font-bold py-1 break-normal">
              apply for the program
            </div>
          </button>
        </div>

        <div className="w-2/8">
          <img
            src={FullAstro}
            alt="FullAstro"
            className={`hidden md:block transition-transform duration-1000 ease-in-out transform  w-[500px] relative object-cover ${translate}`}
          />
        </div>

        <div className="flex flex-col w-3/8">
          <p>
            By submitting your Pitch you are exposing your Project to a myriad
            of new opportunities: influential VCs, engaged audience, and the
            most seamless Fundraising Experience imaginable.
          </p>
          <p>
            Submitting a Pitch is not free as Pitchtalk is a provider of unique
            service that exposes your idea and vision to the notable players in
            the industry and specifically within the NEAR ecosystem. We also
            allow anyone to submit their pitch, giving indiscriminate chance to
            all!
          </p>
        </div>
      </div>

      {/* Blurred Circle at the Bottom Center */}
      <div className="w-full flex justify-center items-end absolute bottom-[-152px]">
        <div className="w-[500px] h-[380px] bg-fuchsia-800 rounded-full blur-[169px]"></div>
      </div>
    </section>
  );
};

export default CreateProjectHero;
