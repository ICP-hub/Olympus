import React from "react";
import ment from "../../../../../IcpAccelerator_frontend/assets/images/ment.jpg";
import project from "../../../../../IcpAccelerator_frontend/assets/images/project.png";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import NoDataCard from "../../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import { useNavigate } from "react-router-dom";


const TopProjects = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  // console.log("dataaaaaaaaaaaaaa =>", data);
  useEffect(() => {
    const getTopProjects = async () => {
      try {
        const getTop5proj = await actor.get_top_5_projects();
        // console.log("getTop5proj", getTop5proj);

        const formattedTopProjects = getTop5proj.map((item) => ({
          principal: item[1].principal,
          code: item[0],
          area_of_interest: item[1].area_of_interest,
          country: item[1].country,
          full_name: item[1].full_name,
          joined_on: numberToDate(item[1].joined_on),
          profile_picture: uint8ArrayToBase64(item[1].profile_picture[0]),
        }));
        // console.log("formattedTopProjects", formattedTopProjects);
        setData(formattedTopProjects);
      } catch (error) {
        console.error("Error fetching top projects:", error);
      }
    };

    getTopProjects();
  }, [actor]);

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

  return (
    <div className="flex flex-col justify-between shadow-md rounded-3xl bg-white mt-4 md:mt-0  w-full h-[300px] px-[2%] overflow-y-auto">
      <div className="p-4">
        <h1 className="font-bold mb-2">Top Projects</h1>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              onClick={() => navigate("/all", { state: item.principal })}
              key={index}
              className="w-full cursor-pointer mb-2 flex flex-col"
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
                        {truncateEllipsis(item.full_name)}
                      </p>
                      <p
                        className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
                        style={{ maxHeight: "4.5rem" }}
                      >
                        {/* {truncateWithEllipsis(item.code)} */}
                        {item.country}
                      </p>

                      <div className="flex flex-row gap-1">
                        <img
                          className="object-fill h-4 w-4 rounded-full"
                          src={item.profile_picture}
                          alt="Project logo"
                        />
                        <p className="text-[12px] text-gray-500 hover:text-clip">
                          {truncateWithEllipsis(item.code)}
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

                <div className="flex rounded-b-xl flex-row justify-between items-center mt-2 px-2 py-1 bg-gray-200">
                  <div className="flex flex-row space-x-2 text-[10px] text-black">
                    <p>{item.area_of_interest}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <NoDataCard />
        )}
      </div>
    </div>
  );
};

export default TopProjects;
