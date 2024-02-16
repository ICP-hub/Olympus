import React from "react";
import p1 from "../../../assets/Founders/p1.png";
import p2 from "../../../assets/Founders/p2.png";
import p3 from "../../../assets/Founders/p3.png";
import p4 from "../../../assets/Founders/p4.png";
import p5 from "../../../assets/Founders/p5.png";

const Founder = () => {
  const founderArr = [p1, p2, p3, p4, p5];

  return (
    <>
      <div className="flex flex-col w-full md:px-[6%] pl-[6%] py-[4%] lg1:py-[2%] ">
        <div className="flex md:flex-row flex-col text-white md:justify-between md:items-center md:px-12 ">
          <h1 className="text-4xl font-black">Founders:</h1>
          <p>Stellar Minds Behind Our Mentorship Program</p>
        </div>
        <div className="relative  pb-4 pt-6 ">
          <ul className="flex space-x-3 overflow-x-auto justify-between md:px-12">
            {founderArr.map((image, index) => (
              <li
                className="w-40 h-auto flex-shrink-0 rounded-lg overflow-hidden"
                key={index}
              >
                <div className="bg-white w-full h-auto">
                  <img
                    className="w-full h-half object-cover "
                    src={image}
                    alt={`image${index}`}
                    style={{ aspectRatio: "1 / 1", userDrag: "none" }}
                  />
                  <div className="p-2 w-full">
                    <h3 className="text-sm font-semibold text-black">
                      Samy Karim
                    </h3>
                    <span className="text-xs text-gray-700">
                      Toshi, Managing Partner. Ex-Binance
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Founder;
