import React, { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import guide from "../../../../assets/getStarted/guide.png";
import upvote from "../../../../assets/getStarted/upvote.png";
import SubmitSection from "../../Footer/SubmitSection";
import { getCurrentRoleStatusRequestHandler } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import SpotLight from "../SpotLight";
import LiveProjects from "../LiveProjects";
import CurrentlyRaising from "../CurrentlyRaising";
import MentorAssociated from "../../AssociatedProjects/MentorAssociated";
import AnnouncementCard from "../AnnouncementCard";
import LiveEventsCards from "../../Mentors/Event/LiveEventsCards";
import UpcomingEventsCard from "../../Mentors/Event/UpcomingEventsCard";

const MentorDashboard = ({ numSkeletons }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  // console.log("actor in MentorDashboard =>", actor);

  const principal = useSelector((currState) => currState.internet.principal);
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const [noDataStates, setNoDataStates] = useState({
    liveProjects: false,
    raisingProjects: false,
    ongoingcohort: false,
  });

  const handleNoDataChange = (key, value) => {
    setNoDataStates((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  useEffect(() => {
    const founderDataFetchHandler = async () => {
      // const founderDataFetch = await actor.get_mentor_candid();
      // console.log("dekho dekho founder data aaya => ", founderDataFetch);
    };
    // founderDataFetchHandler();
  }, [actor]);

  // useEffect(() => {
  //   if (actor) {
  //     if (!userCurrentRoleStatus.length) {
  //       console.log('dispatch')
  //       // dispatch(getCurrentRoleStatusRequestHandler());
  //     } else if (
  //       userCurrentRoleStatus.length === 4 &&
  //       userCurrentRoleStatus[0]?.status === "default"
  //     ) {
  //       navigate("/create-user");
  //     } else {
  //     }
  //   }
  // }, [actor, dispatch, userCurrentRoleStatus, userCurrentRoleStatusActiveRole]);

  const underline =
    "relative focus:after:content-[''] focus:after:block focus:after:w-full focus:after:h-[2px] focus:after:bg-blue-800 focus:after:absolute focus:after:left-0 focus:after:bottom-[-4px]";

  console.log("principal", principal);
  return (
    <section className="overflow-hidden relative bg-gray-100">
      <div className="font-fontUse flex flex-col w-full h-fit px-[5%] lg1:px-[4%] py-[4%]">
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Associated Projects
          </h1>
        </div>
        <div className="flex flex-wrap items-center mt-4 pb-4">
          <MentorAssociated />
        </div>
        {/* <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]"> */}
        {/* <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Spotlight of the month
          </h1> */}
        {/* <button className="border border-violet-800 px-4 py-2 rounded-md text-violet-800">
            Explore more
          </button> */}
        {/* </div> */}
        {/* <div className="mb-4">
          <SpotLight numSkeletons={numSkeletons} />
        </div> */}
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Announcements
          </h1>
        </div>
        <div className="mb-4">
          <AnnouncementCard />
        </div>
        {/* <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Event Announcement
          </h1> */}
        {/* <button className="border border-violet-800 px-4 py-2 rounded-md text-violet-800">
            Explore more
          </button> */}
        {/* </div>
        <EventCard /> */}
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Upcoming Projects
          </h1>
          {!noDataStates.liveProjects && (
          <button
            onClick={() => navigate("/live-projects")}
            className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
          >
            Explore more
          </button>)}
        </div>
        <div className="mb-4">
          <LiveProjects
                    progress={true}
                    numSkeletons={numSkeletons}
                    onNoDataChange={(value) =>
                      handleNoDataChange("liveProjects", value)
                    }
                    />
        </div>
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Currently Raising
          </h1>
          {!noDataStates.raisingProjects && (
          <button
            onClick={() => navigate("/raising-projects")}
            className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
          >
            Explore all
          </button>)}
        </div>
        <div className="mb-4">
          <CurrentlyRaising
                    progress={true}
                    numSkeletons={numSkeletons}
                    onNoDataChange={(value) =>
                      handleNoDataChange("raisingProjects", value)
                    }
                    />
        </div>
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Ongoing Accelerator
          </h1>
          <div className="flex gap-2">
          {noDataStates.ongoingcohort && (
            <button
              onClick={() => navigate(`/all-live-ongoing-cohort`)}
              className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
            >
              View More
            </button>)}
            <button
              onClick={() => navigate(`/cohort-form`)}
              className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
            >
              Start Your Cohort
            </button>
          </div>
        </div>
        <div className="mb-4">
          <LiveEventsCards
                    wrap={true}
                    register={true}
                    onNoDataChange={(value) =>
                      handleNoDataChange("ongoingcohort", value)
                    }
                  />
        </div>
        <div className="mb-4 fade-in">
          <UpcomingEventsCard wrap={true} register={true} />
        </div>
      </div>
    </section>
  );
};

export default MentorDashboard;