import React, { useEffect, useState } from "react";
import { checktab, location, star, star2 } from "../Utils/Data/SvgData";
import MentorCard from "./MentorCard";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";

const MentorsProfile = () => {
  let { id } = useParams();
  console.log("id", id)

  const actor = useSelector((currState) => currState.actors.actor);

  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const [mentorProfileData, setMentorProfileData] = useState([]);

  const fetchMentorProfile = async (caller) => {
    await caller
      .get_mentor_by_principal(Principal.fromText(id))
      .then((result) => {
        console.log("result-in-fetch-mentor-profile", result);
        setMentorProfileData(result[0]);
      })
      .catch((error) => {
        console.log("error-in-fetch-mentor-profile", error);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchMentorProfile(actor);
    } else {
      fetchMentorProfile(IcpAccelerator_backend);
    }
  }, [actor]);

  console.log(mentorProfileData);
  let mentorName = mentorProfileData?.user_data?.full_name;
  let mentorprofile = uint8ArrayToBase64(
    mentorProfileData?.user_data?.profile_picture[0]
  );
  let mentorBio = mentorProfileData?.user_data?.bio[0];
  let mentorLocation = mentorProfileData?.user_data?.country;
  let categoryOfMentoringService =
    mentorProfileData?.category_of_mentoring_service;
  let areaOfExpertise = mentorProfileData?.user_data?.area_of_interest;
  let icpHubOrSpoke = mentorProfileData?.icp_hub_or_spoke;
  let hubOwner = mentorProfileData?.hub_owner;
  let mentorWebsite = mentorProfileData?.website;
  let linkedinLink = mentorProfileData?.linkedin_link;
  let existingIcpProjectPorfolio =
    mentorProfileData?.existing_icp_project_porfolio;
  let yearsOfMentoring = mentorProfileData?.years_of_mentoring;
  let openchat_username = mentorProfileData?.user_data?.openchat_username;
  let twitter_id = mentorProfileData?.user_data?.twitter_id;
  let telegram_id = mentorProfileData?.user_data?.telegram_id;
  let email = mentorProfileData?.user_data?.email[0];
  let reason_to_join = mentorProfileData?.user_data?.reason_to_join;
  let reason_for_joining = mentorProfileData?.reason_for_joining;
  let multiChain = mentorProfileData?.multichain;
  // let multiChain = ['Bitcoin,Ethereum'];
  // let reason_for_joining = ['Bitcoin,Ethereum'];


  return (
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
          {email && email !== '' &&
            (<div>
              <a className="bg-transparent border border-[#3505B2] text-[#3505B2] text-sm font-[950] px-2 py-1 rounded-md" href={"mailto:" + email}>
                Get in touch
              </a>
            </div>)}
        </div>
        <div className="md:flex block w-full md:w-[60%]">
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-[950] pt-3">{mentorName}</h3>
            <div>
              <p className="text-[#737373] pt-2">{categoryOfMentoringService}</p>
            </div>
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
        <div className="text-[#737373] text-xs my-4 grid grid-cols-2">
          <div className="col">
            <div className="flex items-center my-2">
              {location}
              <h6 className="undeline ml-2">{mentorLocation}</h6>
            </div>
            {icpHubOrSpoke === true ? (
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
                <h6 className="ml-2">Spoke for {hubOwner}</h6>
              </div>
            ) : (
              ""
            )}
            {mentorWebsite && mentorWebsite[0] && mentorWebsite[0] !== '' && (<div className="flex items-center my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
              </svg>
              <a href={mentorWebsite} target="_blank" className="hover:text-blue-600 ml-2">{mentorWebsite}</a>
            </div>)}
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
            <div className="flex items-center my-2">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2L18 4M6 2L6 4"
                  stroke="#2A353D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3L12.95 3C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432L21.5 12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22L11.05 22C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568L2.5 12.2432Z"
                  stroke="#2A353D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 8L21 8"
                  stroke="#2A353D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h6 className="ml-2">{yearsOfMentoring} Years of Experience</h6>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <div className="w-full md:w-1/2">
          <h6 className="text-[15px] font-[450]">Skills</h6>
          <div className="text-[15px] leading-4 flex items-center ">
            <span className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline">
              {areaOfExpertise}
            </span>
          </div>
        </div> */}
        {/* {areaOfExpertise && (<div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">Area of expertise</h4>
          <div className="text-[#737373] text-[15px] leading-4">
            <p className="line-clamp-2 sm:line-clamp-none">{areaOfExpertise}</p> */}
        {/* <p>
              he is also a speaker in many global events such as conf42,
              chaosCarnival, Devoxx france ...
            </p> */}
        {/* <p className="text-[#000] underline">Read more</p> */}
        {/* </div>
        </div>)} */}
        {mentorBio && (<div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
          <h4 className="text-xl font-[950] capitalize">About {mentorName}</h4>
          <div className="text-[#737373] text-[15px] leading-4 pt-2">
            <p className="sm:line-clamp-none" style={{ lineHeight: 'normal' }}>{mentorBio}</p>
            {/* <p>
              he is also a speaker in many global events such as conf42,
              chaosCarnival, Devoxx france ...
            </p> */}
            {/* <p className="text-[#000] underline">Read more</p> */}
          </div>
        </div>)}

        {multiChain && multiChain[0] && multiChain[0].trim() !== "" &&
          (<div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
            <h4 className="text-xl font-[950]">Ecosystems {mentorName?.split(' ')[0]} has worked with</h4>
            <div className="text-[15px] leading-4 flex items-center flex-wrap pt-2 gap-2">
              {multiChain[0].split(',').map((item, index) => {
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
              {reason_to_join[0][0]?.split(',').map((item, index) => {
                // console.log('item', item)
                return (<span key={index} className="capitalize bg-[#E7E7E8] flex font-bold items-center leading-none mt-2 px-3 py-2 rounded-full text-gray-600 text-sm">
                  {item.trim().replace(/_/g, " ")}
                </span>)
              })}

            </div>
          </div>)}
        {id === 'nq6zx-w3cl3-cwulr-uejdh-hw4u4-qvmgx-4hryz-zqkyq-dnl7a-dovtu-sqe' && <div className="border-b border-[#DCDCDC] my-5 pb-12 p-5">
          <h4 className="text-xl font-[950]">What projects say about {mentorName?.split(' ')[0]}</h4>
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
                        <p>Gratitude for Visionary Mentorship</p>
                        <p className="line-clamp-2 sm:line-clamp-none">
                          Under your guidance, our project not only navigated through challenging waters but thrived, exceeding our most ambitious expectations. Your unwavering support, insightful feedback, and the strategic direction you provided were instrumental in our success. Thank you for believing in us and our vision, and for steering us towards excellence. Your mentorship has left an indelible mark on both our project and our personal growth.
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
        {/* <button className="border-[#3505B2] border text-[#3505B2] py-[7px] rounded-md px-[9px] text-xs font-[950]">
            Load more
          </button> */}

        {/* <div className="border-b border-[#DCDCDC] pb-4">
          <h4 className="text-xl font-[950]">Skills</h4>
          <div className="text-[15px] leading-4 flex items-center flex-wrap">
            <span className="bg-gradient-to-r from-[#B5B5B54D] to-[#B8B8B84D] w-fit rounded-2xl py-1 px-2 underline my-1 ml-2">
              {areaOfExpertise}
            </span>
          </div>
        </div> */}
        {/* <div className="my-8">
          <h4 className="text-xl font-[950]">Similar mentors</h4>
          <MentorCard />
          <MentorCard />
        </div> */}
      </div>
    </div >
  );
};

export default MentorsProfile;
