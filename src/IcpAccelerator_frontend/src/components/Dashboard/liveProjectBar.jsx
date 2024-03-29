import React, { useEffect } from "react";
import ment from "../../../assets/images/ment.jpg";
import p1 from "../../../assets/Founders/p1.png";
import p2 from "../../../assets/Founders/p2.png";
import p3 from "../../../assets/Founders/p3.png";
import p4 from "../../../assets/Founders/p4.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";

// const CircularProgressBar = ({ progress }) => {
//   const radius = 30;
//   const stroke = 4;

//   const normalizedRadius = radius - stroke * 2;
//   const circumference = normalizedRadius * 2 * Math.PI;
//   const strokeDashoffset = circumference - (progress / 100) * circumference;

//   return (
//     <svg height={radius * 2} width={radius * 2} className="ml-4">
//       <circle
//         stroke="#d1d5db"
//         fill="transparent"
//         strokeWidth={stroke}
//         strokeDasharray={circumference + " " + circumference}
//         style={{ strokeDashoffset }}
//         r={normalizedRadius}
//         cx={radius}
//         cy={radius}
//       />
//       <circle
//         stroke="#8b5cf6"
//         fill="transparent"
//         strokeWidth={stroke}
//         strokeDasharray={circumference + " " + circumference}
//         style={{ strokeDashoffset }}
//         r={normalizedRadius}
//         cx={radius}
//         cy={radius}
//         className="transition-all duration-300 ease-in-out"
//       />
//       <text
//         x="50%"
//         y="50%"
//         dy=".3em"
//         fill="#8b5cf6"
//         textAnchor="middle"
//         fontSize="1em"
//         fontWeight="bold"
//         className="transition-all duration-300 ease-in-out"
//       >
//         {`${progress}%`}
//       </text>
//     </svg>
//   );
// };

const LiveProjectBar = ({ data }) => {
  if (!data) {
    return null
  }
  const navigate = useNavigate();
  const projectProgress = 50;
  let logo = data?.params?.project_logo ? uint8ArrayToBase64(data?.params?.project_logo) : girl;
  let name = data?.params?.project_name ?? '';
  let area_tags = data?.params?.project_area_of_focus ?? '';
  let linkenin_link = data?.params?.project_linkedin[0] ?? '';
  let twitter_link = data?.params?.project_twitter[0] ?? '';
  let website_link = data?.params?.project_website[0] ?? '';
  let dapp_link = data?.params?.dapp_link?.[0].trim() !== '' ? data?.params?.dapp_link?.[0] : null;
  let pro_country = data?.params?.user_data?.country ?? "";
  let joined_on = data?.creation_date ?? "";



  return (
    <div className="bg-gradient-to-r from-gray-100 to-white border rounded-xl shadow-lg p-4 w-full">
      <div className="flex flex-row space-x-2 justify-between">
        <div className="flex items-center gap-4 mb-4">
          <img
            className="rounded-lg border border-gray-200 shadow-sm w-16 h-16 object-cover"
            src={logo}
            alt="logo"
          />
          <div className="ml-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">{name}</h3>
              {/* <CircularProgressBar progress={projectProgress} /> */}
              <CircularProgressbar
                value={(4 / 9) * 100}
                text={`4/9`}
                className="w-10 h-10 font-extrabold text-lg"
                strokeWidth={8}
                styles={buildStyles({
                  strokeLinecap: "round",
                  pathTransitionDuration: 0.5,
                  pathColor: `#2247AF`,
                  trailColor: "#d6d6d6",
                  textColor: "#3505B2",
                })}
              />
            </div>
            <div className="flex space-x-2 mt-2">
              {area_tags && area_tags.trim() !== "" ?
               area_tags.split(",").slice(0, 3).map((val, index) => (
                <span key={index} className="bg-gray-300 px-2 py-1 rounded-2xl text-xs text-gray-500">
                  {val}
                </span>
              )) : ''}
            </div>
          </div>
        </div>

        {/* <div className="bg-blue-100 border mt-4 mx-[4%] pt-4 px-10 rounded-lg w-[80%]">
          <h1 className="font-extrabold text-xl mb-2">Project Progress</h1>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-300 to-blue-600 h-2 rounded-full"
                style={{ width: `${projectProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 ml-2">{projectProgress}%</p>
          </div>
        </div> */}
      </div>

      {/* Team Members and Ranks */}
      <p className="text-gray-400 mb-2 mt-4">Team Members</p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 overflow-hidden">
          <img
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
            src={data?.params?.user_data?.profile_picture[0]}
            alt={`Author`}
          />
          {data?.params?.project_team && data?.params?.project_team.length > 0 ?
            data?.params?.project_team.map((val, index) => {
              let data = val[0]?.member_data;
              return (
                <img
                  key={index}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src={data?.profile_picture}
                  alt={`Team`}
                />
              )
            }) : null}
        </div>
        <div className="text-sm flex items-center space-x-4">
          <button onClick={() => navigate('/individual-project-details-project-owner')} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
            View Project
          </button>
          {!dapp_link && (
            <button className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
              Live Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveProjectBar;
