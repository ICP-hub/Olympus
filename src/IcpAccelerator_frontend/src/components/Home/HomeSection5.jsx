import React from 'react';
import { homepagedata } from "../Utils/jsondata/data/homepageData";



export default function HomeSection5() {
  const { homepagesection5 } = homepagedata;
  return (
    <>
      <div className="bg-white py-10">
        <div className="container mx-auto px-5 md:px-0">
          <div className="max-w-6xl w-full mx-auto bg-[#FEF6EE] rounded-lg shadow-md">
            <section className="text-center p-2 lg:p-12">
              <div className="md1:mx-52">
                <button className="border border-blue-300 rounded-full text-blue-500 px-4 mt-5">
                  {homepagesection5.header.button.text}{" "}
                </button>
                <h2 className="text-3xl font-medium mb-4 mt-4">
                  {homepagesection5.header.title}{" "}
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  {homepagesection5.header.description}
                </p>
              </div>
            </section>
            <div className="flex flex-col-reverse md:flex-row">
              <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                <img
                  src={homepagesection5.image.src.man1}
                  alt="Statue"
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-1/2 min ">
                <ul className="space-y-8 relative ml-2">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-0 bottom-0 sxxs:h-[25rem] ss:h-80 dxs:h-80 xxs:h-80  sm2:h-64  sm4:h-80  md:h-80 sxxs:left-[14px] ss:left-[14px] dlg:left-[14px] lg1:left-4 lg1:h-64 h-64 w-0.5 bg-gray-300"></div>
                  <li className="flex items-start">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 sxxs:w-[4rem] ss:w-[3rem]   dxs:w-[3rem] sm4:w-[2rem] md:w-[2.7rem] md1:w-[2.3rem] lg:w-[2.1rem] dlg:w-8 flex items-center justify-center mr-4 relative z-10">
                      <img
                        src={homepagesection5.step1.icon.CreateProfileIcon}
                        alt="createProfile Icon"
                        className="h-4 w-4"
                      />
                    </span>
                    <div>
                      <h3 className="font-bold">
                        {homepagesection5.step1.title}{" "}
                      </h3>
                      <p className="text-gray-600 pr-6">
                        {homepagesection5.step1.description}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 sxxs:w-[4rem] ss:w-[3rem] dxs:w-[3rem] sm4:w-[2rem] md:w-[2.7rem] md1:w-[2.3rem] lg:w-[2.1rem] dlg:w-8 flex items-center justify-center mr-4 relative z-10">
                      <img
                        src={homepagesection5.step2.icon.DiscoverAndConnetIcon}
                        alt="DiscoverAndConnect Icon"
                        className="h-4 w-4"
                      />
                    </span>
                    <div>
                      <h3 className="font-bold">
                        {homepagesection5.step2.title}
                      </h3>
                      <p className="text-gray-600 pr-6">
                        {homepagesection5.step2.description}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 sxxs:w-[4rem] ss:w-[3rem] dxs:w-[3rem] sm4:w-[2rem] md:w-[2.7rem] md1:w-[2.3rem] lg:w-[2.1rem] dlg:w-8 flex items-center justify-center mr-4 relative z-10">
                      <img
                        src={homepagesection5.step3.icon.CollaborateIcon}
                        alt="Collaboration Icon"
                        className="h-4 w-4"
                      />
                    </span>
                    <div>
                      <h3 className="font-bold">
                        {homepagesection5.step3.title}
                      </h3>
                      <p className="text-gray-600 pr-6">
                        {homepagesection5.step3.description}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start ">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 sxxs:w-[4rem] ss:w-[3rem] dxs:w-[3rem] sm4:w-[2rem] md:w-[2.7rem] md1:w-[2.3rem] lg:w-[2.1rem] dlg:w-8 flex items-center justify-center mr-4 relative z-10">
                      <img
                        src={homepagesection5.step4.icon.AccelerateIcon}
                        alt="Accelerate Icon"
                        className="h-4 w-4"
                      />
                    </span>
                    <div>
                      <h3 className="font-bold">
                        {homepagesection5.step4.title}
                      </h3>
                      <p className="text-gray-600 pr-6">
                        {homepagesection5.step1.description}
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 text-center md:text-left mb-10 md:ml-2 px-4 md:px-0">
                  <button className="bg-blue-500 text-white px-6 py-3  md:rounded-[4px] w-full md:w-auto">
                    {homepagesection5.button.text}{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
