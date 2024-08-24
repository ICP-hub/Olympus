import React from "react";
import { LinkedIn, GitHub, Telegram } from "@mui/icons-material";
import edit from "../../../assets/Logo/edit.png";

const SocialLinks = ({
  socialLinks,
  isEditingLink,
  handleLinkEditToggle,
  handleLinkChange,
}) => {
  return (
    <div>
      <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
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
    </div>
  );
};

export default SocialLinks;
