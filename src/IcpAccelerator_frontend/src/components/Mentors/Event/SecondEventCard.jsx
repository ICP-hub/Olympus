import React, { useState, useEffect } from "react";
import hover from "../../../../assets/images/1.png";
import { winner } from "../../Utils/Data/SvgData";
import girl from "../../../../assets/images/girl.jpeg";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { formatFullDateFromSimpleDate } from "../../Utils/formatter/formatDateFromBigInt";
import { useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
const SecondEventCard = ({ data, register }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  if (!data) {
    return null;
  }
  console.log("data ====???>>>>>>>", data);
  let image = data?.cohort?.cohort_banner
    ? uint8ArrayToBase64(data?.cohort?.cohort_banner?.[0])
    : hover;
  let name = data?.cohort?.title ?? "No Title...";
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
      const today = new Date();
      const deadline = new Date(
        formatFullDateFromSimpleDate(data?.cohort?.deadline)
      );
      const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const deadlineDateOnly = new Date(
        deadline.getFullYear(),
        deadline.getMonth(),
        deadline.getDate()
      );

      if (deadlineDateOnly > todayDateOnly) {
        setIsModalOpen(true);
      } else {
        try {
          if (userCurrentRoleStatusActiveRole === "project") {
            let cohort_id = data?.cohort_id;
            // console.log("cohortid ===> ", cohort_id);
            const cohort_creator_principal =
              data?.cohort_creator_principal.toText();
            const Projectprincipal = principal;

            if (cohort_creator_principal !== Projectprincipal) {
              await actor
                .apply_for_a_cohort_as_a_project(cohort_id)
                .then((result) => {
                  // console.log("result in project to check update call==>", result);
                  if (
                    result &&
                    result.includes(`Request Has Been Sent To Cohort Creator`)
                  ) {
                    toast.success(result);
                    window.location.href = "/";
                  } else {
                    toast.error(result);
                  }
                });
            } else {
              toast.error("Cohort creator cannot apply");
            }
          } else if (userCurrentRoleStatusActiveRole === "vc") {
            let cohort_id = data?.cohort_id;

            // console.log("cohortid ===> ", cohort_id);
            await actor
              .apply_for_a_cohort_as_a_investor(cohort_id)
              .then((result) => {
                // console.log(
                //   "result in mentor || vc to check update call==>",
                //   result
                // );
                if (result) {
                  toast.success(result);
                  // window.location.href = "/";
                } else {
                  toast.error(result);
                }
              });
          } else if (userCurrentRoleStatusActiveRole === "mentor") {
            let cohort_id = data?.cohort_id;

            // console.log("cohortid ===> ", cohort_id);
            await actor
              .apply_for_a_cohort_as_a_mentor(cohort_id)
              .then((result) => {
                // console.log(
                //   "result in mentor || vc to check update call==>",
                //   result
                // );
                if (result) {
                  toast.success(result);
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
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
          <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                  <h3 className="text-xl font-semibold text-gray-900 ">
                    Registration Closed
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                    onClick={closeModal}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>

                <div className=" items-center justify-center p-4 md:p-5 border-b rounded-t ">
                  <p className="text-lg font-semibold text-gray-900 ">
                    You cannot register for this event because the deadline has
                    passed.
                  </p>
                </div>
                <div className="flex w-full p-4 justify-end">
                  <button
                    onClick={closeModal}
                    type="close"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="block w-full drop-shadow-xl rounded-lg bg-gray-200 mb-8">
        <div className="w-full relative">
          <img
            className="w-full object-cover rounded-lg h-48"
            src={image}
            alt="not found"
          />
          <div className="absolute h-12 w-12 -bottom-1 right-[20px]">
            {winner}
          </div>
        </div>
        <div className="w-full">
          <div className="p-8">
            <div className="w-full mt-4">
              <div className="flex-col text-[#737373] flex  ">
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
                <div className="flex gap-2 mt-2 text-xs items-center pb-2 flex-wrap h-10 overflow-y-scroll line-clamp-1">
                  {tags.split(",").map((tag, index) => (
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
                    <p className="flex text-black w-20">{Number(seats)}</p>
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
                    onClick={() =>
                      navigate("/cohort-details-page", {
                        state: { cohort_id: data?.cohort_id },
                      })
                    }
                    className="mb-2 uppercase w-full bg-[#3505B2] mr-2 text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm mt-2 "
                  >
                    Know More
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
