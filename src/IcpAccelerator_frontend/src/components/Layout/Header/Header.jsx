import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logoWithText from "../../../../assets/Logo/topLogo.png";
import LogoutModal from "../../../models/LogoutModal";
import SwitchRole from "../../../models/SwitchRole";
import { getCurrentRoleStatusRequestHandler } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
const Header = ({ setModalOpen, gradient }) => {
  const dispatch = useDispatch();
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

  return (
    <header className={`text-gray-700 body-font ${gradient}`}>

      <div className="  flex  items-center justify-between px-[5%] lg1:px-[4%] py-[3%]">
        <img
          className="w-auto md:h-[35px] xxs1:h-[30px] xxs:h-[23px] dxs:h-[22px] ss4:h-[22px] ss3:h-[21px] ss2:h-[20px] ss1:h-[19px] ss:h-[19px] sxs3:h-[19px] sxs2:h-[19px] sxs1:h-[19px] sxs:h-[19px] sxxs:h-[18px]  h-[30px]"
          src={logoWithText}
          alt="IcpLogo"
          loading="lazy"
        />

        {isAuthenticated && (
          <div className="space-x-3 text-xs md:block hidden">
            <a href="#" className={`${underline}`}>
              Home
            </a>
            <a href="#" className={`${underline}`}>
              Event
            </a>
            <a href="#" className={`${underline}`}>
              Mentor
            </a>
            <a href="#" className={`${underline}`}>
              Projects
            </a>
          </div>
        )}



        {principal && isAuthenticated == true ? (
          <>
            {userCurrentRoleStatus && userCurrentRoleStatusActiveRole
              ? <div className="flex items-center flex-row gap-2">
                <button onClick={() => setShowSwitchRole(true)} className="border border-violet-800 p-1 font-bold rounded-md text-violet-800 px-2 uppercase">
                  {userCurrentRoleStatusActiveRole}
                </button>
                <SwitchRole isModalOpen={showSwitchRole} onClose={() => setShowSwitchRole(false)} />
                <LogoutModal />
              </div>
              :
              // <div className="flex items-center flex-row gap-2">
              //   <button onClick={() => { dispatch(getCurrentRoleStatusRequestHandler()) }} className="border border-violet-800 p-1 font-bold rounded-md text-violet-800">
              //     Sign Up User
              //   </button>
              //   <LogoutModal />
              // </div>
              <LogoutModal />
            }
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
