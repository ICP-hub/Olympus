import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import logoWithText from "../../../../assets/Logo/topLogo.png";
import LogoutModal from "../../../models/LogoutModal";

const Header = ({ setModalOpen, gradient }) => {
  const principal = useSelector((currState) => currState.internet.principal);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );

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
          <LogoutModal />
        ) : (
          <button
            type="button"
            className="rounded-md bg-indigo-600"
            onClick={manageHandler}
          >
            <div className="text-center text-white text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] font-fontUse px-4 ss:px-[0.95rem] sxs3:px-[0.93rem] sxs2:px-[0.9rem] sxs1:px-[0.8rem] sxs:px-[0.75rem] sxxs:px-[0.7rem] font-bold py-1">
              SIGN UP NOW
            </div>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
