import React, { useState, useEffect, useRef } from "react";
import { Line } from "rc-progress";
import NoDataCard from "../../components/Mentors/Event/NoDataCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoData from "../../../assets/images/file_not_found.png";
import toast, { Toaster } from "react-hot-toast";

const ProjectMoneyRaising = ({ data }) => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const projectId = data?.uid;
  const [moneyRaised, setMoneyRaised] = useState([]);
  const [allowAccess, setAllowAccess] = useState(null);
  const [noData, setNoData] = useState(false);
  const [percent, setPercent] = useState(50);
  const tm = useRef(null);
  const gradient = "linear-gradient(90deg, #B9C0F2 0%, #7283EA 100%)";
  const gradientStops = { stop1: "#7283EA", stop2: "#B9C0F2" };
  const circlePosition = (percent) => {
    return `calc(${percent}% - 10px)`;
  };

  // useEffect(() => {
  //   if (percent < 100) {
  //     tm.current = setTimeout(increase, 30);
  //   }
  //   return () => clearTimeout(tm.current);
  // }, [percent]);

  // const increase = () => {
  //   setPercent((prevPercent) => {
  //     if (prevPercent >= 50) {
  //       clearTimeout(tm.current);
  //       return 50;
  //     }
  //     return prevPercent + 1;
  //   });
  // };
  console.log("projectId", data);

  useEffect(() => {
    const fetchAccessPrivateData = async () => {
      if (!projectId) return false;

      try {
        const result = await actor.access_money_details(projectId);
        console.log("result ====>", result);
        if ("Ok" in result) {
          setMoneyRaised(Array.isArray(result.Ok) ? result.Ok : [result.Ok]);
          setNoData(false);
          setAllowAccess(Object.keys(result.Ok).length > 0 ? true : false);
        } else if ("Err" in result) {
          toast.error(result.Err.message);
          setAllowAccess(result.Err.is_owner);
          setMoneyRaised([]);
          setNoData(true);
        }
      } catch (error) {
        toast.error(
          "An unexpected error occurred while fetching private documents"
        );
        setAllowAccess(false);
        setNoData(true);
        setMoneyRaised([]);
      }
    };

    fetchAccessPrivateData();
  }, [actor, projectId]);

  console.log("moneyRaised", moneyRaised);

  const sendMoneyRaisingRequest = async () => {
    if (!projectId) {
      // setDocuments([]);
      return;
    }
    try {
      const result = await actor.send_money_access_request(projectId);
      console.log("result-in-send-access-private-docs", result);
      if (result) {
        toast.success(result);
      } else {
        toast.error(result);
      }
    } catch (error) {
      console.log("error-in-send-access-private-docs", error);
    }
  };
  const raisedFromOtherEcosystem =
    moneyRaised[0]?.raised_from_other_ecosystem[0] ?? 0;
  const sns = moneyRaised[0]?.sns[0] ?? 0;
  const investors = moneyRaised[0]?.investors[0] ?? 0;
  const icpGrants = moneyRaised[0]?.icp_grants[0] ?? 0;
  const targetAmount = moneyRaised[0]?.target_amount[0] ?? 1;

  const totalRaised = raisedFromOtherEcosystem + sns + investors + icpGrants;

  const percentage = (totalRaised / targetAmount) * 100;
  const simplePercentage = Math.min(percentage, 100).toFixed(2);
  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-end text-xs xxs:text-base">
          {allowAccess === true ? (
            <button
              className="text-white bg-blue-700 font-bold py-2 px-4 rounded-xl"
              onClick={() =>
                navigate(`/project-money-raising-requests/${projectId}`)
              }
            >
              View Money Raising Requsets
            </button>
          ) : (
            <button
              className="text-white bg-blue-700 font-bold py-2 px-4 rounded-xl"
              onClick={sendMoneyRaisingRequest}
            >
              Ask for permission
            </button>
          )}
        </div>
        {noData ? (
          <NoDataCard image={NoData} desc={"No Data yet"} />
        ) : (
          moneyRaised[0] && (
            <div className="flex flex-col">
              <div
                className={`bg-[#D9DBF3] border my-4 mr-[4%] pt-4 px-10 rounded-3xl w-[80%] mb-12 ${
                  allowAccess === true ? "" : "blur-sm"
                }`}
              >
                <div className="flex justify-between">
                  <h1 className="font-extrabold text-base xxs:text-xl mb-2">
                    Targeted Funds
                  </h1>
                  <h1 className="font-extrabold text-xl mb-2">
                    ${moneyRaised[0]?.target_amount[0]}
                    <span className="ml-2">M</span>
                  </h1>
                </div>
                <div className="flex items-center mb-4 mt-2">
                  <div className="flex-1 bg-white rounded-full h-2 relative">
                    <div className="relative mb-4">
                      <svg
                        width="100%"
                        height="8"
                        className="rounded-lg absolute"
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-`}
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
                          width={`${simplePercentage}%`}
                          height="10"
                          fill={`url(#gradient-)`}
                        />
                      </svg>
                    </div>
                    <div
                      className="absolute w-5 h-5 rounded-full border-2 border-white -top-[6px]"
                      style={{
                        left: circlePosition(simplePercentage),
                        backgroundImage: gradient,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 ml-2">
                    {simplePercentage}%
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-between mr-[4%] gap-12">
                <div
                  className={`bg-white rounded-3xl p-6 mb-4 flex-auto ${
                    allowAccess === true ? "" : "blur-sm"
                  }`}
                >
                  <div className="flex justify-between mb-2 items-center">
                    <h6 className="text-base font-bold">Grants</h6>
                    <h1 className="text-4xl font-extrabold">
                      $
                      {moneyRaised[0]?.icp_grants[0]
                        ? moneyRaised[0]?.icp_grants[0]
                        : 0}
                      <span className="ml-2">M</span>
                    </h1>
                  </div>
                </div>
                <div
                  className={`bg-white rounded-3xl p-6 mb-4 flex-auto ${
                    allowAccess === true ? "" : "blur-sm"
                  }`}
                >
                  <div className="flex justify-between mb-2 items-center">
                    <h6 className="text-base font-bold">Investors</h6>
                    <h1 className="text-4xl font-extrabold">
                      $
                      {moneyRaised[0]?.investors[0]
                        ? moneyRaised[0]?.investors[0]
                        : 0}
                      <span className="ml-2">M</span>
                    </h1>
                  </div>
                </div>
                <div
                  className={`bg-white rounded-3xl p-6 mb-4 flex-auto ${
                    allowAccess === true ? "" : "blur-sm"
                  }`}
                >
                  <div className="flex justify-between mb-2 items-center">
                    <h6 className="text-base font-bold">Tokens</h6>
                    <h1 className="text-4xl font-extrabold">
                      ${moneyRaised[0]?.sns[0] ? moneyRaised[0]?.sns[0] : 0}
                      <span className="ml-2">M</span>
                    </h1>
                  </div>
                </div>
                <div
                  className={`bg-white rounded-3xl p-6 mb-4 flex-auto ${
                    allowAccess === true ? "" : "blur-sm"
                  }`}
                >
                  <div className="flex justify-between mb-2 items-center">
                    <h6 className="text-base font-bold">Others</h6>
                    <h1 className="text-4xl font-extrabold">
                      $
                      {moneyRaised[0]?.raised_from_other_ecosystem[0]
                        ? moneyRaised[0]?.raised_from_other_ecosystem[0]
                        : 0}{" "}
                      <span className="ml-2">M</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <Toaster />
    </>
  );
};

export default ProjectMoneyRaising;
