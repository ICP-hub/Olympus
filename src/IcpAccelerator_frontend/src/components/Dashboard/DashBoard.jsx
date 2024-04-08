import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCurrentRoleStatusFailureHandler,
  setCurrentActiveRole,
  setCurrentRoleStatus,
} from "../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import SpotLight from "./SpotLight";
import ImpactTool from "./ImpactTool";
import ProjectJobCard from "../Project/ProjectDetails/ProjectJobCard";
import ment from "../../../assets/images/ment.jpg";
import InvestorCard from "./InvestorCard";
import MentorCard from "./MentorCard";
import RegisterCard from "./RegisterCard";
import investor from "../../../assets/images/investors.png";
import mentor from "../../../assets/images/mentors.png";
import testimonial from "../../../assets/images/testimonial.png";
import Testimonial from "./Testimonial";
import ProjectDashboard from "./RoleDashboard/ProjectDashboard";
import MentorDashboard from "./RoleDashboard/MentorDashboard";
import InvestorDashboard from "./RoleDashboard/InvestorDashboard";
import AnnouncementCard from "./AnnouncementCard";
import LiveProjects from "./LiveProjects";
import { Banner } from "../Utils/Data/SvgData";
import LiveEventsCards from "./LiveEventsCards";

const DashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  function getNameOfCurrentStatus(rolesStatusArray) {
    const currentStatus = rolesStatusArray.find(
      (role) => role.status === "active"
    );
    return currentStatus ? currentStatus.name : null;
  }

  function formatFullDateFromBigInt(bigIntDate) {
    const date = new Date(Number(bigIntDate / 1000000n));
    const dateString = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${dateString}`;
  }

  function cloneArrayWithModifiedValues(arr) {
    return arr.map((obj) => {
      const modifiedObj = {};

      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          if (
            key === "approved_on" ||
            key === "rejected_on" ||
            key === "requested_on"
          ) {
            // const date = new Date(Number(obj[key][0])).toLocaleDateString('en-US');
            const date = formatFullDateFromBigInt(obj[key][0]);
            modifiedObj[key] = date; // Convert bigint to string date
          } else {
            modifiedObj[key] = obj[key][0]; // Keep the first element of other arrays unchanged
          }
        } else {
          modifiedObj[key] = obj[key]; // Keep other keys unchanged
        }
      });

      return modifiedObj;
    });
  }

  const initialApi = async () => {
    try {
      const currentRoleArray = await actor.get_role_status();
      if (currentRoleArray && currentRoleArray.length !== 0) {
        const currentActiveRole = getNameOfCurrentStatus(currentRoleArray);
        dispatch(
          setCurrentRoleStatus(cloneArrayWithModifiedValues(currentRoleArray))
        );
        dispatch(setCurrentActiveRole(currentActiveRole));
      } else {
        dispatch(
          getCurrentRoleStatusFailureHandler(
            "error-in-fetching-role-at-dashboard"
          )
        );
        dispatch(setCurrentActiveRole(null));
      }
    } catch (error) {
      dispatch(getCurrentRoleStatusFailureHandler(error.toString()));
      dispatch(setCurrentActiveRole(null));
    }
  };

  useEffect(() => {
    if (actor) {
      if (!userCurrentRoleStatus.length) {
        initialApi();
      } else if (
        userCurrentRoleStatus.length === 4 &&
        userCurrentRoleStatus[0]?.status === "default"
      ) {
        navigate("/create-user");
      } else {
      }
    }
  }, [actor, dispatch, userCurrentRoleStatus, userCurrentRoleStatusActiveRole]);

  const investorCategories = [
    {
      id: "registerInvestor",
      title: "Register as an Investor",
      description: "Discover innovative projects to invest in.",
      buttonText: "Register Now",
      imgSrc: investor,
    },
  ];

  const mentorCategories = [
    {
      id: "registerMentor",
      title: "Register as a Mentor",
      description: "Join our community as a mentor to guide projects.",
      buttonText: "Register Now",
      imgSrc: mentor,
    },
  ];

  const testimonialCategories = [
    {
      id: "addTestimonial",
      title: "Add your testimonial",
      description: "Share your experience and insights with our community.",
      buttonText: "Add Now",
      imgSrc: testimonial,
    },
  ];

  switch (userCurrentRoleStatusActiveRole) {
    case "project":
      return <ProjectDashboard />;
    case "mentor":
      return <MentorDashboard />;
    case "vc":
      return <InvestorDashboard />;
    default:
      return (
        <>
          <section
            className="flex items-center w-full pl-[9%] pr-[9%] py-[2%] max-h-screen"
            style={{
              background: " linear-gradient(63deg, #3B00B9 0%, #D38ED7 100%)",
            }}
          >
            <div className="container mx-auto">
              <div className="flex flex-wrap">
                <div className="flex flex-col justify-center md:w-1/2 sm:px-4 w-full">
                  <h1 className="text-4xl font-bold mb-4 lg:text-7xl text-white font-fontUse">
                    OLYMPUS
                  </h1>
                  <h1 className="text-3xl font-bold mb-4 text-white font-fontUse">
                    Peak of Web3 Acceleration
                  </h1>
                  <p className="text-lg mb-6 md:text-xl lg:text-2xl text-white font-fontUse">
                    Web3 Acceleration Platform for Founders, Investors
                    , Mentors, Talent and Users
                  </p>
                  <a
                    className="mt-6 mb-6 text-white font-fontUse hover:text-black"
                    href="https://internetcomputer.org/olympus"
                  >
                    Learn more about the beta version.<br></br> Use with
                    caution.
                  </a>
                </div>
                <div className="w-full px-4 md:w-1/2 md:flex hidden">
                  {/* <img
                    className="object-contain h-fit w-fit absolute z-10 top-0"
                    src={Banner}
                    alt="Illustration"
                    loading="lazy"
                  /> */}
                  <div className="h-fit w-fit">
                    <div className="relative z-10">{Banner}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="overflow-hidden relative bg-gray-100">
            <div className="container mx-auto">
              <div className="font-fontUse flex flex-col w-full h-fit px-[5%] lg1:px-[4%] py-[4%]">
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent inline-block bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    Hot right now
                  </h1>
                </div>
                <div className="mb-4 z-20">
                  <SpotLight />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    Goals for 2024
                  </h1>
                </div>
                <div className="mb-4">
                  <ImpactTool />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    Upcoming Projects
                  </h1>
                  <button
                    onClick={() => navigate("/live-projects")}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
                  >
                    View More
                  </button>
                </div>
                <div className="mb-4">
                  <LiveProjects progress={false} />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    Ongoing Accelerator
                  </h1>
                  <button
                    onClick={() => navigate(`/all-live-events`)}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
                  >
                    View More
                  </button>
                </div>
                <div className="mb-4">
                  <LiveEventsCards wrap={true} register={false} />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    Investors
                  </h1>
                  <button
                    onClick={() => navigate("/view-investor")}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
                  >
                    View More
                  </button>
                </div>
                <div className="flex mb-4 items-stretch max-md:flex-col">
                  <div className="flex lg:mb-0 lg:w-3/4 mb-4 w-full">
                    <InvestorCard />
                  </div>
                  <div className="lg:w-1/4 md:pl-2">
                    <RegisterCard categories={investorCategories} />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    Mentors
                  </h1>
                  <button
                    onClick={() => navigate("/view-mentors")}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
                  >
                    View More
                  </button>
                </div>
                <div className="flex mb-4 items-stretch max-md:flex-col">
                  <div className="flex lg:mb-0 lg:w-3/4 mb-4 w-full">
                    <MentorCard />
                  </div>
                  <div className="lg:w-1/4 md:pl-2">
                    <RegisterCard categories={mentorCategories} />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    Announcements
                  </h1>
                </div>
                <div className="mb-4">
                  <AnnouncementCard />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl  font-bold">
                    Jobs / Bounties
                  </h1>
                </div>
                <div className="mb-2">
                  <ProjectJobCard
                    image={true}
                    tags={true}
                    country={true}
                    website={true}
                  />
                </div>
                {/* <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    User Testimonials
                  </h1>
                </div>
                <div className="bg-[#B9C0F2] flex-wrap justify-center mb-4 p-4 rounded-lg sm:flex-row">
                  <div className="mb-4 px-2 w-full">
                    <Testimonial />
                  </div> */}
                  {/* <div className="w-full sm:w-1/2 lg:w-1/4 px-2">
                    <RegisterCard
                      categories={testimonialCategories}
                      border={true}
                    />
                  </div> */}
                {/* </div> */}
              </div>
            </div>
          </section>
        </>
      );
  }
};

export default DashBoard;
