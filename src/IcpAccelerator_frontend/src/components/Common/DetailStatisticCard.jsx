import React from 'react'

const DetailStatisticCard = () => {

    const responsiveText= ` text-gray-500 mb-6 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[15px] sm:text-[15.5px] md:text-[16px.3] md1:text-[17px] md2:text-[17.5px] md3:text-[18px] lg:text-[18.5px] dlg:text-[19px] lg1:text-[15.5px] lgx:text-[20px] md:text-[20.5px] xl:text-[21px] xl2:text-[21.5px]`
    

  return (

<div className="w-full md:h-[14.5rem]  bg-neutral-50 rounded-[20px] shadow z-10 absolute  md:top-[230px] top-[200px]">
            <div className="flex  md:justify-center ">
              <div className="w-5/6 px-4 md:justify-between md:items-center md:flex md:left-[-60px] md:top-[60px]  md:relative  ">
                <div className="relative mb-4 mt-4 md:mt-0">
                  <div className="top-0 md:absolute text-center text-violet-800 md:text-5xl text-4xl font-extrabold font-fontUse">
                    50+
                  </div>
                  <div className={`${responsiveText} left-0 top-[50px] md:absolute text-center text-neutral-500 md:text-xl font-normal font-fontUse`}>
                    Project Launched
                  </div>
                </div>
                <div className="relative mb-4 ">
                  <div className="top-0 md:absolute text-center text-violet-800 md:text-5xl text-4xl font-extrabold font-fontUse">
                    $250M+
                  </div>
                  <div className={`${responsiveText} left-[53px] top-[50px] md:absolute text-center text-neutral-500 md:text-xl font-normal font-fontUse`}>
                    Access to Capital
                  </div>
                </div>
                <div className="relative mb-4">
                  <div className="top-0 md:absolute text-center text-violet-800 md:text-5xl text-4xl font-extrabold font-fontUse">
                    450+
                  </div>
                  <div className={`${responsiveText} left-[22px] top-[50px] md:absolute text-center text-neutral-500 md:text-xl font-normal font-fontUse`}>
                    Partners
                  </div>
                </div>
                <div className="relative mb-4">
                  <div className="top-0 md:absolute text-center text-violet-800 md:text-5xl text-4xl font-extrabold font-fontUse">
                    110K+
                  </div>
                  <div className={`${responsiveText} left-[14px] top-[50px] md:absolute text-center text-neutral-500 md:text-xl font-normal font-fontUse`}>
                    Global Community
                  </div>
                </div>
              </div>
            </div>
          </div>  )
}

export default DetailStatisticCard