import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "@mui/icons-material";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import toast, { Toaster } from "react-hot-toast";
import { RiSendPlaneLine } from "react-icons/ri";
import { founderRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/founderRegisteredData";
import { Tooltip } from "react-tooltip";
import AddAMentorRequestModal from "../../models/AddAMentorRequestModal";
import { Principal } from "@dfinity/principal";
import DiscoverInvestorPage from "../Dashboard/DashboardHomePage/DiscoverInvestor/DiscoverInvestorPage";

const DiscoverInvestor = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allInvestorData, setAllInvestorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [sendprincipal, setSendprincipal] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [isAddInvestorModalOpen, setIsAddInvestorModalOpen] = useState(false);
  const [investorId, setInvestorId] = useState(null);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const dispatch = useDispatch();

  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const projectId = projectFullData?.[0]?.[0]?.uid;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);
  const handleInvestorCloseModal = () => {
    setInvestorId(null);
    setIsAddInvestorModalOpen(false);
  };
  const handleInvestorOpenModal = (val) => {
    setInvestorId(val);
    setIsAddInvestorModalOpen(true);
  };

  const handleAddInvestor = async ({ message }) => {
    console.log("add a investor");
    if (actor && investorId) {
      let investor_id = Principal.fromText(investorId);
      let msg = message;
      let project_id = projectId;

      await actor
        .send_offer_to_investor_by_project(investor_id, msg, project_id)
        .then((result) => {
          console.log("result-in-send_offer_to_investor", result);
          if (result) {
            handleInvestorCloseModal();
            toast.success("offer sent to mentor successfully");
          } else {
            handleInvestorCloseModal();
            toast.error("something got wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-send_offer_to_investor", error);
          handleInvestorCloseModal();
          toast.error("something got wrong");
        });
    }
  };

  console.log(".............Investor", allInvestorData);
  const getAllInvestor = async (caller, isMounted) => {
    await caller
      .list_all_vcs_with_pagination({
        page_size: itemsPerPage,
        page: currentPage,
      })
      .then((result) => {
        if (isMounted) {
          console.log("result-in-get-all-investor", result);
          {
            result?.data.map((val) => {
              setSendprincipal(val[0]);
            });
          }
          if (result && result.data) {
            const InvestorData = result.data ? Object.values(result.data) : [];
            const userData = result.user_data
              ? Object.values(result.user_data)
              : [];
            setAllInvestorData(InvestorData);
            setUserData(userData);
          } else {
            setAllInvestorData([]);
            setUserData([]);
            // Set to an empty array if no data
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllInvestorData([]);
          setUserData([]);
          setIsLoading(false);
          console.log("error-in-get-all-investor", error);
        }
      });
  };
  console.log("sendPrincipal", sendprincipal);

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllInvestor(actor, isMounted);
    } else {
      getAllInvestor(IcpAccelerator_backend);
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

  const handleClick = (principal) => {
    setSendprincipal(principal);
    setOpenDetail(true);
    console.log("passed principle", principal);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : allInvestorData.length > 0  ? (
        allInvestorData.map((investorArray, index) => {
          console.log("investorArray", investorArray);
          // const investor_id = investorArray[0]?.toText();
          const investor = investorArray[1];
          const user = investorArray[2];
      
          console.log("000000000000000000000", investor);
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
          const randomSkills = user?.area_of_interest
            .split(",")
            .map((skill) => skill.trim());
          const activeRole = investor?.roles.find(
            (role) => role.status === "approved"
          );

          const principle_id = investorArray[0];
          console.log("principle", principle_id);

          return (
            <div
              className="p-6 w-[750px] rounded-lg shadow-sm mb-4 flex"
              key={index}
            >
              <div
                onClick={() => handleClick(principle_id)}
                className="w-[272px]"
              >
                <div className="max-w-[250px] w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden">
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={handleClick}
                  >
                    <img
                      src={profile} // Placeholder logo image
                      alt={full_name ?? "investor"}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
                    <Star className="text-yellow-400 w-4 h-4" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                </div>
              </div>

              <div className="flex-grow ml-[25px] w-[544px]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{full_name}</h3>
                    <p className="text-gray-500">@{openchat_name}</p>
                  </div>
                  {userCurrentRoleStatusActiveRole === "project" ? (
                    <button
                      data-tooltip-id="registerTip"
                      onClick={() => handleInvestorOpenModal(investor_id)}
                    >
                      <RiSendPlaneLine />
                      <Tooltip
                        id="registerTip"
                        place="top"
                        effect="solid"
                        className="rounded-full z-10"
                      >
                        Send Association Request
                      </Tooltip>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mb-2">
                  {activeRole && (
                    <span
                      key={index}
                      className={`inline-block ${
                        tagColors[activeRole.name] ||
                        "bg-gray-100 text-gray-800"
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
      {isAddInvestorModalOpen && (
        <AddAMentorRequestModal
          title={"Associate Investor"}
          onClose={handleInvestorCloseModal}
          onSubmitHandler={handleAddInvestor}
        />
      )}
      {openDetail && (
        <DiscoverInvestorPage
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          principal={sendprincipal}
        />
      )}
      <Toaster />
    </div>
  );
};

export default DiscoverInvestor;
