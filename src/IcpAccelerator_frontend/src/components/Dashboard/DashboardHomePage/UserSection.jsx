import React, { useState } from 'react';
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import NeilProfileImages from "../../../../assets/Logo/NeilProfileImages.png";
import LeonProfileImage from "../../../../assets/Logo/LeonProfileImage.png";
import BlancheProfileImage from "../../../../assets/Logo/BlancheProfileImage.png";
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import { FavoriteBorder, LocationOn, Star } from '@mui/icons-material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import Tabs from '../../Tabs/Tabs';


const UserCard = ({ name, username, tags, role, description, rating, skills, location, avatar }) => {
  const tagColors = {
    OLYMPIAN: 'bg-[#F0F9FF] border-[#B9E6FE] border text-[#026AA2] rounded-md',
    FOUNDER: 'bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md',
    PROJECT: 'bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md',
    INVESTER: 'bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md',
    TALENT: 'bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md',
  };

  return (
    <div className=" p-6 w-[750px] rounded-lg shadow-sm mb-4 flex">
      <div className="w-[272px]  ">
        <div className="max-w-[250px] w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          {rating && (
            <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
              <Star className="text-yellow-400 w-4 h-4" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow ml-[25px] w-[544px]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-500">@{username}</p>
          </div>
          <FavoriteBorder className="text-gray-400 cursor-pointer" />
        </div>
        <div className="mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-block ${tagColors[tag] || "bg-gray-100 text-gray-800"
                } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="border-t border-gray-200 my-3"></div>
        <p className="font-medium mb-2">{role}</p>

        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500 flex-wrap">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
          {location && (
            <span className="mr-2 mb-2 flex text-[#121926] items-center">
              <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" /> {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const UsersSection = () => {
  const [currentTab, setCurrentTab] = useState('Users');
  const tabs = [ 'Users', 'Projects', 'Mentors', 'Talent', 'Investors'];
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };
  const users = [
    {
      name: "Matt Bowers",
      username: "mattbowers",
      tags: ["OLYMPIAN", "FOUNDER"],
      role: "Founder & CEO at Cypherpunk Labs",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      rating: "5.0",
      skills: ["Web3", "Cryptography"],
      location: "San Diego, CA",
      avatar: ProfileImage,
    },
    {
      name: "Cypherpunk Labs",
      username: "cypherpunklabs",
      tags: ["PROJECT"],
      role: "Bringing privacy back to users",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      skills: ["MVP", "Infrastructure"],
      avatar: CypherpunkLabLogo,
    },

    {
      name: "Neil Prosacco",
      username: "username",
      tags: ["OLYMPIAN"],
      role: "Sollicitudin tellus a ac ac tempor est quis fringilla arcu.",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      rating: "5.0",
      skills: ["Web3", "Cryptography"],
      location: "San Diego, CA",
      avatar: NeilProfileImages,
    },

    {
      name: "Blanche Zieme",
      username: "mattbowers",
      tags: ["OLYMPIAN", "INVESTER"],
      role: "A a porttitor placerat egestas. Ut amet dignissim auctor rhoncus.",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      rating: "5.0",
      skills: ["Web3", "Cryptography"],
      location: "San Diego, CA",
      avatar: BlancheProfileImage,
    },

    {
      name: "Leon Medhurst",
      username: "mattbowers",
      tags: ["OLYMPIAN", "TALENT"],
      role: "Fringilla tincidunt ornare curabitur sed sagittis etiam accumsan.",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      rating: "5.0",
      skills: ["Web3", "Cryptography"],
      location: "San Diego, CA",
      avatar: LeonProfileImage,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <h1 className="text-3xl font-bold p-6 px-0   -top-[0.6rem] bg-opacity-95 sticky bg-white z-20">Discover</h1>
      <Tabs tabs={tabs} currentTab={currentTab} onTabChange={handleTabChange} />
      {/* <div className="border-b border-gray-200 mb-6">
       <nav className="-mb-px flex space-x-8">
         <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">All</a>
         <a href="#" className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Users</a>
         <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Projects</a>
         <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Mentors</a>
         <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Talent</a>
         <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Investors</a>
       </nav>
     </div> */}
      <div className="flex">
        <div className=" pr-6">
          {/* {users.map((user, index) => (
           <UserCard key={index} {...user} />
         ))} */}
          {currentTab === 'Users' && users.map((user, index) => (
            <UserCard key={index} {...user} />
          ))}
          {currentTab === 'Projects' && users.map((user, index) => (
            <UserCard key={index} {...user} />
          ))}
           {currentTab === 'Mentors' && users.map((user, index) => (
            <UserCard key={index} {...user} />
          ))}
           {currentTab === 'Talent' && users.map((user, index) => (
            <UserCard key={index} {...user} />
          ))}
           {currentTab === 'Investors' && users.map((user, index) => (
            <UserCard key={index} {...user} />
          ))}
        </div>
        <div className="max-w-[320px] w-[320px]">
          <div className="bg-white py-6 rounded-lg shadow-sm sticky top-0" >
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Select role</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
              <input type="text" placeholder="Start typing" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" placeholder="E.g., Dubai" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersSection;