// import React, { useEffect, useState } from "react";
// import { FaTelegramPlane, FaDiscord } from "react-icons/fa";
// import XIcon from "@mui/icons-material/Close";
// import { useSelector } from "react-redux";
// import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";

// import RegionalHubModal from "./RegionalHubModal";
// import NoData from "../NoDataCard/NoData";
// import { LanguageIcon } from "../UserRegistration/DefaultLink";
// import {
//   FaLinkedin,
//   FaTwitter,
//   FaGithub,
//   FaTelegram,
//   FaFacebook,
//   FaInstagram,
//   FaYoutube,
//   FaReddit,
//   FaTiktok,
//   FaSnapchat,
//   FaWhatsapp,
//   FaMedium,
// } from "react-icons/fa";
// const DiscoverRegionalHubs = () => {
//   const actor = useSelector((currState) => currState.actors.actor);
//   const [allHubsData, setAllHubsData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const getLogo = (url) => {
//     try {
//       const domain = new URL(url).hostname.split(".").slice(-2).join(".");
//       const size = "text-2xl"; // Adjust size as needed
//       const icons = {
//         "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
//         "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
//         "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
//         "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
//         "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
//         "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
//         "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
//         "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
//         "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
//         "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
//         "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
//         "medium.com": <FaMedium className={`text-black ${size}`} />,
//       };
//       return icons[domain] || <LanguageIcon />;
//     } catch (error) {
//       return <LanguageIcon />;
//     }
//   };

//   const getAllHubs = async (caller, isMounted) => {
//     try {
//       const result = await caller.get_icp_hub_details();
//       if (isMounted) {
//         console.log("HUBS RESULT", result);
//         setAllHubsData(result || []);
//         setIsLoading(false);
//       }
//     } catch (error) {
//       if (isMounted) {
//         setAllHubsData([]);
//         setIsLoading(false);
//         console.error("error-in-get-all-hubs", error);
//       }
//     }
//   };

//   useEffect(() => {
//     let isMounted = true;

//     if (actor) {
//       getAllHubs(actor, isMounted);
//     } else {
//       getAllHubs(IcpAccelerator_backend, isMounted);
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [actor]);

//   return (
//     <div className="container mx-auto mb-5 bg-white">
//       <div className="flex justify-start items-center h-11 bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white z-20">
//         <div className="flex justify-between w-full">
//           <h2 className="text-2xl font-bold">Discover Regional Hubs</h2>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="border-2 px-2 border-black py-1"
//           >
//             Add Hub
//           </button>
//         </div>
//       </div>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : allHubsData.length === 0 ? (
//         <div className="flex items-center justify-center">
//           <NoData message={"No Hubs Data Available"} />
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-3 gap-6">
//           {allHubsData.map((hub, index) => {
//             const name = hub?.params?.name?.[0] || "N/A";
//             const desc = hub?.params?.description?.[0] || "N/A";
//             console.log("description hai ye ", desc);

//             const logo = hub?.params?.flag?.[0]
//               ? uint8ArrayToBase64(hub?.params?.flag?.[0])
//               : "";

//             return (
//               <div key={index} className="bg-white rounded-lg shadow-lg p-4">
//                 <div>
//                   {logo && (
//                     <img
//                       src={logo}
//                       alt={name}
//                       className="w-12 h-12 rounded-full mb-3"
//                     />
//                   )}
//                   <div>
//                     <h3 className="text-lg font-semibold">{name}</h3>
//                     <p className="text-sm text-gray-600">{desc}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   {Array.isArray(hub?.params?.links[0]) &&
//                     (console.log("Links array:", hub?.params?.links[0]), // Log the links array
//                     hub?.params?.links[0]?.map((linkObj, i) => {
//                       const link = linkObj?.links?.[0]; // Ensure `linkObj.link` is an array and has elements
//                       if (!link) return null; // Skip if link is not available
//                       const icon = getLogo(link);
//                       return (
//                         <a
//                           key={i}
//                           href={link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center space-x-2"
//                         >
//                           {icon}
//                         </a>
//                       );
//                     }))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//       {isModalOpen && (
//         <RegionalHubModal onClose={() => setIsModalOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default DiscoverRegionalHubs;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import RegionalHubModal from "./RegionalHubModal";
import NoData from "../NoDataCard/NoData";
import { MdArrowOutward } from "react-icons/md";
import getSocialLogo from "../Utils/navigationHelper/getSocialLogo";
const DiscoverRegionalHubs = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allHubsData, setAllHubsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const getAllHubs = async (caller, isMounted) => {
    try {
      const result = await caller.get_icp_hub_details();
      if (isMounted) {
        setAllHubsData(result || []);
        setIsLoading(false);
      }
    } catch (error) {
      if (isMounted) {
        setAllHubsData([]);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllHubs(actor, isMounted);
    } else {
      getAllHubs(IcpAccelerator_backend, isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);

  return (
    <div className="container mx-auto mb-5 bg-white">
      <div className="flex justify-start items-center h-11 bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white z-20">
        <div className="flex justify-between w-full">
          <h2 className="text-2xl font-bold">Discover Regional Hubs</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 px-2 border-black py-1"
          >
            Add Hub
          </button>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : allHubsData.length === 0 ? (
        <div className="flex items-center justify-center">
          <NoData message={"No Hubs Data Available"} />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {allHubsData.map((hub, index) => {
            let name = hub?.params?.name?.[0] || "N/A";
            let desc = hub?.params?.description?.[0] || "N/A";
            let discord = hub?.params?.discord?.[0] || "N/A";
            let telegram = hub?.params?.telegram?.[0] || "N/A";
            let twitter = hub?.params?.twitter?.[0] || "N/A";
            let website = hub?.params?.website?.[0] || "N/A";
            let logo = hub?.params?.flag?.[0]
              ? uint8ArrayToBase64(hub.params.flag[0])
              : null;

            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                <div>
                  {logo && (
                    <img
                      src={logo}
                      alt={name}
                      className="w-12 h-12 rounded-full mb-3"
                      loading="lazy"
                      draggable={false}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold line-clamp-1 truncate">{name}</h3>
                    <p className="text-sm text-gray-600 mt-2  line-clamp-2">
                      {desc}
                      </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-2 flex-wrap">
                  {Array.isArray(hub?.params?.links[0]) &&
                    hub?.params?.links[0]?.map((linkObj, i) => {
                      const link = linkObj?.links?.[0];
                      if (!link) return null;
                      const icon = getSocialLogo(link);
                      return (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2"
                        >
                          {icon}
                        </a>
                      );
                    })}
                </div>
                <div className="mt-3 text-center ">
                  <a
                    href={website}
                    target="_blank"
                    className="bg-[#155EEF] flex items-center justify-center shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#1018280D_inset,0px_0px_0px_1px_#1018282E_inset]  border-2 border-white text-white py-[10px] px-4 rounded-[4px] text-sm font-medium hover:bg-blue-700 my-4"
                  >
                    Join <span className="px-2 flex items-center">{name}<MdArrowOutward className="text-base font-bold"/></span> 
                  </a>
                </div>

               
              </div>
            );
          })}
        </div>
      )}
      {isModalOpen && (
        <RegionalHubModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default DiscoverRegionalHubs;

