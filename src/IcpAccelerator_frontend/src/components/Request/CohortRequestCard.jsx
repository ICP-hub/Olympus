import React from "react";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import parse from "html-react-parser";
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import PriceIcon from "../../../assets/Logo/PriceIcon.png";

import Avatar from "@mui/material/Avatar";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import NoDataFound from "../Dashboard/DashboardEvents/NoDataFound";
import timestampAgo from "../Utils/navigationHelper/timeStampAgo";

const CohortRequestCard = ({ user, index, activeTabData }) => {
  const title = user.cohort_details.cohort.title;
  const description = user.cohort_details.cohort.description;
  const startDate = user.cohort_details.cohort.start_date;
  const endDate = user.cohort_details.cohort.cohort_end_date;
  const deadline = user.cohort_details.cohort.deadline;
  const noOfSeats = user.cohort_details.cohort.no_of_seats;
  const tags = user.cohort_details.cohort.tags;
  const hostName = user.cohort_details.cohort.host_name.join(", ");
  const fundingType = user.cohort_details.cohort.funding_type;
  const fundingAmount = user.cohort_details.cohort.funding_amount;
  const country = user.cohort_details.cohort.country ?? "global";
  const banner = user.cohort_details.cohort.cohort_banner[0]
    ? uint8ArrayToBase64(user.cohort_details.cohort.cohort_banner[0])
    : [];
  const profileImageSrc = user.enroller_data.user_data[0]?.params
    .profile_picture[0]
    ? uint8ArrayToBase64(
        user.enroller_data.user_data[0]?.params.profile_picture[0]
      )
    : ProfileImage;
  const fullname = user.enroller_data.user_data[0]?.params.full_name;
  const username =
    user.enroller_data.user_data[0]?.params.openchat_username[0] || "";
  const location = user.enroller_data.user_data[0]?.params.country;
  const interests = user.enroller_data.user_data[0]?.params.area_of_interest;
  const about = user.enroller_data.user_data[0]?.params.bio;
  const email = user.enroller_data.user_data[0]?.params.email;
  const reason = user.enroller_data.user_data[0]?.params.reason_to_join;

  let acceptedAt = user?.accepted_at ?? 0n;
  let declinedAt = user?.declined_at ?? 0n;
  let requestStatus = user?.request_status ?? "pending";
  let sentAt = user?.sent_at ?? 0n;

  return (
    <>
      <div key={index} className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 relative">
            <div className="w-[272px] h-[230px]">
              <div
                className="max-w-[230px] w-[230px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden"
                // onClick={() => handleCardClick(userData)}
              >
                <div className="group">
                  <div
                    className="absolute inset-0 blur-sm"
                    style={{
                      backgroundImage: `url(${banner})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={profileImageSrc}
                      alt={title}
                      className="w-24 h-24 rounded-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mt-2">{title}</h3>
              <span className="flex py-2">
                <Avatar
                  alt="Mentor"
                  src={profileImageSrc}
                  className=" mr-2"
                  sx={{ width: 24, height: 24 }}
                />
                <span className="text-gray-500">{fullname}</span>
              </span>
              <span className="mr-2 mb-2 text-[#016AA2] px-3 py-1 rounded-full bg-gray-100 text-sm">
                {activeTabData === "pending" ? (
                  <span className="font-semibold">{timestampAgo(sentAt)}</span>
                ) : activeTabData === "approved" ? (
                  <span className="font-semibold">
                    {timestampAgo(acceptedAt)}
                  </span>
                ) : activeTabData === "declined" ? (
                  <span className="font-semibold">
                    {timestampAgo(declinedAt)}
                  </span>
                ) : activeTabData === "self-reject" ? (
                  <span className="font-semibold">
                    {timestampAgo(selfDeclinedAt)}
                  </span>
                ) : null}
              </span>
              <div className="border-t border-gray-200 mt-2"></div>
              <p
                className="text-sm text-gray-500 overflow-hidden text-ellipsis break-all line-clamp-3 mt-2"
                style={{ maxHeight: "3em", lineHeight: "1em" }}
              >
                {parse(description)}
              </p>
              <div className="flex flex-wrap gap-3 items-center mt-2">
                <div className="flex items-center mt-2">
                  <img
                    src={PriceIcon}
                    alt="Funding Amount"
                    className="w-4 h-4 text-gray-400 mr-2"
                    loading="lazy"
                    draggable={false}
                  />
                  <span className="text-gray-500">{fundingAmount}</span>
                </div>
                <span className="flex items-center mt-2 text-gray-700">
                  <PlaceOutlinedIcon className="" fontSize="small" />
                  {country}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 items-center justify-between mt-2">
                <div className="flex flex-wrap gap-2">
                  {tags
                    ?.split(",")
                    .slice(0, 3)
                    .map((interest, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                      >
                        {interest.trim()}
                      </span>
                    ))}
                </div>
                <div className="flex-grow">
                  {activeTabData === "pending" ? (
                    <span className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full capitalize">
                      {requestStatus}
                    </span>
                  ) : activeTabData === "approved" ? (
                    <span className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full capitalize">
                      {requestStatus}
                    </span>
                  ) : activeTabData === "declined" ? (
                    <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize">
                      {requestStatus}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CohortRequestCard;
