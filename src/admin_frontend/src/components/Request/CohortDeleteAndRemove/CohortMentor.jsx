import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import uint8ArrayToBase64 from "../../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import NoDataCard from "../../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import NoData from "../../../../../IcpAccelerator_frontend/assets/images/search_not_found.png";
import CohortRemoveButton from "../../models/CohortRemoveButton";

function CohortMentor({ allMentorData, noData, cohortId }) {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const [inputValue, setInputValue] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState(null);

  const handleInputChange = (value) => {
    setInputValue(value);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleOpenDeleteModal = (id) => {
    setSelectedMentorId(id);
    setDeleteModalOpen(true);
  };
  const handleClose = () => setDeleteModalOpen(false);
  const handleSubmit = async () => {
    console.log("Submitted value:", inputValue);
    setIsSubmitting(true);
    let passphrase_key = `delete/${inputValue}`;
    let cohort_id = cohortId;
    let uid = inputValue;
    console.log("uid ====>>>", uid);
    console.log("mentor_principal ====>>>", passphrase_key);
    console.log("mentor_principal ====>>>", cohort_id);
    await actor
      .remove_mentor_from_cohort(cohort_id, uid, passphrase_key)
      .then((result) => {
        if (
          result &&
          result?.Ok.includes(
            `Mentor successfully removed from the cohort with cohort id ${selectedMentorId}`
          )
        ) {
          toast.success("Mentor successfully removed");
          setIsSubmitting(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.log("result-in-remove_mentor_from_cohort", result);
          toast.error(result?.Err);
          setIsSubmitting(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
  };
  if (noData || !allMentorData?.Ok?.length) {
    return (
      <div className="items-center w-full flex justify-center">
        <NoDataCard image={NoData} desc={"Mentors not found at the moment"} />
      </div>
    );
  }
  return (
    <>
      {allMentorData &&
        allMentorData?.Ok?.map((mentor, index) => {
          console.log("Mentor Data line no 23 ====>>>>", mentor);
          let id = null;
          let img = "";
          let name = "";
          let skills = "";
          let category_of_mentoring_service = "";
          let role = "Mentor";
          if (noData === false) {
            console.log("Mentor Data line no 31 ====>>>>", mentor);
            id = mentor?.uid;
            img = mentor?.profile?.user_data?.profile_picture[0]
              ? uint8ArrayToBase64(
                  mentor?.profile?.user_data?.profile_picture[0]
                )
              : "";
            name = mentor?.profile?.user_data?.full_name;
            skills = mentor?.profile?.user_data?.area_of_interest;
            category_of_mentoring_service =
              mentor?.profile?.category_of_mentoring_service;
            role = "Mentor";
          } else {
            id = mentor.id;
            img = mentor.image;
            name = mentor.name;
            skills = mentor.areaOfFocus;
            role = mentor.role;
          }
          return (
            <div
              key={index}
              className="bg-white  hover:scale-105 w-full sm:w-1/2 md:w-1/4 rounded-lg mb-5 md:mb-0 p-6"
            >
              <div
                onClick={() => handleOpenDeleteModal(id)}
                className="right-text"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="red"
                  className="size-4 ml-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="justify-center flex items-center">
                <div
                  className="size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                  style={{
                    backgroundImage: `url(${img}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <img
                    className="object-cover size-48 max-h-44 rounded-full"
                    src={img}
                    alt=""
                  />
                </div>
              </div>
              <div className="text-black text-start">
                <div className="text-start my-3">
                  <span className="font-semibold text-lg truncate">{name}</span>
                  <span className="block text-gray-500 truncate">
                    {category_of_mentoring_service}
                  </span>
                </div>
                <div>
                  <div className="flex overflow-x-auto gap-2 pb-4 justify-start">
                    {skills?.split(",").map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2"
                        >
                          {item.trim()}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    // onClick={() =>
                    //   navigate(`/view-mentor-details`, {
                    //     state: { mentorProfileData: { allMentorData } },
                    //   })
                    // }
                    className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      {isDeleteModalOpen && (
        <CohortRemoveButton
          heading="Remove Cohort"
          onClose={handleClose}
          isSubmitting={isSubmitting}
          onSubmitHandler={handleSubmit}
          onInputChange={handleInputChange}
          Id={selectedMentorId}
        />
      )}
    </>
  );
}

export default CohortMentor;
