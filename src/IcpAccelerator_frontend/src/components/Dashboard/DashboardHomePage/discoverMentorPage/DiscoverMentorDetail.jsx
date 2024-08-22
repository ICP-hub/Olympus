import React, {useState} from 'react';
import edit from "../../../../../assets/Logo/edit.png";
import { FaLinkedin, FaGithub, FaTelegram } from 'react-icons/fa';
import org from "../../../../../assets/images/Org.png"
import {
    LinkedIn,
    GitHub,
    Telegram,
  } from "@mui/icons-material";

const DiscoverMentorDetail = () => {
    const [socialLinks, setSocialLinks] = useState({
        LinkedIn: "https://www.linkedin.com/in/mattbowers",
        GitHub: "https://github.com/mattbowers",
        Telegram: "https://t.me/mattbowers",
      });
    
      const [isEditingLink, setIsEditingLink] = useState({
        LinkedIn: false,
        GitHub: false,
        Telegram: false,
      });
    
      const handleLinkEditToggle = (link) => {
        setIsEditingLink((prev) => {
          const newState = {
            LinkedIn: false,
            GitHub: false,
            Telegram: false
          };
          newState[link] = !prev[link];
          return newState;
        });
      };
    
      const handleLinkChange = (e, link) => {
        setSocialLinks((prev) => ({
          ...prev,
          [link]: e.target.value
        }));
      };
    
      const handleSaveLinks = () => {
        console.log('Links saved:', socialLinks);
        setIsEditingLink({
          LinkedIn: false,
          GitHub: false,
          Telegram: false
        });
      };
    return (
        <div className="bg-white shadow-lg rounded-lg w-full max-w-sm">

            <div className="bg-slate-200 p-6">
                <div className="flex justify-center">
                    <img
                        src={org}
                        alt="Profile"
                        className="rounded-lg w-24 h-24"
                    />
                </div>

                <div className="text-center mt-2">
                    <span className="text-xs font-medium text-[#3538CD] border bg-blue-50 rounded-lg px-3 py-1">
                        Looking for funding
                    </span>
                </div>

                <div className="text-center mt-4">
                    <h2 className="text-xl font-semibold text-gray-800">Cypherpunk Labs</h2>
                    <p className="text-gray-500">@cypherpunklabs</p>
                </div>

                <div className="text-center w-full mt-6">
                    <button className="bg-blue-600 text-white font-normal text-sm py-2 px-12 rounded hover:bg-blue-700">
                        Get in touch <span className='ml-3' aria-hidden="true">↗️</span>
                    </button>
                </div>
            </div>

            <div className="p-6 ">
            <div className="">
                <h3 className="text-gray-600 text-sm font-medium">ASSOCIATIONS</h3>
                <div className="flex gap-4 mt-2 ml-2">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Association 1"
                        className="rounded-full w-10 h-10 border-2 border-white shadow-lg -ml-3"
                    />
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Association 2"
                        className="rounded-full w-10 h-10 border-2 border-white shadow-lg -ml-3"
                    />
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Association 3"
                        className="rounded-full w-10 h-10 border-2 border-white shadow-lg -ml-3"
                    />
                </div>
            </div>


            <div className="mt-6">
                <h3 className="text-gray-400 text-sm font-medium">TAGLINE</h3>
                <p className="text-sm mt-2">Bringing privacy back to users</p>
            </div>


            <div className="mt-4">
                <h3 className="text-gray-400 text-sm font-medium">ABOUT</h3>
                <p className="text-sm mt-2">
                    Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.
                </p>
            </div>


            <div className="mt-4">
                <h3 className="text-gray-400 text-sm mb-2 font-medium">CATEGORY</h3>
                <span className="  border  px-3 py-1 rounded-full text-sm">Infrastructure</span>
            </div>


            <div className="mt-4">
                <h3 className="text-gray-400 mb-2 text-sm font-medium">STAGE</h3>
                <span className=" border   px-3 py-1 rounded-full text-sm">MVP</span>
            </div>


            <div className="mt-6">
            <div>
            <h3 className="mb-2 text-xs font-medium text-gray-400 px-3">LINKS</h3>
            <div className="flex items-center px-3">
              {/* LinkedIn */}
              <div className="group relative flex items-center">
                <a
                  href={socialLinks.LinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <LinkedIn className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                </a>
                <button
                  className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7"
                  onClick={() => handleLinkEditToggle("LinkedIn")}
                >
                  <img src={edit} />
                </button>
                {isEditingLink.LinkedIn && (
                  <input
                    type="text"
                    value={socialLinks.LinkedIn}
                    onChange={(e) => handleLinkChange(e, "LinkedIn")}
                    className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                  />
                )}
              </div>

              {/* GitHub */}
              <div className="group relative flex items-center ml-8 group-hover:ml-8">
                <a
                  href={socialLinks.GitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <GitHub className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                </a>
                <button
                  className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7"
                  onClick={() => handleLinkEditToggle("GitHub")}
                >
                  <img src={edit} />
                </button>
                {isEditingLink.GitHub && (
                  <input
                    type="text"
                    value={socialLinks.GitHub}
                    onChange={(e) => handleLinkChange(e, "GitHub")}
                    className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                  />
                )}
              </div>

              {/* Telegram */}
              <div className="group relative flex items-center ml-8 group-hover:ml-8">
                <a
                  href={socialLinks.Telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Telegram className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                </a>
                <button
                  className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7"
                  onClick={() => handleLinkEditToggle("Telegram")}
                >
                  <img src={edit} />
                </button>
                {isEditingLink.Telegram && (
                  <input
                    type="text"
                    value={socialLinks.Telegram}
                    onChange={(e) => handleLinkChange(e, "Telegram")}
                    className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                  />
                )}
              </div>
            </div>

            {/* Save Section */}
            {Object.values(isEditingLink).some((value) => value) && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleSaveLinks}
                  className="bg-blue-600 text-white py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
                >
                  Save
                </button>
              </div>
            )}
          </div>
            </div>
            </div>
        </div>
    );
};

export default DiscoverMentorDetail;
