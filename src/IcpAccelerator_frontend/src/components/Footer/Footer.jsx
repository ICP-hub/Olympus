import React from "react";
// import logo from "../../../assets/Logo/icpLogo.png";
import logo from "../../../assets/Logo/topLogo.png";


const Footer = () => {
  return (
    <footer className="text-white bg-custumPurple py-8 z-10 bottom">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-3">
              <img src={logo} alt="logo" className="text-white h-16 sm:h-20" />
            </h4>
            <ul className="list-none text-sm p-0 m-0 flex items-center space-x-4">
              <li className="text-white">
                <a href="#">© ICP. All Rights Reserved.</a>
              </li>
            </ul>
          </div>
          <div className="mb-4">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
