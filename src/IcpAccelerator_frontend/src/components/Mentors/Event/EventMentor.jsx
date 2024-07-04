import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import NoDataCard from "../../Mentors/Event/NoDataCard";
import NoData from "../../../../assets/images/search_not_found.png";
import AddMentorRatingModal from "../../../models/AddMentorAndInvestorRatingModal";
import toast, { Toaster } from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";
function EventMentor({ allMentorData, noData }) {
  const navigate = useNavigate();
  const [isRatingModalOpen, setRatingModalOpen] = useState(false);
  const principal = useSelector((currState) => currState.internet.principal);
  const handleRatingCloseModal = () => setRatingModalOpen(false);
  const handleRatingOpenModal = () => setRatingModalOpen(true);
  // const [noData, setNoData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);
  const handleAddRating = async ({ rating, ratingDescription ,id}) => {
    console.log("add job");
    setIsSubmitting(true);
    if (actor) {
      let argument = {
        value: rating,
        comment:ratingDescription? [ratingDescription]:[],
      };

      await actor
        .update_mentor_ratings(id, argument)
        .then((result) => {
          console.log("result-in-add_mentor_rating", result);
          if (result) {
            handleRatingCloseModal();
            setIsSubmitting(false);
            toast.success("review added successfully");
          } else {
            handleRatingCloseModal();
            setIsSubmitting(false);
            toast.error("something got wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-add_mentor_rating", error);
          toast.error("something got wrong");
          setIsSubmitting(false);
          handleRatingCloseModal();
        });
    }
  };

  if (noData || !allMentorData?.Ok?.length) {
    return (
      <div className="items-center w-full flex justify-center">
        <NoDataCard image={NoData} desc={"Mentors not found at the moment"} />
      </div>
    );
  }
  console.log("allMentorData", allMentorData);
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
                  {/* <button
                    // onClick={() =>
                    //   navigate(`/view-mentor-details`, {
                    //     state: { mentorProfileData: { allMentorData } },
                    //   })
                    // }
                    className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                  >
                    View Profile
                  </button> */}
                  <button
                    // onClick={() =>
                    //   navigate(`/view-mentor-details`, {
                    //     state: { mentorProfileData: { allMentorData } },
                    //   })
                    // }
                    className="text-white px-4 py-1 mt-2 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                    onClick={handleRatingOpenModal}
                  >
                    Add Mentor Rating
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      {isRatingModalOpen && (
        <AddMentorRatingModal
          onRatingClose={handleRatingCloseModal}
          onSubmitHandler={handleAddRating}
          isSubmitting={isSubmitting}
          isMentor={true}
          id={allMentorData?.Ok[0]?.uid}

        />
      )}
      <Toaster />
    </>
  );
}

export default EventMentor;
