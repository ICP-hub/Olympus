// import React, { useState, useEffect, useRef } from 'react';
// import ment from "../../../assets/images/ment.jpg";
// import girl from "../../../assets/images/girl.jpeg";

// const LaunchedProjects = () => {
//     const [cards, setCards] = useState([
//         // You can add more card data here or fetch from an API
//         { id: 1, name: 'Project 1' },
//         { id: 2, name: 'Project 2' },
//         { id: 3, name: 'Project 3' },

//     ]);
//     const [isHovered, setIsHovered] = useState(false);
//     const [percent, setPercent] = useState(0);
//     const [showLine, setShowLine] = useState({});
//     const tm = useRef(null);

//     // Gradient color stops, changes when hovered
//     const gradientStops = isHovered
//         ? { stop1: "#4087BF", stop2: "#3C04BA" }
//         : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

//     useEffect(() => {
//         if (percent < 100) {
//             tm.current = setTimeout(increase, 30);
//         }
//         return () => clearTimeout(tm.current);
//     }, [percent]);

//     const handleClickPlusOne = (id) => {
//         setShowLine((prevShowLine) => ({
//             ...prevShowLine,
//             [id]: !prevShowLine[id],
//         }));
//     };

//     const increase = () => {
//         setPercent((prevPercent) => {
//             if (prevPercent >= 100) {
//                 clearTimeout(tm.current);
//                 return 100;
//             }
//             return prevPercent + 1;
//         });
//     };

//     return (
//         <div className="flex flex-wrap -mx-4">
//             {cards.map((card) => (
//                 <div key={card.id} className="px-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
//                     <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 m-2">
//                         <div className="p-4">
//                             <div className='flex justify-between items-center mb-4'>
//                                 <img className='rounded-full w-12 h-12' src={ment} alt='profile' />
//                                 <h1 className='font-bold'>{card.name}</h1>
//                                 <div className='flex items-center'>
//                                     <img className='h-6 w-6 rounded-full mr-2' src={girl} alt='not found' />
//                                     <p className='text-xs truncate w-20'>0x2085...6B</p>
//                                 </div>
//                             </div>
//                             <div className="mb-4">
//                                 <svg
//                                     width="100%"
//                                     height="10"
//                                     className='rounded-lg'
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                 >
//                                     <defs>
//                                         <linearGradient id={`gradient-${card.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
//                                             <stop
//                                                 offset="0%"
//                                                 stopColor={gradientStops.stop1}
//                                                 stopOpacity="1"
//                                             />
//                                             <stop
//                                                 offset="100%"
//                                                 stopColor={gradientStops.stop2}
//                                                 stopOpacity="1"
//                                             />
//                                         </linearGradient>
//                                     </defs>
//                                     <rect
//                                         x="0"
//                                         y="0"
//                                         width={`${percent}%`}
//                                         height="10"
//                                         fill={`url(#gradient-${card.id})`}
//                                     />
//                                 </svg>
//                             </div>
//                             <p className="text-gray-700 text-sm">
//                                 Internet Identity 110,000+ users Distrikt is a completely decentralized,
//                                 community-owned Web3 social media platform...
//                             </p>
//                             <div className='flex gap-2 mt-2 text-xs'>
//                                 <p>.DAO</p>
//                                 <p>.Infrastructure</p>
//                                 <p onClick={() => handleClickPlusOne(card.id)} className="cursor-pointer">+1 more</p>
//                             </div>
//                             {showLine[card.id] && <div className="border-t border-gray-300 mt-2">QuadB Tech projects are here</div>}
//                             <button className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out">KNOW MORE</button>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default LaunchedProjects;
import React, { useState, useEffect, useRef } from "react";
import ment from "../../../assets/images/ment.jpg";
import girl from "../../../assets/images/girl.jpeg";
import hover from "../../../assets/images/hover.png";
import RegisterCard from "./RegisterCard";
import { title } from "process";

const LaunchedProjects = () => {
  const [cards, setCards] = useState([
    // Your card data here
    {
      id: 1,
      name: "Project 1",
      level: "Level 2",
      description:
        "Internet Identity 110,000+ users Distrikt is a completely decentralized, community-owned Web3 social media platform. Users of the platform will soon be able to vote on upgrades, and no user data will ever be mined or sold. Create your account, secured by Internet Identity today.",
      additionalContent:
        "Internet Identity 110,000+ users Distrikt is a completely decentralized, community-owned Web3 social media platform. Users of the platform will soon be able to vote on upgrades, and no user data will ever be mined or sold. Create your account, secured by Internet Identity today.",
    },
    {
      id: 2,
      name: "Project 2",
      level: "Level 2",
      description:
        "Internet Identity 110,000+ users Distrikt is a completely decentralized, community-owned Web3 social media platform. Users of the platform will soon be able to vote on upgrades, and no user data will ever be mined or sold. Create your account, secured by Internet Identity today.",
      additionalContent:
        "Internet Identity 110,000+ users Distrikt is a completely decentralized, community-owned Web3 social media platform. Users of the platform will soon be able to vote on upgrades, and no user data will ever be mined or sold. Create your account, secured by Internet Identity today.",
    },
    {
      id: 3,
      name: "Project 3",
      level: "Level 2",
      description:
        "Internet Identity 110,000+ users Distrikt is a completely decentralized, community-owned Web3 social media platform. Users of the platform will soon be able to vote on upgrades, and no user data will ever be mined or sold. Create your account, secured by Internet Identity today.",
      additionalContent:
        "Internet Identity 110,000+ users Distrikt is a completely decentralized, community-owned Web3 social media platform. Users of the platform will soon be able to vote on upgrades, and no user data will ever be mined or sold. Create your account, secured by Internet Identity today.",
    },
    // Add more card data as needed
  ]);
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showLine, setShowLine] = useState({});
  const tm = useRef(null);

  // Gradient color stops, changes when hovered
  const gradientStops = isHovered
    ? { stop1: "#4087BF", stop2: "#3C04BA" }
    : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 30);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  const increase = () => {
    setPercent((prevPercent) => {
      if (prevPercent >= 100) {
        clearTimeout(tm.current);
        return 100;
      }
      return prevPercent + 1;
    });
  };
  const categories = [
    // {
    //   title: "Register as a Mentor",
    //   description: "Join our community as a mentor to guide projects.",
    //   buttonText: "Register Now",
    //   imgSrc: "mentorImageSrc", 
    // },
    // {
    //   title: "Register as an Investor",
    //   description: "Discover innovative projects to invest in.",
    //   buttonText: "Register Now",
    //   imgSrc: "investorImageSrc", 
    // },
    {
      title: "Register your Projects",
      description: "See a project missing? Submit your projects to this page.",
      buttonText: "Register Now",
      imgSrc: hover, 
    },
    
  ];

  return (
    <div className="flex flex-wrap -mx-4 mb-4 flex-row items-start">
      <div className="overflow-x-auto flex w-3/4">
        {cards.map((card) => (
          <div key={card.id} className="px-4 w-full sm:w-1/2 md:w-1/3 ">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 m-2">
              <div className="p-4">
                <div className="flex justify-between items-baseline mb-4 flex-wrap">
                  <div className="flex items-baseline">
                    <img
                      className="rounded-full w-12 h-12"
                      src={ment}
                      alt="profile"
                    />
                    <h1 className="font-bold text-nowrap truncate">
                      {card.name}
                    </h1>
                  </div>
                  <div className="flex items-baseline">
                    <img
                      className="h-5 w-5 rounded-full mr-2"
                      src={girl}
                      alt="not found"
                    />
                    <p className="text-xs truncate w-20">0x2085...6B</p>
                  </div>
                </div>
                <div className="mb-4 flex items-baseline">
                  <svg
                    width="100%"
                    height="8"
                    className="rounded-lg"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${card.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor={gradientStops.stop1}
                          stopOpacity="1"
                        />
                        <stop
                          offset="100%"
                          stopColor={gradientStops.stop2}
                          stopOpacity="1"
                        />
                      </linearGradient>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width={`${percent}%`}
                      height="10"
                      fill={`url(#gradient-${card.id})`}
                    />
                  </svg>
                  <div className="ml-2 text-nowrap text-sm">{card.level}</div>
                </div>
                <p className="text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8">
                  {card.description}
                </p>
                <div className="flex gap-2 mt-2 text-xs">
                  <p>.DAO</p>
                  <p>.Infrastructure</p>
                  <p
                    onClick={() => handleClickPlusOne(card.id)}
                    className="cursor-pointer"
                  >
                    +1 more
                  </p>
                </div>
                {showLine[card.id] && (
                  <div className="border-t border-gray-300 mt-2 text-sm py-2">
                    {card.additionalContent}
                  </div>
                )}
                <button className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out">
                  KNOW MORE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/4">
    <RegisterCard categories={categories}/>
    </div>
    </div>
  );
};

export default LaunchedProjects;
