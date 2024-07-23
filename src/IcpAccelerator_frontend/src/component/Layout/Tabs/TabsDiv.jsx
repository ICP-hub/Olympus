import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { switchRoleRequestHandler } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";

export default function TabsDiv({ role, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);

  const redirectPath = (val) => {
    switch (val) {
      case "project":
        return "/create-project";
      case "mentor":
        return "/create-mentor";
      case "vc":
        return "/create-investor";
      default:
        return "/";
    }
  };

  const clickEventHandler = async (roleName, status) => {
    if (status === "request") {
      navigate(redirectPath(roleName));
      onClose();
    } else if (status === "switch") {
      setIsChecked(false)
      await dispatch(
        switchRoleRequestHandler({
          roleName,
          newStatus: "active",
        })
      );
      onClose();
      // window.location.href = "/";
    } else {
    }
  };

  const getSpans = (roleName, status) => {

    return (
      <div
        className="border border-[#B8B8B8] flex items-baseline justify-between p-4 bg-gradient-to-l from-[#FFFFFF00] to-[#FFFFFF6B]"
       
      >
        <span className="font-bold text-lg text-[#252641] uppercase">
          {roleName === 'vc' ? 'investor' : roleName}
        </span>
        {status === "current" ? (
          <label className="inline-flex items-center cursor-pointer">
            <input
              disabled={true}
              type="checkbox"
              className="sr-only peer"
              checked={isChecked}
              onChange={() => e.target.checked === true}
            />
            <div
              className={`relative w-11 h-6 bg-[#B2B1B6] rounded-full peer peer-checked:after:translate-x-full ${status.current
                  ? "rtl:peer-checked:after:-translate-x-full"
                  : "peer-checked:after:translate-x-full"
                } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#320099]`}
            ></div>
          </label>
        ) : status === "switch" ? (
          <label className="inline-flex items-center cursor-pointer">
            <input
              disabled={false}
              type="checkbox"
              className="sr-only peer"
              defaultChecked={false}
              onChange={() => clickEventHandler(roleName, status)}
            />
            <div
              className={`relative w-11 h-6 bg-[#B2B1B6] rounded-full peer peer-checked:after:translate-x-full ${status.current
                  ? "rtl:peer-checked:after:-translate-x-full"
                  : "peer-checked:after:translate-x-full"
                } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#320099]`}
            ></div>
          </label>
        ) : (
          <button
            type="button"
            onClick={() => clickEventHandler(roleName, status)}
            className={`capitalize rounded-[44px] text-lg px-3 py-1 ${status === "pending"
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
      return getSpans(role?.name, "pending");
    case "default":
      return getSpans(role?.name, "request");
    default:
      return null;
  }
}
