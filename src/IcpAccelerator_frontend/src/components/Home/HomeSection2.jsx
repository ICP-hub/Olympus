import React from "react";
import StatisticCard from "../Common/StatisticCard";
import DetailsCard from "../Common/DetailsCard";

const HomeSection2 = () => {
  return (
    <section className="text-gray-700 bg-gray-100">
      <div className="w-full px-[4%] lg1:px-[5%] xl:px-[1%] h-fit">
        <div className="flex-col">
        <div className="flex mb-4">
          <StatisticCard/>
          </div>
          <div className="flex justify-center">
          <div className="mb-12 text-violet-900  text-sxxs:text-[11.5px] sxs:text-[12px] sxs1:text-[12.5px sxs2:text-[13px] sxs3:text-[13.5px] ss:text-[14px] ss1:text-[14.5px] ss2:text-[15px] ss3:text-[15.5px] ss4:text-[16px] dxs:text-[16.5px] xxs:text-[17px] xxs1:text-[17.5px] sm1:text-[18px] sm4:text-[18.5px] sm2:text-[19px] sm3:text-[19.5px] sm:text-[20px] md:text-[20.8px] md1:text-[21.5px] md2:text-[22px] md3:text-[22.5px] lg:text-[23px] dlg:text-[23.5px] lg1:text-[24px] lgx:text-[24.5px] dxl:text-[28px] xl:text-[25.5px] xl2:text-[26px] font-normal font-fontUse dxl:justify-center dxl:items-center dxl:flex md:top-[19rem] dxl:top-[16rem] ss3:top-[20rem] top-[22rem] ss3:left-0 left-[14px]">Understand the Accelerate program</div>
          </div>
        <div className="flex justify-center ">
        <DetailsCard />
         </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection2;
