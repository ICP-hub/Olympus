import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import { place, tick, star, Profile2 } from "../../Utils/AdminData/SvgData";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { mentorDeclinedRequest } from "../../AdminStateManagement/Redux/Reducers/mentorDeclined";
import { mentorApprovedRequest } from "../../AdminStateManagement/Redux/Reducers/mentorApproved";
import { openchat_username } from "../../Utils/AdminData/SvgData";
import { linkedInSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { openWebsiteIcon } from "../../Utils/AdminData/SvgData";
import { noDataPresentSvg } from "../../Utils/AdminData/SvgData";

const MentorProfile = ({ userData, Allrole, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  // const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log("userData in mentor profile", userData);
  // console.log("Allrole in mentor profile", Allrole);

  useEffect(() => {
    const requestedRole = Allrole?.role?.find(
      (role) => role.status === "requested"
    );
    if (requestedRole) {
      setCurrent(requestedRole.name.toLowerCase());
    } else {
      setCurrent("user");
    }
  }, [Allrole.role]);

  const getButtonClass = (status) => {
    switch (status) {
      case "active":
        return "bg-[#A7943A]";
      case "requested":
        return "bg-[#e55711]";
      case "approved":
        return "bg-[#0071FF]";
      default:
        return "bg-[#FF3A41]";
    }
  };

  function constructMessage(role) {
    let baseMessage = `This User's ${
      role.name.charAt(0).toUpperCase() + role.name.slice(1)
    } Profile `;

    if (
      role.status === "active" &&
      role.approved_on &&
      role.approved_on.length > 0
    ) {
      baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
    } else if (
      role.status === "approved" &&
      role.approved_on &&
      role.approved_on.length > 0
    ) {
      baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
    } else if (
      role.status === "requested" &&
      role.requested_on &&
      role.requested_on.length > 0
    ) {
      baseMessage += `request was made on ${numberToDate(
        role.requested_on[0]
      )}`;
    } else if (
      role.status === "rejected" &&
      role.rejected_on &&
      role.rejected_on.length > 0
    ) {
      baseMessage += `was rejected on ${numberToDate(role.rejected_on[0])}`;
    } else {
      baseMessage += `is currently in the '${role.status}' status without a specific date.`;
    }

    return baseMessage;
  }

  const declineUserRoleHandler = async (
    principal,
    boolean,
    state,
    category
  ) => {
    // console.log(principal, boolean, state, category);

    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      // console.log("Converted Principal ", covertedPrincipal);

      switch (category) {
        case "mentor":
          if (state === "Pending") {
            await actor.decline_mentor_creation_request_candid(
              covertedPrincipal,
              boolean
            );
            await dispatch(mentorDeclinedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsDeclining(false);
      window.location.reload();
    }
  };

  const allowUserRoleHandler = async (principal, boolean, state, category) => {
    setIsAccepting(true);

    // console.log(principal, boolean, state, category);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      // console.log("Converted Principal ", covertedPrincipal);
      switch (category) {
        case "mentor":
          if (state === "Pending") {
            await actor.approve_mentor_creation_request_candid(
              covertedPrincipal,
              boolean
            );
            await dispatch(mentorApprovedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsAccepting(false);
      window.location.reload();
    }
  };

  // console.log("userData[0].profile:", userData[0].profile);

  const date = numberToDate(Allrole[2].requested_on[0]);
  const profile = uint8ArrayToBase64(
    userData[0].profile.user_data.profile_picture[0]
  );
  return (
    <div className="w-full">
      <div className=" bg-white  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full">
        <div className="w-full flex  md:flex-row flex-col md:items-start items-center justify-around px-[4%] py-4">
          <div className="flex md:flex-row flex-col w-full ">
            <div className="relative">
              {/* <div className=""> */}
              <img
                className="md:w-36 object-fill md:h-36 w-28 h-28 mx-4 justify-center rounded-full"
                src={profile}
                alt="description"
              />
              {/* </div> */}

              <div className=" top-0 left-0 w-full h-full flex justify-center items-center">
                <svg className="absolute invisible">
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                      className="rounded"
                    >
                      <stop offset="0%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
              <div className="flex flex-row  gap-4 items-center">
                <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                  {userData[0].profile.user_data.full_name}
                </h1>
              </div>
              <p className="text-gray-500 md:text-md text-sm font-normal mb-4">
                {userData[0].profile.user_data.email}
              </p>

              <div className="flex flex-col items-start gap-3 text-sm">
                <div className="flex flex-row  text-gray-600 space-x-2">
                  {place}
                  <p className="underline ">
                    {userData[0].profile.user_data.country}
                  </p>
                </div>
                <div className=" flex flex-row space-x-2 text-gray-600">
                  {star}
                  <p>
                    {Allrole[2]?.requested_on?.length > 0
                      ? date
                      : "No requested date"}
                  </p>
                </div>
                <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                  {tick}
                  <p>{userData[0].profile.user_data.area_of_interest}</p>
                </div>

                <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                  {openchat_username}
                  <p>{userData[0].profile.user_data.openchat_username[0]}</p>
                </div>
              </div>

              {userData[0].profile.user_data.reason_to_join[0] && (
                <p className="mt-8 text-black mb-2">Reason to join</p>
              )}
              <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                {userData[0].profile.user_data.reason_to_join[0].map(
                  (reason, index) => (
                    <p
                      key={index}
                      className="bg-[#c9c5c5] py-0.5 rounded-full px-3"
                    >
                      {reason.replace(/_/g, " ")}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 h-[275px] bg-gray-100 px-[1%] rounded-md mt-2  overflow-y-auto py-2">
            {Allrole &&
              Allrole.length > 0 &&
              Allrole.filter(
                (role) =>
                  role.approved_on[0] ||
                  role.rejected_on[0] ||
                  role.requested_on[0]
              ).map((role, index) => (
                <div key={index} className="flex justify-around items-center">
                  <button
                    className={`flex px-4 items-center md:w-[400px] w-full h-[90px] ${getButtonClass(
                      role.status
                    )} rounded-md `}
                  >
                    <div className="xl:lg:ml-4">{Profile2}</div>
                    <p className="flex justify-center items-center text-white p-2 text-sm">
                      {constructMessage(role)}
                    </p>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="w-full mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About Mentor</h1>
        <p className="text-gray-600 text-lg mb-10">
          {userData[0].profile.user_data.bio}
        </p>
      </div>

      <div className="mt-12 pb-8">
        <p className="w-full mb-4 border border-[#DCDCDC]"></p>

        <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
          <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
              Website:
            </h2>
            <div className="flex flex-grow items-center truncate">
              <p className="text-gray-600 text-sm md:text-md truncate px-4">
                {userData[0].profile.website}
              </p>
              <a
                href={userData[0].profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="pl-2"
              >
                {openWebsiteIcon}
              </a>{" "}
            </div>
          </div>

          <div className="flex md:w-1/2 w-3/4 items-center text-center sm:text-left md:pl-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mr-2">
              Linkedin:
            </h2>
            <div className="flex flex-grow items-center truncate">
              <p className="text-gray-600 text-sm md:text-md truncate">
                {userData[0].profile.linkedin_link}
              </p>
              <a
                href={userData[0].profile.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 pl-2"
              >
                {linkedInSvg}
              </a>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              Years of Mentoring :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.years_of_mentoring ? (
                <span>{userData[0].profile.years_of_mentoring}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>

          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">
              Preferred ICP hubs :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.preferred_icp_hub ? (
                <span>{userData[0].profile.preferred_icp_hub}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              Existing ICP Mentor :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.existing_icp_mentor ? (
                "Yes"
              ) : "No" ? (
                <span>
                  {userData[0].profile.existing_icp_mentor ? "Yes" : "No"}
                </span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>

          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">
              Mentoring Services :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.category_of_mentoring_service ? (
                <span>{userData[0].profile.category_of_mentoring_service}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              Reason For Join :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.reason_for_joining[0] ? (
                <span>{userData[0].profile.reason_for_joining[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">
              Expertise In :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.area_of_expertise ? (
                <span>{userData[0].profile.area_of_expertise}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              ICP Hub/ Spoke :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {" "}
              {userData[0].profile.icp_hub_or_spoke ? (
                "Yes"
              ) : "No" ? (
                <span>
                  {userData[0].profile.icp_hub_or_spoke ? "Yes" : "No"}
                </span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>

          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">Hub Owner :</h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.hub_owner[0] ? (
                <span>{userData[0].profile.hub_owner[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              Type of Profile :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.user_data.type_of_profile[0] ? (
                <span>{userData[0].profile.user_data.type_of_profile[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>

          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">
              Existing ICP Project Portfolio :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0]?.profile?.existing_icp_project_porfolio[0] ? (
                <span>
                  {userData[0]?.profile?.existing_icp_project_porfolio[0]}
                </span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4 mb-10">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">Multichain :</h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.multichain[0] ? (
                <span>{userData[0].profile.multichain[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>

          <div className="invisible  md:w-1/2 w-full flex flex-row items-start md:items-center justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">
              Reason For Join :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].profile.reason_for_joining[0] ? (
                <span>
                  {userData[0].profile.existing_icp_project_porfolio[0]}
                </span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}{" "}
                  {/* Ensure you define this SVG component elsewhere in your code */}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        {Allrole?.map((role, index) => {
          const roleName = role.name === "vc" ? "investor" : role.name;
          if (role.status === "requested" && roleName === "mentor") {
            return (
              <div key={index} className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() =>
                    declineUserRoleHandler(
                      principal,
                      true,
                      "Pending",
                      role.name
                    )
                  }
                  disabled={isDeclining}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  {isDeclining ? (
                    <ThreeDots color="#FFF" height={13} width={51} />
                  ) : (
                    "Decline"
                  )}
                </button>{" "}
                <button
                  onClick={() =>
                    allowUserRoleHandler(principal, true, "Pending", role.name)
                  }
                  disabled={isAccepting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  {isAccepting ? (
                    <ThreeDots color="#FFF" height={13} width={51} />
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default MentorProfile;
