import React, { useEffect, useState } from "react";
import internetIdentity from "../../assets/WalletLogo/IcpWallet.png";
import plug from "../../assets/WalletLogo/PlugWallet.png";
import bitfinity from "../../assets/WalletLogo/BitfinityWallet.png";
import astroxMe from "../../assets/WalletLogo/MeWallet.png";
import { useDispatch } from "react-redux";
import { WalletSignOut } from "../components/Redux/Reducers/WalletAuth";
import { useSelector } from "react-redux";

const LogoutModal = () => {
  const walletActive = useSelector((curr) => curr.auth.walletConnected);
  const dispatch = useDispatch();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [walletType, setWalletType] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    switch (walletActive) {
      case "internetIdentity":
        setWalletType(internetIdentity);
        break;
      case "astroxMe":
        setWalletType(astroxMe);
        break;
      case "bitfinity":
        setWalletType(bitfinity);
        break;
      case "plug":
        setWalletType(plug);
        break;
      default:
        if (walletActive) {
          alert(`The wallet type '${walletActive}' is not supported yet.`);
        }
        break;
    }
  }, [walletActive]);
  
  return (
    <div className="relative justify-end flex ss:px-[0.95rem] sxs3:px-[0.93rem] sxs2:px-[0.9rem] sxs1:px-[0.8rem] sxs:px-[0.75rem] sxxs:px-[0.7rem]">
      <img
        id="avatarButton"
        type="button"
        onClick={() => {
          toggleDropdown();
        }}
        className="w-10 h-10  rounded-full cursor-pointer"
        src={walletType}
        alt="User dropdown"
      />

      {isDropdownOpen && (
        <div
          id="userDropdown"
          className="absolute  divide-y divide-gray-100 rounded-lg shadow w-44 bg-gradient-to-r from-[#8D3494] to-[#4B0FAC] z-10"
        >
          <div className="px-4 py-3 text-sm text-gray-90 text-white">
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
                src={walletType}
                alt={walletType}
              />
            </div>

            <div>Bonnie Green</div>
            <div className="font-medium truncate">name@flowbite.com</div>
          </div>
          <ul
            className="py-2 text-sm text-gray-70 text-gray-200"
            aria-labelledby="avatarButton"
          >
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Earnings
              </a>
            </li>
          </ul>
          <div className="py-1">
            <a
              className="block px-4 py-2 text-sm text-white hover:bg-gray-100 "
              onClick={() => dispatch(WalletSignOut())}
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutModal;
