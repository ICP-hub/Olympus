// import React from "react";
// // import logo from "../../../assets/Logo/icpLogo.png";
// import logo from "../../../assets/Logo/topLogoWhitepng.png";
// // import { logoSvg } from "../Utils/Data/SvgData";


// const Footer = () => {
//   return (
//     <footer className="text-white bg-custumPurple py-8 z-10 bottom">
//       <div className="container flex justify-center sm:justify-between w-full mx-auto px-4 lg:px-10">
//           <div className="flex flex-col sm:flex-row w-full justify-between items-center">
//             <h4 className="text-xl font-bold mb-3">
//               <img src={logo} alt="logo" className="text-white" />
//             </h4>
//             <ul className="list-none text-sm p-0 m-0 flex items-center space-x-4">
//               <li className="text-white">
//                 <a href="#">© {new Date().getFullYear()} All Rights Reserved</a>
//               </li>
//             </ul>
//           </div>
//           {/* <div className="mb-4">
//             <h4 className="text-xl font-bold mb-2 text-white">Services</h4>
//             <ul className="list-none text-sm p-0 m-0 text-white underline">
//               <li className="mb-2">
//                 <a href="#">Base Camp</a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Ascent</a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Elevate</a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Investors</a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Partners</a>
//               </li>
//             </ul>
//           </div>
//           <div className="mb-4">
//             <h4 className="text-xl font-bold mb-2 text-white">Company</h4>
//             <ul className="list-none text-sm p-0 m-0 text-white underline">
//               <li className="mb-2">
//                 <a href="#">About us </a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Offices </a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">News </a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Mission & Values </a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Careers </a>
//               </li>
//             </ul>
//           </div>
//           <div className="mb-4">
//             <h4 className="text-xl font-bold mb-2 text-white">Legal</h4>
//             <ul className="list-none text-sm p-0 m-0 text-white underline">
//               <li className="mb-2">
//                 <a href="#">Privacy Policy</a>
//               </li>
//               <li className="mb-2">
//                 <a href="#">Terms & Conditions</a>
//               </li>
//             </ul>
//           </div> */}
//         {/* </div> */}
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import logo from "../../../assets/Logo/icpLogo.png";
import Layer1 from "../../../assets/Logo/Layer1.png";

const Footer = () => {
  return (
    <footer className="bg-[rgb(254,246,238)] py-10 px-4 md:px-8">
      <div className="w-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-center md:text-left mb-4 md:mb-0">
            Join Olympus and reach the top. Get started today!
          </h2>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-lg">
            Get started
          </button>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <h3 className="text-xl font-semibold mb-4"> <img src={Layer1} alt="logo" className="text-white" /></h3>
              <p className="text-gray-600">Risus feugiat sollicitudin ur lorem aliquam maecenas vitae vulputate. In tortor.</p>
            </div>
            <div className="w-full md:w-3/4 flex flex-wrap justify-between">
              <div className="w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h4 className="text-lg font-semibold mb-4">Explore</h4>
                <ul className="text-gray-600">
                  <li className="mb-2"><a href="/">Projects</a></li>
                  <li className="mb-2"><a href="/">Investors</a></li>
                  <li className="mb-2"><a href="/">Mentors</a></li>
                  <li className="mb-2"><a href="/">Talent</a></li>
                  <li><a href="/">Accelerators</a></li>
                </ul>
              </div>
              <div className="w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="text-gray-600">
                  <li className="mb-2"><a href="/">About us</a></li>
                  <li className="mb-2"><a href="/">Careers</a></li>
                  <li className="mb-2"><a href="/">Roadmap</a></li>
                  <li><a href="/">Contact</a></li>
                </ul>
              </div>
              <div className="w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="text-gray-600">
                  <li className="mb-2"><a href="/">Blog</a></li>
                  <li className="mb-2"><a href="/">Events</a></li>
                  <li><a href="/">FAQ</a></li>
                </ul>
              </div>
              <div className="w-1/2 md:w-1/4">
                <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                <form>
                  <input type="email" placeholder="Enter your email" className="w-full p-2 border border-gray-300 rounded-lg mb-4" />
                  <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-lg w-full">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
            
            <div className="flex space-x-4">
            <p className="mb-4 md:mb-0">&copy; 2024 Olympus Inc. All rights reserved.</p>
              <a href="/">Terms of use</a>
              <a href="/">Cookie policy</a>
              <a href="/">Privacy policy</a>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/" className="text-gray-600"><i className="fab fa-twitter"></i></a>
              <a href="/" className="text-gray-600"><i className="fab fa-linkedin"></i></a>
              <a href="/" className="text-gray-600"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
