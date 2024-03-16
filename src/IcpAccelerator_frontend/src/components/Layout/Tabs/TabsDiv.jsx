import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { switchRoleRequestHandler } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";

export default function TabsDiv({ role, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectPath = (val) => {
    switch (val) {
      case "project":
        return "/create-project";
      case "mentor":
        return "/create-mentor";
      case "vc":
        return "/create-vc";
      default:
        return "/";
    }
  };

  const clickEventHandler = async (roleName, status) => {
    if (status === "request") {
      navigate(redirectPath(roleName));
      onClose();
    } else if (status === "switch") {
      await dispatch(
        switchRoleRequestHandler({
          roleName,
          newStatus: "active",
        })
      );
      onClose();
      window.location.href = "/";
    } else {
    }
  };

  const getSpans = (roleName, status) => {
    const [isChecked, setIsChecked] = useState(true);

    const handleCheckboxClick = () => {
      if (status === "switch") {
        setIsChecked(true);
      }
    };
    return (
      <div
        className="border border-[#B8B8B8] flex items-baseline justify-between p-4 bg-gradient-to-l from-[#FFFFFF00] to-[#FFFFFF6B]"
        onClick={() => clickEventHandler(roleName, status)}
      >
        <span className="font-bold text-lg text-[#252641] uppercase">
          {roleName}
        </span>
        {status === "current" && "switch" ? (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isChecked}
              onClick={handleCheckboxClick}
            />
            <div
              className={`relative w-11 h-6 bg-[#B2B1B6] rounded-full peer peer-checked:after:translate-x-full ${
                status.current
                  ? "rtl:peer-checked:after:-translate-x-full"
                  : "peer-checked:after:translate-x-full"
              } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
            ></div>
          </label>
        ) : (
          <button
            type="button"
            className={`rounded-[44px] text-lg px-3 py-1 ${
              status === "Pending"
                ? "bg-[#E5E5E5] text-[#737373] font-normal"
                : "bg-[#320099] text-[#FFFFFF] font-bold"
            }`}
          >
            {status}
          </button>
        )}
      </div>
    );
  };

  switch (role?.status) {
    case "active":
      return getSpans(role?.name, "current");
    case "approved":
      return getSpans(role?.name, "switch");
    case "requested":
      return getSpans(role?.name, "Pending");
    case "default":
      return getSpans(role?.name, "Request");
    default:
      return null;
  }
}
