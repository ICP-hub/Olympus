import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hover from "../../../../../IcpAccelerator_frontend/assets/images/1.png";
import { winner } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import FunctionalityModel from "../../../../../IcpAccelerator_frontend/src/models/FunctionalityModel";

const CohortDeleteCard = ({ data, deleteCohort }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [para, setPara] = useState("");
  const [action, setAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = (para, action) => {
    setPara(para);
    setAction(action);
    setModalOpen(true);
    console.log("Modal open with", para, action);
  };
  const handleClick = async () => {
    setIsSubmitting(true);
    // console.log("Line 21 Action ====>>>>",action)
    let decision = action === "Delete" ? "Delete" : "Delete";
    // console.log("Line 23 Decision =====>>>>",decision)
    try {
      await deleteCohort(decision, cohortId);
    } catch (error) {
      console.error("Failed to process the decision: ", error);
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
      window.location.href = "/";
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const request = data;
  if (!request) return null;
  // const image = uint8ArrayToBase64(request?.cohort_creator?._arr);
  const name = request?.cohort?.title;
  const tags = request?.cohort?.tags;
  const description = request?.cohort?.description;
  const no_of_seats = request?.cohort?.no_of_seats;
  const cohort_launch_date = request?.cohort?.cohort_launch_date;
  const cohort_end_date = request?.cohort?.cohort_end_date;
  const deadline = request?.cohort?.deadline;
  const eligibility = request?.cohort?.criteria?.eligibility?.[0];
  const level_on_rubric = request?.cohort?.criteria?.level_on_rubric;
  // const principal = request?.sender.toText();
  const status = data?.request_status;
  const cohortId = request?.cohort_id;
  return (
    <div className="flex w-auto items-center flex-wrap justify-between bg-gray-200 rounded-lg  text-lg p-4 my-4">
      <div className="block lgx:flex w-full rounded-lg lgx:h-96 ">
        <FunctionalityModel
          para={para}
          action={action}
          onModal={modalOpen}
          isSubmitting={isSubmitting}
          onClose={handleCloseModal}
          onClick={handleClick}
          // handleClick={approveAndRejectCohort(`${decision}`, cohortId)}
        />
        <div className="lgx:w-[60%] xl:w-[70%] w-full relative">
          <img
            className="h-full object-cover rounded-lg w-full"
            src={hover}
            alt="not found"
          />
          <div className="absolute h-12 w-12 -bottom-1 lgx:top-0 lgx:right-[-8px] right-[20px]">
            {winner}
          </div>
        </div>
        <div className="lgx:w-[40%] xl:w-[30%] w-full">
          <div className="px-8">
            <div className="w-full mt-4">
              <div className="w-1/2 flex-col text-[#737373] flex  ">
                <h1 className="font-bold text-black text-xl truncate capitalize">
                  {name}
                </h1>
                <p className="text-sm whitespace-nowrap pt-1">
                  <span className="text-black font-bold text-sm">
                    Starting on :
                  </span>{" "}
                  {cohort_launch_date}
                </p>
                <p className="text-sm whitespace-nowrap pt-1">
                  <span className="text-black font-bold text-sm">
                    Ends on :
                  </span>{" "}
                  {cohort_end_date}
                </p>
              </div>
              <p className="text-[#7283EA] font-semibold">Overview</p>
              <div className="flex w-full py-1">
                <p className="h-auto truncate text-sm">{description}</p>
              </div>
              {eligibility ? (
                <div>
                  <p className="text-[#7283EA] font-semibold">Eligibility</p>
                  <div className="flex w-full py-1">
                    <p className="h-auto truncate text-sm">{eligibility}</p>
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* <div className="flex flex-col font-bold">
                <p className="text-[#7283EA]">Eligibility</p>
                <p className="flex text-black w-20">{eligibility}</p>
              </div> */}
              <p className="text-[#7283EA] font-semibold">Tags</p>
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
              </div>
              <div className="flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8 mt-2">
                <div className="flex lg:justify-start gap-4 ">
                  <div className="flex flex-col font-bold">
                    <p className="text-[#7283EA]">Seats</p>
                    <p className="text-black whitespace-nowrap text-sm">
                      {Number(no_of_seats)}
                    </p>
                  </div>
                  <div className="flex flex-col font-bold">
                    <p className="text-[#7283EA]">Application's deadline</p>
                    <p className="text-black whitespace-nowrap text-sm">
                      {deadline}
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-wrap md:flex-nowrap mt-2">
                <button
                  className="px-4 py-1 bg-[#3505B2] text-white font-bold rounded-lg ml-3"
                  onClick={() =>
                    handleOpenModal(
                      "Are you sure you want to delete cohort ?",
                      "Delete"
                    )
                  }
                >
                  Delete cohort
                </button>
              </div> */}
              <div
                onClick={() =>
                  navigate("/CohortRemove", { state: { cohort_id: cohortId } })
                }
                className="flex justify-center items-center"
              >
                <button className="mb-2 uppercase w-full bg-[#3505B2] mr-2 text-white  px-4 py-2 rounded-md  items-center font-extrabold text-sm mt-2 ">
                  Remove from cohort
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortDeleteCard;
