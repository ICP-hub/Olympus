import React from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
//   import profilepicture from "../../../../../assets/Logo/CypherpunkLabLogo.png";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import XIcon from "@mui/icons-material/X";
import { LanguageIcon } from "../../../UserRegistration/DefaultLink";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaMedium,
} from "react-icons/fa";

// const teamMembers = [
//     {
//         name: 'Matt Bowers',
//         username: '@mattbowers',
//         role: 'Founder & CEO',
//         image: 'https://randomuser.me/api/portraits/men/32.jpg', // Example image URL
//         social: {
//             twitter: '#',
//             linkedin: '#',
//             facebook: '#'
//         },
//         badges: ['OLYMPIAN', 'FOUNDER']
//     },
//     {
//         name: 'Tricia Renner',
//         username: '@triciarenner',
//         role: 'Co-founder, CTO',
//         image: 'https://randomuser.me/api/portraits/women/44.jpg', // Example image URL
//         social: {
//             twitter: '#',
//             linkedin: '#'
//         },
//         badges: ['OLYMPIAN']
//     },
//     {
//         name: 'Billy Aufderhar',
//         username: '@billyaufderhar',
//         role: 'Marketing Lead',
//         image: 'https://randomuser.me/api/portraits/men/68.jpg', // Example image URL
//         social: {
//             twitter: '#'
//         },
//         badges: ['OLYMPIAN', 'MENTOR']
//     }
// ];

const getLogo = (url) => {
  try {
    const domain = new URL(url).hostname.split(".").slice(-2).join(".");
    const size = "text-2xl"; // Adjust size as needed
    const icons = {
      "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
      "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
      "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
      "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
      "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
      "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
      "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
      "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
      "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
      "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
      "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
      "medium.com": <FaMedium className={`text-black ${size}`} />,
    };
    return icons[domain] || <LanguageIcon />;
  } catch (error) {
    return <LanguageIcon />;
  }
};

const TeamCard = ({ projectDetails }) => {
  const member = projectDetails.project_team?.[0]?.[0]?.member_data;
  console.log("memberdata consloed ", member);

  let profile = member?.profile_picture[0]
    ? uint8ArrayToBase64(member?.profile_picture[0])
    : "https://randomuser.me/api/portraits/men/68.jpg";

  let links = member?.social_links?.links?.[0];
  console.log("Links ", links);

  return (
    <div className="flex gap-6 items-center p-4 bg-white shadow-sm rounded-lg  mb-4">
      <div className="">
        <div className="">
          <img
            src={profile}
            alt={member?.full_name}
            className="w-[70px] h-[70px] rounded-full"
          />
        </div>
        {/* <div className="flex items-center mt-2 space-x-2">
                    {member.social.twitter && (
                        <a href={member.social.twitter} className="text-gray-500">
                            <XIcon sx={{fontSize:"medium"}} />
                        </a>
                    )}
                    {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-500">
                            <LinkedInIcon />
                        </a>
                    )}
                    {member.social.facebook && (
                        <a href={member.social.facebook} className="text-gray-500">
                            <FacebookRoundedIcon />
                        </a>
                    )}
                </div> */}
      </div>

      <div className="ml-4">
        <h4 className="text-base font-semibold">{member?.full_name}</h4>
        <p className="text-gray-500 text-xs">{member?.openchat_username}</p>
        <p className="text-gray-600 text-sm">{member?.bio[0]}</p>

        {/* <div className="mt-2 space-x-2">
                    {member.badges.map((badge, idx) => (
                        <span
                            key={idx}
                            className={`px-2 py-1 rounded-lg border text-xs font-normal ${badge === 'FOUNDER'
                                    ? 'bg-purple-100 text-xs text-[#3538CD]'
                                    : badge === 'MENTOR'
                                        ? 'bg-pink-100 text-xs text-pink-800'
                                        : 'bg-blue-100 text-xs text-blue-800'
                                }`}
                        >
                            {badge}
                        </span>
                    ))}
                </div> */}
        {links?.link.map((alllink, i) => {
          const icon = getLogo(alllink);
          return (
            <div key={i} className="flex items-center space-x-2">
              {icon ? <a href={`${alllink}`}>{icon}</a> : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DiscoverTeam = ({ projectDetails }) => {
  return (
    <div className="p-6 border border-gray-200 shadow-lg rounded-xl bg-white">
      <div className=" mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Team</h2>
          <a href="#" className="text-sm font-medium text-blue-500">
            View all team
          </a>
        </div>
        <TeamCard projectDetails={projectDetails} />
        {/* {teamMembers.map((member, idx) => (
                    
                ))} */}
      </div>
    </div>
  );
};

export default DiscoverTeam;
