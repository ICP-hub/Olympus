import React from "react";
import coding1 from "../../../assets/images/coding1.jpeg";
import ment from "../../../assets/images/ment.jpg";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { useNavigate } from 'react-router-dom';


const AssociatedProjects = ({ data }) => {
  console.log('this data:->', data)

  // const navigate = useNavigate();
  // let id = data?.uid ?? '';
  let name = data?.project_name ?? '';
  let desc = data?.reason_to_join_incubator ?? '';
  let hub = data?.preferred_icp_hub ?? '';
  let logo = data?.project_logo ? uint8ArrayToBase64(data?.project_logo) : "";
  let cover = data?.project_cover ? uint8ArrayToBase64(data?.project_cover) : "";
  return (
    <div className=" md:mx-6">
      <div className="flex  gap-4 flex-wrap">
        <div className=" lg:w-[700px] md:w-96 w-60 relative shadow-md rounded-lg overflow-hidden  gap-2 bg-white ">
          <div className=" flex flex-col md:flex-row gap-2 space-x-4 ">
            <div className="w-full md:w-2/3">
              <img
                className="w-full h-full rounded-md sm:rounded-l-none sm:rounded-r-none md:rounded-r-none lg:rounded-r-none object-cover"
                src={cover}
                alt="cover"
              />
            </div>
            <div className="flex flex-col p-2 overflow-x-auto">
              <div className="flex flex-row justify-between items-end">
                <img className="w-12 h-12 rounded-lg object-cover" src={logo} alt="logo" />
                <p className="text-[#6B7280] font-bold">{hub}</p>
              </div>
              <p className="font-bold text-black">{name}</p>
              <p className="text-[#737373] font-bold line-clamp-2 ">
                {desc}
              </p>
              {/* <div className="flex justify-end items-end mt-20">
                <button onClick={() => navigate(`/individual-project-details-project-mentor/${id}`)} className="w-full bg-[#3505B2] text-white font-bold rounded-md py-2 capitalize">
                  see project
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AssociatedProjects;