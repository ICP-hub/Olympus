import React, { useEffect, useState } from "react";
import ProjectCard from "../ProjectCard";
import ment from "../../../../assets/images/ment.jpg";
import MembersProfileCard from "../../TeamMembers/MembersProfileCard";
import ProjectRank from "../ProjectRank";
import ProjectReviewRatings from "../ProjectReviewRatings";
import ProjectRatings from "../ProjectRatings";
import Announcement from "./Announcement";
import ProjectJobCard from "./ProjectJobCard";
import { useSelector } from "react-redux";
import MentorsProfileCard from "../../TeamMembers/MentorsProfileCard";
import InvenstorProfileCard from "../../TeamMembers/InvenstorProfileCard";
import Frame from "../../../../assets/images/Frame.png";
import girl from "../../../../assets/images/girl.jpeg";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CommunityRatings from "./CommunityRatings";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import AnnouncementCard from "../../Dashboard/AnnouncementCard";
import AnnouncementModal from "../../../models/AnnouncementModal";
import AddJobsModal from "../../../models/AddJobsModal";
import AddRatingModal from "../../../models/AddRatingModal";

const ProjectDetailsForUser = () => {
  const location = useLocation();
  // const { data } = location.state;
  const actor = useSelector((currState) => currState.actors.actor);
  const { id } = useParams();
  const [details, setDetails] = useState();
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [isJobsModalOpen, setJobsModalOpen] = useState(false);
  const [isRatingModalOpen, setRatingModalOpen] = useState(false);

  const headerData = [
    {
      id: "team-member",
      label: "team member",
    },
    {
      id: "mentors-associated",
      label: "mentors associated",
    },
    {
      id: "investors-associated",
      label: "investors",
    },
    {
      id: "project-ratings",
      label: "Rubric Rating",
    },
  ];

  const AnnouncementData = [
    {
      id: 1,
      img: Frame,
      img2: girl,
    },
    {
      id: 2,
      img: Frame,
      img2: girl,
    },
    {
      id: 3,
      img: Frame,
      img2: girl,
    },
  ];
  const [activeTab, setActiveTab] = useState(headerData[0].id);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );



  const handleCloseModal = () => setAnnouncementModalOpen(false);
  const handleOpenModal = () => setAnnouncementModalOpen(true);
  const handleJobsCloseModal = () => setJobsModalOpen(false);
  const handleJobsOpenModal = () => setJobsModalOpen(true);
  const handleRatingCloseModal = () => setRatingModalOpen(false);
  const handleRatingOpenModal = () => setRatingModalOpen(true);

  console.log(userCurrentRoleStatusActiveRole)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const reducerhandler = (result) => {
    console.log(result);
    if (result.length > 0) {
      const projectDetails = result[0];

      const detail = {
        announcements: projectDetails.announcements[0],
        areaOfFocus: projectDetails?.area_of_focus[0],
        countryOfProject: projectDetails.country_of_project[0],
        dateOfJoining: new Date(
          projectDetails.date_of_joining[0]
        ).toLocaleDateString("en-US"),
        jobsOpportunity: projectDetails.jobs_opportunity[0],
        liveLinkOfProject: projectDetails.live_link_of_project[0],
        mentorAssociated: projectDetails.mentor_associated[0],
        reviews: projectDetails.reviews[0],
        teamMemberInfo: projectDetails.team_member_info[0],
        vcAssociated: projectDetails.vc_associated[0],
        websiteSocialGroup: projectDetails.website_social_group[0],
      };

      setDetails(detail);
    }
  };
  const getTabClassName = (tab) => {
    return `inline-block p-1 ${activeTab === tab
      ? "border-b-2 border-[#3505B2]"
      : "text-[#737373]  border-transparent"
      } rounded-t-lg`;
  };

  const renderComponent = () => {
    switch (activeTab) {
      case "team-member":
        return (
          <MembersProfileCard
            profile={true}
            type={!true}
            name={true}
            role={true}
            socials={true}
            filter={"team"}
          />
        );
      case "mentors-associated":
        return (
          <MentorsProfileCard
            profile={true}
            type={!true}
            name={true}
            role={true}
            socials={true}
            filter={"mentor"}
          />
        );
      case "investors-associated":
        return (
          <InvenstorProfileCard
            profile={true}
            type={!true}
            name={true}
            role={true}
            socials={true}
            filter={"investor"}
          />
        );
      case "project-ratings":
        return (
          <ProjectRatings
            profile={true}
            type={!true}
            name={true}
            role={true}
            socials={true}
            filter={"rubric"}
          />
        );
      default:
        return null;
    }
  };

  console.log("ProjectId ===> ", id);
  const getProjectDetail = async (caller) => {
    console.log("caller", caller);
    await caller
      .get_project_info_for_user(id)
      .then((result) => {
        console.log("result-in-get_Project_Detail", result);
        reducerhandler(result);
      })
      .catch((error) => {
        console.log("error-in-get_Project_Detail", error);
      });
  };
  useEffect(() => {
    if (actor) {
      getProjectDetail(actor);
    }
  }, [actor]);
  // useEffect(() => {
  //     (async () => {
  //         if (actor) {
  //             const testData = await actor.get_dummy_data_for_project_details_for_users();
  //             console.log("testData", testData)
  //         }
  //     })();
  // }, [actor]);
  // console.log("details ===>", details);
  // console.log("data ===>", data);
  return (
    <section className="text-black bg-gray-100 pb-4">
      <div className="w-full px-[4%] lg1:px-[5%]">
        <div className="flex-col">
          <div className="mb-4">
            <ProjectCard
              image={ment}
              title="buider.io"
              tags={details?.areaOfFocus || ["Defi", "NFT", "Game"]}
              doj={details?.dateOfJoining || "10 October, 2023"}
              country={details?.countryOfProject || "india"}
              website={"https://www.google.co.in/"}
              dapp={"https://6lqbm-ryaaa-aaaai-qibsa-cai.ic0.app/"}
            />
          </div>
          <div className="flex flex-col w-full py-4">
            <p className="capitalize pb-2 font-bold text-xl">overview</p>
            <p className="text-base text-gray-500">
              The Student Side Dashboard provides students with access to the
              assigned tests and assessments created by their respective
              teachers. Students can log in to their accounts, view a list of
              available tests, and choose the tests they want to attempt. The
              dashboard allows them to navigate through the tests, answer
              questions, and submit their responses within the specified time
              limit. Upon completing a test, students can view their scores and
              performance summary. The platform provides immediate feedback,
              highlighting correct and incorrect answers, helping students
              identify areas that require improvement. They can also access
              their historical test results and track their progress over time.{" "}
              <br />
              <br />
              Additional Features: In addition to the core functionalities
              mentioned above, the website may include other features to enhance
              the learning experience. These may include:
              <br />
              1. Test Scheduling: The ability for teachers to schedule tests for
              specific dates and times, ensuring timely access for students.
              <br />
              2. Announcements and Notifications: Teachers can share important
              announcements, updates, and reminders with students through the
              platform.
              <br />
              3. Progress Tracking: A comprehensive progress tracking system
              that allows teachers and students to monitor performance over
              time.
              <br />
            </p>
          </div>
          <div className="mb-4">
            {/* <ProjectRank dayRank={true} weekRank={true} /> */}
            <div className="text-sm font-bold text-center text-[#737373] mt-2">
              <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
                {headerData
                  .filter((header) => {
                    // Always include if not the Rubric Rating tab
                    if (header.id !== "project-ratings") return true;
                    // Include the Rubric Rating tab only if activeRole is mentor
                    return userCurrentRoleStatusActiveRole === "mentor";
                  })
                  .map((header) => (
                    <li key={header.id} className="me-6 relative group">
                      <button
                        className={getTabClassName(header?.id)}
                        onClick={() => handleTabClick(header?.id)}
                      >
                        <div className="capitalize text-base">
                          {header.label}
                        </div>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="py-4">{renderComponent()}</div>
          </div>
          <div className="flex flex-col py-4">
            <div className="flex justify-end mb-4">
              <button className="font-[950] border bg-[#3505B2] py-[7px] px-[9px] rounded-md text-white text-nowrap capitalize"
                onClick={handleOpenModal}>
                Add Announcement
              </button>
            </div>
            <AnnouncementCard />
          </div>
          <div className="flex flex-col py-4">
            <div className="flex justify-end">
              <button className="font-[950] border bg-[#3505B2] py-[7px] px-[9px] rounded-md text-white text-nowrap capitalize"
                onClick={handleRatingOpenModal}>
                Add Rating
              </button>
            </div>
            <CommunityRatings
              profile={true}
              type={!true}
              name={true}
              role={true}
              socials={true}
              filter={"team"}
            />
          </div>
          <div className="flex flex-col py-4">
            <div className="flex justify-between">
              <h1 className="font-[950] text-lg md:text-2xl  text-blue-700">
                jobs/opportunity
              </h1>
              <button className="font-[950] border bg-[#3505B2] px-4 py-2 rounded-md text-white text-nowrap capitalize"
                onClick={handleJobsOpenModal}>
                Add Jobs
              </button>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <ProjectJobCard
                image={ment}
                tags={["Imo", "Ludi", "Ndaru"]}
                country={"india"}
                website={"https://www.google.co.in/"}
              />
              <ProjectJobCard
                image={ment}
                tags={["Imo", "Ludi", "Ndaru"]}
                country={"india"}
                website={"https://www.google.co.in/"}
              />
            </div>
          </div>
        </div>
      </div>
      {isAnnouncementModalOpen && (
        <AnnouncementModal onClose={handleCloseModal} />)}
      {isJobsModalOpen && (
        <AddJobsModal onJobsClose={handleJobsCloseModal} />)}
      {isRatingModalOpen && (
        <AddRatingModal onRatingClose={handleRatingCloseModal} />)}
    </section>
  );
};

export default ProjectDetailsForUser;
