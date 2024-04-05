import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import logoWithText from "../../../../assets/Logo/topLogo.png";
import topLogoWhitepng from "../../../../assets/Logo/topLogoWhitepng.png";

import LogoutModal from "../../../models/LogoutModal";
import SwitchRole from "../../../models/SwitchRole";
import { getCurrentRoleStatusFailureHandler, setCurrentActiveRole, setCurrentRoleStatus } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
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
  // console.log("principal in header", connectedWalletPrincipal);

  const manageHandler = () => {
    !principal ? setModalOpen(true) : setModalOpen(false);
  };

  const underline =
    "relative focus:after:content-[''] focus:after:block focus:after:w-full focus:after:h-[2px] focus:after:bg-blue-800 focus:after:absolute focus:after:left-0 focus:after:bottom-[-4px]";


  const initialApi = async () => {
    try {
      const currentRoleArray = await actor.get_role_status()
      if (currentRoleArray && currentRoleArray.length !== 0) {
        const currentActiveRole = getNameOfCurrentStatus(currentRoleArray)
        dispatch(setCurrentRoleStatus(currentRoleArray));
        dispatch(setCurrentActiveRole(currentActiveRole));
      } else {
        dispatch(getCurrentRoleStatusFailureHandler('error-in-fetching-role-at-header'));
        dispatch(setCurrentActiveRole(null));
      }
    } catch (error) {
      dispatch(getCurrentRoleStatusFailureHandler(error.toString()));
      dispatch(setCurrentActiveRole(null));
    }
  }


  useEffect(() => {
    if (actor && principal && isAuthenticated) {
      if (!userCurrentRoleStatus.length) {
        initialApi();
      }
    }
    console.log('userCurrentRoleStatus--in--header', userCurrentRoleStatus)
  }, [actor, principal, isAuthenticated, dispatch, userCurrentRoleStatus, userCurrentRoleStatusActiveRole]);

  console.log('userCurrentRoleStatusActiveRole--in--header', userCurrentRoleStatusActiveRole)


  return (
    <header className={`text-gray-700 body-font ${(!userCurrentRoleStatusActiveRole || userCurrentRoleStatusActiveRole === 'user') && window.location.pathname === "/" ?
      "bg-gradient-to-r from-purple-900 via-purple-500 to-purple-400" : "bg-gray-100"}`}>
      <div className="flex items-center justify-between px-[5%] lg1:px-[4%] py-[3%]">
        <div onClick={() => navigate("/")}>
          <img className="sxs:scale-75 sxs:-ml-5 md:scale-100 cursor-pointer" onClick={() => window.location.href = "/"}
            src={(!userCurrentRoleStatusActiveRole || userCurrentRoleStatusActiveRole === 'user') && window.location.pathname === "/" ? topLogoWhitepng : logoWithText} alt="IcpLogo" loading="lazy" />
        </div>
        {isAuthenticated && (
          <div className="md:flex hidden cursor-pointer">
            {/* <a href="/" className={`${underline}`}>
              Home
            </a> */}
            {/* home disabled */}
            {/* <div onClick={() => window.location.href = "/"}
              className={`rounded-full px-8 py-[2px] group-hover:bg-[#6E52AA] group-hover:text-white font-fontUse ${(!userCurrentRoleStatusActiveRole || userCurrentRoleStatusActiveRole === 'user') && window.location.pathname === "/" ? 'text-white' : 'text-blue-800'}`}>
              Home
            </div> */}
            {/* <a href="#" className={`${underline}`}>
              Event
            </a>
            <a href="#" className={`${underline}`}>
              Mentor
            </a> */}

            {/* {userCurrentRoleStatus && userCurrentRoleStatusActiveRole && userCurrentRoleStatusActiveRole !== 'user' ?
              <div className={`rounded-full px-8 py-[2px] group-hover:bg-[#6E52AA] group-hover:text-white ${(!userCurrentRoleStatusActiveRole || userCurrentRoleStatusActiveRole === 'user') && window.location.pathname === "/" ? 'text-white' : 'text-blue-800'}`}
                onClick={() => navigate(
                  userCurrentRoleStatusActiveRole === 'project'
                    ? '/project-association-requests'
                    : userCurrentRoleStatusActiveRole === 'mentor'
                      ? '/mentor-association-requests'
                      : userCurrentRoleStatusActiveRole === 'vc'
                        ? "/investor-association-requests"
                        : ''
                )}
              >
                Associations
              </div>
              : ''} */}

          </div>
        )}

        {principal && isAuthenticated ? (
          <>
            {userCurrentRoleStatus && userCurrentRoleStatusActiveRole ? (
              <div className="flex items-center flex-row gap-2 z-20">
                <button
                  onClick={() => setShowSwitchRole(true)}
                  className={
                    (!userCurrentRoleStatusActiveRole || userCurrentRoleStatusActiveRole === 'user') && window.location.pathname === "/"
                      ? " hover:bg-white hover:text-violet-800 border border-white md:p-1 font-bold rounded-md text-white md:px-2 px-1 text-base md:text-lg  uppercase"
                      : "hover:bg-violet-800 hover:text-white border border-violet-800 md:p-1 font-bold rounded-md text-violet-800 md:px-2 px-1 text-base md:text-lg  uppercase"}
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
              <div className="flex items-center flex-row gap-2 z-20">

                <button
                  // onClick={() => setShowSwitchRole(true)}
                  onClick={() => window.location.reload()}
                  className={
                    (!userCurrentRoleStatusActiveRole || userCurrentRoleStatusActiveRole === 'user') && window.location.pathname === "/"
                      ? "hover:bg-white hover:text-violet-800 border border-white md:p-1 font-bold rounded-md text-white md:px-2 px-1 text-base md:text-lg  uppercase"
                      : "hover:bg-violet-800 hover:text-white border border-violet-800 md:p-1 font-bold rounded-md text-violet-800 md:px-2 px-1 text-base md:text-lg  uppercase"}
                >
                  {/* {userCurrentRoleStatusActiveRole == "vc"
                    ? "investor"
                    : userCurrentRoleStatusActiveRole} */}
                    get role
                </button>
                <LogoutModal />
              </div>
            )}
          </>
        ) : (
          // <button
          //   type="button"
          //   className="font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap"
          //   onClick={manageHandler}
          // >
          //   SIGNUP / LOGIN
          // </button>
          <button
            type="button"
            className="font-bold rounded-xl my-2 bg-transparent border-2 border-white/50 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[14.5px] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap group-hover:bg-white group-hover:text-[#BA77FB] z-20"
            onClick={manageHandler}
          >
            <span className="">SIGNUP / SIGNIN</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
