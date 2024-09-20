// import React from "react";

// const Tabs = ({ tabs, currentTab, onTabChange }) => {
//   return (
//     <div className="border-b border-gray-200 mb-6">
//       <nav className="-mb-px flex space-x-8">
//         {tabs.map((tab) => (
//           <button
//             key={tab.value} 
//             onClick={() => onTabChange(tab.value)} 
//             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//               currentTab === tab.value 
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//             }`}
//           >
//             {tab.label} 
//           </button>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Tabs;
import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Tabs = ({ tabs, currentTab, onTabChange }) => {
  const tabsContainerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (tabsContainerRef.current) {
        setIsScrollable(
          tabsContainerRef.current.scrollWidth >
            tabsContainerRef.current.clientWidth
        );
      }
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, []);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -100 : 100, 
        right: direction ==="right" ? -100 :100,
       });
    }
  };

  return (
    <div className="relative w-full">
      {isScrollable && (
        <button
          onClick={() => scrollTabs("left")}
          className="absolute left-0 top-[40%] transform -translate-y-1/2 bg-gray-100 p-2 rounded-full z-10"
        >
          <FaChevronLeft />
        </button>
      )}

      <div
        ref={tabsContainerRef}
        className={`w-[94%] overflow-x-auto whitespace-nowrap scrollbar-hide ${
          isScrollable ? "px-6" : ""
        }`}
      >
        <nav className="flex space-x-6">
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`whitespace-nowrap py-2 px-2 border-b-2 font-medium text-sm  ${
                currentTab === tab.value
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              // style={index === tabs.length - 1 ? { paddingRight: "40px" } : {}}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {isScrollable && (
        <button
          onClick={() => scrollTabs("right")}
          className="absolute right-0 top-[32%] transform -translate-y-1/2 bg-gray-100 p-2 rounded-full z-10"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default Tabs;
