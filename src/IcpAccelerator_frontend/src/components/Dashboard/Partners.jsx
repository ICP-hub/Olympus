import React from "react";
import a1 from "../../../assets/Partners/a1.png";
import a2 from "../../../assets/Partners/a2.png";
import a3 from "../../../assets/Partners/a3.png";
import a4 from "../../../assets/Partners/a4.png";
import a5 from "../../../assets/Partners/a5.png";
import a6 from "../../../assets/Partners/a6.png";
import a7 from "../../../assets/Partners/a7.png";
import a8 from "../../../assets/Partners/a8.png";
import a9 from "../../../assets/Partners/a9.png";

const Partners = () => {
  const partnerArr = [a1, a2, a3, a4, a5, a6, a7, a8, a9];
  const firstRow = partnerArr.slice(0, 5);
  const secondRow = partnerArr.slice(5);

  return (
    <>
      <div className="flex flex-col w-full px-[6%] py-[4%] lg1:py-[2%]">
        <h1 className="text-4xl font-black text-white mb-6">Partners:</h1>
        <div className="flex justify-between overflow-x-auto space-x-2 mb-4">
          {firstRow.map((image, index) => (
            <img
              key={`image-top${index}`}
              src={image}
              className="w-40 h-auto flex-shrink-0 rounded-lg object-cover "
              alt={`Partner ${index + 1}`}
            />
          ))}
        </div>
        <div className="mx-auto flex justify-between overflow-x-auto md:gap-24  space-x-2">
          {secondRow.map((image, index) => (
            <img
              key={`image-bottom${index}`}
              src={image}
              className="w-40 h-auto flex-shrink-0 rounded-lg object-cover"
              alt={`Partner ${index + 6}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Partners;
