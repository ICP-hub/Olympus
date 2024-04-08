import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import SpotLight from "../SpotLight";
import EventCard from "../EventCard";
import ProjectJobCard from "../../Project/ProjectDetails/ProjectJobCard";
import AnnouncementCard from "../AnnouncementCard";
import LiveProjectBar from "../liveProjectBar";
import LiveEventsCards from "../LiveEventsCards";

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const [projectData, setProjectData] = useState(null);

  const fetchProjectData = async () => {
    await actor.get_my_project()
      .then((result) => {
        console.log('result-in-get_my_project', result)
        if (result && Object.keys(result).length > 0) {
          setProjectData(result)
        } else {
          setProjectData(null)
        }
      })
      .catch((error) => {
        console.log('error-in-get_my_project', error)
        setProjectData(null)
      })
  };

  useEffect(() => {
    if (actor) {
      fetchProjectData();
    } else {
      window.location.href = '/'
    }
  }, [actor]);

  return (
    <section className="overflow-hidden relative bg-gray-100">
      <div className="font-fontUse flex flex-col w-full h-fit px-[5%] lg1:px-[4%] py-[4%]">
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            My Project
          </h1>
        </div>
        <div className="mb-4 md:md-8">
          <LiveProjectBar data={projectData} />
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
        <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Spotlight of the month
          </h1>
        </div>
        <SpotLight />
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
          <button
            onClick={() => navigate(`/all-live-events`)}
            className="border border-violet-800 px-4 py-2 rounded-md text-violet-800"
          >
            View More
          </button>
        </div>
        <div className="mb-4">
          <LiveEventsCards wrap={true} register={true}/>
        </div>
      </div>
    </section>
  );
};

export default ProjectDashboard;
