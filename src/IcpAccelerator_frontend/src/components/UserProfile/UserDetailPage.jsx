import React, { useEffect, useState } from "react";
import { locations, twitterSvg } from "../Utils/Data/SvgData";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import hub from "../../../assets/Logo/hub.png";
import openchat from "../../../../admin_frontend/assets/image/spinner.png";
import { useLocation } from "react-router-dom";
import { telegramSVg } from "../../../../admin_frontend/src/components/Utils/AdminData/SvgData";

function UserDetailPage() {
  const location = useLocation();
  const id = location.state;
  console.log("id", id);

  const actor = useSelector((currState) => currState.actors.actor);

  const [userProfileData, setUserProfileData] = useState([]);


  const fetchUserProfile = async (caller,userId) => {
    try {
      const result = await caller.get_user_information_using_uid(userId);
      console.log("result-in-fetch-user-profile", result);

      if (result?.Ok) {
        setUserProfileData(result.Ok);
      } else {
        console.error("No user data found:", result.Err);
      }
    } catch (error) {
      console.log("error-in-fetch-user-profile", error);
    }
  };

  useEffect(() => {
    if (actor) {
      fetchUserProfile(actor, id);
    } else {
      fetchUserProfile(IcpAccelerator_backend, id);
    }
  }, [actor,id]);


  if (!userProfileData) {
    return <div>Loading...</div>;
  }

  console.log('userProfileData',userProfileData);
    let mentorName = userProfileData?.full_name;
    let mentorprofile = userProfileData?.profile_picture ? uint8ArrayToBase64(
      userProfileData?.profile_picture[0]
    ):'';
    let mentorBio = userProfileData?.bio ? userProfileData?.bio[0]:'';
    let mentorLocation = userProfileData?.country;
    let areaOfExpertise = userProfileData?.area_of_interest;
    let mentorWebsite = userProfileData?.website;
    let openchat_username = userProfileData?.openchat_username;
    let twitter_id = userProfileData?.twitter_id;
    let telegram_id = userProfileData?.telegram_id;
    // let linkedinLink = userProfileData?.linkedin_link;
    let email = userProfileData?.email;
    let reason_to_join = userProfileData?.reason_to_join;
    // let preferred_icp_hub = userProfileData?.preferred_icp_hub;

  return (
    <>
    <div className="px-[4%] w-full bg-gray-100 overflow-y-scroll font-fontUse">
      <div className="border-[#DCDCDC] border-b p-5 pb-4 rounded-2xl">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div
              className="relative p-1 bg-blend-overlay w-[85px] rounded-full bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: `url(${mentorprofile}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                backdropFilter: "blur(20px)",
              }}
            >
              {" "}
              <img
                className="rounded-full object-cover w-20 h-20"
                src={mentorprofile}
                alt=""
              />
            </div>
            {/* <div className="text-[15px] leading-4 flex items-center bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 ml-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.87358 1.72209L7.75349 3.49644C7.87347 3.74343 8.19344 3.98035 8.46341 4.02572L10.0582 4.29288C11.0781 4.46426 11.3181 5.2103 10.5832 5.94625L9.34331 7.19636C9.13333 7.40807 9.01835 7.81637 9.08334 8.10873L9.4383 9.65625C9.71827 10.8812 9.07334 11.355 7.99846 10.7148L6.50362 9.82259C6.23365 9.66129 5.7887 9.66129 5.51373 9.82259L4.0189 10.7148C2.94902 11.355 2.29909 10.8761 2.57906 9.65625L2.93402 8.10873C2.99901 7.81637 2.88402 7.40807 2.67405 7.19636L1.43418 5.94625C0.704266 5.2103 0.93924 4.46426 1.95913 4.29288L3.55395 4.02572C3.81892 3.98035 4.13889 3.74343 4.25887 3.49644L5.13878 1.72209C5.61872 0.759304 6.39864 0.759304 6.87358 1.72209Z"
                  stroke="#7283EA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Top mentor</span>
            </div> */}
          </div>
          {email && email !== "" && (
            <div>
              <a
                className="bg-transparent border border-[#3505B2] text-[#3505B2] text-sm font-[950] px-2 py-1 rounded-md"
                href={"mailto:" + email}
              >
                Get in touch
              </a>
            </div>
          )}
        </div>
        <div className="md:flex block w-full md:w-[60%]">
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-[950] pt-3">{mentorName}</h3>

            <div className="flex">
              {/* {linkedinLink && (
                <div className="flex items-center my-2">
                  <a
                    href={linkedinLink}
                    target="_blank"
                    className="hover:text-blue-600"
                  >
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="15"
                      height="15"
                      fill="currentColor"
                    >
                      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                    </svg>
                  </a>
                </div>
              )} */}
              {twitter_id && (
                <div className="flex items-center my-2">
                  <a
                    href={twitter_id}
                    target="_blank"
                    className="hover:text-blue-600 ml-2"
                  >
                    {twitterSvg}
                  </a>
                </div>
              )}
              {telegram_id && (
                <div className="flex items-center my-2">
                  <a
                    href={telegram_id}
                    target="_blank"
                    className="hover:text-blue-600 ml-2"
                  >
                    {telegramSVg}
                  </a>
                </div>
              )}
              {mentorWebsite && mentorWebsite[0] && mentorWebsite[0] !== "" && (
                <div className="flex items-center my-2">
                  <a
                    href={mentorWebsite}
                    target="_blank"
                    className="hover:text-blue-600 ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="15"
                      height="15"
                      fill="currentColor"
                    >
                      <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
            <div className="text-[#737373] text-xs my-4 grid sm:grid-cols-2">
          <div className="sm:col">
            <div className="flex items-center my-2">
              {locations}
              <h6 className="undeline ml-2">{mentorLocation}</h6>
            </div>
            <div className="flex items-center my-2">
              <img src={openchat} alt="openchat" className="w-4 h-4" />
              <h6 className="ml-2">openchat username {openchat_username}</h6>
            </div>
            {/* <div className="flex items-center my-2">
              <img src={hub} alt="hubimage" className="w-4 h-4" />
              <h6 className="ml-2"> {preferred_icp_hub}</h6>
            </div> */}
            </div>
            </div>
            {reason_to_join && reason_to_join[0].length > 0 && (
          <div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
            <h4 className="text-xl font-[950]">Looking for</h4>
            <div className="text-[15px] leading-4 flex items-center flex-wrap pt-2 gap-2">
              {reason_to_join[0].map((item, index) => {
                // console.log('item', item)
                return (
                  <span
                    key={index}
                    className="capitalize bg-[#E7E7E8] flex font-bold items-center leading-none mt-2 px-3 py-2 rounded-full text-gray-600 text-sm"
                  >
                    {item.trim().replace(/_/g, " ")}
                  </span>
                );
              })}
            </div>
          </div>
        )}
            {mentorBio && (
          <div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
            <h4 className="text-xl font-[950] capitalize">
              About {mentorName}
            </h4>
            <div className="text-[#737373] text-[15px] leading-4 pt-2">
              <p
                className="sm:line-clamp-none"
                style={{ lineHeight: "normal" }}
              >
                {mentorBio}
              </p>
            </div>
          </div>
        )}
            <div className="flex flex-wrap gap-2">
              {areaOfExpertise?.split(',').map((item, index) => {
                return (<span key={index} className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                  {item.trim()}
                </span>)
              })}

            </div>
          </div>
          {/* <div className="flex flex-row gap-4 items-center md:w-1/2 w-full">
            <h6 className="text-[15px] font-[450]">Area of interest : </h6>
            <div className="text-[15px] leading-4 flex items-center ">
              <span className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline">
                {areaOfExpertise}
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
   </>
  );
}

export default UserDetailPage;