import React, { useEffect, useState,useRef } from "react";
import {
  closeModalSvg,
  walletModalSvg,
} from "../component/Utils/Data/SvgData";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/StateManagement/useContext/useAuth";

const ConnectWallet = ({ isModalOpen, onClose }) => {
  const [navigationTriggered, setNavigationTriggered] = useState(false);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const userFullData = useSelector((currState) => currState.userData.data?.Ok);
  const { login } = useAuth();
  const modalRef = useRef(null);
    const navigate = useNavigate();

  useEffect(() => {
    // Only trigger navigation if the modal is closed and navigation hasn't been triggered yet
    if (
      !isModalOpen &&
      !navigationTriggered &&
      isAuthenticated !== undefined &&
      userFullData !== undefined
    ) {
      if (isAuthenticated) {
        if (userFullData) {
          navigate("/dashboard");
        } else {
          navigate("/register-user");
        }
      } else {
        navigate("/");
      }

      setNavigationTriggered(true); // Ensure navigation only triggers once
      onClose(); // Close the modal after navigation
    }
  }, [isAuthenticated, userFullData, navigate, onClose, isModalOpen, navigationTriggered]);

  const loginHandler = async (val) => {
    await login(val);
    onClose(); // Close the modal after login
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return isModalOpen ? (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
          <div className="overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
            <div
              className="relative p-4 w-full max-w-md max-h-full"
              ref={modalRef}
            >
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm h-8 w-8 inline-flex justify-center items-center z-10"
                    onClick={onClose}
                  >
                    {closeModalSvg}
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 grow text-center absolute left-0 right-0">
                    Signup / Signin
                  </h3>
                </div>
                <div className="p-4 md:p-5">
                  <ul className="cursor-pointer">
                    {walletModalSvg.map((wallet, index) => (
                      <a key={index} onClick={() => loginHandler(wallet.id)} target="_self">
                        {wallet.content}
                      </a>
                    ))}
                  </ul>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
    </>
  ) : null;
};

export default ConnectWallet;
