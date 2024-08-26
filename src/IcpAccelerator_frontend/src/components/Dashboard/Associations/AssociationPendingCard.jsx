import React,{useState} from "react";
import {
  MoreVert,
  Star,
  PlaceOutlined as PlaceOutlinedIcon,
} from "@mui/icons-material";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import Avatar from "@mui/material/Avatar";
import parse from "html-react-parser";
import AssociationOfferModal from "./AssociationOfferModal";

const AssociationPendingCard = ({ user, index }) => {
  const [openDetail,setOpenDetail]=useState(false)

  console.log("user", user);
  let projectImage = user?.project_info?.project_logo[0]
    ? uint8ArrayToBase64(user?.project_info?.project_logo[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let projectName = user?.project_info?.project_name ?? "projectName";

  let profile = user?.project_info?.user_data?.profile_picture[0]
    ? uint8ArrayToBase64(user?.project_info?.user_data?.profile_picture[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let userName = user?.project_info?.user_data?.full_name ?? "userName";

  let openchat_name =
    user?.project_info?.user_data?.openchat_username[0] ?? "openchatName";

  let userEmail =
    user?.project_info?.user_data?.email[0] ?? "email@example.com";

  let userCountry = user?.project_info?.user_data?.country ?? "Country";

  let userBio = user?.project_info?.user_data?.bio[0] ?? "Bio not available";

  let userAreaOfInterest =
    user?.project_info?.user_data?.area_of_interest ?? "Area of Interest";

  let userReasonToJoin =
    user?.project_info?.user_data?.reason_to_join[0] ??
    "Reason to join not available";

  let userTypeOfProfile =
    user?.project_info?.user_data?.type_of_profile[0] ?? "individual";

  let socialLinks =
    user?.project_info?.user_data?.social_links[0] ??
    "No social links available";

  let projectDescription =
    user?.project_info?.project_description[0] ??
    "Project description not available";

  let projectId = user?.project_info?.project_id ?? "projectId";

  let offer = user?.offer ?? "offer";

  let offerId = user?.offer_id ?? "offerId";

  let requestStatus = user?.request_status ?? "pending";

  let response = user?.response ?? "No response";

  let acceptedAt = user?.accepted_at ?? 0n;

  let declinedAt = user?.declined_at ?? 0n;

  let selfDeclinedAt = user?.self_declined_at ?? 0n;

  let senderPrincipal = user?.sender_principal ?? "Principal not available";

  let sentAt = user?.sent_at ?? 0n;

  return (
    <>
    <div key={index} className="p-6 w-[650px] rounded-lg shadow-sm flex">
      <div className="w-[272px]">
        <div className="max-w-[250px] w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center" onClick={() => setOpenDetail(true)}>
            <img
              src={projectImage}
              alt="projectImage"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
            <Star className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-medium">9</span>
          </div>
        </div>
      </div>

      <div className="flex-grow ml-[25px] w-[544px]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold">{projectName}</h3>
            <span className="flex py-2">
              <Avatar
                alt="Mentor"
                src={profile}
                className=" mr-2"
                sx={{ width: 24, height: 24 }}
              />
              <span className="text-gray-500">{userName}</span>
            </span>
            <span className="text-gray-500">@{openchat_name}</span>
          </div>
          <span className="mr-2 mb-2 border border-[#016AA2] bg-[#F0F9FF] text-[#016AA2] px-3 py-1 rounded-full">
          {projectId ? "Project" : "User"}
        </span>
        </div>

        <div className="border-t border-gray-200 mt-3"></div>
        

        <p className="text-gray-600 my-2 overflow-hidden line-clamp-2 text-ellipsis max-h-[2rem]">
          {parse(projectDescription)}
        </p>
        <div className="flex items-center text-sm text-gray-500 flex-wrap py-2">
          {userAreaOfInterest &&
            userAreaOfInterest
              .split(",")
              .slice(0, 2)
              .map((tag, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}

          <span className="mr-2 mb-2 flex text-[#121926] items-center">
            <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />{" "}
            {userCountry}
          </span>
        </div>
        <div className="">
          <button className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full">
            Accept
          </button>
          <button className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full">
            Reject
          </button>
        </div>
      </div>
    </div>
                  {openDetail && <AssociationOfferModal openDetail={openDetail} setOpenDetail={setOpenDetail} user={user} />}
    </>
  );
};

export default AssociationPendingCard;
