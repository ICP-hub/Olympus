import React, { useEffect ,useRef } from "react";
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
import useFadeInScrollAnimation from "../hooks/useFadeInScrollAnimation";
import toast, { Toaster } from "react-hot-toast";


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
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  function getNameOfCurrentStatus(rolesStatusArray) {
    const currentStatus = rolesStatusArray.find(
      (role) => role.status === "active"
    );
    return currentStatus ? currentStatus.name : null;
  }

    const SpotLightRef = useRef(null);
    useFadeInScrollAnimation(SpotLightRef, 0, 100);
    const ProjectRef = useRef(null);
    useFadeInScrollAnimation(ProjectRef, 170, 310);
    const CohorotRef = useRef(null);
    useFadeInScrollAnimation(CohorotRef, 370, 880);
    const InvestorRef = useRef(null);
    useFadeInScrollAnimation(InvestorRef, 955, 1137);
    const MentorRef = useRef(null);
    useFadeInScrollAnimation(MentorRef, 1140, 1322);
    const AnnouncementRef = useRef(null);
    useFadeInScrollAnimation(AnnouncementRef, 1327, 1557);
    const JobRef = useRef(null);
    useFadeInScrollAnimation(JobRef, 1590, 1840);

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
  const handleNavigateProject = () => {
    if (isAuthenticated) {
      navigate("/live-projects")
    }else{
      toast.error("Please Sign Up !!!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  const handleNavigateCohort = () => {
    if (isAuthenticated) {
      navigate(`/all-live-events`)
    }else{
      toast.error("Please Sign Up !!!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  const handleNavigateInvestor = () => {
    if (isAuthenticated) {
      navigate("/view-investor")
    }else{
      toast.error("Please Sign Up !!!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  const handleNavigateMentor = () => {
    if (isAuthenticated) {
      navigate("/view-mentors")
    }else{
      toast.error("Please Sign Up !!!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
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
                <div className="flex flex-col justify-center md:w-1/2 sm:px-4 w-full relative lg:-top-8">
                  <h1 className="text-4xl font-semibold mb-4 lg:text-8xl sxxs:text-3xl text-white font-fontUse">
                    OLYMPUS
                  </h1>
                  <h1 className="lg:text-4xl text-3xl sxxs:text-2xl font-semibold mb-4 text-white font-fontUse">
                    Peak of Web3 Acceleration
                  </h1>
                  <p className="text-lg mb-6 md:text-xl lg:text-2xl font-normal text-white font-fontUse">
                    Web3 Acceleration Platform for Founders, Investors, Mentors, Talent and Users
                  </p>
                  <a
                    className="mb-4 text-white font-fontUse hover:text-black"
                    href="https://internetcomputer.org/olympus"
                  >
                    Learn more about the beta version.
                  </a>
                  <div className="capitalize items-center px-4 py-3 sxxs:py-1 sxxs:px-2 sxxs:mb-8 text-white mr-auto font-semibold flex justify-start">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="9" r="7.5" stroke="#fff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.99326 11.25H9H8.99326Z" fill="#fff"/>
<path d="M8.99326 11.25H9" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 9L9 6" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span className="ml-1">Use with caution.</span></div> 
                </div>
                <div className="w-full px-4 md:w-1/2 md:flex hidden">
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
                <div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent inline-block bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                    Hot right now
                  </h1>
                </div>
                <div className="mb-4 z-20 fade-in">
                  <SpotLight />
                </div>
                </div>
                {/* <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                    Goals for 2024
                  </h1>
                </div>
                <div className="mb-4">
                  <ImpactTool />
                </div> */}
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                    Upcoming Projects
                  </h1>
                  <button
                    onClick={handleNavigateProject}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
                  >
                    View More
                  </button>
                </div>
                <div className="mb-4 fade-in" >
                  <LiveProjects progress={false} />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                    Ongoing Accelerator
                  </h1>
                  <button
                    onClick={handleNavigateCohort}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
                  >
                    View More
                  </button>
                </div>
                <div className="mb-4 fade-in" >
                  <LiveEventsCards wrap={true} register={false} />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                    Investors
                  </h1>
                  <button
                    onClick={handleNavigateInvestor}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
                  >
                    View More
                  </button>
                </div>
               
                <div className="flex max-md:flex-col -mx-4 mb-4 items-stretch fade-in" >
                  <div className="w-full md:w-3/4 px-4 md:flex md:gap-4 sm:flex sm:gap-4">
                    <InvestorCard />
                  </div>
                  <div className="w-full md:w-1/4 sm:pr-4 md:flex md:gap-4 px-4">
                    <RegisterCard categories={investorCategories} />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                    Mentors
                  </h1>
                  <button
                    onClick={handleNavigateMentor}
                    className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
                  >
                    View More
                  </button>
                </div>
                <div className="flex max-md:flex-col -mx-4 mb-4 items-stretch fade-in">
                  <div className="w-full md:w-3/4 px-4 md:flex md:gap-4 sm:flex sm:gap-4">
                    <MentorCard />
                  </div>
                  <div className="w-full md:w-1/4 sm:pr-4 md:flex md:gap-4 px-4">
                    <RegisterCard categories={mentorCategories} />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                    Announcements
                  </h1>
                  
                </div>
                <div className="mb-4 fade-in">
                  <AnnouncementCard />
                </div>
                <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
                  <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl  font-bold sxxs:text-lg">
                    Jobs / Bounties
                  </h1>
                </div>
                <div className="mb-2 fade-in">
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
          <Toaster/>
        </>
      );
  }
};

export default DashBoard;
