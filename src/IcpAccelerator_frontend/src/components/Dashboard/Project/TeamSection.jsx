import React, { useEffect, useState } from "react";
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
import DeleteModel from "./DeleteModel";
import NoDataFound from "../DashboardEvents/NoDataFound";
import NoData from "../../NoDataCard/NoData";

const TeamMember = ({ cardData, onDelete }) => {
  const projectTeam = cardData?.[0]?.[0]?.params?.project_team;

  const hasTeamMembers =
    projectTeam &&
    Array.isArray(projectTeam) &&
    projectTeam.length > 0 &&
    projectTeam.some(
      (teamMember) => Array.isArray(teamMember) && teamMember.length > 0
    );

  return (
    <>
      {hasTeamMembers ? (
        projectTeam.map((teamMember, index) => {
          if (!teamMember || teamMember.length === 0 || !teamMember[0]) {
            return null;
          }
          const member = teamMember[0];
          const result = member?.member_data;
          const principle = member?.member_principal;
          if (!result) return null;

          const name = result?.full_name ?? "Unnamed Member";
          const avatar = result?.profile_picture?.[0]
            ? uint8ArrayToBase64(result.profile_picture[0])
            : "../../../../assets/Logo/ProfileImage.png";

          return (
            <div
              key={index}
              className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-full"
            >
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs flex justify-around w-full text-gray-700 uppercase bg-gray-50 dark:text-gray-400">
                  <tr className="flex justify-between w-full">
                    <th
                      scope="col"
                      className="text:sm sm3:text-base sm3:px-4 py-2 sm:px-6 sm:py-3"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text:sm sm3:text-base sm3:px-4 py-2 sm:px-6 sm:py-3"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="text:sm sm3:text-base sm3:px-4 py-2 sm:px-6 sm:py-3"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white w-full justify-between flex border-b hover:bg-gray-50">
                    <th
                      scope="row"
                      className="flex flex-col sm1:flex-row w-1/3 items-center sm1:px-4 py-2 sm:px-6 sm:py-4 text-gray-900  dark:text-white"
                    >
                      <img
                        src={avatar}
                        alt={name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-4"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="ps-2 sm:ps-3 ">
                        <p className="line-clamp-1 break-all font-medium text-[#121926] text-xs sm3:text-sm">
                          {name}
                        </p>
                        <p className="line-clamp-1 break-all text-xs sm:text-sm text-gray-500">
                          {result?.openchat_username?.[0] ?? "No Username"}
                        </p>
                      </div>
                    </th>
                    <td className="flex items-center justify-around w-1/3 sm3:px-4 py-2 sm:px-6 sm:py-4">
                      <div className="flex items-center">
                        <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500 mr-1 sm:mr-2"></div>
                        <span className="hidden sm3:block px-1.5 sm:px-2 py-1 rounded text-xs sm:text-sm font-medium bg-[#ecfdf3da] border-2 border-[#6ceda0] text-green-800">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-4 w-1/3 flex items-center justify-end flex-grow-0 py-2 sm:px-6 sm:py-4">
                      <button
                        className="text-gray-400 text-center hover:text-gray-600"
                        onClick={() => onDelete(principle)}
                      >
                        <Delete fontSize="small" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })
      ) : (
        <NoData message="No Team member available" />
      )}
    </>
  );
};


function TeamSection({ data, cardData }) {
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleTeamMemberCloseModal = () => setIsAddTeamModalOpen(false);
  const handleTeamMemberOpenModal = () => setIsAddTeamModalOpen(true);
  const [currentMemberData, setCurrentMemberData] = useState(null);
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
            setTimeout(() => {
              window.location.reload();
            }, 500);
            toast.success("team member added successfully");
          } else {
            handleTeamMemberCloseModal();
            setIsSubmitting(false);
            toast.error("something went wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-update_team_member", error);
          handleTeamMemberCloseModal();
          setIsSubmitting(false);
          toast.error("something went wrong");
        });
    }
  };

  // =======================================
  // <<<<<------- member Delete ----->>>>>

  const handleOpenDeleteModal = (data) => {
    setCurrentMemberData(data);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentMemberData(null);
  };
  const handleClose = () => {
    setDeleteModalOpen(false);
    setCurrentMemberData(null);
  };

  const handleDelete = async () => {
    let project_id = data;

    if (!currentMemberData) return;

    setIsSubmitting(true);

    try {
      // Reconstruct the Principal object
      const principalToPass = Principal.fromUint8Array(currentMemberData._arr);
      const result = await actor.delete_team_member(
        project_id,
        principalToPass
      );

      if (result) {
        toast.success("Team member deleted successfully", {
          style: {
            backgroundColor: "#d9534f",
            color: "#fff",
          },
          icon: "🗑️",
        });
        handleCloseDeleteModal();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Failed to delete the team member");
      }
    } catch (error) {
      console.log("Error in delete_team_member:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // useEffect(() => {
  //   if (actor && latestJobs) {
  //     fetchPostedJobs();
  //   }
  // }, [actor, latestJobs]);
  return (
    <>
      <div className="bg-white overflow-hidden">
        <div className="">
          <div className="flex justify-end mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-4 rounded-lg text-sm flex items-center"
              onClick={handleTeamMemberOpenModal}
            >
              <PersonAdd className="mr-2" fontSize="small" />
              Invite members
            </button>
          </div>

          <div className="rounded-lg overflow-hidden border-2 border-gray-100">
            <div>
              <TeamMember
                cardData={cardData}
                onDelete={handleOpenDeleteModal}
              />
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
      {isDeleteModalOpen && (
        <DeleteModel
          onClose={handleClose}
          title={"Delete Member"}
          heading={"Are you sure to delete this member"}
          onSubmitHandler={handleDelete}
          isSubmitting={isSubmitting}
          data={currentMemberData}
        />
      )}
      <Toaster />
    </>
  );
}

export default TeamSection;
