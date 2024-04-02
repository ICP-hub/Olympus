import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import logoWithText from "../../../../assets/Logo/topLogo.png";
import LogoutModal from "../../../models/LogoutModal";
import SwitchRole from "../../../models/SwitchRole";
import { OutSideClickHandler } from "../../hooks/OutSideClickHandler";
import { getCurrentRoleStatusFailureHandler, getCurrentRoleStatusRequestHandler, setCurrentActiveRole, setCurrentRoleStatus } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import { logoSvg } from "../../Utils/Data/SvgData";
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
    if (actor) {
      if (!userCurrentRoleStatus.length) {
        initialApi();
      }
    }
    console.log('userCurrentRoleStatus--in--header', userCurrentRoleStatus)
  }, [actor, dispatch, userCurrentRoleStatus, userCurrentRoleStatusActiveRole]);

  return (
    <header className={`text-gray-700 body-font ${gradient}`}>
      <div className="flex items-center justify-between px-[5%] lg1:px-[4%] py-[3%]">
        <div onClick={() => navigate("/")}>
          <img className="sxs:scale-75 sxs:-ml-5 md:scale-100" src={logoWithText} alt="IcpLogo" loading="lazy" />
        </div>
        {/* <div>
          {logoSvg}
        </div> */}

        {isAuthenticated && (
          <div className="space-x-3 text-xs md:block hidden">
            {/* <a href="" className={`${underline}`}>
              Home
            </a> */}
            {/* <a href="#" className={`${underline}`}>
              Event
            </a>
            <a href="#" className={`${underline}`}>
              Mentor
            </a> */}

            {userCurrentRoleStatus && userCurrentRoleStatusActiveRole && userCurrentRoleStatusActiveRole !== 'user' ?
              <span onClick={() => navigate(
                userCurrentRoleStatusActiveRole === 'project'
                  ? '/project-association-requests'
                  : userCurrentRoleStatusActiveRole === 'mentor'
                    ? '/mentor-association-requests'
                    : userCurrentRoleStatusActiveRole === 'vc'
                      ? "/investor-association-requests"
                      : ''
              )}
                // className={`${underline}`}
                className="cursor-pointer focus:after:absolute focus:after:bg-blue-800 focus:after:block focus:after:bottom-[-4px] focus:after:content-[''] focus:after:h-[2px] focus:after:left-0 focus:after:w-full relative text-lg"
              >
                Associations
              </span>
              : ''}

          </div>
        )}

        {principal && isAuthenticated == true ? (
          <>
            {userCurrentRoleStatus && userCurrentRoleStatusActiveRole ? (
              <div className="flex items-center flex-row gap-2">
                {/* {userCurrentRoleStatusActiveRole !== 'user' ?
                  <button
                    onClick={() => navigate(
                      userCurrentRoleStatusActiveRole === 'project'
                        ? '/project-association-requests'
                        : userCurrentRoleStatusActiveRole === 'mentor'
                          ? '/mentor-association-requests'
                          : userCurrentRoleStatusActiveRole === 'investor'
                            ? "/investor-association-requests"
                            : ''
                    )}
                    className="border border-violet-800 md:p-1 font-bold rounded-md text-violet-800 md:px-2 px-1 text-base md:text-lg  uppercase"
                  >associations</button> : ''} */}
                <button
                  onClick={() => setShowSwitchRole(true)}
                  className="border border-violet-800 md:p-1 font-bold rounded-md text-violet-800 md:px-2 px-1 text-base md:text-lg  uppercase"
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
              // <div className="flex items-center flex-row gap-2">
              //   <button onClick={() => { dispatch(getCurrentRoleStatusRequestHandler()) }} className="border border-violet-800 p-1 font-bold rounded-md text-violet-800">
              //     Sign Up User
              //   </button>
              //   <LogoutModal />
              // </div>
              <LogoutModal />
            )}
          </>
        ) : (
          <button
            type="button"
            className="font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap"
            onClick={manageHandler}
          >
            SIGN UP NOW
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
