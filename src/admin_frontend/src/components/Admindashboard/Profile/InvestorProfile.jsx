import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  place,
  tick,
  star,
  Profile2,
  openWebsiteIcon,
  telegramSVg,
  noDataPresentSvg,
} from "../../Utils/AdminData/SvgData";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { investorApprovedRequest } from "../../AdminStateManagement/Redux/Reducers/investorApproved";
import { investorDeclinedRequest } from "../../AdminStateManagement/Redux/Reducers/investorDecline";
import { openchat_username } from "../../Utils/AdminData/SvgData";
import { linkedInSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

const InvestorProfile = ({ userData, Allrole, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   const notificationDetails = location.state;

  // console.log("userData in investor profile", userData[0]);
  // console.log("Allrole in investor profile", Allrole);

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
    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      // console.log("Converted Principal ", covertedPrincipal);

      switch (category) {
        case "vc":
          if (state === "Pending") {
            await actor.decline_vc_creation_request(covertedPrincipal, boolean);
            await dispatch(investorDeclinedRequest());
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

    try {
      const covertedPrincipal = await Principal.fromText(principal);

      switch (category) {
        case "vc":
          if (state === "Pending") {
            await actor.approve_vc_creation_request(covertedPrincipal, boolean);
            await dispatch(investorApprovedRequest());
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

  const date = numberToDate(Allrole[3].requested_on[0]);
  const profile = uint8ArrayToBase64(
    userData[0].params.user_data.profile_picture[0]
  );
  const logo =
    userData && userData[0].params.logo[0].length > 0
      ? uint8ArrayToBase64(userData[0].params.logo[0])
      : null;

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
                  {userData[0].params.user_data.full_name}
                </h1>
              </div>
              <p className="text-gray-500 md:text-md text-sm font-normal mb-4">
                {userData[0].params.user_data.email}
              </p>

              <div className="flex flex-col items-start gap-3 text-sm">
                <div className="flex flex-row  text-gray-600 space-x-2">
                  {place}
                  <p className="underline ">
                    {" "}
                    {userData[0].params.user_data.country}
                  </p>
                </div>
                <div className=" flex flex-row space-x-2 text-gray-600">
                  {star}
                  <p>{date}</p>
                </div>
                <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                  {tick}
                  <p>{userData[0].params.user_data.area_of_interest}</p>
                </div>

                <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                  {openchat_username}
                  <p>{userData[0].params.user_data.openchat_username[0]}</p>
                </div>
              </div>

              {userData[0].params.user_data.reason_to_join[0] && (
                <p className="mt-8 text-black mb-2">Reason to join</p>
              )}
              <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                {userData[0].params.user_data.reason_to_join[0].map(
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          About Investor
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          {userData[0].params.user_data.bio}
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
                {userData[0].params.website_link}
              </p>
              <a
                href={userData[0].params.website_link}
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
                {userData[0].params.linkedin_link}
              </p>
              <a
                href={userData[0].params.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 pl-2"
              >
                {linkedInSvg}
              </a>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full mt-4">
          <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
              Portfolio:
            </h2>
            <div className="flex flex-grow items-center truncate">
              <p className="text-gray-600 text-sm md:text-md truncate px-4">
                {userData[0].params.portfolio_link}
              </p>
              <a
                href={userData[0].params.portfolio_link}
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
              Telegram:
            </h2>
            <div className="flex flex-grow items-center truncate">
              <p className="text-gray-600 text-sm md:text-md truncate">
                {userData[0].params.user_data.telegram_id[0]}
              </p>
              <a
                href={userData[0].params.user_data.telegram_id}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 pl-2"
              >
                {telegramSVg}
              </a>
            </div>
          </div>
        </div>

        {logo && (
          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
              <div className="object-fill">
                <img
                  className="md:w-36 md:h-36 w-28 h-28  mx-4 justify-start rounded-full"
                  src={logo}
                  alt="logo"
                />
              </div>
            </div>

            <div className="invisible  md:w-1/2 w-full flex flex-row items-start md:items-center justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Reason For Join :
              </h1>
              <p className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.reason_for_joining[0] ? (
                  <span>
                    {userData[0].params.existing_icp_project_porfolio[0]}
                  </span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg} Data Not Available
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              Exisitng ICP Portfolio :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.existing_icp_portfolio[0] ? (
                <span>{userData[0].params.existing_icp_portfolio[0]}</span>
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
              Assets Under Management :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.assets_under_management[0] ? (
                <span>{userData[0].params.assets_under_management[0]}</span>
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
              Average Check Size :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.average_check_size ? (
                <span>{userData[0].params.average_check_size}</span>
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
              Registered Under Any Hub :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {" "}
              {userData[0].params.registered_under_any_hub[0] ? (
                "Yes"
              ) : "No" ? (
                <span>
                  {userData[0].params.registered_under_any_hub[0]
                    ? "Yes"
                    : "No"}
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

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              Announcement :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.announcement_details[0] ? (
                <span>{userData[0].params.announcement_details[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>

          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">Fund Size :</h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.fund_size[0] ? (
                <span>{userData[0].params.fund_size[0]}</span>
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
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
            <h1 className="text-lg font-normal text-gray-600">
              Money Invested :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.money_invested[0] ? (
                <span>{userData[0].params.money_invested[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">Registered :</h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {" "}
              {userData[0].params.registered ? (
                "Yes"
              ) : "No" ? (
                <span>{userData[0].params.registered ? "Yes" : "No"}</span>
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
              Type Of Investment :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.type_of_investment ? (
                <span>{userData[0].params.type_of_investment}</span>
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
              Exisitng ICP Investor :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {" "}
              {userData[0].params.existing_icp_investor ? (
                "Yes"
              ) : "No" ? (
                <span>
                  {userData[0].params.existing_icp_investor ? "Yes" : "No"}
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

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
            <h1 className="text-lg font-normal text-gray-600">
              Registered Country :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.registered_country[0] ? (
                <span>{userData[0].params.registered_country[0]}</span>
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
              Preferred ICP Hub :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.preferred_icp_hub ? (
                <span>{userData[0].params.preferred_icp_hub}</span>
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
              Range Of Check Size :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.range_of_check_size[0] ? (
                <span>{userData[0].params.range_of_check_size[0]}</span>
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
              Investor Type :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.investor_type[0] ? (
                <span>{userData[0].params.investor_type[0]}</span>
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
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
            <h1 className="text-lg font-normal text-gray-600">
              Project On Multichain :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.project_on_multichain[0] ? (
                <span>{userData[0].params.project_on_multichain[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>

          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
            <h1 className="text-lg font-normal text-gray-600">Name Of Fund:</h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.name_of_fund ? (
                <span>{userData[0].params.name_of_fund}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10 mb-10 ">
          <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
            <h1 className="text-lg font-normal text-gray-600">
              Number Of Portfolio Companies :
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.number_of_portfolio_companies ? (
                <span>{userData[0].params.number_of_portfolio_companies}</span>
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
              Investment Stage:
            </h1>
            <p className="text-lg font-bold text-gray-800 pl-6">
              {userData[0].params.stage[0] ? (
                <span>{userData[0].params.stage[0]}</span>
              ) : (
                <span className="flex items-center">
                  {noDataPresentSvg}
                  Data Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        {Allrole?.map((role, index) => {
          const roleName = role.name === "vc" ? "vc" : role.name;
          if (role.status === "requested" && roleName === "vc") {
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
                </button>
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

export default InvestorProfile;
