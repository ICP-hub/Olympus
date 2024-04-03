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

  // const declineUserRoleHandler = async (
  //   principal,
  //   boolean,
  //   state,
  //   category
  // ) => {
  //   setIsDeclining(true);
  //   try {
  //     const convertedPrincipal = await Principal.fromText(principal);
  //     switch (category) {
  //       case "mentor":
  //         if (state === "Pending") {
  //           await actor.decline_mentor_creation_request_candid(
  //             convertedPrincipal,
  //             boolean
  //           );
  //           // Dispatch decline action here and wait for it to complete
  //           await dispatch(mentorDeclinedRequest());
  //         }
  //         break;
  //       case "vc":
  //         if (state === "Pending") {
  //           await actor.decline_vc_creation_request(convertedPrincipal, boolean);
  //           // Dispatch decline action here and wait for it to complete
  //           await dispatch(investorDeclinedRequest());
  //         }
  //         break;
  //       case "project":
  //         if (state === "Pending") {
  //           await actor.decline_project_creation_request(convertedPrincipal);
  //           // Dispatch decline action here and wait for it to complete
  //           await dispatch(projectDeclinedRequest());
  //         }
  //         break;
  //       default:
  //         console.warn("Unhandled category:", category);
  //     }
  //   } catch (error) {
  //     console.error("Error processing decline request:", error);
  //   } finally {
  //     setIsDeclining(false);
  //     // window.location.reload();
  //   }
  // };

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
    <div className="w-full px-[4%]">
      <div className="  bg-white  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full">
        <div className="w-full pl-4 pr-2 flex flex-wrap flex-row items-start justify-start py-4">
          <div className="relative">
            <div className="object-fill">
              <img
                className="md:w-36 md:h-36 w-28 h-28  mx-4 justify-start rounded-full"
                src={profile}
                alt="profile"
              />
            </div>

            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
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
          <div className="flex flex-col ml-4  mt-2 w-auto md:mr-80">
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
                <p>{userData[0].profile.user_data.area_of_intrest}</p>
              </div>
            </div>

            {userData[0].profile.area_of_expertise && (
              <p className="mt-8 text-black mb-2">Skills</p>
            )}
            <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
              <p className="bg-[#c9c5c5] underline rounded-full px-3">
                {userData[0].profile.area_of_expertise}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 h-[300px] bg-gray-300 rounded-md mt-2 px-2 overflow-y-auto py-2">
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
                    className={`flex items-center md:w-[310px] w-full h-[90px] ${getButtonClass(
                      role.status
                    )} rounded-md px-4`}
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
        <div className="flex  font-bold text-black text-3xl ">
          <h1 className="mb-2">About Mentor</h1>
        </div>
        <div>
          <p>{userData[0].profile.user_data.bio}</p>
        </div>
      </div>

      <div className="mt-12 pb-8">
        <p className="w-full mb-4 border border-[#DCDCDC]"></p>
        <div className="text-black text-3xl font-bold">
          {userData[0].profile.area_of_expertise && (
            <h1 className="">Skills</h1>
          )}
        </div>

        <div className="flex flex-col gap-2 ">
          <div className="flex flex-row gap-2 flex-wrap mt-2 ">
            <p className="bg-gray-300 underline rounded-full px-2">
              {userData[0].profile.area_of_expertise}
            </p>
          </div>
        </div>

        <div>
          {userData[0].profile.website && (
            <div className="text-black mt-4">
              <h1 className="text-3xl font-bold">website</h1>
              <p>{userData[0].profile.website}</p>
            </div>
          )}

          {userData[0].profile.years_of_mentoring && (
            <div className="text-black mt-4">
              <h1 className="text-3xl font-bold">Years of Mentoring</h1>
              <p>{userData[0].profile.years_of_mentoring}</p>
            </div>
          )}

          {userData[0].profile.reason_for_joining && (
            <div className="text-black mt-4">
              <h1 className="text-3xl font-bold">Reason for Joining</h1>
              <p>{userData[0].profile.reason_for_joining}</p>
            </div>
          )}

          {userData[0].profile.preferred_icp_hub && (
            <div className="text-black mt-4">
              <h1 className="text-3xl font-bold">Preferred ICP hubs</h1>
              <p>{userData[0].profile.preferred_icp_hub}</p>
            </div>
          )}

          {userData[0].profile.multichain && (
            <div className="text-black mt-4">
              <h1 className="text-3xl font-bold">Mutli-chains</h1>
              <p>{userData[0].profile.multichain}</p>
            </div>
          )}

          {userData[0].profile.linkedin_link && (
            <div className="text-black mt-4">
              <h1 className="text-3xl font-bold">Linked-In</h1>
              <p>{userData[0].profile.linkedin_link}</p>
            </div>
          )}

          {userData[0].profile.existing_icp_project_porfolio && (
            <div className="text-black mt-4">
              <h1 className="text-3xl font-bold">
                Existing ICP project portfolio
              </h1>
              <p>{userData[0].profile.existing_icp_project_porfolio}</p>
            </div>
          )}
        </div>

        {Allrole?.map((role, index) => {
          const roleName = role.name === "vc" ? "investor" : role.name;
          if (role.status === "requested" && roleName === "mentor") {
            return (
              <div key={index} className="flex justify-end gap-2 mt-6">
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
