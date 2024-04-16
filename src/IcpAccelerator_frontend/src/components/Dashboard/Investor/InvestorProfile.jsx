import React, { useEffect, useState } from "react";
import { checktab, location, star, star2 } from "../../Utils/Data/SvgData";
// import MentorCard from "./MentorCard";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";

const InvestorProfile = () => {
  let { id } = useParams();

  const actor = useSelector((currState) => currState.actors.actor);

  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const [investorProfileData, setInvestorProfileData] = useState([]);

  const fetchInvestorProfile = async (caller) => {
    await caller
      .get_vc_info_by_principal(Principal.fromText(id))
      .then((result) => {
        console.log("result-in-fetch-investor-profile", result);
        setInvestorProfileData(result[0][1]?.profile?.params);
      })
      .catch((error) => {
        console.log("error-in-fetch-investor-profile", error);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchInvestorProfile(actor);
    } else {
      fetchInvestorProfile(IcpAccelerator_backend);
    }
  }, [actor]);

  console.log(investorProfileData);
  let investorName = investorProfileData?.user_data?.full_name;
  let investorprofile = uint8ArrayToBase64(
    investorProfileData?.user_data?.profile_picture[0]
  );
  let investorBio = investorProfileData?.user_data?.bio[0];
  let investorLocation = investorProfileData?.user_data?.country;
  let announcementDetails = investorProfileData?.announcement_details;
  let categoryOfInvestment = investorProfileData?.category_of_investment;
  let investorWebsite = investorProfileData?.website_link;
  let linkedinLink = investorProfileData?.linkedin_link;
  let existingIcpInvestor = investorProfileData?.existing_icp_investor;
  let existingIcpProjectPorfolio = investorProfileData?.existing_icp_portfolio;
  let typeOfInvestment = investorProfileData?.type_of_investment;
  let projectOnMultichain = investorProfileData?.project_on_multichain && investorProfileData?.project_on_multichain.length > 0 && investorProfileData?.project_on_multichain[0] && investorProfileData?.project_on_multichain[0].trim() !== "" ? investorProfileData?.project_on_multichain[0].trim() : null;
  let fundSize = investorProfileData?.fund_size
  let averageCheckSize = investorProfileData?.average_check_size
  let moneyInvested = investorProfileData?.money_invested && investorProfileData?.money_invested.length > 0 && typeof investorProfileData?.money_invested[0] === "number" ? investorProfileData?.money_invested[0] : null
  let nameOfFund = investorProfileData?.name_of_fund
  let openchat_username = investorProfileData?.user_data?.openchat_username;
  let twitter_id = investorProfileData?.user_data?.twitter_id;
  let telegram_id = investorProfileData?.user_data?.telegram_id;
  let email = investorProfileData?.user_data?.email[0];
  let reason_to_join = investorProfileData?.user_data?.reason_to_join;
  let range_of_check_size = investorProfileData?.range_of_check_size
  let stage = investorProfileData?.stage
  let preferred_icp_hub = investorProfileData?.preferred_icp_hub



  // let reason_to_join = investorProfileData?.reason_to_join;
  // let multiChain = investorProfileData?.multichain;

  return (
    <div className="px-[4%] w-full bg-gray-100 overflow-y-scroll font-fontUse">
      <div className="border-[#DCDCDC] border-b p-5 pb-4 rounded-2xl">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div
              className="relative p-1 bg-blend-overlay w-[85px] rounded-full bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: `url(${investorprofile}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                backdropFilter: "blur(20px)",
              }}
            >
              {" "}
              <img
                className="rounded-full object-cover w-20 h-20"
                src={investorprofile}
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
              <span>Top Investor</span>
            </div> */}
          </div>
          {email && email !== '' &&
            (<div>
              <a className="bg-transparent border border-[#3505B2] text-[#3505B2] text-sm font-[950] px-2 py-1 rounded-md" href={"mailto:" + email}>
                Get in touch
              </a>
            </div>)}
        </div>
        <div className="md:flex block w-full md:w-[60%]">
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-[950] pt-3">{investorName}</h3>
            <div>
              <p className="text-[#737373] pt-2">{nameOfFund}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryOfInvestment?.split(',').map((item, index) => {
                return (<span key={index} className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                  {item.trim()}
                </span>)
              })}

            </div>
          </div>
          {/* <div className="flex flex-row gap-4 items-center md:w-1/2 w-full">
            <h6 className="text-[15px] font-[450]">Category of Investment : </h6>
            <div className="text-[15px] leading-4 flex items-center ">
              {categoryOfInvestment?.split(',').map((item, index) => {
                return (
                  <span key={index} className="bg-gradient-to-r mr-2 from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline ">
                    {item.trim()}
                  </span>
                )
              })}
              
            </div>
          </div> */}
        </div>
        <div className="text-[#737373] text-xs my-4 grid grid-cols-2">
          <div className="col">
            <div className="flex items-center my-2">
              {location}
              <h6 className="undeline ml-2">
                <span className="font-bold">Location:</span>
                <span className="ml-2">{investorLocation}</span>
              </h6>
            </div>
            {announcementDetails && announcementDetails[0] && announcementDetails[0] !== '' && (
              <div className="flex items-center my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="15"
                  height="15"
                  fill="currentColor"
                >
                  <path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                </svg>
                <h6 className="ml-2">
                  <span className="font-bold">Announcement Details:</span>
                  <span className="ml-2">{announcementDetails}</span>
                </h6>
              </div>
            )}
            {preferred_icp_hub && preferred_icp_hub !== '' && (
              <div className="flex items-center my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="15"
                  height="15"
                  fill="currentColor"
                >
                  <path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                </svg>
                <h6 className="ml-2">
                  {/* <span className="font-bold">Announcement Details:</span> */}
                  <span className="">{preferred_icp_hub}</span>
                </h6>
              </div>
            )}


            {/* <div className="flex items-center m-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="15"
                height="15"
                fill="currentColor"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm48 160H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zM96 336c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16zM376 160h80c13.3 0 24 10.7 24 24v48c0 13.3-10.7 24-24 24H376c-13.3 0-24-10.7-24-24V184c0-13.3 10.7-24 24-24z" /></svg>
              <h6 className="ml-2"> <span className="font-bold">Average Check Size:</span>
                <span className="ml-2">$ {averageCheckSize}</span></h6>
            </div> */}
            <div className="flex items-center my-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="15"
                height="15"
                fill="currentColor"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm48 160H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zM96 336c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16zM376 160h80c13.3 0 24 10.7 24 24v48c0 13.3-10.7 24-24 24H376c-13.3 0-24-10.7-24-24V184c0-13.3 10.7-24 24-24z" /></svg>
              <h6 className="ml-2"> <span className="font-bold">Range of check size:</span>
                <span className="ml-2">{range_of_check_size}</span></h6>
            </div>
          </div>
          <div className="col">
            {linkedinLink && (<div className="flex items-center my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
              </svg>
              <a href={linkedinLink} target="_blank" className="hover:text-blue-600 ml-2">{linkedinLink}</a>
            </div>)}
            {investorWebsite && investorWebsite[0] && investorWebsite[0] !== '' && (<div className="flex items-center my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
              </svg>
              <a href={investorWebsite} target="_blank" className="hover:text-blue-600 ml-2">{investorWebsite}</a>
            </div>)}
            {existingIcpProjectPorfolio && existingIcpProjectPorfolio[0] && existingIcpProjectPorfolio[0].trim() !== "" && (
              <div className="flex items-center my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="15"
                  height="15"
                  fill="currentColor"
                >
                  <path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                </svg>
                <h6 className="ml-2" title="Existing Icp Project Porfolio">
                  <span className="font-bold">
                    Existing Icp Project Porfolio:
                  </span>
                  <span className="ml-2">{existingIcpProjectPorfolio}</span>
                </h6>
              </div>)}
            {/* <div className="flex items-center my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z" />
              </svg>
              <h6 className="ml-2"><span className="font-bold">
                Fund Size:
              </span>
                <span className="ml-2">${fundSize} Million</span></h6>
            </div> */}
            {/* {moneyInvested && (<div className="flex items-center m-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z" />
              </svg>
              <h6 className="ml-2"><span className="font-bold">
                Money Invested:
              </span>
                <span className="ml-2">$ {moneyInvested}</span>
                </h6>
            </div>)} */}
          </div>
        </div>
        {/* {typeOfInvestment && (<div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">Type of Investment</h4>
          <div className="text-[15px] leading-4 flex items-center flex-wrap">
            <span className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              {typeOfInvestment}
            </span>
          </div>
        </div>)} */}

        {/* {projectOnMultichain && (<div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">Multi-Chain</h4>
          <div className="text-[15px] leading-4 flex items-center flex-wrap">
            <span className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              {projectOnMultichain}
            </span>
          </div>
        </div>)} */}
      </div>
      <div>
        {/* <div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">Category of Investment</h4>
          <div className="text-[15px] leading-4 flex items-center flex-wrap">
            <span className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              {categoryOfInvestment}
            </span>
          </div>
        </div> */}
        {investorBio && (<div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
          <h4 className="text-xl font-[950] capitalize">About {investorName}</h4>
          <div className="text-[#737373] text-[15px] leading-4 pt-2">
            <p className="sm:line-clamp-none" style={{ lineHeight: 'normal' }}>{investorBio}</p>
            {/* <p>
              he is also a speaker in many global events such as conf42,
              chaosCarnival, Devoxx france ...
            </p> */}
            {/* <p className="text-[#000] underline">Read more</p> */}
          </div>
        </div>)}
        {typeOfInvestment && typeOfInvestment !== '' &&
          (<div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
            <h4 className="text-xl font-[950]">Types of Investments preferred</h4>
            <div className="text-[15px] leading-4 flex items-center flex-wrap pt-2 gap-2">
              {typeOfInvestment.split(',').map((item, index) => {
                // console.log('item', item)
                return (<span key={index} className="bg-[#E7E7E8] flex font-bold items-center leading-none mt-2 px-3 py-2 rounded-full text-gray-600 text-sm">
                  {item.trim()}
                </span>)
              })}

            </div>
          </div>)}
        {stage && stage[0] && stage[0].trim() !== "" &&
          (<div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
            <h4 className="text-xl font-[950]">Stages of Investment preferred</h4>
            <div className="text-[15px] leading-4 flex items-center flex-wrap pt-2 gap-2">
              {stage[0].split(',').map((item, index) => {
                // console.log('item', item)
                return (<span key={index} className="bg-[#E7E7E8] flex font-bold items-center leading-none mt-2 px-3 py-2 rounded-full text-gray-600 text-sm capitalize">
                  {item.trim()}
                </span>)
              })}

            </div>
          </div>)}
        {projectOnMultichain && projectOnMultichain[0] && projectOnMultichain[0].trim() !== "" &&
          (<div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
            <h4 className="text-xl font-[950]">Ecosystems {investorName?.split(' ')[0]} has worked with</h4>
            <div className="text-[15px] leading-4 flex items-center flex-wrap pt-2 gap-2">
              {projectOnMultichain[0].split(',').map((item, index) => {
                // console.log('item', item)
                return (<span key={index} className="bg-[#E7E7E8] flex font-bold items-center leading-none mt-2 px-3 py-2 rounded-full text-gray-600 text-sm">
                  {item.trim()}
                </span>)
              })}

            </div>
          </div>)}
        {reason_to_join && reason_to_join[0].length > 0 &&
          (<div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
            <h4 className="text-xl font-[950]">Looking for</h4>
            <div className="text-[15px] leading-4 flex items-center flex-wrap pt-2 gap-2">
              {reason_to_join[0].map((item, index) => {
                // console.log('item', item)
                return (<span key={index} className="capitalize bg-[#E7E7E8] flex font-bold items-center leading-none mt-2 px-3 py-2 rounded-full text-gray-600 text-sm">
                  {item.trim().replace(/_/g, " ")}
                </span>)
              })}

            </div>
          </div>)}
        {id === 'hqgvf-ullh5-p3g44-mdyfg-tjtex-fsly6-weeud-d7qku-wafhg-rw6xp-7ae' && <div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
          <h4 className="text-xl font-[950]">What projects say about {investorName?.split(' ')[0]}</h4>
          <div className="space-y-4">
            <div className="flex relative -left-5 -top-2">
              <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                <div className="space-y-4 ">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      {/* <img
                        className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                        src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                        alt=""
                      /> */}
                    </div>
                    <div className="flex-1 px-1 py-2 sm:px-2 sm:py-4 leading-relaxed text-[#737373] text-base">
                      <span className="font-bold underline">
                        Rent Space{" "}
                        <span className="font-normal">@rentspace</span>
                      </span>
                      <div className="text-sm sm:text-base text-black">
                        <p>A Testimonial to Our Esteemed Investor</p>
                        <p className="line-clamp-2 sm:line-clamp-none">
                          We are deeply grateful for your investment and the faith you've placed in our project. Your support has been a cornerstone of our journey, enabling us to transform our vision into a tangible reality. Thank you for being more than an investor; thank you for being a partner in our quest for innovation and impact. Your contribution has been pivotal to our progress and success.
                        </p>
                        {/* <p>
                          Upvote(21) Share{" "}
                          <span className="underline">Dec 22</span>
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex relative -left-5 -top-2">
              <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                <div className="space-y-4 ">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                        src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 px-1 py-2 sm:px-2 sm:py-4 leading-relaxed text-[#737373] text-base">
                      <span className="font-bold underline">
                        Farid Sukurov{" "}
                        <span className="font-normal">@farid_sukurov</span>
                      </span>
                      <div className="text-sm sm:text-base text-black">
                        <p>Hey guys, I am one of the makers!</p>
                        <p className="line-clamp-2 sm:line-clamp-none">
                          We have been working hard on Beep and actually have
                          done testing to make sure 4x faster is a real number
                          and not a lie. We have analyzed people doing reviews
                          with Beep and without Beep and it is actually 3-4x
                          faster on average. Would be happy to hear your
                          feedback!
                        </p>
                        <p>Upvote(21) Share Dec 22</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>}
        {/* <div className="border-b border-[#DCDCDC] pb-4"> */}
        {/* <h4 className="text-xl font-[950]">What mentees say</h4> */}
        {/* <div className="space-y-4">
            <div className="flex relative -left-5 -top-2">
              <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                <div className="space-y-4 ">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                        src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 px-1 py-2 sm:px-2 sm:py-4 leading-relaxed text-[#737373] text-base">
                      <span className="font-bold underline">
                        Farid Sukurov{" "}
                        <span className="font-normal">@farid_sukurov</span>
                      </span>
                      <div className="text-sm sm:text-base text-black">
                        <p>Hey guys, I am one of the makers!</p>
                        <p className="line-clamp-2 sm:line-clamp-none">
                          We have been working hard on Beep and actually have
                          done testing to make sure 4x faster is a real number
                          and not a lie. We have analyzed people doing reviews
                          with Beep and without Beep and it is actually 3-4x
                          faster on average. Would be happy to hear your
                          feedback! :)
                        </p>
                        <p>
                          Upvote(21) Share{" "}
                          <span className="underline">Dec 22</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex relative -left-5 -top-2">
              <div className="flex-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                <div className="space-y-4 ">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                        src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 px-1 py-2 sm:px-2 sm:py-4 leading-relaxed text-[#737373] text-base">
                      <span className="font-bold underline">
                        Farid Sukurov{" "}
                        <span className="font-normal">@farid_sukurov</span>
                      </span>
                      <div className="text-sm sm:text-base text-black">
                        <p>Hey guys, I am one of the makers!</p>
                        <p className="line-clamp-2 sm:line-clamp-none">
                          We have been working hard on Beep and actually have
                          done testing to make sure 4x faster is a real number
                          and not a lie. We have analyzed people doing reviews
                          with Beep and without Beep and it is actually 3-4x
                          faster on average. Would be happy to hear your
                          feedback! :)
                        </p>
                        <p>Upvote(21) Share Dec 22</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="border-[#3505B2] border text-[#3505B2] py-[7px] rounded-md px-[9px] text-xs font-[950]">
            Load more
          </button> */}
        {/* </div> */}

        {/* <div className="my-8">
          <h4 className="text-xl font-[950]">Similar mentors</h4>
          <MentorCard />
          <MentorCard />
        </div> */}
      </div>
    </div>
  );
};

export default InvestorProfile;
