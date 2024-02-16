import React, { useState } from "react";
import { sidebarSvg } from "../../Utils/Data/SvgData";

const Bottombar = () => {
  const [activeId, setActiveId] = useState(null);

  const handleButtonClick = (id) => {
    setActiveId(id);
  };

  return (
    <div className="fixed bottom-0  w-full h-14 bg-gradient-to-br from-pink-400 to-purple-800 shadow-md backdrop-blur-sm flex justify-around items-center rounded-md z-50">
      {sidebarSvg.map((data) => (
        <button
          key={data.id}
          className={`text-white p-2 mx-1 hover:scale-110 transition duration-300 ${
            activeId === data.id ? "relative" : ""
          }`}
          onClick={() => handleButtonClick(data.id)}
        >
          {activeId === data.id && (
            <span className="absolute inset-0 bg-gray-300 rounded-full opacity-50"></span>
          )}
          <div>{data.svg}</div>
        </button>
      ))}
    </div>
  );
};

export default Bottombar;
