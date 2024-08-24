import React from "react";
import { homepagedata } from "../Utils/jsondata/data/homepageData";



export default function HomeSection3() {
  const { homepagesection3 } = homepagedata;

  return (
    <>
      <div className="bg-white pb-40">
        <div className="container mx-auto ">
          <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8  mx-auto">
            <div className="  p-6 ">
              <p className="text-[#121926] md:max-w-4xl text-4xl font-medium mb-5 leading-[60px]">
                {homepagesection3.paragraph1.text}
                <span className="bg-blue-400 font-bold text-white">
                {homepagesection3.paragraph1.highlightedText.text}
                </span>{" "}
                {homepagesection3.paragraph2.text}
                <span className="bg-orange-400 font-bold text-white">
                {homepagesection3.paragraph2.highlightedText2.text}
                </span>{" "}
                {homepagesection3.paragraph3.text}
                <span className="bg-red-400 font-bold text-white">{homepagesection3.paragraph3.highlightedText3.text}</span>{" "}
                {homepagesection3.paragraph4.text}
                <span className="bg-green-400 font-bold text-white">{homepagesection3.paragraph4.highlightedText4.text}</span>{" "}
                {homepagesection3.paragraph5.text}
              </p>
              <p className="text-[#121926] text-4xl font-medium leading-[60px] md:max-w-4xl">
              {homepagesection3.paragraph6.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}