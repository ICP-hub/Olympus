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
  const projectTeam = cardData?.[0]?.[0]?.params?.project_team;
  console.log("result CARD DATA", cardData?.[0]?.[0]);

  return (
    <>
      {projectTeam?.map((teamMember, index) => {
        const member = teamMember?.[0]; // Adjust the index if necessary
        const result = member?.member_data;

        console.log("teamMember:", teamMember);
        console.log("result CARD DATA", result);
        if (!result) return null;

        const name = result?.full_name ?? "Unnamed Member";
        const avatar = result?.profile_picture?.[0]
          ? uint8ArrayToBase64(result.profile_picture[0])
          : "../../../../assets/Logo/ProfileImage.png";

        return (
          <>
            <div
              key={index}
              class="relative overflow-x-auto shadow-md sm:rounded-lg"
            >
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white border-b   hover:bg-gray-50 ">
                    <th
                      scope="row"
                      class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div class="ps-3">
                        <p className="font-medium text-[#121926]">{name}</p>
                        <p className="text-sm text-gray-500">
                          {result?.openchat_username?.[0] ?? "No Username"}
                        </p>
                      </div>
                    </th>
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                        {/* <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                result?.status === "Active"
                  ? "bg-[#ecfdf3da] rounded-md border-2 border-[#6ceda0] text-green-800"
                  : "bg-[#FFFAEB] border-2 border-[#FEDF89] text-[#B54708]"
              }`}
            >
              {result?.status === "Active " && "• "}
              {result?.status ?? "Unknown Status"}
            </span> */}
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium bg-[#ecfdf3da]  border-2 border-[#6ceda0] text-green-800`}
                        >
                        Active
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Delete fontSize="small" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );
      }) || (
        <div>
          <h1>No result</h1>
        </div>
      )}
    </>
  );
};

function TeamSection({ data, cardData }) {
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTeamMemberCloseModal = () => setIsAddTeamModalOpen(false);
  const handleTeamMemberOpenModal = () => setIsAddTeamModalOpen(true);

  const handleAddTeamMember = async ({ user_id }) => {
    setIsSubmitting(true);
    if (actor) {
      let project_id = data;
      let member_principal_id = Principal.fromText(user_id);
      await actor
        .update_team_member(project_id, member_principal_id)
        .then((result) => {
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
            <div>
              <TeamMember cardData={cardData} />
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
