import React from "react";

const Tabs = ({ tabs, currentTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value} 
            onClick={() => onTabChange(tab.value)} 
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              currentTab === tab.value 
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label} 
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
