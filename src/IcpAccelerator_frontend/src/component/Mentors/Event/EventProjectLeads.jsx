import React from "react";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import NoDataCard from "./NoDataCard";
import NoData from "../../../../assets/images/search_not_found.png";

function EventProjectLeads({ allInvestorData, noData }) {
  const navigate = useNavigate();

  if (noData || !allInvestorData?.Ok?.length) {
    return (
      <div className="items-center w-full flex justify-center">
        <NoDataCard
          image={NoData}
          desc={"You are not associated with any project yet"}
        />
      </div>
    );
  }

  return (
    <div className="items-center w-full flex justify-start">
      {allInvestorData.Ok.map((investor, index) => {
        let img = uint8ArrayToBase64(
          investor?.params?.user_data?.profile_picture[0]
        );
        let name = investor?.params?.user_data?.full_name;
        let company = investor?.params?.name_of_fund;
        let category_of_investment =
          investor?.params?.category_of_investment ?? "";

        return (
          <div
            key={index}
            className="bg-white hover:scale-105 w-full sm:w-1/2 md:w-1/4 rounded-lg mb-5 md:mb-0 p-6 py-8"
          >
            <div className="justify-center flex items-center">
              <div
                className="size-48 rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                style={{
                  backgroundImage: `url(${img}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                  backdropFilter: "blur(20px)",
                }}
              >
                <img
                  className="object-cover size-48 max-h-44 rounded-full"
                  src={img}
                  alt=""
                />
              </div>
            </div>
            <div className="text-black text-start">
              <div className="text-start my-3">
                <span className="font-semibold text-lg truncate">{name}</span>
                <span className="block text-gray-500 truncate">{company}</span>
              </div>
              <div className="flex overflow-x-auto gap-2 pb-4 justify-start">
                {category_of_investment &&
                  category_of_investment.split(",").map((item, index) => (
                    <span
                      key={index}
                      className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-1 leading-none flex items-center"
                    >
                      {item.trim()}
                    </span>
                  ))}
              </div>
              <button
                // onClick={() => navigate(`/view-investor-details`)}
                className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
              >
                View Profile
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EventProjectLeads;

