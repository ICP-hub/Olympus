
import React from 'react'
import { homepagedata } from "../Utils/jsondata/data/homepageData";



export default function Section2() {
  const { homepagesection2 } = homepagedata;

  return (
    <>
      <div className="flex flex-col items-center justify-center  p-4 bg-white">
        <div className="max-w-7xl mx-auto md:px-6">
          <div className="flex flex-col items-center justify-center  bg-white mx-auto md:pb-20 md:pt-28 ">
            <div className="py-2 px-4 bg-white border border-blue-500 rounded-full text-blue-500 mb-4">
              {homepagesection2.aboutText}
            </div>
            <h1 className="text-3xl font-bold text-center mb-4">
              {homepagesection2.mainHeading}{" "}
            </h1>
            <p className="text-center text-gray-600 max-w-3xl">
              {homepagesection2.description}
            </p>
          </div>
          <div className="container mx-auto">
            <div className="max-w-7xl w-full py-8  md:px-4 sm:px-6 lg:px-8  mx-auto">
              <div className="grid gap-4  dlg:grid-cols-2">
                <div className="py-6  bg-[#E0F2FE] rounded-3xl overflow-hidden">
                  <div className=" flex flex-col sm3:flex-row items-center mb-4">
                    <img
                      src={homepagesection2.card1.image.Founder}
                      alt="Founders"
                      className="w-[230px] h-[350px] mr-4"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="px-6">
                      <h2 className="text-2xl font-bold">
                        {homepagesection2.card1.title}{" "}
                      </h2>
                      <p className="text-sm font-normal text-[#4B5565] pb-6">
                        {homepagesection2.card1.description}
                      </p>
                      <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                        {homepagesection2.card1.list.map((list, index) => {
                          return <li key={index}>{list}</li>;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="py-6 bg-[#FEF0C7] rounded-3xl overflow-hidden">
                  <div className="flex flex-col sm3:flex-row items-center mb-4">
                    <img
                      src={homepagesection2.card2.image.Investor}
                      alt="Investors"
                      className="w-[230px] h-[350px] mr-4"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="px-6">
                      <h2 className="text-2xl font-bold">
                        {homepagesection2.card2.title}
                      </h2>
                      <p className="text-smfont-normal text-[#4B5565] pb-6">
                        {homepagesection2.card2.description}
                      </p>
                      <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                        {homepagesection2.card2.list.map((list, index) => {
                          return <li key={index}>{list}</li>;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="py-6 bg-[#FDEAD7] rounded-3xl overflow-hidden">
                  <div className="flex flex-col sm3:flex-row items-center mb-4">
                    <img
                      src={homepagesection2.card3.image.MentorsImage}
                      alt="Mentors"
                      className="w-[230px] h-[350px] mr-4"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="px-6">
                      <h2 className="text-2xl font-bold">
                        {homepagesection2.card3.title}
                      </h2>
                      <p className="text-smfont-normal text-[#4B5565] pb-6">
                        {homepagesection2.card3.description}
                      </p>
                      <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                        {homepagesection2.card3.list.map((list, index) => {
                          return <li key={index}>{list}</li>;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="py-6 bg-[#CCFBEF] rounded-3xl overflow-hidden">
                  <div className="flex flex-col sm3:flex-row items-center mb-4">
                    <img
                      src={homepagesection2.card4.image.Talents}
                      alt="Talent"
                      className="w-[230px] h-[350px] mr-4"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="px-6">
                      <h2 className="text-2xl font-bold">
                        {homepagesection2.card4.title}
                      </h2>
                      <p className="text-smfont-normal text-[#4B5565] pb-6">
                        {homepagesection2.card4.description}
                      </p>
                      <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                        {homepagesection2.card4.list.map((list, index) => {
                          return <li key={index}>{list}</li>;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative dlg:-top-[628px] dlg1:-top-[606px] dlg2:-top-[580px] lg1:-top-[577px] lg2:-top-[556px] lgx1:-top-[527px] lgx2:-top-[505px] flex items-center justify-center w-full mt-8">
                <div className="bg-white  dlg:p-6 dlg:rounded-full w-full dlg:w-auto">
                  <button className="px-6 py-3  text-white bg-blue-600 rounded-md dlg:rounded-full w-full">
                    {homepagesection2.aboutText}
                    <homepagesection2.arrowForwardIcon.ArrowForwardIcon className="ml-2" />
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


