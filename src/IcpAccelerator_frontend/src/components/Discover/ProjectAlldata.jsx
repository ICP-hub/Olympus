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
import UserDetailPage from "../Dashboard/DashboardHomePage/UserDetailPage";
const DiscoverProject = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allProjectData, setAllProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [cardDetail,setCadDetail]=useState(null)
  const [principal,setprincipal]=useState(null)
  const getAllProject = async (caller, isMounted) => {
    await caller
      .list_all_projects_with_pagination({
        page_size: itemsPerPage,
        page: currentPage,
      })
      .then((result) => {
        if (isMounted) {
          console.log("result-in-get-all-projects", result);
          setprincipal(result.data[0].principal)
          if (result && result.data) {
            const ProjectData = result.data ? Object.values(result.data) : [];
            const userData = result.user_data
              ? Object.values(result.user_data)
              : [];
              setAllProjectData(ProjectData);
            setUserData(userData);
          } else {
            setAllProjectData([]);
            setUserData([]);
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllProjectData([]);
          setUserData([]);
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
    // OLYMPIAN: "bg-[#F0F9FF] border-[#B9E6FE] border text-[#026AA2] rounded-md",
    mentor: "bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md",
    project: "bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md",
    vc: "bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md",
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
  const [openDetail,setOpenDetail]=useState(false)

console.log("cardDetail => ",cardDetail)
  const handleClick=(user)=>{
    setOpenDetail(true)
    setCadDetail(user)
    // console.log("cardDetail => ",cardDetail)
  }

  return (
    <div>
    {isLoading ? (
      <div>Loading...</div>
    ) : allProjectData.length > 0 && userData.length > 0 ? (
      allProjectData.map((projectArray, index) => {
        const project = projectArray[1];
        const user = userData[index][1];
        console.log("000000000000000000000", project);
        console.log("111111111111111111111", user);
        const randomTags = getRandomTags();
        // const randomSkills = getRandomskills();
        let profile = user?.profile_picture[0]
          ? uint8ArrayToBase64(user?.profile_picture[0])
          : "../../../assets/Logo/CypherpunkLabLogo.png";
        let full_name = user?.full_name;
        let openchat_name = user?.openchat_username;
        let country = user?.country;
        let bio = user?.bio[0];
        let email = user?.email[0];
        const randomSkills = user?.area_of_interest.split(",").map(skill => skill.trim());
        const activeRole = project?.roles.find(role => role.status === "approved");
        return (
          <div
            className="p-6 w-[750px] rounded-lg shadow-sm mb-4 flex"
            key={index}
          >
            <div onClick={()=>handleClick(user)} className="w-[272px]">
              <div className="max-w-[250px] w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={profile} // Placeholder logo image
                    alt={full_name ?? "Project"}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>

                <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
                  <Star className="text-yellow-400 w-4 h-4" />
                  <span className="text-sm font-medium">5.0</span>
                </div>
              </div>
            </div>
            {openDetail && <UserDetailPage openDetail={openDetail} setOpenDetail={setOpenDetail} userData={cardDetail} principal={principal} />}

            <div className="flex-grow ml-[25px] w-[544px]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{full_name}</h3>
                  <p className="text-gray-500">@{openchat_name}</p>
                </div>
                <FavoriteBorder className="text-gray-400 cursor-pointer" />
              </div>
              <div className="mb-2">
              {activeRole && (
                  <span
                    key={index}
                    className={`inline-block ${
                      tagColors[activeRole.name] || "bg-gray-100 text-gray-800"
                    } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
                  >
                    {activeRole.name}
                  </span>
                )}
              </div>
              <div className="border-t border-gray-200 my-3">{email}</div>

              <p className="text-gray-600 mb-4">{bio}</p>
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
                  {country}
                </span>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div>No Data Available</div>
    )}
  </div>
  );
};

export default DiscoverProject;