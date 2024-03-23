import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import logoWithText from "../../../../../IcpAccelerator_frontend/assets/Logo/topLogo.png"
import LogoutModal from "../../models/LogoutModal";
import { useNavigate, useLocation } from "react-router-dom";


const Header = ({ setModalOpen, gradient }) => {
  const principal = useSelector((currState) => currState.internet.principal);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const navigate = useNavigate()
  const location = useLocation();

  // console.log("principal in header", connectedWalletPrincipal);

  const manageHandler = () => {
    !principal ? setModalOpen(true) : setModalOpen(false);
  };

  const getLinkStyle = (path) => {
    return location.pathname === path
      ? "pb-1 border-b-2 border-gray-700 font-bold text-gray-700"
      : "text-gray-500";
  };
  
  
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
          <div className="space-x-3 text-xs md:block hidden cursor-pointer">
            <a onClick={()=>navigate('/dashboard')} className={`${getLinkStyle('/dashboard')}`}>
              Dashboard
            </a>
            <a className={`${getLinkStyle('/users')}`}>
              Users
            </a>
            <a onClick={()=>navigate('/request')} className={`${getLinkStyle('/request')}`}>
              Requests
            </a>
          </div>
        )}

        {principal && isAuthenticated == true ? (
          <LogoutModal />
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
