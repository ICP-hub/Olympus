import React from "react";
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import {
  ArrowBack,
  ArrowOutwardOutlined as ArrowOutwardOutlinedIcon,
  MoreVert,
  LinkedIn,
  GitHub,
  Telegram,
  Add,
} from "@mui/icons-material";
import parse from "html-react-parser";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";

function ProfileCard({ cardData }) {
  const projectDescription =
    cardData?.[0]?.[0]?.params?.project_description?.[0] ??
    "No description available";
  const preferred_icp =
    cardData?.[0]?.[0]?.params?.preferred_icp_hub?.[0] ?? "No data available";
  const country_of_registration =
    cardData?.[0]?.[0]?.params?.country_of_registration?.[0] ??
    "No data available";
  const isActive = cardData?.[0]?.[0]?.is_active ?? false;
  const statusText = isActive ? "Active" : "Inactive";
  const project_area_of_focus = cardData?.[0]?.[0]?.params
    ?.project_area_of_focus
    ? cardData[0][0].params.project_area_of_focus
        .split(",")
        .map((interest) => interest.trim())
    : ["No interest provided"];
  const projectLogo = cardData?.[0]?.[0]?.params?.project_logo?.[0]
    ? uint8ArrayToBase64(cardData[0][0].params.project_logo[0])
    : "";
  const projectName =
    cardData?.[0]?.[0]?.params?.project_name || "Unknown Project";
  const fullName =
    cardData?.[0]?.[1]?.params?.openchat_username ?? "No name provided";
  const links = cardData?.[0]?.[0]?.params?.links?.[0] ?? [];
  const email = cardData?.[0]?.[1]?.params?.email?.[0] ?? null;

  const handleGetInTouchClick = () => {
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      alert("Contact information is not available.");
    }
  };

  const renderIconForLink = (linkObj) => {
    const url = linkObj?.link?.[0];

    if (url?.includes("linkedin.com")) {
      return (
        <LinkedIn className="text-blue-400 hover:text-blue-600 cursor-pointer" />
      );
    } else if (url?.includes("github.com")) {
      return (
        <GitHub className="text-gray-400 hover:text-gray-600 cursor-pointer" />
      );
    } else if (url?.includes("t.me")) {
      return (
        <Telegram className="text-gray-400 hover:text-gray-600 cursor-pointer" />
      );
    }
    return null;
  };

  return (
    <div className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[400px]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-sm">
          <div className="relative h-1 bg-gray-200">
            <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
          </div>
          <div className="p-6 bg-gray-50 relative">
            {/* Three-dot menu button */}
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <MoreVert fontSize="small" />
            </button>

            <div className="relative w-28 mx-auto mb-6">
              <img
                src={projectLogo}
                alt="Cypherpunk Labs"
                className="w-full aspect-square object-cover rounded-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-center mb-1">
              {projectName}
            </h2>
            <p className="text-gray-600 text-center mb-4">@{fullName}</p>
            <button
              onClick={handleGetInTouchClick}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-6 flex items-center justify-center"
            >
              Get in touch
              <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
            </button>
          </div>

          <div className="p-6 bg-white">
            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                Status
              </h3>
              <div className="flex space-x-2">
                <span className="bg-[#FFFAEB] border border-[#83e24d] text-[#B54708] px-3 py-1 rounded-md text-xs font-medium">
                  {statusText}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                ASSOCIATIONS
              </h3>
              <div className="flex space-x-2">
                <img
                  src={ProfileImage}
                  alt="Profile"
                  className="h-[40px] w-[40px] rounded-full"
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                About
              </h3>
              <p className="text-sm">{parse(projectDescription)}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                Area Of Focus
              </h3>
              <div className="flex space-x-2">
                {project_area_of_focus.map((data, index) => (
                  <span
                    key={index}
                    className="bg-white border border-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm"
                  >
                    {data}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                Preferred ICP Hub
              </h3>
              <div className="flex space-x-2">
                <span className="bg-white border border-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  {preferred_icp}
                </span>
              </div>
            </div>

            <div className="mb-4 max-w-sm">
              <h3 className="font-normal mb-2 text-sm text-gray-500">
                Country Of Registration
              </h3>
              {/* <a className="font-normal mb-2 text-sm text-gray-500">
                Country Of Registration
              </a> */}

              {/* <a className="bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center">
                <Add fontSize="small" className="mr-2" />
                <span className="">{country_of_registration}</span>
              </a> */}
              <div className="flex space-x-2">
                <span className="bg-white border border-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm">
                  {country_of_registration}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-normal mb-2 text-sm text-gray-500">LINKS</h3>
              <div className="flex space-x-2">
                {links.map((linkObj, index) => (
                  <a
                    key={index}
                    href={linkObj?.link?.[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {renderIconForLink(linkObj)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
