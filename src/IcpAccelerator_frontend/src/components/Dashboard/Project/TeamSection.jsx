import React, { useState } from "react";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import TriciaProfile from "../../../../assets/Logo/TriciaProfile.png";
import BillyProfile from "../../../../assets/Logo/BillyProfile.png";
import DavidProfile from "../../../../assets/Logo/DavidProfile.png";
import { PersonAdd, HelpOutline, Delete, Edit } from "@mui/icons-material";
import AddTeamMember from "./AddProjectTeamMenber";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import toast, { Toaster } from "react-hot-toast";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
const TeamMember = ({ cardData }) => {
  // const [isChecked, setIsChecked] = useState(false);
  // console.log("check---------------", isChecked);
  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked);
  // };
  console.log("CARD DATA", cardData)
  console.log("PARAMS DATA", cardData[0].params)
console.log("TEAM ALL DATA", cardData[0]?.params?.project_team)
console.log("TEAM 0TH DATA", cardData[0]?.params?.project_team[0].member_data)
  return (
    <>
  {cardData[0]?.params?.project_team?.[0]?.map((val, index) => {
        const result = val?.member_data;

        if (!result) return null;

        const name = result?.full_name ?? "Unnamed Member";
        const avatar = result?.profile_picture?.[0]
          ? uint8ArrayToBase64(result.profile_picture[0])
          : "../../../../assets/Logo/ProfileImage.png"; 

        return (
          <div className="flex items-center py-4 px-6 border-b border-gray-200 last:border-b-0" key={index}>
            <div className="w-1/2 flex items-center">
              <img src={avatar} alt={name} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <p className="font-medium text-[#121926]">{name}</p>
                <p className="text-sm text-gray-500">
                  {result?.openchat_username?.[0] ?? "No Username"}
                </p>
              </div>
            </div>
            <div className="w-1/4 flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  result?.status === "Active"
                    ? "bg-[#ecfdf3da] rounded-md border-2 border-[#6ceda0] text-green-800"
                    : "bg-[#FFFAEB] border-2 border-[#FEDF89] text-[#B54708]"
                }`}
              >
                {result?.status === "Active" && "• "}
                {result?.status ?? "Unknown Status"}
              </span>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Delete fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        );
      }) || (
        <div><h1>No result</h1></div>
      )}
  </>
  );
};

function TeamSection({ data, cardData }) {
  if (!data) {
    return null;
  }
  console.log("getget id", data);
  console.log("getget.................. id.........", cardData);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTeamMemberCloseModal = () => setIsAddTeamModalOpen(false);
  const handleTeamMemberOpenModal = () => setIsAddTeamModalOpen(true);

  const handleAddTeamMember = async ({ user_id }) => {
    console.log("add team member");
    setIsSubmitting(true);
    if (actor) {
      let project_id = data;
      let member_principal_id = Principal.fromText(user_id);
      await actor
        .update_team_member(project_id, member_principal_id)
        .then((result) => {
          console.log("result-in-update_team_member", result);
          if (result) {
            handleTeamMemberCloseModal();
            setIsSubmitting(false);
            // setTimeout(() => {
            //   window.location.reload();
            // }, 500);
            toast.success("team member added successfully");
          } else {
            // handleTeamMemberCloseModal();
            // setIsSubmitting(false);
            toast.error("something went wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-update_team_member", error);
          // handleTeamMemberCloseModal();
          // setIsSubmitting(false);
          toast.error("something went wrong");
        });
    }
  };

  // =======================================

  return (
    <>
      <div className="bg-white overflow-hidden">
        <div className="p-6">
          <div className="flex justify-end mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
              onClick={handleTeamMemberOpenModal}
            >
              <PersonAdd className="mr-2" fontSize="small" />
              Invite members
            </button>
          </div>

          <div className="rounded-lg overflow-hidden border-2 border-gray-100">
            <div className="flex items-center py-3 px-6 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="w-1/2 flex items-center">
                <span className="ml-10">Name</span>
              </div>
              <div className="w-1/4 flex items-center">
                Role
                <HelpOutline fontSize="small" className="ml-1 text-gray-400" />
              </div>
              <div className="w-1/4 flex items-center justify-between pr-8">
                Status
              </div>
            </div>

            <div>
              
                        <TeamMember
                        cardData={cardData}
                        />
                   
              {/* <TeamMember
              name="Tricia Renner"
              username="@triciarenner"
              role="Co-founder, CTO"
              status="Active"
              avatar={TriciaProfile}
            />
            <TeamMember
              name="Billy Aufderhar"
              username="@billyaufderhar"
              role="Marketing Lead"
              status="Active"
              avatar={BillyProfile}
            />
            <TeamMember
              name="David Wilkinson"
              username="@davidw"
              role="Backend Developer"
              status="Pending"
              avatar={DavidProfile}
            /> */}
            </div>
          </div>
        </div>

        {isAddTeamModalOpen && (
          <AddTeamMember
            title="Add Team Member"
            onClose={handleTeamMemberCloseModal}
            onSubmitHandler={handleAddTeamMember}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}

export default TeamSection;
