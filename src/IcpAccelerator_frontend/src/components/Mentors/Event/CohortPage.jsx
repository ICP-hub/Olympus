import React, { useState, useEffect } from "react";
import hover from "../../../../assets/images/1.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatFullDateFromSimpleDate } from "../../Utils/formatter/formatDateFromBigInt";
import LiveProjects from "../../Dashboard/LiveProjects";
import EventProject from "./EventProject";
import EventMentor from "./EventMentor";
import EventInvestor from "./EventInvestor";

function CohortPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const { cohort_id } = location.state || {};

  const [cohortData, setCohortData] = useState(null);
  const [allProjectData, setAllProjectData] = useState([]);
  const [allMentorData, setAllMentorData] = useState([]);
  const [allInvestorData, setAllInvestorData] = useState([]);
  const fetchCohortData = async () => {
    await actor
      .get_cohort(cohort_id)
      .then((result) => {
        console.log("get_cohort line 14 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setCohortData(result);
          setNoData(false);
        } else {
          setCohortData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_my_cohort", error);
        setCohortData(null);
      });
  };
  const fetchProjectData = async () => {
    await actor
      .get_projects_applied_for_cohort(cohort_id)
      .then((result) => {
        console.log("get_project line 38 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setAllProjectData(result);
          setNoData(false);
        } else {
          setAllProjectData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_project", error);
        setAllProjectData(null);
      });
  };
  const fetchMentorData = async () => {
    await actor
      .get_mentors_applied_for_cohort(cohort_id)
      .then((result) => {
        console.log("get_mentor line 54 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setAllMentorData(result);
          setNoData(false);
        } else {
          setAllMentorData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_mentor", error);
        setAllMentorData(null);
      });
  };
  const fetchInvestorData = async () => {
    await actor
      .get_vcs_applied_for_cohort(cohort_id)
      .then((result) => {
        console.log("get_investor line 81 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setAllInvestorData(result);
          setNoData(false);
        } else {
          setAllInvestorData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_investor", error);
        setAllInvestorData(null);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchCohortData();
      fetchProjectData();
      fetchMentorData();
      fetchInvestorData();
    } else {
      window.location.href = "/";
    }
  }, [actor]);
  return (
    <section className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
      <div className="container">
        <p className="text-lg font-semibold text-indigo-900 inline-block ">
          Events
        </p>

        <div className="container">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between p-8">
              <div className="w-1/2">
                <p className="font-extrabold text-xl">
                  {cohortData?.cohort?.title}
                </p>
                <div className="pt-2">
                  <h4 className="font-extrabold py-2">EVENT PROGRAM</h4>
                  <ul className="list-disc px-6 list-outside text-[#737373]">
                    <li>
                      Groundbreaking Seed-Stage Start-Ups have the chance to
                      showcase the core functionality of their initiative and
                      the value they bring to the industry
                    </li>
                    <li>
                      Each showcase lasts 5 min and is presented in real-time
                      through a pitch format combined with video material of a
                      Demo
                    </li>
                    <li>5 min Showcase + 5 min AMA</li>
                    <li>
                      To participate, apply
                      here: https://forms.gle/HWK9fvT4rvnLgGrz5
                    </li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="font-extrabold py-2">SHOWCASING REWARDS</h4>
                  <ul className="list-disc px-6 list-outside text-[#737373]">
                    <li>
                      The event fosters applications and synergies through:
                    </li>
                    <li>Media outreach</li>
                    <li>Community growth</li>
                    <li>Strategic one-on-one meetings with foundations</li>
                    <li>VCs and Angels Optional grants</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="font-extrabold py-2">JUDGE PROCEDURE</h4>
                  <ul className="list-disc px-6 list-outside text-[#737373]">
                    <li>
                      Esteemed VCs and Angels critically judge showcases at the
                      event and distribute votes to all participants for the
                      DemoDay Leaderboard
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-1/2 right-text">
                <div className="w-4/5">
                  <div>
                    <img
                      className="h-full object-cover rounded-2xl w-full"
                      src={hover}
                      alt="not found"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center mt-2">
                    <div className="flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8">
                      <div className="flex lg:justify-start text-left gap-4 ">
                        <div className="flex flex-col font-bold">
                          <p className="text-[#7283EA]">Date</p>
                          <p className="text-black whitespace-nowrap">
                            {cohortData?.cohort?.cohort_end_date}
                          </p>
                        </div>
                        <div class="text-2xl">•</div>
                        <div className="flex flex-col font-bold">
                          <p className="text-[#7283EA]">Time</p>
                          <p className="text-black">7:30 pm</p>
                        </div>
                        <div class="text-2xl">•</div>
                        <div className="flex flex-col font-bold">
                          <p className="text-[#7283EA]">Duration</p>
                          <p className="text-black">60 min</p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex justify-center items-center">
                      <div className="flex justify-center items-center">
                        <button className="uppercase w-full bg-[#3505B2] text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm">
                          Register now Accept
                        </button>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between my-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
              <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                Projects
              </h1>
              <button
                onClick={() => navigate("/live-projects")}
                className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
              >
                View More
              </button>
            </div>
            <div className="mb-4 fade-in">
              <EventProject allProjectData={allProjectData} noData={noData} />
            </div>
            <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
              <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                Mentors
              </h1>
              <button
                onClick={() => navigate("/view-mentors")}
                className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
              >
                View More
              </button>
            </div>
            <div className="w-full md:w-full px-4 md:flex md:gap-4 sm:flex sm:gap-4">
              <EventMentor allMentorData={allMentorData} noData={noData} />
            </div>
            <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
              <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                Investors
              </h1>
              <button
                onClick={() => navigate("/view-investor")}
                className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
              >
                View More
              </button>
            </div>

            <div className="flex max-md:flex-col -mx-4 mb-4 items-stretch fade-in">
              <div className="w-full px-4 md:flex md:gap-4 sm:flex sm:gap-4">
                <EventInvestor
                  allInvestorData={allInvestorData}
                  noData={noData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CohortPage;
