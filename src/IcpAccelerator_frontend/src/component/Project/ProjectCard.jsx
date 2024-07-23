import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { linkedInSvg, twitterSvg } from "../Utils/Data/SvgData";
import ment from "../../../assets/images/ment.jpg";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../Utils/formatter/formatDateFromBigInt";


function ProjectCard({ data }) {
  if (!data) {
    return null
  }
  const [rating, setRating] = useState(4);

  const ratingPercentage = (rating / 9) * 100;
  const navigate = useNavigate();

  console.log("data", data)
  let image = data?.image ? uint8ArrayToBase64(data?.image) : ment;
  let title = data?.name ?? 'builder.io';
  let tags = data?.area_of_focus.length > 0 ? data?.area_of_focus[0].split(',') : null;
  let country = data?.country_of_project.length > 0 ? data?.country_of_project[0].split(',')[1] : null;
  let doj = data?.date_of_joining.length > 0 ? formatFullDateFromBigInt(data?.date_of_joining[0]) : null;
  let linkedIn = data?.linkedIn && data?.linkedIn.length > 0 ? data?.linkedIn[0] : null;
  let twitter =  data?.twitter && data?.twitter.length > 0 ? data?.twitter[0] : null;
  let website = data?.website_social_group && data?.website_social_group.length > 0 ? data?.website_social_group[0] : null;
  let dapp = data?.live_link_of_project && data?.live_link_of_project.length > 0 ? data?.live_link_of_project[0] : null;
  
  return (
    <>
      <div className="p-6 shadow-lg pb-1 bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]">
        <div className="flex items-center">
          <div className="flex">
            <img
              src={image}
              alt="project"
              className="w-16 aspect-square object-cover rounded-md"
            />
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="px-2">
              <div className="flex items-center">
                <div className="flex items-center">
                  <p className="font-[950] text-2xl pr-2">{title}</p>
                </div>
              </div>
              <div className="md:flex block text-xs md:text-sm text-[#737373]">
                {tags && (
                  <p className="flex items-center flex-wrap py-2 gap-2">
                    {tags.map((val, index) => {
                      if (!val || val.trim() == "") {
                        return null;
                      }
                      return (
                        <span className="bg-[#B5B5B54D] px-4 rounded-full" key={index}>
                          {val}
                        </span>
                      )
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-2 text-xs md:text-sm text-right pr-4">
              <div className="flex gap-2.5 mr-2 mt-1.5">
                {linkedIn && (
                  <div className="w-4 h-4">
                    <a href={linkedIn} target="_blank">
                      {linkedInSvg}
                    </a>
                  </div>
                )}
                {twitter && (
                  <div className="w-4 h-4">
                    <a href={twitter} target="_blank">
                      {twitterSvg}
                    </a>
                  </div>
                )}
              </div>
              {website && (
                <a href={website} target="_blank">
                  <button className="font-[950] border bg-[#3505B2] py-[7px] px-[9px] rounded-md text-white text-nowrap">
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
        <div className="flex justify-between text-gray-500 px-2 pt-2">
          <div className="flex items-center">
            {country && (
              <div className="flex items-center gap-2">
                <span className="capitalize">{country}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                <p>
                  {doj && (
                    <div className="flex text-xs md:text-sm text-[#737373]">
                      <p>Platform Joined On {doj}</p>
                    </div>
                  )}
                </p>
              </div>)}
          </div>
          <div>
          </div>
        </div>
        {/* {country && ( */}
        {/* <div className="flex justify-end text-gray-500 px-2 pb-2 text-lg font-extrabold">
          <div className="flex">
            <div className="flex">
              <span className="capitalize">overall rank #3</span>
            </div>
          </div>
          <div>
          </div>
        </div> */}
        {/* // )} */}
      </div>
    </>
  );
}

export default ProjectCard;
