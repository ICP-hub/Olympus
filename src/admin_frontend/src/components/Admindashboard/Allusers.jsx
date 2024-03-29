import React, { useState ,useEffect, useRef} from "react";
// import {OutSideClickHandler} from "../hooks/OutSideClickHandler";
import { OutSideClickHandler } from "../../../../IcpAccelerator_frontend/src/components/hooks/OutSideClickHandler";
import  img1 from "../../../../IcpAccelerator_frontend/assets/images/img1.png";
import { linkedIn  } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

const Allusers  = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All Users");
  const dropdownRef = useRef(null);
  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false))

  const projects = [
    {
      img: <img src={img1} alt='Img'  />,
      number: "Jammy Anderson",
      name: "Mentor",
      url: "Dubai",
      pdf: "110",
      upvotes: "www.linkedin.com",
    },
    {
      img: <img src={img1} alt='Img'  />,
      number: "Jammy Anderson",
      name: "Mentor",
      url: "Pakistan",
      pdf: "110",
      upvotes: "www.linkedin.com",
    },
    // Add more projects as needed
  ];

  // State to manage accordion visibility
  const [visibleProject, setVisibleProject] = useState(null);

  const toggleAccordion = (number) => {
    setVisibleProject(visibleProject === number ? null : number);
  };

  return (
    <div>
           
    <div className="px-[4%]  w-full flex flex-col bg-gray-100  justify-center ">
      <div className="flex items-center justify-between">
      <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold ml-8">
        {selectedOption}
      </div>

        {/* <div className="flex justify-end gap-4 relative " ref={dropdownRef}>
          <div
            className="cursor-pointer"
            onClick={() => setIsPopupOpen(true)}
          >
      

            {isPopupOpen && (
              <div className="absolute w-[250px] top-full right-9 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
                <ul className="flex flex-col">
                  <li>
                    <button className="border-[#9C9C9C] py-[18px] border-b-2 w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start">
                      Projects
                    </button>
                  </li>
                  <li>
                    <button className="border-[#9C9C9C] py-[18px] w-[230px] border-b-2 px-4 font-bold focus:outline-none text-xl flex justify-start">
                      Mentors
                    </button>
                  </li>
                  <li>
                    <button className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start">
                      VCs
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="mt-1"></div>
        </div> */}
      </div>

      <div> 
        <div className="bg-white border-2 border-black  border-b-2  rounded-lg p-4  mt-16 text-lg rounded-b-none">
          <table className="w-full text-black font-bold lg:text-xl md:text-lg sm:text-s text-xms">
            <thead>
              <tr className="flex flex-row justify-around mt-4">
                <th className="mr-36">Name</th>
                <th className=" md:table-cell">Role</th>
                <th className="hidden md:table-cell">Country</th>
                <th className="hidden md:table-cell">Level</th>
                <th className=" md:table-cell">LinkedIn</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="text-[#737373] font-bold bg-white bg-opacity-30 border-l-[1px] border-r-[1px] border-b-[1px] border-[#737373] h-screen rounded-lg text-lg rounded-t-none overflow-y-auto mb-4">
          <table className="w-full">
            <tbody>
              {projects.map((project, index) => (
                <React.Fragment key={index}>
                  <tr className="flex flex-row justify-around py-4">
                    <td className="flex justify-center relative items-center">
                   
                     
                      <div className="relative w-[40px] h-[40px]  rounded-full border-2 border-black ">{project.img}</div>
                    
                    <div className="relative text-center ml-2">
                      <div className="absolute flex justify-center items-center"></div>
                      <div className="relative z-10 mt-2 ">{project.number}</div>
                    </div>
                    </td>
                    <td className="truncate items-center mt-2">{project.name}</td>
                    <td className="hidden md:table-cell truncate items-center mt-2">{project.url}</td>
                    <td className="hidden md:table-cell truncate items-center mt-2">{project.pdf}</td>
                    <td className="truncate items-center mt-2">{project.upvotes}</td>
                    <td>
                      <button className="mt-2" onClick={() => toggleAccordion(project.number)}>
                        ...
                      </button>
                    </td>
                  </tr>
                  {visibleProject === project.number && (
                    <tr className="flex flex-col md:hidden p-4">
                      <td>URL: {project.url}</td>
                      <td>PDF: {project.pdf}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Allusers ;
