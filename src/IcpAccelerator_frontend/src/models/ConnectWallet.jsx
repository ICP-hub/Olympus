import React, { useEffect, useState } from "react";
import { closeModalSvg } from "../components/Utils/Data/SvgData";
import { walletModalSvg } from "../components/Utils/Data/SvgData";
import { useDispatch } from "react-redux";
// import {
//   // triggerInternetIdentity,
//   triggerPlugWallet,
//   triggeBitfinityWallet,
// } from "../components/Redux/Reducers/WalletAuth";
import { loginStart } from "../components/Redux/Reducers/InternetIdentityReducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Loader from "../components/Loader/Loader";


const ConnectWallet = ({ isModalOpen, onClose }) => {
  const roleNavigate = useSelector((currState) => currState.internet.navi);
  const userRole = useSelector((currState) => currState.current.specificRole);
  const hasSelectedRole  = useSelector((currState)=> currState.current.hasSelectedRole)
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("bande ka role ", userRole);



  useEffect(() => {
    console.log("isAuthenticated=> ", isAuthenticated,"roleNavigate =>", roleNavigate,"userRole=>", userRole , 'hasSelectedRole =>', hasSelectedRole)
    if (userRole  && isAuthenticated) {
      console.log("1");
      onClose();
      navigate("/dashboard");
    } else if (
      userRole === null &&
      roleNavigate === "roleSelect" &&
      isAuthenticated && hasSelectedRole === false
    ) {
      console.log("2");
      onClose();
      navigate(`/${roleNavigate}`);
    }else if(hasSelectedRole ===true && isAuthenticated && userRole!== null){
      navigate('/details')
    } else if(!isAuthenticated) {
      console.log("3");
      navigate("/");
    }
  }, [isAuthenticated, roleNavigate, userRole]);


  
  const handleClick = (walletType) => {
    if (!walletType) {
      console.log("No wallet type specified.");
      return;
    }
    switch (walletType) {
      case "internetIdentity":
        dispatch(loginStart());
        break;
      // case "bitfinity":
      //   dispatch(triggeBitfinityWallet());
      //   break;
      // case "plug":
      //   dispatch(triggerPlugWallet());
      //   break;
      default:
        alert(`The wallet type '${walletType}' is not supported yet.`);
        break;
    }
  };



  return (
    <>
      {isModalOpen && (
        <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm h-8 w-8 inline-flex justify-center items-center"
                  onClick={onClose}
                >
                  {closeModalSvg}
                </button>
                <h3 className="text-lg font-semibold text-gray-900 grow text-center">
                  Log in or Sign up
                </h3>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-[16px] font-normal text-gray-500 text-center">
                  If you already have - continue with method you have used
                  previously.
                </p>
                <ul className="my-4 space-y-3 cursor-pointer">
                  {walletModalSvg.map((wallet, index) => (
                    <div key={index} onClick={() => handleClick(wallet.id)}>
                      {wallet.content}
                    </div>
                  ))}
                </ul>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWallet;
