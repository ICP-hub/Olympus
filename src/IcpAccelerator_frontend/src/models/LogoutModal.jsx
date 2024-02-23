import React, { useState } from "react";
import internetIdentity from "../../assets/WalletLogo/IcpWallet1.png";
// import plug from "../../assets/WalletLogo/PlugWallet.png";
// import bitfinity from "../../assets/WalletLogo/BitfinityWallet.png";
// import astroxMe from "../../assets/WalletLogo/MeWallet.png";
import { useDispatch } from "react-redux";
// import { WalletSignOut } from "../components/Redux/Reducers/WalletAuth";
import { useSelector } from "react-redux";
import { logoutStart } from "../components/Redux/Reducers/InternetIdentityReducer";

const LogoutModal = () => {
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const principal = useSelector((currState) => currState.internet.principal);

  const dispatch = useDispatch();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative z-50 justify-end flex rounded-full">
      {isAuthenticated && (
        <img
          id="avatarButton"
          type="button"
          onClick={() => {
            toggleDropdown();
          }}
          className="w-10 h-10  rounded-full cursor-pointer"
          src={internetIdentity}
          alt="User dropdown"
        />
      )}

      {isDropdownOpen && (
        <div
          id="userDropdown"
          className="absolute  divide-y divide-gray-100 rounded-lg shadow w-48 bg-gray-100 z-10 -top-3 -right-4"
        >
          <div className="px-4 py-3 text-sm text-gray-90 text-black">
            <div className="flex flex-row justify-between w-full">
              <button
                onClick={toggleDropdown}
                type="button"
                className=" bg-transparent hover:text-black rounded-lg text-2xl  text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="8"
                  viewBox="0 0 20 8"
                  fill="none"
                >
                  <path
                    d="M19.2556 4.7793C19.5317 4.77946 19.7557 4.55574 19.7559 4.2796C19.756 4.00346 19.5323 3.77946 19.2562 3.7793L19.2556 4.7793ZM0.902522 3.91471C0.707143 4.10985 0.706953 4.42643 0.902096 4.62181L4.08216 7.80571C4.27731 8.00109 4.59389 8.00128 4.78927 7.80613C4.98465 7.61099 4.98484 7.2944 4.78969 7.09902L1.96297 4.2689L4.7931 1.44217C4.98848 1.24703 4.98867 0.930444 4.79352 0.735065C4.59838 0.539685 4.2818 0.539495 4.08642 0.734639L0.902522 3.91471ZM19.2562 3.7793L1.25616 3.76847L1.25556 4.76847L19.2556 4.7793L19.2562 3.7793Z"
                    fill="#B3B3B3"
                  />
                </svg>
              </button>
              <img
                className="w-10 h-10  rounded-full "
                src={internetIdentity}
                alt={internetIdentity}
              />
            </div>
            <div className="group">
              {" "}
              <div className="truncate w-32 overflow-hidden text-ellipsis group-hover:w-auto group-hover:whitespace-normal group-hover:text-left">
                Principal :{principal}
              </div>
            </div>
          </div>
          <ul
            className="text-sm text-gray-70 text-black font-bold"
            aria-labelledby="avatarButton"
          >
            <li className="block px-4 py-2 hover:bg-gray-200 hover:text-black">
              {" "}
              Dashboard
            </li>
            <li className="block px-4 py-2 hover:bg-gray-200 hover:text-black">
              Settings
            </li>
          </ul>
          <a
            className="block px-4 py-2 text-sm text-black hover:bg-gray-200 hover:text-black font-bold mb-4"
            onClick={() => dispatch(logoutStart())}
          >
            Sign out
          </a>
        </div>
      )}
    </div>
  );
};

export default LogoutModal;
