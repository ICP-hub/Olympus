import React from "react";
import { useNavigate } from 'react-router-dom'
import { globesvg } from "../Utils/Data/SvgData";

function ProjectCard({ image, title, tags, doj, country, website, dapp }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-3 flex items-start bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]">
        <div className="md:p-4">
          <img
            src={image}
            alt="project"
            className="w-12 aspect-square object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="px-2">
            <div className="flex items-center">
              <div className="flex items-center">
                <p className="font-[950] text-2xl pr-2">{title}</p>
              </div>
            </div>
            {country && (
              <div className="flex items-center gap-1">
                {globesvg}
                <span className="capitalize">{country}</span>
              </div>
            )}
            <div className="md:flex block text-xs md:text-sm text-[#737373]">
              {tags && (
                <p className="flex items-center flex-wrap py-2 gap-2">
                  {tags.map((val, index) => (
                    <span className="bg-[#B5B5B54D] px-4 rounded-full" key={index}>
                      {val}
                    </span>
                  ))}
                </p>
              )}
            </div>
            {doj && (
              <div className="flex text-xs md:text-sm text-[#737373]">
                <p className="font-bold pr-2">Joined On: </p>
                <span className="font-semibold">{doj}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-xs md:text-sm text-right pr-4">
            {website && (
              <a href={website} target="_blank">
                <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                  Visit Website
                </button>
              </a>
            )}
            {dapp && (
              <a href={dapp} target="_blank">
                <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                  Visit Dapp
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectCard;
