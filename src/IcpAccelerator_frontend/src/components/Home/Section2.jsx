
import React from 'react'
import {homepagedata} from "../../../src/components/jsondata/data/homepageData";


export default function Section2() {
  const { homepagesection2 } = homepagedata;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <div className="flex flex-col items-center justify-center  bg-white mx-auto pb-20 pt-28">
      <div className="py-2 px-4 bg-white border border-blue-500 rounded-full text-blue-500 mb-4">
        {homepagesection2.aboutText}
      </div>
      <h1 className="text-3xl font-bold text-center mb-4">
        {homepagesection2.mainHeading}      </h1>
      <p className="text-center text-gray-600 max-w-3xl">
        {homepagesection2.description}
      </p>
    </div>
     <div className="container mx-auto">
          <div className="max-w-7xl w-full py-8 px-4 sm:px-6 lg:px-8  mx-auto">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <div className="py-6  bg-[#E0F2FE] rounded-3xl overflow-hidden">
                <div className="flex items-center mb-4">
                  <img
                    src={homepagesection2.card1.image.Founder}
                    alt="Founders"
                    className="w-[230px] h-[350px] mr-4"
                  />
                  <div className="px-3">
                    <h2 className="text-2xl font-bold">{homepagesection2.card1.title} </h2>
                    <p className="text-smfont-normal text-[#4B5565] pb-6">
                      {homepagesection2.card1.description}
                    </p>
                    <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                     {homepagesection2.card1.list.map((list,index)=>{
                      return(
                        <li key={index}>{list}</li>
                      )
                     })}
                      {/* <li>Platea sit lacus pellentesque feugiat neque</li>
                      <li>Blandit a mi dictumst placerat</li>
                      <li>Tempus cursus enim eget ornare</li>
                      <li>Cursus tristique in diam porta ut egestas</li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="py-6 bg-[#FEF0C7] rounded-3xl overflow-hidden">
                <div className="flex items-center mb-4">
                  <img
                    src={homepagesection2.card2.image.Investor}
                    alt="Investors"
                    className="w-[230px] h-[350px] mr-4"
                  />
                  <div className="px-3">
                    <h2 className="text-2xl font-bold">{homepagesection2.card2.title}</h2>
                    <p className="text-smfont-normal text-[#4B5565] pb-6">
                    {homepagesection2.card2.description}
                    </p>
                    <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                     {homepagesection2.card2.list.map((list,index)=>{
                        return(<li key={index}>{list}</li>)
                     })}
                      {/* <li>Platea sit lacus pellentesque feugiat neque</li>
                      <li>Blandit a mi dictumst placerat</li>
                      <li>Tempus cursus enim eget ornare</li>
                      <li>Cursus tristique in diam porta ut egestas</li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="py-6 bg-[#FDEAD7] rounded-3xl overflow-hidden">
                <div className="flex items-center mb-4">
                  <img
                    src={homepagesection2.card3.image.MentorsImage}
                    alt="Mentors"
                    className="w-[230px] h-[350px] mr-4"
                  />
                  <div className="px-3">
                    <h2 className="text-2xl font-bold">{homepagesection2.card3.title}</h2>
                    <p className="text-smfont-normal text-[#4B5565] pb-6">
                      {homepagesection2.card3.description}
                    </p>
                    <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                    {homepagesection2.card3.list.map((list,index)=>{
                        return(<li key={index}>{list}</li>)
                     })}
                      {/* <li>Platea sit lacus pellentesque feugiat neque</li>
                      <li>Blandit a mi dictumst placerat</li>
                      <li>Tempus cursus enim eget ornare</li>
                      <li>Cursus tristique in diam porta ut egestas</li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="py-6 bg-[#CCFBEF] rounded-3xl overflow-hidden">
                <div className="flex items-center mb-4">
                  <img
                    src={homepagesection2.card4.image.Talents}
                    alt="Talent"
                    className="w-[230px] h-[350px] mr-4"
                  />
                  <div className="px-3">
                    <h2 className="text-2xl font-bold">{homepagesection2.card4.title}</h2>
                    <p className="text-smfont-normal text-[#4B5565] pb-6">
                    {homepagesection2.card4.description}
                    </p>
                    <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
                      {homepagesection2.card4.list.map((list,index)=>{
                        return (
                          <li key={index}>{list}</li>
                        )
                      })}
                      {/* <li>Platea sit lacus pellentesque feugiat neque</li>
                      <li>Blandit a mi dictumst placerat</li>
                      <li>Tempus cursus enim eget ornare</li>
                      <li>Cursus tristique in diam porta ut egestas</li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative -top-[501px] flex items-center justify-center w-full mt-8">
              <div className="bg-white p-6 rounded-full">
                <button className="px-6 py-3 text-white bg-blue-600 rounded-full">
                  {homepagesection2.aboutText}
                  <homepagesection2.arrowForwardIcon.ArrowForwardIcon className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


