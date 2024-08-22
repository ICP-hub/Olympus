import React, { useState, useEffect } from "react";
// import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { FavoriteBorder, LocationOn, Star } from "@mui/icons-material";
import CypherpunkLabLogo from "../../../assets/Logo/CypherpunkLabLogo.png";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { BsFillSendPlusFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
const DiscoverProject = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allProjectData, setAllProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const getAllProject = async (caller, isMounted) => {
    await caller
      .list_all_projects_with_pagination({
        page_size: itemsPerPage,
        page: currentPage,
      })
      .then((result) => {
        if (isMounted) {
          console.log("result-in-get-all-projects", result);
          if (!result || result.length === 0) {
            setNoData(true);
            setAllProjectData([]);
            // onNoDataChange(false);
          } else {
            setAllProjectData(result.data);
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllProjectData([]);
          setIsLoading(false);
          console.log("error-in-get-all-projects", error);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllProject(actor, isMounted);
    } else {
      getAllProject(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor, currentPage]);

  /////////////////////////
  const tagColors = {
    OLYMPIAN: "bg-[#F0F9FF] border-[#B9E6FE] border text-[#026AA2] rounded-md",
    FOUNDER: "bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md",
    PROJECT: "bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md",
    INVESTER: "bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md",
    TALENT: "bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md",
  };

  const tags = ["OLYMPIAN", "FOUNDER", "TALENT", "INVESTER", "PROJECT"];
  const getRandomTags = () => {
    const shuffledTags = tags.sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 2);
  };

  const skills = [
    "Web3",
    "Cryptography",
    "MVP",
    "Infrastructure",
    "Web3",
    "Cryptography",
  ];
  const getRandomskills = () => {
    const shuffledTags = skills.sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 2);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : allProjectData.length > 0 ? (
        <div>
          {allProjectData.map((project, index) => {
            //   project card data
            const randomTags = getRandomTags();
            const randomSkills = getRandomskills();
            const logo =
              project?.params?.params?.project_logo &&
              project.params.params.project_logo[0]
                ? uint8ArrayToBase64(project.params.params.project_logo[0])
                : "../../../../assets/Logo/CypherpunkLabLogo.png";

            const project_name = project.params.params.project_name;
            // const project_rating = project.params.params.self_rating_of_project;
            const project_rating = `${Math.floor(
              project.params.params.self_rating_of_project
            )}.0`;
            const dapp_link = project.params.params.dapp_link[0] ?? "N/A";
            const project_area_of_focus =
              project.params.params.project_area_of_focus;
            const project_description =
              project.params.params.project_description[0] ||
              "Is the management ready to be flexible and accommodate changes?Is the management ready to be flexible and accommodate changes?";
            const location =
              project.params.params.country_of_registration[0] || "USA";
            return (
              <>
                {/* Render more fields as needed */}
                <div
                  className=" p-6 w-[750px] rounded-lg shadow-sm mb-4 flex"
                  key={index}
                >
                  <div className="w-[272px]  ">
                    <div className="max-w-[250px] w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between  relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={logo}
                          alt={project_name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>

                      <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
                        <Star className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm font-medium">
                          {project_rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow ml-[25px] w-[544px]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{project_name}</h3>
                        <p className="text-gray-500">@{dapp_link}</p>
                      </div>

                      <button className="flex items-center bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600">
                        Request <BsFillSendPlusFill className="ml-2"/>
                      </button>
                    </div>
                    <div className="mb-2">
                      {randomTags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-block ${
                            tagColors[tag] || "bg-gray-100 text-gray-800"
                          } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 my-3"></div>
                    <p className="font-medium mb-2"> {project_area_of_focus}</p>

                    <p className="text-gray-600 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2 ">
                      {project_description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 flex-wrap">
                      {randomSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}

                      <span className="mr-2 mb-2 flex text-[#121926] items-center">
                        <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />
                        {location}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <div>No Data Available</div>
      )}
    </div>
  );
};

export default DiscoverProject;
