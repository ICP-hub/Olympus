import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import logoWithText from "../../../../assets/Logo/topLogo.png";
import topLogoWhitepng from "../../../../assets/Logo/topLogoWhitepng.png";
import LogoutModal from "../../../models/LogoutModal";
import SwitchRole from "../../../models/SwitchRole";
import {
  getCurrentRoleStatusFailureHandler,
  setCurrentActiveRole,
  setCurrentRoleStatus,
} from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import { useNavigate } from "react-router-dom";

const Header = ({ setModalOpen, gradient }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const [showSwitchRole, setShowSwitchRole] = useState(false);

  const manageHandler = () => {
    !principal ? setModalOpen(true) : setModalOpen(false);
  };

  const underline =
    "relative focus:after:content-[''] focus:after:block focus:after:w-full focus:after:h-[2px] focus:after:bg-blue-800 focus:after:absolute focus:after:left-0 focus:after:bottom-[-4px]";

  function getNameOfCurrentStatus(rolesStatusArray) {
    const currentStatus = rolesStatusArray.find(
      (role) => role.status === "active"
    );
    return currentStatus ? currentStatus.name : null;
  }

  function formatFullDateFromBigInt(bigIntDate) {
    const date = new Date(Number(bigIntDate / 1000000n));
    const dateString = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${dateString}`;
  }

  function cloneArrayWithModifiedValues(arr) {
    return arr.map((obj) => {
      const modifiedObj = {};

      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          if (
            key === "approved_on" ||
            key === "rejected_on" ||
            key === "requested_on"
          ) {
            // const date = new Date(Number(obj[key][0])).toLocaleDateString('en-US');
            const date = formatFullDateFromBigInt(obj[key][0]);
            modifiedObj[key] = date; // Convert bigint to string date
          } else {
            modifiedObj[key] = obj[key][0]; // Keep the first element of other arrays unchanged
          }
        } else {
          modifiedObj[key] = obj[key]; // Keep other keys unchanged
        }
      });

      return modifiedObj;
    });
  }

 
  const initialApi = async (isMounted) => {
    try {
      const currentRoleArray = await actor.get_role_status();
      if (isMounted) {
        if (currentRoleArray && currentRoleArray.length !== 0) {
          const currentActiveRole = getNameOfCurrentStatus(currentRoleArray);
          dispatch(
            setCurrentRoleStatus(cloneArrayWithModifiedValues(currentRoleArray))
          );
          dispatch(setCurrentActiveRole(currentActiveRole));
        } else {
          dispatch(
            getCurrentRoleStatusFailureHandler("error-in-fetching-role-at-header")
          );
          dispatch(setCurrentActiveRole(null));
        }
      }
    } catch (error) {
      if (isMounted) {
        dispatch(getCurrentRoleStatusFailureHandler(error.toString()));
        dispatch(setCurrentActiveRole(null));
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (actor && principal && isAuthenticated) {
      if (!userCurrentRoleStatus.length) {
        initialApi(isMounted);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [
    actor,
    principal,
    isAuthenticated,
    dispatch,
    userCurrentRoleStatus,
    userCurrentRoleStatusActiveRole,
  ]);


  return (
    <header
      className={`text-gray-700 body-font`}
      style={{
        background:
          (!userCurrentRoleStatusActiveRole ||
            userCurrentRoleStatusActiveRole === "user") &&
          window.location.pathname === "/"
            ? "linear-gradient(163deg, #3B00B9 0%, #D38ED7 100%)"
            : "#F3F4F6",
      }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-[5%] lg1:px-[4%] py-[2%]">
          <div onClick={() => navigate("/")}>
            <img
              className="sxs:scale-75 sxs:-ml-5 md:scale-100 cursor-pointer"
              onClick={() => (window.location.href = "/")}
              src={
                (!userCurrentRoleStatusActiveRole ||
                  userCurrentRoleStatusActiveRole === "user") &&
                window.location.pathname === "/"
                  ? topLogoWhitepng
                  : logoWithText
              }
              alt="IcpLogo"
              loading="lazy"
                    draggable={false}
            />
          </div>
          {isAuthenticated && (
            <div className="md:flex hidden cursor-pointer"></div>
          )}

          {principal && isAuthenticated ? (
            <>
              {userCurrentRoleStatus && userCurrentRoleStatusActiveRole ? (
                <div className="flex items-center flex-row gap-2 z-20">
                  <button
                    onClick={() => setShowSwitchRole(true)}
                    className={
                      (!userCurrentRoleStatusActiveRole ||
                        userCurrentRoleStatusActiveRole === "user") &&
                      window.location.pathname === "/"
                        ? " hover:bg-white hover:text-violet-800 border border-white md:p-1 font-bold rounded-md text-white md:px-2 px-1 text-base md:text-lg  uppercase backdrop-blur-xl"
                        : "hover:bg-violet-800 hover:text-white border border-violet-800 md:p-1 font-bold rounded-md text-violet-800 md:px-2 px-1 text-base md:text-lg  uppercase backdrop-blur-xl"
                    }
                  >
                    {userCurrentRoleStatusActiveRole == "vc"
                      ? "investor"
                      : userCurrentRoleStatusActiveRole}
                  </button>
                  <SwitchRole
                    isModalOpen={showSwitchRole}
                    onClose={() => setShowSwitchRole(false)}
                  />
                  <LogoutModal />
                </div>
              ) : (
                <LogoutModal />
              )}
            </>
          ) : (
            <button
              type="button"
              className="font-bold rounded-xl my-2 bg-transparent border-2 border-white/50 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[14.5px] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap group-hover:bg-white group-hover:text-[#BA77FB] z-20"
              onClick={manageHandler}
            >
              <span className="">SIGNUP / SIGNIN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
