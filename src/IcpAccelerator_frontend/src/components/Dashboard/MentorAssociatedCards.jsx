import React from "react";
import coding1 from "../../../assets/images/coding1.jpeg";
import ment from "../../../assets/images/ment.jpg";
import girl from "../../../assets/images/girl.jpeg";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { useNavigate } from 'react-router-dom';


const AssociatedProjects = ({ data }) => {
  console.log('this data:->', data)
  const navigate = useNavigate();

  let projectName = data?.params?.project_name ?? "";
  let projectId = data?.uid ?? "";
  let projectImage = data?.params?.project_logo ? uint8ArrayToBase64(data?.params?.project_logo) : ment;
  let projectCover = data?.params?.project_cover ? uint8ArrayToBase64(data?.params?.project_cover) : coding1;
  let userImage = data?.params?.user_data?.profile_picture[0] ? uint8ArrayToBase64(data?.params?.user_data?.profile_picture[0]) : girl;
  let userName = data?.params?.user_data?.full_name ?? "";
  let projectDescription = data?.params?.project_description ?? "";
  let projectAreaOfFocus = data?.params?.project_area_of_focus ?? "";

  return (
      <div className="flex gap-4 flex-wrap">
        <div className="relative shadow-md rounded-lg overflow-hidden w-full gap-2 bg-white ">
          <div className="flex flex-col md:flex-row gap-2">
            {/* <div className="w-full max-w-xs min-h-40 md:min-h-56">
              <img
                className="w-full h-full rounded-md sm:rounded-l-none sm:rounded-r-none md:rounded-r-none lg:rounded-r-none object-cover"
                src={projectCover}
                alt="cover"
              />
            </div> */}
            <div className="flex flex-col justify-between w-full p-4 overflow-x-auto">
              <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row justify-between lg:items-end">
                  <img className="w-14 h-14 rounded-lg object-cover" src={projectImage} alt="logo" />
                  <p className="font-bold truncate w-full">{projectName}</p>
                </div>
                <div className="flex flex-col sm:flex-row py-2 justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full mx-2"
                      src={userImage}
                      alt="img"
                    />
                    <p className="text-xs">
                      {userName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-full pb-4 pr-4 overflow-x-auto">
                {projectAreaOfFocus ? (
                  <div className="flex gap-2 mt-2 text-xs items-center">
                    {projectAreaOfFocus
                      .split(",")
                      .slice(0, 3)
                      .map((tag, index) => (
                        <div
                          key={index}
                          className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                        >
                          {tag.trim()}
                        </div>
                      ))}
                  </div>) : ""}
              </div>
              <div className="flex flex-col pb-4">
                <p className="text-[#737373] line-clamp-2">
                  {projectDescription}
                </p>
              </div>

              <div className="flex justify-end items-end">
                <button onClick={() => navigate(`/individual-project-details-project-mentor/${projectId}`)} className="w-full bg-[#3505B2] text-white font-bold rounded-md py-2 capitalize">
                  view project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};


export default AssociatedProjects;
