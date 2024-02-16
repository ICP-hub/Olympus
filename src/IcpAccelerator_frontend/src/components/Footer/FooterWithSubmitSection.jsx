import React from "react";
import logo from "../../../assets/Logo/icpLogo2.png";
import BigLogo from "../../../assets/Logo/bigLogo.png"

const FooterWithSubmitSection = () => {
  return (
    <footer className="text-blue-800 bg-white py-8 z-10">
      <div className="flex justify-center">
        <div className="w-11/12 h-fit bg-gradient-to-r from-violet-800 to-blue-500 rounded-md shadow relative top-[-130px]">
          <div className="p-8 flex justify-between items-center h-fit">
            <div className="flex flex-col dxl:m-8 md1:m-4 sm1:m-3 w-1/4 -left-4 relative">
              <img src={BigLogo} alt="BigLogo" className="object-contain"/>
            </div>
            <div className="flex flex-col justify-between w-3/4">
              <div className="w-fit h-fit text-white text-2xl font-bold font-fontUse leading-none mb-4">
                Accelerator
              </div>
              <div className="w-fit h-20 text-white text-sm font-light font-fontUse mb-4 truncate text-wrap">
                * Past performances do not indicate future success.
                <br />
                This web page and any other contents published on this website
                shall not constitute investment advice, financial advice,
                trading advice, or any other kind of advice, and you should not
                treat any of the website’s content as such. You alone assume the
                sole responsibility of evaluating the merits and risks
                associated with using any information or other content on this
                website before making any decisions based on such information.
                You understand that the crypto market is characterised by high
                volatility, and you should be aware of the concrete possibility
                of losing the entirety of the funds you allocated in the crypto
                market. You should refrain from using funds you can’t afford to
                lose when purchasing cryptocurrencies and other digital tokens.
              </div>
              <button type="button" className="w-fit h-fit bg-white rounded-sm">
                <div className="w-fit dxl:h-fit h-[26px] text-center text-violet-800 sm:text-sm dxl:text-xl px-4 py-2 text-xs font-fontUse text-wrap truncate">
                  Accelerate with Symbiote, Apply to Launch!
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-3">
              <img src={logo} alt="logo" />
            </h4>
            <ul className="list-none text-sm p-0 m-0 flex items-center space-x-4">
              <li className="text-black">
                <a href="#">© ICP. All Rights Reserved.</a>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2 text-footerText">Services</h4>
            <ul className="list-none text-sm p-0 m-0 text-btnColor underline">
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
            <h4 className="text-xl font-bold mb-2 text-footerText">Company</h4>
            <ul className="list-none text-sm p-0 m-0 text-btnColor underline">
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
            <h4 className="text-xl font-bold mb-2 text-footerText">Legal</h4>
            <ul className="list-none text-sm p-0 m-0 text-btnColor underline">
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

export default FooterWithSubmitSection;
