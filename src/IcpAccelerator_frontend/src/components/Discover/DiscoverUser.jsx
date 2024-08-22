import React, { useState, useEffect } from "react";
// import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { FavoriteBorder, LocationOn, Star } from "@mui/icons-material";
import CypherpunkLabLogo from "../../../assets/Logo/CypherpunkLabLogo.png";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
const DiscoverUser = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allUserData, setAllUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  console.log(".............USERS", allUserData);
  const getAllUser = async (caller, isMounted) => {
    await caller
      .list_all_users({
        page_size: itemsPerPage,
        page: currentPage,
      })
      .then((result) => {
        if (isMounted) {
          console.log("result-in-get-all-user USERS", result);
          if (result ) {
            // Log the exact structure of result.data to verify it
            console.log("Data received:", result.data);
            setAllUserData(result);
        } else {
          setAllUserData([]); // Set to an empty array if no data
        }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
            setAllUserData([]);
          setIsLoading(false);
          console.log("error-in-get-all-user", error);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
        getAllUser(actor, isMounted);
    } else {
      getAllUser(IcpAccelerator_backend);
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
      ) : allUserData.length > 0 ? (
        <div>
          {allUserData.map((user, index) => {
            //   project card data
            const randomTags = getRandomTags();
            const randomSkills = getRandomskills();
            const logo =
              user.profile_picture && user.profile_picture[0]
                ? uint8ArrayToBase64(user.profile_picture[0])
                : "default-profile.png";

            const full_name = user.full_name || "Unknown User";
            console.log("full_name.........",full_name)
            const bio = user.bio[0] || "No bio available.";
            const area_of_interest = user.area_of_interest || "N/A";
            const location = user.country || "Unknown Location";
            const openchat_username =user.openchat_username ?? "ICP"
            return (
              <>
                {/* Render more fields as needed */}
                <div className=" p-6 w-[750px] rounded-lg shadow-sm mb-4 flex" key={index}>
                  <div className="w-[272px]  ">
                    <div className="max-w-[250px] w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between  relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={logo}
                          alt={full_name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>

                      <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
                        <Star className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm font-medium">
                          {/* {project_rating} */} start
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow ml-[25px] w-[544px]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">
                        {full_name}

                        </h3>
                        <p className="text-gray-500">@{openchat_username}</p>
                      </div>
                      <FavoriteBorder className="text-gray-400 cursor-pointer" />
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
                    <p className="font-medium mb-2"> {area_of_interest}</p>

                    <p className="text-gray-600 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2 ">
                      {bio} 
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

export default DiscoverUser;
