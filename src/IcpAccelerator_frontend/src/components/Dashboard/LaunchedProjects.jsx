import React, { useState, useEffect, useRef } from "react";
import ment from "../../../assets/images/ment.jpg";
import girl from "../../../assets/images/girl.jpeg";
import hover from "../../../assets/images/hover.png";
import RegisterCard from "./RegisterCard";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useSpring, animated, useTrail } from "react-spring";
import NoDataCard from "../Mentors/Event/NoDataCard";

const LaunchedProjects = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);

  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showLine, setShowLine] = useState({});
  const tm = useRef(null);
  const navigate = useNavigate();
  // Gradient color stops, changes when hovered
  const gradientStops = isHovered
    ? { stop1: "#4087BF", stop2: "#3C04BA" }
    : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger the animation once
    threshold: 0.1, // Trigger when 10% of the element is in view
  });

  // Define the fade-in animation
  const fadeIn = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { duration: 1000 }, // Customize duration as needed
  });

  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 30);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  const increase = () => {
    setPercent((prevPercent) => {
      if (prevPercent >= 100) {
        clearTimeout(tm.current);
        return 100;
      }
      return prevPercent + 1;
    });
  };

  const projectCategories = [
    {
      id: "registerProject",
      title: "Register your Projects",
      description: "See a project missing? Submit your projects to this page.",
      buttonText: "Register Now",
      imgSrc: hover,
    },
  ];

  const defaultArray = [
    {
      projectName: "Awesome Project",
      projectId: null,
      projectImage: ment,
      userImage: girl,
      principalId: "user123",
      projectDescription: "This is an amazing project focused on innovation.",
      projectAreaOfFocus: "Technology",
    },
    {
      projectName: "Creative Initiative",
      projectId: null,
      projectImage: ment,
      userImage: girl,
      principalId: "user456",
      projectDescription:
        "A creative initiative aiming to bring positive change.",
      projectAreaOfFocus: "Art and Design",
    },
    {
      projectName: "Community Outreach",
      projectId: null,
      projectImage: ment,
      userImage: girl,
      principalId: "user789",
      projectDescription:
        "Engaging community outreach program fostering collaboration.",
      projectAreaOfFocus: "Social Impact",
    },
  ];

  const [noData, setNoData] = useState(null);
  const [allProjectData, setAllProjectData] = useState([]);

  const getAllProject = async (caller) => {
    await caller
      .list_all_projects()
      .then((result) => {
        console.log("result-in-get-all-projects", result);

        if (!result || result.length === 0) {
          setNoData(true);
          setAllProjectData([]);
        } else {
          setAllProjectData(result);
          setNoData(false);
        }
      })
      .catch((error) => {
        setNoData(true);
        setAllProjectData([]);
        console.log("error-in-get-all-projects", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllProject(actor);
    } else {
      getAllProject(IcpAccelerator_backend);
    }
    return;
  }, [actor]);

  const handleNavigate = (projectId, projectData) => {
    if (isAuthenticated) {
      navigate(`/individual-project-details-user/${projectId}`, {
        state: projectData
      });
    } else {
      toast.error("Please Sign Up !!!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="flex flex-wrap -mx-4 mb-4 items-center">
        <div className="w-full md:w-3/4 px-4 md:flex md:gap-4">
          {noData ? (
            <NoDataCard />
          ) : (
            <>
              {allProjectData &&
                allProjectData.slice(0, 3).map((data, index) => {
                  let projectName = "";
                  let projectId = "";
                  let projectImage = "";
                  let userImage = "";
                  let principalId = "";
                  let projectDescription = "";
                  let projectAreaOfFocus = "";
                  let projectData = null;
                  if (noData === false) {
                    projectName =
                      data[1]?.project_profile[0]?.params?.project_name;
                    projectId = data[1]?.project_profile[0]?.uid;
                    projectImage = uint8ArrayToBase64(
                      data[1]?.project_profile[0]?.params?.project_logo
                    );
                    userImage = uint8ArrayToBase64(
                      data[1]?.project_profile[0]?.params?.user_data
                        ?.profile_picture[0]
                    );
                    principalId = data[0].toText();
                    projectDescription =
                      data[1]?.project_profile[0]?.params?.project_description;
                    projectAreaOfFocus =
                      data[1]?.project_profile[0]?.params
                        ?.project_area_of_focus;
                    projectData = data[1]?.project_profile[0]
                  } else {
                    projectName = data.projectName;
                    projectId = data.projectId;
                    projectImage = data.projectImage;
                    userImage = data.userImage;
                    principalId = data.principalId;
                    projectDescription = data.projectDescription;
                    projectAreaOfFocus = data.projectAreaOfFocus;
                  }
                  return (
                    <animated.div
                      className="w-full sm:w-1/2 md:w-1/3 mb-2  hover:scale-105 transition-transform duration-300 ease-in-out"
                      key={index}
                    >
                      <div className="flex justify-between items-baseline flex-wrap bg-white overflow-hidden rounded-lg shadow-lg">
                        <div className="p-4">
                          <div className="flex justify-between items-baseline mb-2 flex-col flex-wrap w-fit">
                            <div className="flex items-baseline w-1/2">
                              <img
                                className="rounded-full w-12 h-12 object-cover"
                                src={projectImage}
                                alt="profile"
                              />
                              <h1 className="font-bold text-nowrap truncate w-[220px]">
                                {projectName}
                              </h1>
                            </div>
                            <div className="flex items-baseline w-1/2">
                              <img
                                className="h-5 w-5 rounded-full mx-2 mt-2"
                                src={userImage}
                                alt="not found"
                              />
                              <p className="text-xs truncate w-20">
                                {principalId}
                              </p>
                            </div>
                          </div>
                          <div className="mb-4 flex items-baseline">
                            <svg
                              width="100%"
                              height="8"
                              className="rounded-lg"
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                            >
                              <defs>
                                <linearGradient
                                  id={`gradient-${index}`}
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="0%"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor={gradientStops.stop1}
                                    stopOpacity="1"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor={gradientStops.stop2}
                                    stopOpacity="1"
                                  />
                                </linearGradient>
                              </defs>
                              <rect
                                x="0"
                                y="0"
                                width={`${percent}%`}
                                height="10"
                                fill={`url(#gradient-${index})`}
                              />
                            </svg>
                            <div className="ml-2 text-nowrap text-sm">
                              Level 2
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm p-2 h-36 overflow-hidden line-clamp-8">
                            {projectDescription}
                          </p>

                          {projectAreaOfFocus ? (
                            <div className="flex gap-2 mt-2 text-xs items-center">
                              {projectAreaOfFocus
                                .split(",")
                                .slice(0, 3)
                                .map((tag, index) => (
                                  <div
                                    key={index}
                                    className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                                  >
                                    {tag.trim()}
                                  </div>
                                ))}
                              {projectAreaOfFocus.split(",").length > 3 && (
                                <p
                                  onClick={() =>
                                    projectId ? handleNavigate(projectId, projectData) : ""
                                  }
                                  className="cursor-pointer"
                                >
                                  +1 more
                                </p>
                              )}
                            </div>
                          ) : (
                            ""
                          )}

                          <button
                            className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                            onClick={() => handleNavigate(projectId, projectData)}
                          >
                            KNOW MORE
                          </button>
                        </div>
                      </div>
                    </animated.div>
                  );
                })}
            </>
          )}
        </div>
        <div className="w-full md:w-1/4 pr-4 md:flex md:gap-4">
          <RegisterCard categories={projectCategories} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default LaunchedProjects;
