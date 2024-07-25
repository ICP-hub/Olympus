import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SpotLight from "../SpotLight";
import EventCard from "../../Mentors/Event/EventCard";
import ProjectJobCard from "../../Project/ProjectDetails/ProjectJobCard";
import AnnouncementCard from "../AnnouncementCard";
import LiveProjectBar from "../liveProjectBar";
import LiveEventsCards from "../../Mentors/Event/LiveEventsCards";
import UpcomingEventsCard from "../../Mentors/Event/UpcomingEventsCard";
import { ProjectBarSkeleton } from "../Skeleton/Projectbarskeleton";

const ProjectDashboard = ({ numSkeletons }) => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [noDataStates, setNoDataStates] = useState({
    ongoingcohort: false,
    upcomingcohort: false,
  
  });
  const fetchProjectData = async (isMounted) => {
    setIsLoading(true);
    await actor
      .get_my_project()
      .then((result) => {
        // console.log("result-in-get_my_project", result);
        if (result && Object.keys(result).length > 0) {
          if (isMounted) {
            setProjectData(result);
            setIsLoading(false);
          }
        } else {
          if (isMounted) {
            setProjectData(null);
            setIsLoading(false);
          }
        }
      })
      .catch((error) => {
        console.log("error-in-get_my_project", error);
        if (isMounted) {
          setProjectData(null);
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      fetchProjectData(isMounted);
    } else {
      window.location.href = "/";
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);


  const handleNoDataChange = (key, value) => {
    setNoDataStates((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  return (
    <section className="overflow-hidden relative bg-gray-100">
      <div className="font-fontUse flex flex-col w-full h-fit px-[5%] lg1:px-[4%] py-[4%]">
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            My Project
          </h1>
        </div>
        <div className="mb-4 md:md-8">
          {isLoading ? (
            <ProjectBarSkeleton />
          ) : (
            <LiveProjectBar data={projectData} />
          )}
        </div>
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Announcements
          </h1>
        </div>
        <div className="mb-4">
          <AnnouncementCard />
        </div>
        <div className="flex items-center justify-between mb-4 mt-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Jobs / Opportunities
          </h1>
        </div>
        <div className="flex-wrap md:flex-nowrap gap-4 mb-4">
          <ProjectJobCard
            image={true}
            tags={true}
            country={true}
            website={true}
          />
        </div>
        {/* <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Spotlight of the month
          </h1>
        </div>
        <SpotLight numSkeletons={numSkeletons} /> */}
        {/* <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Event Announcement
          </h1>
        </div>
        <EventCard /> */}
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Ongoing Accelerator
          </h1>
          {noDataStates.ongoingcohort && (
          <button
            onClick={() => navigate(`/all-live-ongoing-cohort`)}
            className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
          >
            View More
          </button>)}
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
          <UpcomingEventsCard
                    wrap={true}
                    register={true}
                    onNoDataChange={(value) =>
                      handleNoDataChange("upcomingcohort", value)
                    }
                  />
        </div>
      </div>
    </section>
  );
};

export default ProjectDashboard;