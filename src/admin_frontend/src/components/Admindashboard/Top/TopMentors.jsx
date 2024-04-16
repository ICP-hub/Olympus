import React, { useState } from "react";
import ment from "../../../../../IcpAccelerator_frontend/assets/images/ment.jpg";
import project from "../../../../../IcpAccelerator_frontend/assets/images/project.png";
import p2 from "../../../../../IcpAccelerator_frontend/assets/Founders/p2.png";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  principalToText,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import NoData from "../../../../../IcpAccelerator_frontend/assets/images/search_not_found.png";

import { useNavigate } from "react-router-dom";

// const dummyData = [
//   {
//     id: 1,
//     logo: p2,
//     name: "Builder.fi",
//     description: "Q&A marketplace built on...",
//     code: "0x2085...016B",
//   },
//   {
//     id: 2,
//     logo: p2,
//     name: "Project 2",
//     description: "Description for project 2",
//     code: "0x2085...016C",
//   },
//   {
//     id: 3,
//     logo: p2,
//     name: "Project 3",
//     description: "Description for project 33333333333333333333333",
//     code: "0x2085...016Cbbbbbbbbbbbbbbbbbbbb",
//   },
//   {
//     id: 4,
//     logo: p2,
//     name: "Project 4",
//     description: "Description for project 4",
//     code: "0x2085...016C",
//   },
// ];

const TopMentors = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  function truncateWithEllipsis(str, startLen = 3, endLen = 3) {
    if (str.length <= startLen + endLen) {
      return str;
    }
    const start = str.substring(0, startLen);
    const end = str.substring(str.length - endLen);
    return `${start}...${end}`;
  }

  function truncateEllipsis(str, maxLength = 15) {
    if (str.length <= maxLength) {
      return str;
    }
    return `${str.substring(0, maxLength)}...`;
  }

  useEffect(() => {
    const getTopMentors = async () => {
      try {
        if (actor) {
          const getTop5 = await actor.get_top_5_mentors();
          // console.log("getTop555555555 mentor", getTop5);

          const formattedTop5 = await Promise.all(
            getTop5.map(async (item) => {
              const image = uint8ArrayToBase64(item[1].profile_picture[0]);
              const StringPrincipal = await principalToText(item[0]);
              return {
                principal: StringPrincipal,
                area_of_interest: item[1].area_of_interest,
                country: item[1].country,
                full_name: item[1].full_name,
                joined_on: item[1].joined_on,
                profile_picture: image,
              };
            })
          );
          // console.log("getTop5", formattedTop5);
          setData(formattedTop5);
        }
      } catch (error) {
        console.error("Error fetching top mentors:", error);
      }
    };

    getTopMentors();
  }, [actor]);

  // console.log("dataaaaaaaaaaaaaaaa", data);
  return (
    <div className="flex flex-col justify-between shadow-md rounded-3xl bg-white mt-4 md:mt-0  w-full h-[300px] px-[2%] overflow-y-auto">
      <div className="p-4">
        <h1 className="font-bold mb-2">Top Mentors</h1>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              onClick={() => navigate("/all", { state: item.principal })}
              key={index}
              className="w-full mb-4 flex flex-col cursor-pointer"
            >
              <div className="flex flex-col justify-between border border-gray-200 rounded-xl pt-3 px-[2%]">
                <div className="flex justify-between items-start ">
                  <div className="flex items-center">
                    <img
                      className="object-fill rounded-md h-16 w-16"
                      src={item.profile_picture}
                      alt="logo"
                    />
                    <div className="pl-2">
                      <p
                        className="text-[13px] font-bold text-black"
                        title={item.full_name}
                      >
                        {truncateEllipsis(item.full_name, 12)}
                      </p>
                      <p
                        className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
                        style={{ maxHeight: "4.5rem" }}
                      >
                        {/* {truncateWithEllipsis(item.description)} */}
                        {item.country}
                      </p>

                      <div className="flex flex-row gap-1">
                        <img
                          className="object-fill h-4 w-4 rounded-full"
                          src={item.profile_picture}
                          alt="logo"
                        />
                        <p className="text-[12px] text-gray-500 hover:text-clip">
                          {item.principal &&
                            truncateWithEllipsis(item.principal)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#5B21B6"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => navigate("/all", { state: item.principal })}
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-2 py-1 mb-[2px]">
                  <div
                    className="flex flex-row space-x-2 text-[10px] text-black overflow-x-auto"
                    style={{
                      marginBottom:
                        item.area_of_interest.split(",").length > 1
                          ? "-0.8rem"
                          : "0",
                    }}
                  >
                    {item.area_of_interest && (
                      <div className="flex rounded-2xl flex-row justify-between items-center space-x-2 mb-[16px]">
                        {item.area_of_interest.split(",").map((area, i) => (
                          <p
                            key={i}
                            className={
                              "bg-gray-200 px-2 py-0.5 rounded-2xl mb-0" +
                              (i === item.area_of_interest.split(",").length - 1
                                ? " mb-0"
                                : "")
                            }
                          >
                            {area.trim()}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <img
              src={NoData}
              className="object-cover object-center w-[50%] pt-[2.5rem]"
              alt="No data found"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMentors;
