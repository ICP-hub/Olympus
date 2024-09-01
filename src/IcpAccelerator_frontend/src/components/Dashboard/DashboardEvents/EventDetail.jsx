import React, { useEffect, useState } from "react";
import eventbg from "../../../../assets/images/bg.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import GuestProfile1 from "../../../../assets/Logo/GuestProfile1.png";
import CapacityGroupIcon from "../../../../assets/Logo/CapacityGroupIcon.png";
import StartDateCalender from "../../../../assets/Logo/StartDateCalender.png";
import StartTimeClock from "../../../../assets/Logo/StartTimeClock.png";
import PriceIcon from "../../../../assets/Logo/PriceIcon.png";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import parse from "html-react-parser";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { formatFullDateFromSimpleDate } from "../../Utils/formatter/formatDateFromBigInt";
import { ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import NoDataFound from "./NoDataFound";
import EventRequestCard from "./EventRequestCard";
import EventRequestStatus from "./EventRequestStatus";
import Tabs from "../../Common/Tabs/Tabs";
import Attendees from "./Attendees";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full text-left py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-medium">{question}</span>
        {isOpen ? (
          <RemoveCircleOutlineOutlinedIcon className="text-[#9AA4B2]" />
        ) : (
          <AddCircleOutlineOutlinedIcon className="text-[#9AA4B2]" />
        )}
      </button>
      {isOpen && (
        <p className="mt-2 text-[#4B5565] font-normal text-sm pb-4">{answer}</p>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "What is a role, actually?",
      answer:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
    },
    {
      question: "How do roles work?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      question: "Can I change roles?",
      answer:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ];

  return (
    <div className="mt-3 text-[#121926] text-[18px] font-medium border-gray-200">
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

const EventDetails = () => {
  const [currentTab, setCurrentTab] = useState("Summary");
  const tabs = ["Summary", "Request", "Announcements", "Attendees", "Reviews"];
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };
  const location = useLocation();
  const { cohort_id } = location.state || {};
  const [cohortData, setCohortData] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [difference, setDifference] = useState(null); // Add this state

  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log("............./.........../cohortData",cohortData)
  // const userCurrentRoleStatusActiveRole = useSelector(
  //   (currState) => currState.currentRoleStatus.activeRole
  // );
  const userCurrentRoleStatusActiveRole = "vc";
  useEffect(() => {
    const fetchCohortData = async () => {
      console.log("Actor:", actor);
      console.log("Cohort ID:", cohort_id);

      if (actor && cohort_id) {
        try {
          const result = await actor.get_cohort(cohort_id);
          if (result && Object.keys(result).length > 0) {
            setCohortData(result);
            calculateTimeLeft(result.cohort.cohort_launch_date);
          } else {
            setCohortData(null);
          }
        } catch (error) {
          console.log("error-in-get_my_cohort", error);
          setCohortData(null);
        }
      }
    };

    fetchCohortData();
  }, [actor, cohort_id]);

  useEffect(() => {
    if (cohortData) {
      const intervalId = setInterval(() => {
        calculateTimeLeft(cohortData.cohort.cohort_launch_date);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [cohortData]);

  const calculateTimeLeft = (cohortLaunchDate) => {
    const launchDate = new Date(cohortLaunchDate);
    const now = new Date();
    const difference = launchDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    setTimeLeft(timeLeft);
    setDifference(difference);
  };

  if (!cohortData) {
    return <div>Loading...</div>;
  }

  const {
    cohort_banner,
    cohort_end_date,
    cohort_launch_date,
    country,
    criteria,
    deadline,
    description,
    funding_amount,
    funding_type,
    host_name,
    no_of_seats,
    start_date,
    tags,
    title,
  } = cohortData.cohort;

  const Seats = Number(no_of_seats);
  const bannerImage =
    cohort_banner && cohort_banner.length > 0
      ? uint8ArrayToBase64(cohort_banner[0])
      : [];

  const TabButton = ({ name, label }) => (
    <button
      className={`py-2 px-4 ${
        activeTab === name
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600"
      }`}
      onClick={() => setActiveTab(name)}
    >
      {label}
    </button>
  );

  //   const TabContent = () => {
  //     switch (activeTab) {
  //       case 'summary':
  //         return (
  //           <div>
  //             {/* <h2 className="text-2xl font-semibold mb-2">About</h2>
  //             <ul className="list-disc pl-5 text-gray-700">
  //               <li>
  //                 A tortor laoreet at magna nibh. Bibendum augue neque
  //                 malesuada aliquam venenatis.
  //               </li>
  //               <li>Feugiat nulla pellentesque eu augue dignissim.</li>
  //               <li>
  //                 Diam gravida turpis fermentum ut est. Vulputate platea non
  //                 ac elit massa.
  //               </li>
  //             </ul>
  //             <div className="mt-6">
  //               <h2 className="text-2xl font-semibold mb-2">Topics covered</h2>
  //               <p className="text-gray-700">
  //                 Est quis ornare proin quisque lacinia ac tincidunt massa
  //               </p>
  //               <p className="text-gray-700 mt-2">
  //                 Est malesuada ac elit gravida vel aliquam nec. Arcu velit
  //                 netusque convallis quam feugiat non viverra massa fringilla.
  //               </p>
  //             </div>
  //             <hr className="border-gray-300 mt-4 mb-4" /> */}

  //             <div className="mt-4">
  //       <h2 className="text-2xl font-semibold mb-2">Description</h2>
  //       {/* <div className="text-gray-700">{parse(description)}</div> */}
  //       <div className="relative text-gray-700 overflow-hidden max-h-[10rem] hover:max-h-none transition-all duration-300 ease-in-out group">
  //   <div
  //     className="overflow-hidden text-ellipsis line-clamp-10"
  //   >
  //     { parse(description) }

  //   </div>
  //   <div
  //     className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"
  //   ></div>
  // </div>
  //       <h2 className="text-2xl font-semibold mt-2">FAQ</h2>
  //       <FAQ />
  //     </div>
  //           </div>
  //         );
  //       case 'announcements':
  //         return <NoDataFound message="No active announcements found" />;
  //       case 'attendees':
  //         return <NoDataFound message="No active attendes found" />;
  //       case 'reviews':
  //         return <NoDataFound message="No active reviews found" />;
  //         case 'request':
  //           return <EventRequestStatus/>;
  //       default:
  //         return null;
  //     }
  //   };
  //Register Modal
  const registerHandler = async () => {
    setIsSubmitting(true);
    if (actor) {
      const today = new Date();
      const deadline = new Date(
        formatFullDateFromSimpleDate(cohortData?.cohort?.deadline)
      );

      // if (deadline < today) {
      //   setIsSubmitting(false);
      //   // setIsModalOpen(true);
      // } else {
      try {
        let cohort_id = cohortData?.cohort_id;
        if (userCurrentRoleStatusActiveRole === "project") {
          await actor
            .apply_for_a_cohort_as_a_project(cohort_id)
            .then((result) => {
              setIsSubmitting(false);
              if (
                result &&
                result.includes(`Request Has Been Sent To Cohort Creator`)
              ) {
                toast.success(result);
                // window.location.href = "/";
              } else {
                toast.error(result);
              }
            });
        } else if (userCurrentRoleStatusActiveRole === "vc") {
          await actor
            .apply_for_a_cohort_as_a_investor(cohort_id)
            .then((result) => {
              console.log("result in investor", result);

              setIsSubmitting(false);
              if (result) {
                toast.success(result);
                // window.location.href = "/";
              } else {
                toast.error(result);
              }
            });
        } else if (userCurrentRoleStatusActiveRole === "mentor") {
          await actor
            .apply_for_a_cohort_as_a_mentor(cohort_id)
            .then((result) => {
              console.log("result in mentor", result);

              setIsSubmitting(false);
              if (result) {
                toast.success(result);
                // window.location.href = "/";
              } else {
                toast.error(result);
              }
            });
        }
      } catch (error) {
        setIsSubmitting(false);
        toast.error(error);
        console.error("Error sending data to the backend:", error);
      }
      // }
    } else {
      setIsSubmitting(false);
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getButtonText = (role) => {
    switch (role) {
      case "project":
        return "Join as Project";
      case "vc":
        return "Join as Investor";
      case "mentor":
        return "Join as Mentor";
      default:
        return "Join";
    }
  };
  // console.log("current role",userCurrentRoleStatusActiveRole);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="w-[30%] bg-white rounded-lg shadow-md pt-4">
          <div className="bg-gray-100 p-4">
            <div className="flex items-start mb-4">
              <img
                src={ProfileImage}
                alt={host_name || "Host"}
                className="w-14 h-14 rounded-full mr-3"
              />
              <div>
                <h2 className="text-lg font-medium">
                  {host_name || "Host Name"}
                </h2>
                <span className="inline-block border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708] text-xs px-2 py-0.5 rounded-md uppercase font-medium tracking-wide">
                  ORGANISER
                </span>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-base font-medium mb-2 text-left">
                Event starts in
              </h3>
              <div className="flex items-center justify-between">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, index) => (
                  <React.Fragment key={item.label}>
                    <div className="text-center">
                      <div className="text-xl font-bold bg-white rounded-lg p-2 min-w-[48px]">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.label}
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="text-2xl font-bold mx-1 self-start mt-2">
                        :
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-2 text-sm "
             onClick={registerHandler}>
              Register{" "}
              <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
               {isSubmitting ? (
                          <button className="uppercase w-full bg-[#3505B2] text-white  px-6  rounded-md  items-center font-extrabold text-xl sxxs:text-sm">
                            <ThreeDots
                              visible={true}
                              height="24"
                              width="24"
                              color="#FFFFFF"
                              radius="9"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClassName=""
                            />
                          </button>
                        ) : (
                          getButtonText(userCurrentRoleStatusActiveRole)
                        )}
            </button> */}
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-2 text-sm"
              onClick={registerHandler}
            >
              {isSubmitting ? (
                <ThreeDots
                  visible={true}
                  height="24"
                  width="24"
                  color="#FFFFFF"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                />
              ) : (
                getButtonText(userCurrentRoleStatusActiveRole)
              )}
            </button>

            <button className="w-full border border-[#CDD5DF] bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300 mb-2 text-sm">
              Contact organiser
            </button>

            <div className="text-center text-orange-500 font-medium text-sm">
              {Seats} spots left
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-[12px] font-medium text-[#697586] mb-2">
                GUEST
              </h3>
              <div className="flex flex-wrap justify-start">
                {[...Array(11)].map((_, i) => (
                  <img
                    key={i}
                    src={GuestProfile1}
                    alt={`Guest ${i + 1}`}
                    className="w-8 h-8 rounded-full mr-1 mb-1"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[#697586] text-[12px] block mb-2">
                  EVENT CATEGORY
                </span>
                <span className="bg-white font-medium border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  {tags}
                </span>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  CAPACITY
                </span>
                <div className="flex items-center">
                  <img
                    src={CapacityGroupIcon}
                    alt="Capacity"
                    className="w-4 h-4 text-gray-400 mr-2"
                  />
                  <span className="text-gray-700">{Seats}</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  START DATE
                </span>
                <div className="flex items-center">
                  <img
                    src={StartDateCalender}
                    alt="Start Date"
                    className="w-4 h-4 text-gray-400 mr-2"
                  />
                  <span className="text-gray-700">{start_date}</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  END DATE
                </span>
                <div className="flex items-center">
                  <img
                    src={StartDateCalender}
                    alt="End Date"
                    className="w-4 h-4 text-gray-400 mr-2"
                  />
                  <span className="text-gray-700">{cohort_end_date}</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  COUNTRY
                </span>
                <div className="flex items-center">
                  <PlaceOutlinedIcon
                    className="text-gray-500 h-4 w-4 mr-2"
                    fontSize="small"
                  />

                  <span className="text-gray-700">{country}</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  FUNDING AMOUNT
                </span>
                <div className="flex items-center">
                  <img
                    src={PriceIcon}
                    alt="End Date"
                    className="w-4 h-4 text-gray-400 mr-2"
                  />
                  <span className="text-gray-700">{funding_amount}</span>
                </div>
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  FUNDING TYPE
                </span>
                <div className="flex items-center">
                  <span className="bg-white font-medium border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                    {funding_type}
                  </span>
                </div>
                {/* <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  END DATE
                </span>
                <div className="flex items-center">
                  <img
                    src={StartDateCalender}
                    alt="End Date"
                    className="w-4 h-4 text-gray-400 mr-2"
                  />
                  <span className="text-gray-700">{cohort_end_date}</span>
                </div>
              </div> */}
              </div>
              <div>
                <span className="text-[#697586] text-[12px] block mb-1">
                  DEADLINE
                </span>
                <div className="flex items-center">
                  <img
                    src={StartDateCalender}
                    alt="deadline"
                    className="w-4 h-4 text-gray-400 mr-2"
                  />
                  <span className="text-gray-700">{deadline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 ml-auto overflow-auto ">
          <div className="p-4">
            <img
              src={bannerImage}
              alt="Event"
              className="w-full rounded-lg h-[310px] object-cover"
            />
            <h1 className="text-3xl font-bold mt-4">{title}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <span className="mr-2">
                <img
                  src={StartDateCalender}
                  className="w-5 h-5 font-bold"
                  alt="Price icon"
                />
              </span>
              <span className="mr-2"> {timeLeft.days} days</span>
              <span className="mr-2">
                <img
                  src={PriceIcon}
                  className="w-5 h-5 font-bold"
                  alt="Price icon"
                />
              </span>
              <span>{funding_amount}</span>
            </div>

            {/* <div className="mt-4">
              <div className="border-b border-gray-300 mb-4">
                <TabButton name="summary" label="Summary" />
                <TabButton name="announcements" label="Announcements" />
                <TabButton name="attendees" label="Attendees" />
                <TabButton name="reviews" label="Reviews" />
                <TabButton name="request" label="Request" />
              </div>
              <TabContent />
              
            </div> */}
            <Tabs
              tabs={tabs}
              currentTab={currentTab}
              onTabChange={handleTabChange}
            />
            <div className=" pr-6">
              {currentTab === "Summary" && (
                <>
                  <div>
                    <div className="mt-4">
                      <h2 className="text-2xl font-semibold mb-2">
                        Description
                      </h2>
                      {/* <div className="text-gray-700">{parse(description)}</div> */}
                      <div className="relative text-gray-700 overflow-hidden max-h-[10rem] hover:max-h-none transition-all duration-300 ease-in-out group">
                        <div className="overflow-hidden text-ellipsis line-clamp-10">
                          {parse(description)}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      </div>
                      <h2 className="text-2xl font-semibold mt-2">FAQ</h2>
                      <FAQ />
                    </div>
                  </div>
                </>
              )}
              {currentTab === "Announcements" && (
                <NoDataFound message="No active announcements found" />
              )}
              {currentTab === "Attendees" && (
                <Attendees cohortData={cohortData} />
              )}
              {currentTab === "Request" && <EventRequestCard />}
              {currentTab === "Reviews" && (
                <NoDataFound message="No active reviews found" />
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default EventDetails;
