import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  place,
  tick,
  star,
  Profile2,
  telegramSVg,
} from "../../Utils/AdminData/SvgData";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { openchat_username } from "../../Utils/AdminData/SvgData";
import { linkedInSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
const UserProfile = ({ userData, Allrole }) => {
  // const actor = useSelector((currState) => currState.actors.actor);

  const [current, setCurrent] = useState("user");

  // const location = useLocation();

  // console.log("userData in user profile", userData[0]);
  // console.log("Allrole in user profile", Allrole);

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

  const date = numberToDate(userData[0].joining_date);
  const profile = uint8ArrayToBase64(userData[0].params.profile_picture[0]);
  // console.log(profile);
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
                  {userData[0].params.full_name}
                </h1>
              </div>
              <p className="text-gray-500 md:text-md text-sm font-normal mb-4">
                {userData[0].params.email}
              </p>

              <div className="flex flex-col items-start gap-3 text-sm">
                <div className="flex flex-row  text-gray-600 space-x-2">
                  {place}
                  <p className="underline ">{userData[0].params.country}</p>
                </div>
                <div className=" flex flex-row space-x-2 text-gray-600">
                  {star}
                  <p>{date}</p>
                </div>
                <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                  {tick}
                  <p>{userData[0].params.area_of_interest}</p>
                </div>
                <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                  {openchat_username}
                  <p>{userData[0].params.openchat_username[0]}</p>
                </div>
              </div>

              {userData[0].params.reason_to_join[0] && (
                <p className="mt-8 text-black mb-2">Reason to join</p>
              )}
              <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                {userData[0].params.reason_to_join[0].map((reason, index) => (
                  <p
                    key={index}
                    className="bg-[#c9c5c5] py-0.5 rounded-full px-3"
                  >
                    {reason.replace(/_/g, " ")}
                  </p>
                ))}
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

      <div className="mx-auto mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          About {current.charAt(0).toUpperCase() + current.slice(1)}
        </h1>
        <p className="text-gray-600 text-lg mb-10">{userData[0].params.bio}</p>

        <p className="w-full mb-4 border border-[#DCDCDC]"></p>

        <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full mb-10">
          <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
              Telegram:
            </h2>
            <div className="flex flex-grow items-center truncate">
              <p className="text-gray-600 text-sm md:text-md truncate px-4">
                {userData[0].params.telegram_id}
              </p>
              <a
                href={userData[0].params.telegram_id}
                target="_blank"
                rel="noopener noreferrer"
                className="pl-2"
              >
                {telegramSVg}
              </a>{" "}
            </div>
          </div>

          <div className="flex md:w-1/2 w-3/4 items-center text-center sm:text-left md:pl-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mr-2">
              Twitter:
            </h2>
            <div className="flex flex-grow items-center truncate">
              <p className="text-gray-600 text-sm md:text-md truncate">
                {userData[0].params.twitter_id}
              </p>
              <a
                href={userData[0].params.twitter_id}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 pl-2"
              >
                {twitterSvg}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
