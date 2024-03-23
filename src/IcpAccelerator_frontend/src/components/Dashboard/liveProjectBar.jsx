import React from "react";
import ment from "../../../assets/images/ment.jpg";
import p1 from "../../../assets/Founders/p1.png";
import p2 from "../../../assets/Founders/p2.png";
import p3 from "../../../assets/Founders/p3.png";
import p4 from "../../../assets/Founders/p4.png";
import { useNavigate } from "react-router-dom";

const CircularProgressBar = ({ progress }) => {
  const radius = 30;
  const stroke = 4;

  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="ml-4">
      <circle
        stroke="#d1d5db"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#8b5cf6"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="transition-all duration-300 ease-in-out"
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        fill="#8b5cf6"
        textAnchor="middle"
        fontSize="1em"
        fontWeight="bold"
        className="transition-all duration-300 ease-in-out"
      >
        {`${progress}%`}
      </text>
    </svg>
  );
};

const LiveProjectBar = () => {
  const navigate = useNavigate();
  const projectProgress = 50;

  return (
    <div className="bg-gradient-to-r from-gray-100 to-white border rounded-xl shadow-lg p-4 w-full">
      <div className="flex flex-row space-x-2 justify-between">
        <div className="flex items-center mb-4">
          <img
            className="rounded-lg border border-gray-200 shadow-sm w-16 h-16"
            src={ment}
            alt="Project Logo"
          />
          <div className="ml-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">builder.fi</h3>
              <CircularProgressBar progress={projectProgress} />
            </div>
            <div className="flex space-x-2 mt-2">
              <span className="bg-gray-300 px-2 py-1 rounded-2xl text-xs text-gray-500">
                Infrastructure
              </span>
              <span className="bg-gray-300 px-2 py-1 rounded-2xl text-xs text-gray-500">
                Tooling
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 border mt-4 mx-[4%] pt-4 px-10 rounded-lg w-[80%]">
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
        </div>
      </div>

      {/* Team Members and Ranks */}
      <p className="text-gray-400 mb-2 mt-4">Team Members</p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 overflow-hidden">
          {[p1, p2, p3, p4, p1, p2, p3, p4].map((member, index) => (
            <img
              key={index}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              src={member}
              alt={`Team member ${index + 1}`}
            />
          ))}
        </div>
        <div className="text-sm flex items-center space-x-4">
          {/* <span className="font-extrabold text-gray-700">Day Rank #1</span>
          <span className="font-extrabold text-gray-700">Week Rank #3</span> */}
          <button onClick={() => navigate('/individual-project-details-project-owner')} className="text-white bg-purple-600 hover:bg-purple-700 transition duration-300 ease-in-out rounded-lg text-sm font-medium py-2 px-6">
            View Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveProjectBar;
