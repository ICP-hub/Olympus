import React from "react";
import { sidebarSvg } from "../../Utils/Data/SvgData";

const Sidebar = () => {

  return (
    <div className="w-14 h-72 px-3 pt-2.5 pb-4 bg-gradient-to-br from-pink-400 to-purple-800 rounded-md shadow backdrop-blur-sm flex-col justify-start items-center inline-flex z-50">
      <div className="self-stretch h-64 relative">
      {sidebarSvg.map((data) => (
           <li key={data.id} 
           className={`list-none md:w-7 md:h-7 w-6 h-6 absolute ${data.positionStyles}`}>
           {data.svg}
           </li>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
