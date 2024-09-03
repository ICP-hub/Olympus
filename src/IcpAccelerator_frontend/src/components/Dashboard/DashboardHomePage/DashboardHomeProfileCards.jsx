import React, { useEffect, useState } from "react";
import {
  AccountCircle,
  Star,
  Group,
  InfoOutlined,
  StarBorderOutlined,
} from "@mui/icons-material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { MoreVert } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import nodata from "../../../../assets/images/nodata.png";
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import Nodatafound from "../../../../assets/Logo/Nodatafound.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardProfileView from "./DashboardProfileView";
import RatingCard from "../../Common/RatingCard";
import EditRating from "../../Common/RatingReview";
import RatingReview from "../../Common/RatingReview";
import mentor from "../../../../assets/Logo/mentor.png";
import talent from "../../../../assets/Logo/talent.png";
import founder from "../../../../assets/Logo/founder.png";
import Avatar3 from "../../../../assets/Logo/Avatar3.png";
import ProjectCard from "../Project/ProjectCard";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardProjectCard from "./DashboardProjectCard";

function getAvatarsByRoles(approvedRoles) {
  const defaultAvatar = mentor;  // User avatar
  const mentorAvatar = talent;    // Mentor avatar
  const investorAvatar = Avatar3;  // Investor avatar
  const projectAvatar = founder;  // Project avatar

  let firstCardAvatar = defaultAvatar;
  let secondCardAvatar = defaultAvatar;

  // Prioritize combinations of mentor and investor
  if (approvedRoles.includes("mentor") && approvedRoles.includes("vc")) {
    firstCardAvatar = mentorAvatar;
    secondCardAvatar = investorAvatar;
  } else if (approvedRoles.includes("vc") && approvedRoles.includes("mentor")) {
    firstCardAvatar = investorAvatar;
    secondCardAvatar = mentorAvatar;
  }
  // If only one of mentor or investor is present
  else if (approvedRoles.includes("mentor")) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = mentorAvatar;
  } else if (approvedRoles.includes("vc")) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = investorAvatar;
  }
  // Handle user combined with other roles
  else if (approvedRoles.includes("user") && approvedRoles.includes("project")) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = projectAvatar;
  } else if (approvedRoles.includes("user") && approvedRoles.includes("mentor")) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = mentorAvatar;
  } else if (approvedRoles.includes("user") && approvedRoles.includes("vc")) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = investorAvatar;
  }
  // Handle single roles
  else if (approvedRoles.includes("user") && approvedRoles.length === 1) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = defaultAvatar;
  } else if (approvedRoles.includes("project") && approvedRoles.length === 1) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = projectAvatar;
  }

  return [firstCardAvatar, secondCardAvatar];
}





function DashboardHomeProfileCards(percentage) {
  const navigate= useNavigate()
  const location = useLocation();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const [show,setShow]=useState(true)
  const [activeTab, setActiveTab] = useState("project");
  const userRoles = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const approvedRoles = userCurrentRoleStatus
  .filter((role) => role.approval_status === 'approved')
  .map((role) => role.name);
  console.log(".../.../.../../userrole", userCurrentRoleStatus)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("project"); // default tab
    }
  }, [location.search]);

  const handleChange = (tab) => {
    setActiveTab(tab);

    // Update the URL with the selected tab
    navigate(`/dashboard/profile?tab=${tab}`);
  };


  const [firstCardAvatar, secondCardAvatar] = getAvatarsByRoles(approvedRoles);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-6">
        {/* Main profile card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Main profile</h2>
            <Link
              to="/dashboard/profile"
              className="text-blue-500 font-normal "
            >
              Manage &gt;
            </Link>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[5px] bg-green-500"
              style={{ width: percentage }}
            ></div>
            <div className="flex flex-col items-center pt-2">
              <div className="w-20 h-20 bg-gray-300 rounded-full mb-3 overflow-hidden">
                {/* <AccountCircle className="w-full h-full text-gray-400" /> */}
                <img
                  src={userFullData?.profile_picture[0]}
                  alt="Profle Image"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
              <span className="inline-block bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] text-xs font-semibold px-2 py-1 rounded-md mb-2">
                OLYMPIAN
              </span>
              <h3 className="text-lg font-semibold flex items-center mb-1">
                <span className="text-blue-500 ml-1">
                  <VerifiedIcon
                    className="text-blue-500 mr-1"
                    fontSize="small"
                  />
                </span>
                {userFullData?.full_name}
              </h3>
              <p className="text-gray-500">
                @{userFullData?.openchat_username[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Rating card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold mr-2">Rating</h2>
              <HelpOutlineOutlinedIcon
                className="text-gray-400"
                fontSize="small"
              />
            </div>
            <Link
              to="/dashboard/profile"
              className="text-blue-500 font-normal">
              View details &gt;
            </Link>
          </div>
          {/* <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
            <svg
              className="text-gray-200 w-20 h-20 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-gray-700 font-semibold mb-2">No ratings yet</p>
            <p className="text-gray-500 text-sm text-center">
              Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat
              rhoncus tristique ullamcorper sit.
            </p>
          </div> */}
          {show === true ? (
            <RatingCard show={show} setShow={setShow} />
          ) : (
            <RatingReview />
          )}

          {/* <RatingReview /> */}
        </div>

        {/* Roles card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold mr-2">Roles</h2>
              <HelpOutlineOutlinedIcon
                className="text-gray-400"
                fontSize="small"
              />
            </div>
            <Link to="/dashboard/profile" className="text-blue-500 font-normal">
              Manage &gt;
            </Link>
          </div>
          <div className="mt-2 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <img src={firstCardAvatar} className="text-gray-400 w-12 h-12" />
            </div>
          </div>
          <div className="mt-8 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <img src={secondCardAvatar} className="text-gray-400 w-12 h-12" />
            </div>
          </div>
        </div>
      </div>
    {userRoles === 'project' &&
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <div className="flex justify-between items-center m-2 p-2">
          <h2 className="text-xl font-semibold">Projects</h2>
          <a className="text-sm font-normal cursor-pointer" onClick={() => handleChange("project")}>View all projects</a>
        </div>
         <DashboardProjectCard/>
      </div>}
      <div className="bg-white w-full rounded-lg shadow-sm  mt-8">
        <DashboardProfileView />
      </div>
    </>
  );
}
export default DashboardHomeProfileCards;

