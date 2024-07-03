import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  place,
  telegramSVg,
  noDataPresentSvg,
  place1,
  websiteSvg,
  linkSvg,
} from "../../Utils/AdminData/SvgData";
import {
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import openchat_username from "../../../../assets/image/spinner.png";
import { linkedInSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

const UpdateInvestorProfile = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [orignalData, setOrignalData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isReasonToJoinOpen, setIsReasonToJoinOpen] = useState(false);
  const [principal, setPrincipal] =useState(null)

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateStatus =location.state

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        let data = await actor.vc_profile_edit_awaiting_approval();
        console.log("Received data in investor update:", data);

        const originalInfo = data[0][1].original_info[0];
        const updatedInfo = data[0][1].updated_info[0];
        const approveAt = data[0][1].approved_at
        const rejectAt = data[0][1].rejected_at
        const sentAt = data[0][1].sent_at
        const principalId = data[0][0]
         
        setPrincipal(principalId)
        // const Allrole = {
        //   approved_on: [formatDateFromBigInt(data[0][1].approved_at)],
        //   name: "project",
        //   rejected_at: [formatDateFromBigInt(data[0][1].rejected_at)],
        //   requested_on: [formatDateFromBigInt(data[0][1].sent_at)],
        //   status: "approved"
        // };
        // console.log("Original Info:", originalInfo);
        // console.log("updated Info:", updatedInfo);

        if (
          data &&
          data.length > 0 &&
          data[0].length > 1 &&
          data[0][1].original_info
        ) {
          setOrignalData({
            announcementDetails: originalInfo?.announcement_details?.[0],
            assetsUnderManagement: originalInfo?.assets_under_management?.[0],
            averageCheckSize: originalInfo?.average_check_size,
            categoryOfInvestment: originalInfo?.category_of_investment,
            exisitngIcpInvestor: originalInfo?.existing_icp_investor,
            exisitngIcpPortfolio: originalInfo?.existing_icp_portfolio?.[0],
            preferredIcpHub: originalInfo?.preferred_icp_hub,
            fundSize: originalInfo?.fund_size?.[0],
            investorType: originalInfo?.investor_type?.[0],
            logo:
              originalInfo?.logo?.[0].length > 0
                ? uint8ArrayToBase64(originalInfo?.logo[0])
                : null,
            linkedIn: originalInfo?.linkedin_link,
            moneyInvested: originalInfo?.money_invested?.[0],
            nameOfFund: originalInfo?.name_of_fund,
            numberOfPortfolioCompanies:
              originalInfo?.number_of_portfolio_companies,
            portfolio: originalInfo?.portfolio_link,
            profilePicture:
              originalInfo?.user_data?.profile_picture?.[0].length > 0
                ? uint8ArrayToBase64(
                    originalInfo?.user_data?.profile_picture[0]
                  )
                : null,
            multichain: originalInfo?.project_on_multichain?.[0],
            checkSize: originalInfo?.range_of_check_size?.[0],
            reasonForJoining: originalInfo?.reason_for_joining?.[0],
            registered: originalInfo?.registered,
            registeredCountry: originalInfo?.registered_country?.[0],
            registeredUnderAnyHub: originalInfo?.registered_under_any_hub?.[0],
            stage: originalInfo?.stage?.[0],
            typeOfInvestment: originalInfo?.type_of_investment,
            website: originalInfo?.website_link?.[0],
            areaOfInterest: originalInfo?.user_data?.area_of_interest,
            bio: originalInfo?.user_data?.bio?.[0],
            country: originalInfo?.user_data?.country,
            email: originalInfo?.user_data?.email?.[0],
            fullName: originalInfo?.user_data?.full_name,
            openchatUsername: originalInfo?.user_data?.openchat_username?.[0],
            reasonToJoin: originalInfo?.user_data?.reason_to_join?.[0],
            telegram: originalInfo?.user_data?.telegram_id?.[0],
            twitter: originalInfo?.user_data?.twitter_id?.[0],
            typeOfProfile: originalInfo?.user_data?.type_of_profile?.[0],
          });

          setUpdatedData({
            announcementDetails: updatedInfo?.announcement_details?.[0],
            assetsUnderManagement: updatedInfo?.assets_under_management?.[0],
            fundSize: updatedInfo?.fund_size?.[0],
            investorType: updatedInfo?.investor_type?.[0],
            logo:
              updatedInfo?.logo?.[0].length > 0
                ? uint8ArrayToBase64(updatedInfo?.logo[0])
                : null,
            averageCheckSize: updatedInfo?.average_check_size,
            categoryOfInvestment: updatedInfo?.category_of_investment,
            exisitngIcpInvestor: updatedInfo?.existing_icp_investor,
            exisitngIcpPortfolio: updatedInfo?.existing_icp_portfolio?.[0],
            reasonForJoining: updatedInfo?.reason_for_joining?.[0],
            typeOfInvestment: updatedInfo?.type_of_investment,
            typeOfProfile: updatedInfo?.user_data?.type_of_profile?.[0],

            preferredIcpHub: updatedInfo?.preferred_icp_hub,
            linkedIn: updatedInfo?.linkedin_link,
            moneyInvested: updatedInfo?.money_invested?.[0],
            nameOfFund: updatedInfo?.name_of_fund,
            numberOfPortfolioCompanies:
              updatedInfo?.number_of_portfolio_companies,
            portfolio: updatedInfo?.portfolio_link,
            profilePicture:
              updatedInfo?.user_data?.profile_picture?.[0].length > 0
                ? uint8ArrayToBase64(updatedInfo?.user_data?.profile_picture[0])
                : null,
            multichain: updatedInfo?.project_on_multichain?.[0],
            checkSize: updatedInfo?.range_of_check_size?.[0],
            registered: updatedInfo?.registered,
            registeredCountry: updatedInfo?.registered_country?.[0],
            registeredUnderAnyHub: updatedInfo?.registered_under_any_hub?.[0],
            stage: updatedInfo?.stage?.[0],
            website: updatedInfo?.website_link?.[0],
            areaOfInterest: updatedInfo?.user_data?.area_of_interest,
            bio: updatedInfo?.user_data?.bio?.[0],
            country: updatedInfo?.user_data?.country,
            email: updatedInfo?.user_data?.email?.[0],
            fullName: updatedInfo?.user_data?.full_name,
            openchatUsername: updatedInfo?.user_data?.openchat_username?.[0],
            reasonToJoin: updatedInfo?.user_data?.reason_to_join?.[0],
            telegram: updatedInfo?.user_data?.telegram_id?.[0],
            twitter: updatedInfo?.user_data?.twitter_id?.[0],
          });
        } else {
          console.error("Unexpected data structure:", data);
          setOrignalData({});
          setUpdatedData({});
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (actor) {
      fetchProjectData();
    }
  }, [actor]);

  const declineUserRoleHandler = async (
    principle,
    boolean
  ) => {
    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principle);

            await actor.decline_vc_profile_update_request(
              covertedPrincipal,
              boolean
            );
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsDeclining(false);
      window.location.reload();
    }
  };

  const allowUserRoleHandler = async ( principle,boolean) => {
    setIsAccepting(true);
    try {
       const covertedPrincipal = await Principal.fromText(principle);
            await actor.approve_vc_profile_update(
              covertedPrincipal,
              boolean
            );
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsAccepting(false);
      // window.location.reload();
    }
  };

  //   const date = numberToDate(Allrole[3].requested_on[0]);
 

  return (
    <>
      <div className="w-full flex flex-col px-[4%] py-[4%]">
        <div className="w-full flex gap-4 sxxs:flex-col sm:flex-row">
       

          <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg md:w-1/4 sxxs:w-full">
            <div className="justify-center flex items-center">
              <div
                className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                style={{
                  backgroundImage: `url(${orignalData?.profilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                  backdropFilter: "blur(20px)",
                }}
              >
                <img
                  className="object-cover size-44 max-h-44 rounded-full"
                  src={orignalData?.profilePicture}
                  alt=""
                />
              </div>
            </div>

            <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
              <div className="flex w-full flex-row justify-between gap-4 items-center">
                <div className="flex flex-row space-x-4 items-center">
                  <span className="inline-block w-1.5  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                  <h1 className="text-[19px] md:font-bold font-bold  bg-black text-transparent bg-clip-text">
                    {orignalData?.fullName}
                  </h1>
                </div>
                <div className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]">
                  {current.charAt(0).toUpperCase() + current.slice(1)}
                </div>
              </div>
              <div className="flex flex-row  gap-4 items-center">
                <span className="inline-block w-1.5  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                <h1 className="text-[19px] md:font-bold font-bold  bg-black text-transparent bg-clip-text">
                  {updatedData?.fullName}
                </h1>
              </div>
              {orignalData?.email && (
                <div className="text-gray-500 md:text-md text-sm items-center space-x-4 font-normal flex mb-2">
                  <span className="inline-block w-1.5  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="size-4 ml-2"
                    fill="currentColor"
                  >
                    <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                  </svg>
                  <span className="ml-2 truncate">{orignalData?.email}</span>
                </div>
              )}
              {updatedData?.email && (
                <div className="text-gray-500 md:text-md text-sm items-center space-x-4 font-normal flex mb-2">
                  <span className="inline-block w-1.5  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="size-4 ml-2"
                    fill="currentColor"
                  >
                    <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                  </svg>
                  <span className="ml-2 truncate">{updatedData?.email}</span>
                </div>
              )}
              <div className="flex flex-col items-start gap-3 text-sm">
                <div className="flex flex-row  items-center text-gray-600 space-x-3">
                  <span className="inline-block w-1.5  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                  {place1}
                  <p className="underline">{orignalData?.country}</p>
                </div>
                <div className="flex flex-row  items-center text-gray-600 space-x-3">
                  <span className="inline-block w-1.5  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                  {place1}
                  <p className="underline">{updatedData?.country}</p>
                </div>
                {/* <div className=" flex flex-row items-center space-x-3 text-gray-600">
                  <span className="inline-block w-1.5  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="size-4"
                    fill="currentColor"
                  >
                    <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                  </svg>
                  <p className="ml-2 truncate">
                    {Allrole[2]?.requested_on?.length > 0
                      ? date
                      : "No requested date"}
                  </p>
                </div>
                <div className=" flex flex-row items-center space-x-3 text-gray-600">
                  <span className="inline-block w-1.5  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="size-4"
                    fill="currentColor"
                  >
                    <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                  </svg>
                  <p className="ml-2 truncate">
                    {Allrole[2]?.requested_on?.length > 0
                      ? date
                      : "No requested date"}
                  </p>
                </div> */}

                {orignalData?.openchatUsername && (
                  <div className="flex flex-row space-x-3 items-center text-gray-600">
                    <span className="inline-block w-1.5  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    <img
                      src={openchat_username}
                      alt="openchat_username"
                      className="size-4"
                    />
                    <p className="ml-2">{orignalData?.openchatUsername}</p>
                  </div>
                )}
                {updatedData?.openchatUsername && (
                  <div className="flex flex-row space-x-3 items-center text-gray-600">
                    <span className="inline-block w-1.5  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    <img
                      src={openchat_username}
                      alt="openchat_username"
                      className="size-4"
                    />
                    <p className="ml-2">{updatedData?.openchatUsername}</p>
                  </div>
                )}

                <div className=" flex flex-col w-full text-gray-600">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-black font-semibold mb-1">Skill :</p>
                    <button
                      onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                      className="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {isSkillsOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        )}
                      </svg>
                    </button>
                  </div>

                  {isSkillsOpen && (
                    <div className="flex flex-col text-gray-600">
                      <div className="flex gap-2 text-xs flex-wrap overflow-y-scroll h-14 items-center">
                        <span className="inline-block w-1.5 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                        {orignalData?.areaOfInterest
                          .split(",")
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))}
                      </div>
                      <div className="flex gap-2 mt-2 text-xs flex-wrap overflow-y-scroll h-14 items-center">
                        <span className="inline-block w-1.5 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                        {updatedData?.areaOfInterest
                          .split(",")
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col w-full text-gray-600">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-black font-semibold mb-1">
                      Reason to join:
                    </p>
                    <button
                      onClick={() => setIsReasonToJoinOpen(!isReasonToJoinOpen)}
                      className="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {isReasonToJoinOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        )}
                      </svg>
                    </button>
                  </div>

                  {isReasonToJoinOpen && (
                    <div className="flex flex-col text-gray-600">
                      <div className="flex gap-2 text-xs flex-wrap items-center">
                        <span className="inline-block w-1.5 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                        {orignalData?.reasonToJoin.map((reason, index) => (
                          <p
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {reason.replace(/_/g, " ")}
                          </p>
                        ))}
                      </div>

                      <div className="flex gap-2 text-xs mt-2 flex-wrap items-center">
                        <span className="inline-block w-1.5 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                        {updatedData?.reasonToJoin.map((reason, index) => (
                          <p
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {reason.replace(/_/g, " ")}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-[74%] sxxs:w-full">
            <div className="flex w-full mb-4">
              {/* <Swiper
                modules={[Pagination, Autoplay]}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                spaceBetween={30}
                slidesPerView="auto"
                slidesOffsetAfter={100}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 1,
                  },
                }}
              >
                {Allrole &&
                  Allrole.length > 0 &&
                  Allrole.filter(
                    (role) =>
                      role.approved_on[0] ||
                      role.rejected_on[0] ||
                      role.requested_on[0]
                  ).map((role, index) => (
                    <SwiperSlide key={index}>
                      <div
                        key={index}
                        className="flex justify-around items-center w-full"
                      >
                        <button
                          className={`flex p-2 items-center w-full ${getButtonClass(
                            role.status
                          )} rounded-md `}
                        >
                          <div className="xl:lg:ml-4">{Profile2}</div>
                          <div className="flex justify-center items-center text-white p-2 text-sm ">
                            {constructMessage(role)}
                          </div>
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper> */}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">About Investor</h1>
            <div className="flex flex-row space-x-4 mt-4 justify-start items-start">
              <span className="inline-block w-1.5  md:ml-8 p-1 h-1.5 mt-2 bg-red-700 rounded-full"></span>
              <div className="text-gray-600 flex flex-row items-start md:text-sm text-xs break-all line-clamp-6">
                {orignalData?.bio ? (
                  orignalData?.bio
                ) : (
                  <p className="flex items-center">
                    {noDataPresentSvg}
                    <span className="ml-2">No Data</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row space-x-4 my-4 justify-start items-start">
              <span className="inline-block w-1.5 md:ml-8 p-1 h-1.5 mt-2 bg-green-700 rounded-full"></span>
              <div className="text-gray-600 flex flex-row items-start md:text-sm text-xs break-all line-clamp-6">
                {updatedData?.bio ? (
                  updatedData?.bio
                ) : (
                  <p className="flex items-center">
                    {noDataPresentSvg}
                    <span className="ml-2">No Data</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pl-[4%]">
              <p className="w-full mb-4 border border-[#C5C5C5]"></p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-3 text-sm w-full md:px-[4%]">
              <div className="flex flex-col md:w-1/2 w-full">
                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Telegram :
                  </h2>
                  <div className="flex flex-grow items-center mt-1.5 truncate">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                    {orignalData?.telegram ? (
                      <div
                        onClick={() => {
                          const telegramUsername = orignalData?.telegram;
                          if (telegramUsername) {
                            const telegramUrl = `https://t.me/${telegramUsername}`;
                            window.open(telegramUrl, "_blank");
                          }
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {telegramSVg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs md:text-sm truncate">
                      {orignalData?.telegram || "Not available"}
                    </p>
                  </div>
                  <div className="flex flex-grow items-center mt-1.5 truncate">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                    {updatedData?.telegram ? (
                      <div
                        onClick={() => {
                          const telegramUsername = updatedData?.telegram;
                          if (telegramUsername) {
                            const telegramUrl = `https://t.me/${telegramUsername}`;
                            window.open(telegramUrl, "_blank");
                          }
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {telegramSVg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs md:text-sm truncate">
                      {updatedData?.telegram || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Twitter :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                    {orignalData?.twitter ? (
                      <div
                        onClick={() => {
                          const url = orignalData?.twitter;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2 ml-0.5"
                      >
                        {twitterSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {orignalData?.twitter || "Not available"}
                    </p>
                  </div>

                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                    {updatedData?.twitter ? (
                      <div
                        onClick={() => {
                          const url = updatedData?.twitter;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2 ml-0.5"
                      >
                        {twitterSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {updatedData?.twitter || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Website :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5   p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                    {orignalData?.website ? (
                      <div
                        onClick={() => {
                          const url = orignalData?.website;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {websiteSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {orignalData?.website || "Not available"}
                    </p>
                  </div>

                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                    {updatedData?.website ? (
                      <div
                        onClick={() => {
                          const url = updatedData?.website;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {websiteSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {updatedData?.website || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:w-1/2 w-full">
                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    LinkedIn :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                    {orignalData?.linkedIn ? (
                      <div
                        onClick={() => {
                          const url = orignalData?.linkedIn;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {linkedInSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {orignalData?.linkedIn || "Not available"}
                    </p>
                  </div>

                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                    {updatedData?.linkedIn ? (
                      <div
                        onClick={() => {
                          const url = updatedData?.linkedIn;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {linkedInSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {updatedData?.linkedIn || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Portfoilo :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                    {orignalData?.portfolio ? (
                      <div
                        onClick={() => {
                          const url = orignalData?.portfolio;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {linkSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {orignalData?.portfolio || "Not available"}
                    </p>
                  </div>

                  <div className="flex flex-grow mt-1.5 truncate items-center">
                    <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                    {updatedData?.portfolio ? (
                      <div
                        onClick={() => {
                          const url = updatedData?.portfolio;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {linkSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {updatedData?.portfolio || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4 sxxs:flex-col sm:flex-row mt-4">
          <div className="flex flex-col  w-full   md:w-[26%] sxxs:w-full"></div>
          <div className="flex flex-row justify-between bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-3/4 sxxs:w-fulll">
            <ul className="grid grid-cols-2 gap-4 w-full px-[3%]">
              <li className="list-disc md:ml-4">
                {orignalData?.multichain && (
                  <p className="text-gray-800 font-semibold ">Multichain :</p>
                )}
                <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                    {orignalData?.multichain && orignalData.multichain !== "" ? (
                      orignalData.multichain
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                    {updatedData?.multichain && updatedData.multichain !== "" ? (
                      updatedData.multichain
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
              </li>

              <li className="list-disc md:ml-8">
                {orignalData?.categoryOfInvestment && (
                  <div className=" flex flex-col text-gray-600">
                    <p className="font-semibold mb-1 text-gray-800">
                      Area of Invest :
                    </p>
                    <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                    {orignalData?.categoryOfInvestment && orignalData.categoryOfInvestment !== "" ? (
                      orignalData.categoryOfInvestment
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                    {updatedData?.categoryOfInvestment && updatedData.categoryOfInvestment !== "" ? (
                      updatedData.categoryOfInvestment
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                  </div>
                )}
              </li>

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    At what stage of investment are you currently focusing on?
                  </p>
                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                    {orignalData?.stage && orignalData.stage !== "" ? (
                      orignalData.stage
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                    {updatedData?.stage && updatedData.stage !== "" ? (
                      updatedData.stage
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the typical range of check sizes for your
                    investments?
                  </h2>
                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                    {orignalData?.checkSize && orignalData.checkSize !== "" ? (
                      orignalData.checkSize
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                    {updatedData?.checkSize && updatedData.checkSize !== "" ? (
                      updatedData.checkSize
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Are you currently serving as an Existing ICP Investror?
                  </p>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.exisitngIcpInvestor ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {orignalData?.exisitngIcpInvestor ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.exisitngIcpInvestor ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {updatedData?.exisitngIcpInvestor ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the scope and status of the Existing ICP Project
                    Portfolio?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.exisitngIcpPortfolio ? (
                      <span>{orignalData?.exisitngIcpPortfolio}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.exisitngIcpPortfolio ? (
                      <span>{updatedData?.exisitngIcpPortfolio}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What are the preferred ICP hubs ?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.preferredIcpHub ? (
                      <span>{orignalData?.preferredIcpHub}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.preferredIcpHub ? (
                      <span>{updatedData?.preferredIcpHub}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Have you previously been involved with any ICP hubs ?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.registeredUnderAnyHub === true ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {orignalData?.registeredUnderAnyHub === true
                          ? "Yes"
                          : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.registeredUnderAnyHub === true ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {updatedData?.registeredUnderAnyHub === true
                          ? "Yes"
                          : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the average size of the checks issued or received?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.averageCheckSize ? (
                      <span>{orignalData?.averageCheckSize}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.averageCheckSize ? (
                      <span>{updatedData?.averageCheckSize}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    How much money have you invested?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.moneyInvested ? (
                      <span>{orignalData?.moneyInvested}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.moneyInvested ? (
                      <span>{updatedData?.moneyInvested}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Have you made any previous registrations?
                  </p>
                  <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.registered === true ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {orignalData?.registered === true ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.registered === true ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {updatedData?.registered === true ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    In which country are you registered?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {place}
                    {orignalData?.registeredCountry ? (
                      <span className="ml-2">
                        {orignalData?.registeredCountry}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs ml-2">
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {place}
                    {updatedData?.registeredCountry ? (
                      <span className="ml-2">
                        {updatedData?.registeredCountry}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    How many portfolio companies do you currently have?
                  </p>
                  <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.numberOfPortfolioCompanies ? (
                      <span>{orignalData?.numberOfPortfolioCompanies}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.numberOfPortfolioCompanies ? (
                      <span>{updatedData?.numberOfPortfolioCompanies}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the name of the fund you are referring to?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.nameOfFund ? (
                      <span>{orignalData?.nameOfFund}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.nameOfFund ? (
                      <span>{updatedData?.nameOfFund}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Announcement Details
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.announcementDetails ? (
                      <span>{orignalData?.announcementDetails}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.announcementDetails ? (
                      <span>{updatedData?.announcementDetails}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What are the Assets Under Management?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.assetsUnderManagement ? (
                      <span>{orignalData?.assetsUnderManagement}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.assetsUnderManagement ? (
                      <span>{updatedData?.assetsUnderManagement}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the size of fund?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.fundSize ? (
                      <span>{orignalData?.fundSize}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.fundSize ? (
                      <span>{updatedData?.fundSize}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What type of Investor you are ?
                  </h2>
                  <div className="flex gap-2 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                    {orignalData?.investorType && orignalData.investorType !== "" ? (
                      orignalData.investorType
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                    {updatedData?.investorType && updatedData.investorType !== "" ? (
                      updatedData.investorType
                        .split(",")
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Reason for joining platform ?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.reasonForJoining ? (
                      <span>{orignalData?.reasonForJoining}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.reasonForJoining ? (
                      <span>{updatedData?.reasonForJoining}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Which type of investment it is ?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.typeOfInvestment ? (
                      <span>{orignalData?.typeOfInvestment}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.typeOfInvestment ? (
                      <span>{updatedData?.typeOfInvestment}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Which type of profile it is ?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                    {orignalData?.typeOfProfile ? (
                      <span>{orignalData?.typeOfProfile}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                    <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                    {updatedData?.typeOfProfile ? (
                      <span>{updatedData?.typeOfProfile}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {updateStatus.selectionOption === "Pending"?
        <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() =>
                    declineUserRoleHandler(
                      updateStatus.principalId,
                      true,  
                    )
                  }
                  disabled={isDeclining}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#C60404] hover:bg-[#8b2a2a] rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  {isDeclining ? (
                    <ThreeDots color="#FFF" height={13} width={51} />
                  ) : (
                    "Decline"
                  )}
                </button>{" "}
                <button
                  onClick={() =>
                    allowUserRoleHandler(updateStatus.principalId, true)
                  }
                  disabled={isAccepting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#3505B2] hover:bg-[#482b90] rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  {isAccepting ? (
                    <ThreeDots color="#FFF" height={13} width={51} />
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>:""}
      </div>
    </>
  );
};

export default UpdateInvestorProfile;
