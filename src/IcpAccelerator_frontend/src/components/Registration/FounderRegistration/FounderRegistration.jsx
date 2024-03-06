import React from "react";
import FounderInfo from "./FounderInfo";
import CompanyInfo from "./CompanyInfo";
import CompanyMetrics from "./CompanyMetrics";
import TeamDetails from "./TeamDetails";
import AdditionalInfo from "./AdditionalInfo";
import { headerData } from "../../Utils/Data/AllDetailFormData";
import { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const FounderRegistration = () => {
  const specificRole = useSelector(
    (currState) => currState.current.specificRole
  );

  const [activeTab, setActiveTab] = useState(headerData[0].id);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-400  border-transparent hover:text-black"
    } rounded-t-lg`;
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "company":
        return <CompanyInfo />;
      case "metrics":
        return <CompanyMetrics />;
      case "team":
        return <TeamDetails />;
      case "additional":
        return <AdditionalInfo />;
      default:
        return <FounderInfo />;
    }
  };

  return (
    <div>
      <div className="w-full h-full bg-gray-100 pt-8">
        <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
          Founder Information
        </div>
        <div className="text-sm font-medium text-center text-gray-200 ">
          <ul
            className={`flex flex-wrap text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer ${
              headerData.id !== "founder"
                ? "md:justify-start xl:px-12 ss1:justify-center"
                : "justify-around"
            }`}
          >
            {headerData.map((header) => (
              <li key={header.id} className="me-2 relative group">
                <button
                  className={getTabClassName(header.id)}
                  onClick={() => handleTabClick(header.id)}
                >
                  <div className="hidden md:block">{header.label}</div>

                  <div className="flex md:hidden items-center">
                    {header.icon}
                  </div>
                </button>
                <div className="md:hidden">
                  <ReactTooltip
                    id={header.id}
                    place="bottom"
                    content={header.label}
                    className="z-10 "
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="xl:px-12 py-12">
          {specificRole ? renderActiveComponent() : <FounderInfo />}
        </div>
      </div>
    </div>
  );
};

export default FounderRegistration;
