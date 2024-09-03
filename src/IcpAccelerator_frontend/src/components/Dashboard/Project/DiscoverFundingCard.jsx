import React from 'react';
import docu1 from "../../../../assets/images/docu.png";
import docu2 from "../../../../assets/images/docu.png";
import docu3 from "../../../../assets/images/docu.png";
import docu4 from "../../../../assets/images/docu.png";
import docu5 from "../../../../assets/images/docu.png";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const DiscoverFundingCard = ({ title, value, imageSrc, isPrivate }) => {
    return (
        <div className="relative flex items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300 hover:shadow-lg">
            {/* Overlay for Private Documents */}
            {isPrivate && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 rounded-lg z-10">
                </div>
            )}
            {/* Image Section */}
            <div className="flex-shrink-0">
                <img
                    src={imageSrc}
                    alt={`${title} Thumbnail`}
                    className={`w-[150px] h-[100px] object-cover rounded-lg transition-all duration-300 ${isPrivate ? 'blur-sm' : ''}`}
                />
            </div>

            {/* Details Section */}
            <div className={`ml-6 flex-grow transition-all duration-300 ${isPrivate ? 'blur-sm' : ''}`}>
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-900">
                        {title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">${value}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};



const DiscoverMoneyRaising = ({ data ,projectId}) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const sendMoneyRaisingRequest = async () => {
    if (!projectId) {
      // setDocuments([]);
      return;
    }
    try {
      const result = await actor.send_money_access_request(projectId);
      console.log("result-in-send-access-private-docs", result);
      if (result) {
        toast.success(result);
      } else {
        toast.error(result);
      }
    } catch (error) {
      console.log("error-in-send-access-private-docs", error);
    }
  };
    const {
        icp_grants,
        investors,
        raised_from_other_ecosystem,
        sns,
        target_amount,
    } = data; // Destructure the necessary fields

    return (
        <div className="flex flex-col">
          {userCurrentRoleStatusActiveRole === 'user' ?'':
          data &&
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 w-1/4 self-end"
        onClick={sendMoneyRaisingRequest}>
          Request Access
        </button>}
      
        <div className="space-y-4">
          <DiscoverFundingCard
            title="ICP Grants"
            value={icp_grants}
            imageSrc={docu1}
            isPrivate={true}
          />
          <DiscoverFundingCard
            title="Investors"
            value={investors}
            imageSrc={docu2}
            isPrivate={true}
          />
          <DiscoverFundingCard
            title="Launchpad"
            value={raised_from_other_ecosystem}
            imageSrc={docu3}
            isPrivate={true}
          />
          <DiscoverFundingCard
            title="Valuation"
            value={sns}
            imageSrc={docu4}
            isPrivate={true}
          />
          <DiscoverFundingCard
            title="Target Amount"
            value={target_amount}
            imageSrc={docu5}
            isPrivate={true}
          />
        </div>
      </div>
      
    );
};

export default DiscoverMoneyRaising;
