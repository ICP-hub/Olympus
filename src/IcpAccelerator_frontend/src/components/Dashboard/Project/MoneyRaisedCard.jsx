import React from 'react';
import docu1 from "../../../../assets/images/docu.png";
import docu2 from "../../../../assets/images/docu.png";
import docu3 from "../../../../assets/images/docu.png";
import docu4 from "../../../../assets/images/docu.png";
import docu5 from "../../../../assets/images/docu.png";

const FundingCard = ({ title, value, imageSrc, isPrivate }) => {
    return (
      <div className="relative flex items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300">
        {/* Image Section */}
        <div className={`flex-shrink-0`}>
          <img
            src={imageSrc}
            alt={`${title} Thumbnail`}
            className="w-[150px] h-[100px] object-cover rounded-lg"
          />
        </div>

        {/* Details Section */}
        <div className={`ml-6 flex-grow transition-all duration-300 `}>
          <div className="flex justify-between items-center">
            <p className="text-xs xxs:text-base sm5:text-lg font-semibold text-gray-900">
              {title}
            </p>
          </div>
          <p className="text-xs xxs:text-sm text-gray-500 mt-1">
            <span className="font-semibold">{value}</span>
          </p>
        </div>

        {/* Request Access Button for Private Documents */}
        {/* {isPrivate && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Request Access
                    </button>
                </div>
            )} */}
      </div>
    );
};

const MoneyRaisedCard = ({ data }) => {
    const {
        icp_grants,
        investors,
        raised_from_other_ecosystem,
        sns,
        target_amount,
    } = data[0].params.money_raised[0]; // Destructure the necessary fields
    console.log("data kya kya aa rha h",data)

    return (
        <div className="space-y-4">
            <FundingCard
                title="ICP Grants"
                value={icp_grants}
                imageSrc={docu1}
                // isPrivate={false}  
            />
            <FundingCard
                title="Investors"
                value={investors}
                imageSrc={docu2}
                // isPrivate={false}  
            />
            <FundingCard
                title="Launchpad"
                value={raised_from_other_ecosystem}
                imageSrc={docu3}
                // isPrivate={false}  
            />
            <FundingCard
                title="Valuation"
                value={sns}
                imageSrc={docu4}
                isPrivate={false}  
            />
            <FundingCard
                title="Target Amount"
                value={target_amount}
                imageSrc={docu5}
                // isPrivate={false}  
            />
        </div>
    );
};

export default MoneyRaisedCard;


