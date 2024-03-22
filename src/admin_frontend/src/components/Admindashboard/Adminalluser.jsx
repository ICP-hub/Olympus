import React, { useState ,useEffect, useRef} from "react";
import girl from "../../../../IcpAccelerator_frontend/assets/images/girl.jpeg";
import { projectFilterSvg, remove, badge } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { OutSideClickHandler } from "../../../../IcpAccelerator_frontend/src/components/hooks/OutSideClickHandler";

const Adminalluser = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Users");
  const dropdownRef = useRef(null);
  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));

  const projects = [
    {
      img: girl,
      Role: "mentor",
      name: "Jammy",
      linkedin: "http://www.konmatfix.com",
      level: 110,
      Country: "India",
    },
    {
      img: girl,
      Role: "mentor",
      name: "Jammy",
      linkedin: "http://www.konmatfix.com",
      level: 110,
      Country: "India",
    },
    // Add more projects as needed
  ];

  // State to manage accordion visibility
  const [visibleProject, setVisibleProject] = useState(null);

  const toggleAccordion = (number) => {
    setVisibleProject(visibleProject === number ? null : number);
  };

  return (
    <div className="px-[4%] w-full flex flex-col bg-gray-100 justify-center gap-8">
     
        <div className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
          {selectedOption}
        </div>
   

      <div>
        <div className="bg-gray-200 rounded-lg p-4  text-lg rounded-b-none">
          <table className="w-full text-black font-bold lg:text-xl md:text-lg sm:text-s text-xms">
            <thead>
              <tr className="flex flex-row justify-around mt-4 ">
                <th>Name</th>
                <th className="md:table-cell">Role</th>
                <th className="hidden md:table-cell">Country</th>
                <th className=" hidden md:table-cell ">Level</th>
                <th className="hidden md:table-cell">LinkedIn</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="text-[#737373] font-bold bg-gray-200  bg-opacity-30  h-screen rounded-lg text-lg drop-shadow-2xl overflow-y-auto mb-4">
          <table className="w-full">
            <tbody className="overflow-y-auto">
              {projects.map((project, index) => (
                <React.Fragment key={index}>
                  <tr className="flex flex-row justify-between py-4  gap-2 p-2">
                    <td className="flex justify-center relative items-center">
                      <div className="relative text-center">
                        
                      </div>
                      <div className="flex flex-row lg:space-x-6">
                          <img className="w-10 h-10 rounded-full ml-2" src={project.img} alt="abc" />
                          <td className="truncate ">{project.name}</td>
                        </div>
                    </td>
                  
                    <td className="truncate md:ml-4 ">{project.Role}</td>
                    <td className="truncate hidden md:table-cell md:ml-8 ">{project.Country}</td>
                    <td className="hidden md:table-cell truncate md:ml-20 ">{project.level}</td>
                    <td className="hidden md:table-cell truncate ">{project.linkedin}</td>
                    <tr>
                      <td className="md:hidden"> 
                        <button onClick={() => toggleAccordion(project.number)}>
                          +3more..
                        </button>
                      </td>
                    </tr>
                  </tr>
                  {visibleProject === project.number && (
                    <tr className="flex flex-col md:hidden p-4">
                      <td className="truncate">Country: {project.Country}</td>
                      <td>linkedin: {project.linkedin}</td>
                      <td>level: {project.level}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Adminalluser;