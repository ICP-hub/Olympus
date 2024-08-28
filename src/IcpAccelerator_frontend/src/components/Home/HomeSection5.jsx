import React from 'react';
import { homepagedata } from "../Utils/jsondata/data/homepageData";



export default function HomeSection5() {
  const { homepagesection5 } = homepagedata;
  return (
    <>
      <div className="bg-white py-10">
        <div className="container mx-auto">
          <div className="max-w-6xl w-full mx-auto bg-[#FEF6EE] rounded-lg shadow-md">
            <section className="text-center p-12">
              <div className="mx-52">
                <button className="border border-blue-300 rounded-full text-blue-500 px-4">{homepagesection5.header.button.text} </button>
                <h2 className="text-3xl font-medium mb-4 mt-4">{homepagesection5.header.title} </h2>
                <p className="text-gray-600 mb-6 text-center">
                {homepagesection5.header.description}
                </p>
              </div>
            </section>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                <img
                  src={homepagesection5.image.src.man1}
                  alt="Statue"
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-1/2 min ml-2">
                <ul className="space-y-8 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-0 bottom-0 h-64 w-0.5 bg-gray-300"></div>
                  <li className="flex items-start">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                    <img src={homepagesection5.step1.icon.CreateProfileIcon} alt="createProfile Icon" className="h-4"/>
                    </span>
                    <div>
                      <h3 className="font-bold">{homepagesection5.step1.title} </h3>
                      <p className="text-gray-600">{homepagesection5.step1.description}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                    <img src={homepagesection5.step2.icon.DiscoverAndConnetIcon} alt="DiscoverAndConnect Icon" className="h-4"/>
                    </span>
                    <div>
                      <h3 className="font-bold">{homepagesection5.step2.title}</h3>
                      <p className="text-gray-600">{homepagesection5.step2.description}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                    <img src={homepagesection5.step3.icon.CollaborateIcon} alt="Collaboration Icon" className="h-4"/>
                    </span>
                    <div>
                      <h3 className="font-bold">{homepagesection5.step3.title}</h3>
                      <p className="text-gray-600">{homepagesection5.step3.description}</p>
                    </div>
                  </li>
                  <li className="flex items-start ">
                    <span className="bg-[#F7B27A] text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 relative z-10">
                    <img src={homepagesection5.step4.icon.AccelerateIcon} alt="Accelerate Icon" className="h-4"/>
                    </span>
                    <div>
                      <h3 className="font-bold">{homepagesection5.step4.title}</h3>
                      <p className="text-gray-600">{homepagesection5.step1.description}</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 text-center md:text-left ">
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-[4px]">{homepagesection5.button.text} </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
