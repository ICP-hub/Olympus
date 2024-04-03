import React from "react";
import logo from "../../../../IcpAccelerator_frontend/assets/Logo/topLogoWhitepng.png"


const Footer = () => {
  return (
    <footer className="text-white bg-custumPurple py-8 z-10 bottom">
      <div className="container flex justify-center sm:justify-between w-full mx-auto px-4 lg:px-10">
        <div className="flex flex-col sm:flex-row w-full justify-between items-center">
          <h4 className="text-xl font-bold mb-3">
            <img src={logo} alt="logo" className="text-white" />
          </h4>
          <ul className="list-none text-sm p-0 m-0 flex items-center space-x-4">
            <li className="text-white">
              <a href="#">© {new Date().getFullYear()} All Rights Reserved</a>
            </li>
          </ul>
        </div>
        {/* <div className="mb-4">
            <h4 className="text-xl font-bold mb-2 text-white">Services</h4>
            <ul className="list-none text-sm p-0 m-0 text-white underline">
              <li className="mb-2">
                <a href="#">Base Camp</a>
              </li>
              <li className="mb-2">
                <a href="#">Ascent</a>
              </li>
              <li className="mb-2">
                <a href="#">Elevate</a>
              </li>
              <li className="mb-2">
                <a href="#">Investors</a>
              </li>
              <li className="mb-2">
                <a href="#">Partners</a>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2 text-white">Company</h4>
            <ul className="list-none text-sm p-0 m-0 text-white underline">
              <li className="mb-2">
                <a href="#">About us </a>
              </li>
              <li className="mb-2">
                <a href="#">Offices </a>
              </li>
              <li className="mb-2">
                <a href="#">News </a>
              </li>
              <li className="mb-2">
                <a href="#">Mission & Values </a>
              </li>
              <li className="mb-2">
                <a href="#">Careers </a>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2 text-white">Legal</h4>
            <ul className="list-none text-sm p-0 m-0 text-white underline">
              <li className="mb-2">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#">Terms & Conditions</a>
              </li>
            </ul>
          </div> */}
        {/* </div> */}
      </div>
    </footer>
  );
};

export default Footer;
