import React, { useState } from "react";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ok from "../../../../assets/images/ok.jpg";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import ticket1 from "../../../../assets/images/ticket-01.png";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
const RequestEventCard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <div className="rounded-xl border p-1.5 pl-3 text-gray-400 w-[60%] ">
          <SearchIcon />
          <input
            className="ml-2"
            type="text"
            placeholder="search peoples, events"
          />
        </div>
        <div className="text-gray-400 ">
          <FilterAltOutlinedIcon
            sx={{ cursor: "pointer" }}
            onClick={toggleFilterDropdown}
          />
          {isFilterOpen && (
            <div className="absolute right-20 mt-2 w-48 bg-white border rounded shadow-lg p-3">
              <p className="text-sm cursor-pointer hover:bg-slate-100 rounded p-1 text-gray-700">
                Accepted
              </p>
              <p className="text-sm cursor-pointer hover:bg-slate-100 rounded p-1 text-gray-700">
                Rejected
              </p>
              <p className="text-sm cursor-pointer hover:bg-slate-100 rounded p-1 text-gray-700">
                Pending
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-3 border my-5">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-1 border rounded relative">
            <div className="max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]">
              <p className="text-base mb-2 font-bold">20 June - 22 June</p>
              <p className="text-sm font-normal">14:00 - 20:00 CEST</p>
            </div>
            <img
              src={ok}
              alt="bg image"
              className="w-[200px] h-[240px] rounded-lg mr-4 object-cover"
            />
          </div>
          <div className="my-3 pl-4">
            <div>
              <p className="bg-white font-normal border-2 borer-[#CDD5DF] text-[#364152] w-[86px] px-3 py-1 rounded-full text-xs">
                Workshop
              </p>
              <h3 className="text-lg font-semibold mt-2">Demo Heading</h3>
              <p className="text-sm text-gray-500 mt-2">Demo Description</p>
            </div>
            <div className="flex gap-3 items-center mt-3">
              <span className="text-sm text-[#121926]">
                <PlaceOutlinedIcon
                  className="text-[#364152]"
                  fontSize="small"
                />
                Online
              </span>
              <span>
                <img className="text-sm text-[#121926]" src={ticket1} alt="" />{" "}
              </span>
              <span className="text-sm text-[#121926]"> Free</span>
              <div className="flex -space-x-1 ">
                
                {/* <AvatarGroup
                  max={4}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 24,
                      height: 24,
                      marginTop: "1px",
                    }, // Applies to all avatars
                    "& .MuiAvatarGroup-avatar": { width: 24, height: 24 }, // Specifically targets the "+X" avatar
                  }}
                >
                  <Avatar
                    sx={{ width: 24, height: 24, marginTop: "1px" }}
                    alt="Remy Sharp"
                    src={ok}
                  />
                  <Avatar
                    sx={{ width: 24, height: 24, marginTop: "1px" }}
                    alt="Travis Howard"
                    src={ok}
                  />
                  <Avatar
                    sx={{ width: 24, height: 24, marginTop: "1px" }}
                    alt="Cindy Baker"
                    src={ok}
                  />
                  <Avatar
                    sx={{ width: 24, height: 24, marginTop: "1px" }}
                    alt="Agnes Walker"
                    src={ok}
                  />
                  <Avatar
                    sx={{ width: 24, height: 24, marginTop: "1px" }}
                    alt="Trevor Henderson"
                    src={ok}
                  />
                </AvatarGroup> */}
              </div>
            </div>
            <div className="flex justify-start gap-3 mt-3">
              <button className="bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center justify-center ">
                Accept
              </button>
              <button className="text-[#155EEF] bg-white px-2 py-2 rounded-md flex items-center justify-center ">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestEventCard;


