import React, { useEffect } from "react";
import { closeModalSvg } from "../Utils/AdminData/SvgData";
import { walletModalSvg } from "../Utils/AdminData/SvgData";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AdminStateManagement/useContext/useAuth";

const ConnectWallet = ({ isModalOpen, onClose }) => {

  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const { login } = useAuth();
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async () => {
    await login();
    onClose();
    window.location.reload();
  };

  useEffect(async () => {
    if (isAuthenticated) {
      await navigate("/dashboard");
    }
    onClose()
  }, [isAuthenticated]);

  return (
    <>
      {isModalOpen && (
        <div className=" inset-0 bg-black bg-opacity-30 backdrop-blur-sm overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
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
                Signup / Signin
                </h3>
              </div>
              <div className="p-4 md:p-5">
                {/* <p className="text-[16px] font-normal text-gray-500 text-center">
                  If you already have - continue with method you have used
                  previously.
                </p> */}
                <ul className="my-4 space-y-3 cursor-pointer">
                  {walletModalSvg.map((wallet, index) => (
                    <div key={index} onClick={loginHandler}>
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
