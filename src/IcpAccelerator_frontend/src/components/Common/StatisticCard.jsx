import React from 'react'

const StatisticCard = () => {
  return (
    <div className="lg:w-11/12 w-full sm4:mt-0 mt-16 dxl:h-[17.5rem] h-fit bg-neutral-50 rounded-[20px] shadow z-10 relative dxl:-top-[80px] md:-top-[44px] sm:top-[10px] xxs:top-[10px]">
            <div className="flex justify-center">
              <div className="w-4/6  dxl:justify-between dxl:items-center dxl:flex  dxl:left-[-60px] dxl:top-[60px]  dxl:relative block p-6">
                <div className="relative mb-4">
                  <div className="top-0 dxl:absolute text-center bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text dxl:text-5xl text-4xl font-extrabold font-fontUse">
                    50+
                  </div>
                  <div className="left-0 top-[50px] dxl:absolute text-center text-neutral-500 dxl:text-xl font-normal font-fontUse">
                    Project Launched
                  </div>
                </div>
                <div className="relative mb-4">
                  <div className="top-0 dxl:absolute text-center bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text dxl:text-5xl text-4xl font-extrabold font-fontUse">
                    $250M+
                  </div>
                  <div className="left-[53px] top-[50px] dxl:absolute text-center text-neutral-500 dxl:text-xl font-normal font-fontUse">
                    Access to Capital
                  </div>
                </div>
                <div className="relative mb-4">
                  <div className="top-0 dxl:absolute text-center bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text dxl:text-5xl text-4xl font-extrabold font-fontUse">
                    450+
                  </div>
                  <div className="left-[22px] top-[50px] dxl:absolute text-center text-neutral-500 dxl:text-xl font-normal font-fontUse">
                    Partners
                  </div>
                </div>
                <div className="relative mb-4">
                  <div className="top-0 dxl:absolute text-center bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text dxl:text-5xl text-4xl font-extrabold font-fontUse">
                    110K+
                  </div>
                  <div className="left-[14px] top-[50px] dxl:absolute text-center text-neutral-500 dxl:text-xl font-normal font-fontUse">
                    Global Community
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}

export default StatisticCard