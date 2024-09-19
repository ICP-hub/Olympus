import React, { useEffect } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import CloseIcon from "@mui/icons-material/Close";
import getSocialLogo from "../../../Utils/navigationHelper/getSocialLogo";

const DiscoverUserModal = ({ openDetail, setOpenDetail, userData }) => {
  console.log("user data =>", userData);



  useEffect(() => {
    if (openDetail) {
      // Prevent background from scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore background scroll when modal is closed
      document.body.style.overflow = "auto";
    }
    // Cleanup when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openDetail]);

  const profilepic =
    userData.profile_picture && userData.profile_picture[0]
      ? uint8ArrayToBase64(userData.profile_picture[0])
      : "default-profile.png";
  console.log("userData", userData);
  console.log(userData?.social_links[0])
  const full_name = userData.full_name || "Unknown User";
  const email = userData.email || "N/A";
  const bio = userData.bio[0] || "No bio available.";
  const area_of_interest = userData.area_of_interest || "N/A";
  const location = userData.country || "Unknown Location";
  const openchat_username = userData.openchat_username[0] ?? "N/A";
  const type_of_profile = userData.type_of_profile[0] ?? "N/A";

  return (
    <div
      className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
        openDetail ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {openDetail && userData && (
        <div
          className={`mx-auto w-full pb-4  sm:w-[60%] lg:w-[40%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
            openDetail ? "translate-x-0" : "translate-x-full"
          } z-20`}
        >
          <div className="p-2 mb-2">
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setOpenDetail(false)}
            />
          </div>
          <div className="container mx-auto justify-center w-full h-full overflow-y-scroll pb-8 ">
            <div className="flex justify-center p-6">
              <div className="container border bg-white rounded-lg shadow-sm h-full overflow-y-scroll w-full ">
                <div className="flex flex-col w-full p-6 bg-gray-100">
                  <img
                    src={profilepic}
                    alt="Matt Bowers"
                    className="w-24 h-24 mx-auto rounded-full mb-2"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="flex items-center justify-center mb-1">
                    <VerifiedIcon
                      className="text-blue-500 mr-1"
                      fontSize="small"
                    />
                    <h2 className="text-xl font-semibold">{full_name}</h2>
                  </div>
                  <p className="text-gray-600 text-center mb-2">
                    @{openchat_username}{" "}
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
                  >
                    Get in touch
                    <ArrowOutwardOutlinedIcon
                      className="ml-1"
                      fontSize="small"
                    />
                  </a>
                </div>

                <div className="p-6 bg-white">
                  <div className="mb-2">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                      Roles
                    </h3>
                    <div className="flex space-x-2">
                      <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">
                        OLYMPIAN
                      </span>
                    </div>
                  </div>
                  <hr />

                  <div className=" ">
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                      <h3 className="font-semibold mb-1 text-xs text-gray-500 uppercase">
                        Email
                      </h3>

                      <div className="flex flex-wrap items-center">
                        <p className="mr-2 text-sm">{email}</p>
                        <VerifiedIcon
                          className="text-blue-500 mr-2 w-2 h-2"
                          fontSize="small"
                        />
                        <span className=" dxs:flex bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
                          HIDDEN
                        </span>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                    <h3 className="font-semibold mb-1 text-xs text-gray-500 uppercase">
                        About
                      </h3>
                      <div>
                        <p className="text-sm line-clamp-3 hover:line-clamp-6">{bio}</p>
                      </div>
                    </div>
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Type of Profile
                      </h3>

                      <div className="flex items-center">
                        <p className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100">{type_of_profile}</p>
                      </div>
                    </div>
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Reason to Join Platform
                      </h3>
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {userData?.reason_to_join[0]?.map((reason, index) => (
                            <span
                              key={index}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Area of Interest
                      </h3>
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {userData?.area_of_interest &&
                            userData.area_of_interest
                              .split(", ")
                              ?.map((interest, index) => (
                                <span
                                  key={index}
                                  className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100"
                                >
                                  {interest}
                                </span>
                              ))}
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Location
                      </h3>
                      <div className="flex gap-2">
                        <PlaceOutlinedIcon
                          sx={{ fontSize: "medium", marginTop: "3px" }}
                        />
                        <p className="text-sm">{location}</p>
                      </div>
                    </div>

                    <div className="p-2 group relative hover:bg-gray-100 rounded-lg">
                      {userData?.social_links[0] && (
                       
                           <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase ">
                          LINKS
                        </h3>
                      )}

                      <div className="flex items-center ">
                        <div className="flex gap-3">
                        {userData?.social_links[0]?.map((linkObj, i) => {
                                const link = linkObj.link[0]; // Assuming the link is in this format
                                const icon = getSocialLogo(link);
                                return (
                                  <a
                                    key={i}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2"
                                  >
                                    {icon}
                                  </a>
                                );
                              })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverUserModal;
