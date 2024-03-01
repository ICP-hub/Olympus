import React, { useState ,useEffect, useRef} from "react";
import { projectFilterSvg, remove, badge } from "../Utils/Data/SvgData";

const Leaderboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Leaderboard");
  const dropdownRef = useRef(null);
  const projects = [
    {
      number: 1,
      name: "Project One",
      url: "URL 1",
      pdf: "PDF 1",
      upvotes: 100,
    },
    {
      number: 2,
      name: "Project Two",
      url: "URL 2",
      pdf: "PDF 2",
      upvotes: 200,
    },
    // Add more projects as needed
  ];

  // State to manage accordion visibility
  const [visibleProject, setVisibleProject] = useState(null);

  const toggleAccordion = (number) => {
    setVisibleProject(visibleProject === number ? null : number);
  };

  useEffect(() => { // Step 2: Setup the click event listener
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPopupOpen(false); // Close the dropdown if the click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="px-[4%]  w-full flex flex-col bg-gray-100  justify-center ">
      <div className="flex items-center justify-between">
        {selectedOption && (
          <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
            {selectedOption}
          </div>
        )}

        <div className="flex justify-end gap-4 relative " ref={dropdownRef}>
          <div
            className="cursor-pointer"
            onClick={() => setIsPopupOpen(!isPopupOpen)}
          >
            {projectFilterSvg}

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
          <div className="mt-1">{remove}</div>
        </div>
      </div>

      <div>
        <div className="bg-[#B9C0F2] rounded-lg p-4  mt-16 text-lg rounded-b-none">
          <table className="w-full text-white font-bold lg:text-xl md:text-lg sm:text-s text-xms">
            <thead>
              <tr className="flex flex-row justify-around mt-4">
                <th>#</th>
                <th className=" md:table-cell">Project Name</th>
                <th className="hidden md:table-cell">URL</th>
                <th className="hidden md:table-cell">PDF</th>
                <th className=" md:table-cell">Upvotes</th>
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
                    <div className="relative text-center">
                      <div className="absolute flex justify-center items-center">{badge}</div>
                      <div className="relative z-10 left-2">{project.number}</div>
                    </div>
                    </td>
                    <td className="truncate">{project.name}</td>
                    <td className="hidden md:table-cell truncate">{project.url}</td>
                    <td className="hidden md:table-cell truncate">{project.pdf}</td>
                    <td className="truncate">{project.upvotes}</td>
                    <td>
                      <button onClick={() => toggleAccordion(project.number)}>
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
  );
};

export default Leaderboard;
