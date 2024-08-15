import React from "react";
import {  Share, Info } from "@mui/icons-material";
import XIcon from '@mui/icons-material/X';
import flag from "../../../../assets/Logo/IT.png"
const hubs = [
  {
    id: 1,
    name: "ICP Hub Italy",
    description:
      "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam!",
    flag: flag,
    link: "Join ICP Italy",
  },
  {
    id: 2,
    name: "ICP Hub Italy",
    description:
      "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam!",
    flag: flag,
    link: "Join ICP Italy",
  },
  {
    id: 3,
    name: "ICP Hub Italy",
    description:
      "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam!",
    flag: flag,
    link: "Join ICP Italy",
  },
  {
    id: 4,
    name: "ICP Hub Italy",
    description:
      "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam!",
    flag: flag,
    link: "Join ICP Italy",
  },
  {
    id: 5,
    name: "ICP Hub Italy",
    description:
      "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam!",
    flag: flag,
    link: "Join ICP Italy",
  },
  {
    id: 6,
    name: "ICP Hub Italy",
    description:
      "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam!",
    flag: flag,
    link: "Join ICP Italy",
  },

];

const DiscoverRegionalHubs = () => {
  return (
    <div className="container mx-auto mb-5 bg-white">
       <div className="flex justify-start items-center  h-11   bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white  z-20">
        <div className="">
          <h2 className="text-2xl font-bold">Discover Regional Hubs</h2>
        </div>
       
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {hubs.map((hub) => (
          <div key={hub.id} className="bg-white rounded-lg shadow-lg p-4">
            <div className="">
              <img
                src={hub.flag}
                alt={hub.name}
                className="w-12 h-12 rounded-full mb-3"
              />
              <div>
                <h3 className="text-lg font-semibold">{hub.name}</h3>
                <p className="text-sm text-gray-600">{hub.description}</p>
              </div>
            </div>
            <div className=" items-center mt-4">
              <div className="flex space-x-2 mb-3">
                <button className="text-gray-500 hover:text-red-500">
                  <XIcon />
                </button>
                <button className="text-gray-500 hover:text-blue-500">
                  <Share />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Info />
                </button>
              </div>
              <hr/>
              <div className="mt-3">
                <a
                  href="#"
                  className="bg-[#155EEF] shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#1018280D_inset,0px_0px_0px_1px_#1018282E_inset] block border-2 border-white text-white py-[10px] px-4 rounded-[4px] text-sm font-medium hover:bg-blue-700 my-4"
                >
                  {hub.link} &#8594;
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverRegionalHubs;
