import React, { useState, useEffect } from "react";
import hover from "../../../assets/images/1.png";
import { winner } from "../Utils/Data/SvgData";
import girl from "../../../assets/images/girl.jpeg";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { formatFullDateFromSimpleDate } from "../Utils/formatter/formatDateFromBigInt";
const SecondEventCard = ({ data, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [projectData, setProjectData] = useState(null);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const fetchProjectData = async () => {
    await actor
      .get_my_project()
      .then((result) => {
        console.log("result-in-get_my_project ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setProjectData(result);
        } else {
          setProjectData(null);
        }
      })
      .catch((error) => {
        console.log("error-in-get_my_project", error);
        setProjectData(null);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchProjectData();
    } else {
      window.location.href = "/";
    }
  }, [actor]);

  if (!data) {
    return null;
  }
  console.log("data ====???>>>>>>>", data);
  let image = hover;
  let name = data?.cohort?.title ?? "";
  let launch_date = data?.cohort?.cohort_launch_date
    ? formatFullDateFromSimpleDate(data?.cohort?.cohort_launch_date)
    : "";
  let end_date = data?.cohort?.cohort_end_date
    ? formatFullDateFromSimpleDate(data?.cohort?.cohort_end_date)
    : "";
  let deadline = data?.cohort?.deadline
    ? formatFullDateFromSimpleDate(data?.cohort?.deadline)
    : "";
  let desc = data?.cohort?.description ?? "";
  let tags = data?.cohort?.tags ?? "";
  let seats = data?.cohort?.no_of_seats ?? 0;

  // const toastHandler = () => {
  //   toast.success("Thank you for the registration request. admin approval in process now.")
  // }
  const registerHandler = async () => {
    if (actor) {
      try {
        if (userCurrentRoleStatusActiveRole === "project") {
          let project_id = projectData?.uid;
          let cohort_id = data?.cohort_id;
          console.log("project_id ===> ", project_id);
          console.log("cohortid ===> ", cohort_id);
          await actor
            .apply_for_a_cohort_as_a_project(cohort_id, project_id)
            .then((result) => {
              console.log("result in project to check update call==>", result);
              if (result.Ok) {
                toast.success("You have successfully applied for the cohort");
                // window.location.href = "/";
              } else {
                toast.error(result.Err);
              }
            });
        } else if (
          userCurrentRoleStatusActiveRole === "mentor" ||
          userCurrentRoleStatusActiveRole === "vc"
        ) {
          let cohort_id = data?.cohort_id;

          console.log("cohortid ===> ", cohort_id);
          await actor
            .apply_for_a_cohort_as_a_mentor_or_investor(cohort_id)
            .then((result) => {
              console.log(
                "result in mentor || vc to check update call==>",
                result
              );
              if (
                result &&
                result.includes(
                  `you have successfully applied for the cohort with cohort id ${cohort_id}`
                )
              ) {
                toast.success("You have successfully applied for the cohort");
                // window.location.href = "/";
              } else {
                toast.error(result);
              }
            });
        }
      } catch (error) {
        toast.error(error);
        console.error("Error sending data to the backend:", error);
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="block w-full drop-shadow-xl rounded-lg bg-gray-200 mb-8">
        <div className="w-full relative">
          <img
            className="w-full object-cover rounded-lg "
            src={hover}
            alt="not found"
          />
          <div className="absolute h-12 w-12 -bottom-1 right-[20px]">
            {winner}
          </div>
        </div>
        <div className="w-full">
          <div className="p-8">
            <div className="w-full mt-4">
              <div className="w-1/2 flex-col text-[#737373] flex  ">
                <h1 className="font-bold text-black text-xl truncate capitalize">
                  {name}
                </h1>
                <p className="text-sm whitespace-nowrap pt-1">
                  <span className="text-black font-bold">Starting on :</span>{" "}
                  {launch_date}
                </p>
                <p className="text-sm whitespace-nowrap pt-1">
                  <span className="text-black font-bold">Ends on :</span>{" "}
                  {end_date}
                </p>
              </div>
              <p className="text-[#7283EA] font-semibold text-xl">Overview</p>
              <div className="flex w-full py-2">
                <p className="line-clamp-3 h-12">{desc}</p>
              </div>
              <p className="text-[#7283EA] font-semibold text-xl">Tags</p>
              {/* <ul className="text-sm font-extralight list-disc list-outside pl-4">
                {tags && tags.split(",").map((val, index) => {
                  return (
                    <li key={index} >{val.trim()}</li>
                  )
                })}
              </ul> */}
              {tags ? (
                <div className="flex gap-2 mt-2 text-xs items-center pb-2">
                  {tags
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
                  {/* {tags.split(",").length > 3 && (
                    <p
                      // onClick={() =>
                      //   // projectId ? handleNavigate(projectId, projectData) : ""
                      // }
                      className="cursor-pointer">
                      +1 more
                    </p>
                  )} */}
                </div>
              ) : (
                ""
              )}

              <div className="flex flex-row flex-wrap space-x-8 mt-2">
                <div className="flex gap-4 justify-between w-full">
                  <div className="flex flex-col font-bold">
                    <p className="text-[#7283EA]">Application's deadline</p>
                    <p className="text-black whitespace-nowrap">{deadline}</p>
                  </div>
                  <div className="flex flex-col font-bold">
                    <p className="text-[#7283EA]">Seats</p>
                    <p className="flex text-black w-20">{seats}</p>
                  </div>
                  {/* <div className="flex flex-col font-bold">
                    <p className="text-[#7283EA]">Duration</p>
                    <p className="flex text-black w-20">60 min</p>
                  </div> */}
                </div>
              </div>
              <div className="flex justify-center items-center ">
                {register && (
                  <button
                    onClick={registerHandler}
                    className="mb-2 uppercase w-full bg-[#3505B2] mr-2 text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm mt-2 "
                  >
                    Register now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default SecondEventCard;
