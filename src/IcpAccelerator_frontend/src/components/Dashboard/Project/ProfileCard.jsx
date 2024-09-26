import React, { useCallback, useState } from "react";
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
import Avatar from "@mui/material/Avatar";
import parse from "html-react-parser";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import getSocialLogo from "../../Utils/navigationHelper/getSocialLogo";
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

  const projectDetail = cardData;
  console.log(
    "my card..../////",
    projectDetail?.[0][0]?.params?.mentors_assigned?.[0][0][1]?.params
  );

  let mergedProfiles = [];

  // Extracting mentor profiles
  if (projectDetail?.[0]?.[0]?.params?.mentors_assigned?.[0]?.length > 0) {
    projectDetail[0][0].params.mentors_assigned[0].forEach((mentorGroup) => {
      mentorGroup.forEach((mentor) => {
        const mentorParams = mentor.params;
        const profilePicture = mentorParams?.profile_picture[0]
          ? uint8ArrayToBase64(mentorParams.profile_picture[0])
          : null;

        mergedProfiles.push({
          profile_picture: profilePicture,
          role: "mentor",
        });
      });
    });
  }

  // Extracting VC profiles
  if (projectDetail?.[0]?.[0]?.params?.vc_assigned?.[0]?.length > 0) {
    projectDetail[0][0].params.vc_assigned[0].forEach((vcGroup) => {
      vcGroup.forEach((vc) => {
        const vcParams = vc.params;
        const profilePicture = vcParams?.profile_picture[0]
          ? uint8ArrayToBase64(vcParams.profile_picture[0])
          : null;

        mergedProfiles.push({
          profile_picture: profilePicture,
          role: "vc", // Mark role as VC
        });
      });
    });
  } else {
    console.log("No VCs assigned or data is missing");
  }

  console.log("mergedProfiles", mergedProfiles); // Log merged profiles
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = useCallback(
    (index) => {
      if (hoveredIndex !== index) {
        setHoveredIndex(index);
        setActiveIndex(index);
      }
    },
    [hoveredIndex]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setActiveIndex(null);
  }, []);

  const handleTransitionEnd = () => {
    if (hoveredIndex === null) {
      setActiveIndex(null);
    }
  };
  return (
    <div className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full dlg:max-w-[400px]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full dlg:max-w-sm">
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
                loading="lazy"
                draggable={false}
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
                <span className="bg-[#FFFAEB] border border-[#83e24d] text-[#83e24d] px-3 py-1 rounded-md text-xs font-medium">
                  {statusText}
                </span>
              </div>
            </div>

            {/* {mergedProfiles && mergedProfiles.length > 0 && (
              <div className="mb-4">
                <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                  ASSOCIATIONS
                </h3>
                <div className="flex items-center space-x-2">
                  {mergedProfiles.map((association, index) => (
                    <div
                      key={index}
                      className="relative flex items-center transition-all duration-600 ease-cubic-bezier(0.25, 0.1, 0.25, 1)"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      onTransitionEnd={handleTransitionEnd}
                    >
                      <span
                        className={`absolute left-12 transition-all duration-600 ease-cubic-bezier(0.25, 0.1, 0.25, 1) transform ${
                          activeIndex === index
                            ? "translate-x-0 opacity-100 delay-100"
                            : "-translate-x-4 opacity-0"
                        }`}
                      >
                        {association?.role}
                      </span>

                      <Avatar
                        src={association?.profile_picture}
                        alt={`Avatar of ${association.name}`}
                        className={`h-12 w-12 rounded-full transition-transform duration-600 ease-cubic-bezier(0.25, 0.1, 0.25, 1) hover:scale-105 ${
                          activeIndex === index ? "mr-16 delay-100" : "mr-0"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            {mergedProfiles && mergedProfiles.length > 0 && (
              <div className="mb-4">
                <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
                  ASSOCIATIONS
                </h3>
                <div className="flex items-center space-x-2">
                  {mergedProfiles
                    .filter((association) => association.profile_picture) // Filter out profiles with null profile_picture
                    .map((association, index) => (
                      <div
                        key={index}
                        className="relative flex items-center transition-all duration-600 ease-cubic-bezier(0.25, 0.1, 0.25, 1)"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        onTransitionEnd={handleTransitionEnd}
                      >
                        <span
                          className={`absolute left-12 transition-all duration-600 ease-cubic-bezier(0.25, 0.1, 0.25, 1) transform ${
                            activeIndex === index
                              ? "translate-x-0 opacity-100 delay-100"
                              : "-translate-x-4 opacity-0"
                          }`}
                        >
                          {association?.role}
                        </span>

                        <Avatar
                          src={association.profile_picture}
                          alt={`Avatar of ${association.name}`}
                          className={`h-12 w-12 rounded-full transition-transform duration-600 ease-cubic-bezier(0.25, 0.1, 0.25, 1) hover:scale-105 ${
                            activeIndex === index ? "mr-16 delay-100" : "mr-0"
                          }`}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

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
                    className="flex items-center"
                  >
                    {getSocialLogo(linkObj?.link?.[0])}
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
