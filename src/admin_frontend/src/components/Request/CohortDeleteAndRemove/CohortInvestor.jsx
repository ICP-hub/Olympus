import React, { useState } from "react";
import uint8ArrayToBase64 from "../../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoDataCard from "../../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import NoData from "../../../../../IcpAccelerator_frontend/assets/images/search_not_found.png";
import CohortRemoveButton from "../../models/CohortRemoveButton";

function CohortInvestor({ allInvestorData, noData, cohortId }) {
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();
  console.log("allInvestorData line no 17 =====>>>>>>>", allInvestorData);
  const [inputValue, setInputValue] = useState("");
  const [currentInvestorId, setCurrentInvestorId] = useState(null);

  const handleInputChange = (value) => {
    setInputValue(value);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleOpenDeleteModal = (id) => {
    setCurrentInvestorId(id);
    setDeleteModalOpen(true);
  };
  const handleClose = () => {
    setDeleteModalOpen(false);
    setCurrentInvestorId(null);
  };
  const handleSubmit = async () => {
    console.log("Submitted value:", inputValue);
    setIsSubmitting(true);
    let passphrase_key = `delete/${inputValue}`;
    let cohort_id = cohortId;
    let vc_principal = inputValue;
    console.log("remove_vc_from_cohort ====>>>", vc_principal);
    console.log("remove_vc_from_cohort ====>>>", passphrase_key);
    console.log("remove_vc_from_cohort ====>>>", cohort_id);
    await actor
      .remove_vc_from_cohort(cohort_id, vc_principal, passphrase_key)
      .then((result) => {
        if (result && result?.Ok) {
          console.log("result-in-remove_vc_from_cohort", result);
          toast.success(result?.Ok);
          setIsSubmitting(false);
          navigate("/");
        } else {
          console.log("result-in-remove_vc_from_cohort", result);
          toast.error(result?.Err);
          setIsSubmitting(false);
        }
      });
  };

  if (noData || !allInvestorData?.Ok?.length) {
    return (
      <div className="items-center w-full flex justify-center">
        <NoDataCard
          image={NoData}
          desc={"You are not associated with any project yet"}
        />
      </div>
    );
  }

  return (
    <div className="items-center w-full flex justify-start gap-4">
      {allInvestorData.Ok.map((investor, index) => {
        let img = uint8ArrayToBase64(
          investor?.params?.user_data?.profile_picture[0]
        );
        let name = investor?.params?.user_data?.full_name;
        let company = investor?.params?.name_of_fund;
        let investorId = investor?.params?.name_of_fund;
        let category_of_investment =
          investor?.params?.category_of_investment ?? "";

        return (
          <div
            key={index}
            className="bg-white hover:scale-105 w-full sm:w-1/2 md:w-1/4 rounded-lg mb-5 md:mb-0 p-6"
          >
            <div
              onClick={() => handleOpenDeleteModal(investorId)}
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
                className="size-48 rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
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
                <span className="block text-gray-500 truncate">{company}</span>
              </div>
              <div className="flex overflow-x-auto gap-2 pb-4 justify-start">
                {category_of_investment &&
                  category_of_investment.split(",").map((item, index) => (
                    <span
                      key={index}
                      className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-1 leading-none flex items-center"
                    >
                      {item.trim()}
                    </span>
                  ))}
              </div>
              <button
                // onClick={() => navigate(`/view-investor-details`)}
                className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
              >
                View Profile
              </button>
            </div>
          </div>
        );
      })}{" "}
      {isDeleteModalOpen && (
        <CohortRemoveButton
          heading="Remove Cohort"
          onClose={handleClose}
          isSubmitting={false}
          onSubmitHandler={handleSubmit}
          onInputChange={handleInputChange}
          Id={currentInvestorId}
        />
      )}
    </div>
  );
}

export default CohortInvestor;
