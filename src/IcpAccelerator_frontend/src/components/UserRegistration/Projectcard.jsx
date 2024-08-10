import React from "react";
import {Link} from "react-router-dom"
import box from "../../../assets/Logo/box.png";
import addfiles from "../../../assets/Logo/addfiles.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const ProjectCard = () => {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg  mx-auto">
      
        <div className="flex mt-4 max-w-4xl">
          <div className=" items-center justify-center">
            {/* Replace with your image */}
            <img src={box} alt="Profile" className="" />
          </div>
          <div className="mx-12">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">Cypherpunk Labs</h2>
                <p className="text-[#4B5565] text-sm">@cypherpunklabs</p>
              </div>
              <div>
                <MoreVertIcon />
              </div>
            </div>

            <hr className="text-[#E3E8EF] mt-2  "></hr>
            <p className="mb-4 mt-2 text-normal ">
              Bringing privacy back to users
            </p>
            <p className="my-2  text-normal ">
              Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque
              convallis quam feugiat non viverra massa fringilla.
            </p>

            <span className=" my-2 text-base text-gray-700 px-2 py-1 rounded-full border-2 border-gray-300">
              Infrastructure
            </span>
          </div>
        </div>
     

      <div className="mt-8 flex flex-col items-center">
        <div className="  flex items-center justify-center">
          {/* Replace with your folder image */}
          <img src={addfiles} alt="Folder" className="" />
        </div>
        <h3 className="mt-4 text-xl font-bold">Add new project</h3>
        <p className="mt-2 text-[#364152] text-center text-base">
          Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque
          convallis quam feugiat non viverra massa fringilla.
        </p>
        <button className="mt-4 bg-[#155EEF] text-white px-4 py-2 rounded-lg text-lg">
          + Add project
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
