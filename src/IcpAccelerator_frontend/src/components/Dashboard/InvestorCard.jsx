import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../Mentors/Event/NoDataCard";
import NoData from "../../../assets/images/search_not_found.png";
import { InvestorlistSkeleton } from "./Skeleton/Investorslistskeleton";
const InvestorsList = ({ numSkeletons, onNoDataChange }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);
  useEffect(() => {
    let isMounted = true;

    const getAllInvestors = async (caller) => {
      setIsLoading(true);
      await caller
        .get_top_three_vc()
        .then((result) => {
          console.log("get_top_three_vc ==>", result);
          if (isMounted) {
            if (!result || result.length == 0) {
              setNoData(true);
              onNoDataChange(true);
              setIsLoading(false);
              setData([]);
            } else {
              setData(result);
              setIsLoading(false);
              setNoData(false);
              onNoDataChange(false);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            setData([]);
            setIsLoading(false);
            setNoData(true);
            onNoDataChange(true);
          }
        });
    };

    if (actor) {
      getAllInvestors(actor);
    } else {
      getAllInvestors(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);
  return (
    <>
      {isLoading ? (
        Array(numSkeletons)
          .fill(0)
          .map((_, index) => <InvestorlistSkeleton key={index} />)
      ) : noData ? (
        <div className="items-center w-full flex justify-center">
          <NoDataCard
            image={NoData}
            desc={"You are not associated with any project yet"}
          />
        </div>
      ) : (
        data &&
        data?.slice(0, numSkeletons).map((investor, index) => {
          let id = investor?.principal?.toText();
          let img = investor?.params?.params?.user_data?.profile_picture
            ? uint8ArrayToBase64(
                investor?.params?.params?.user_data?.profile_picture[0]
              )
            : "";
          let name = investor?.params?.params?.user_data?.full_name;
          let company = investor?.params?.params?.name_of_fund;
          let role = "Investor";
          let website_link = investor?.params?.params?.website_link;
          let category_of_investment =
            investor?.params?.params?.category_of_investment ?? "";

          return (
            <div
              key={index}
              className="bg-white  hover:scale-105 w-full md3:w-1/2 dxl:w-1/3 rounded-lg mb-5 md:mb-0 p-6"
            >
              <div className="justify-center flex items-center">
                <div
                  className="size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay"
                  //  style={{
                  //   backgroundImage: `url(${img}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                  //   backdropFilter: "blur(20px)",
                  // }}
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
                  <span className="block text-gray-500 truncate">
                    {company}
                  </span>
                </div>
                <div className="flex overflow-x-auto gap-2 pb-4 justify-start">
                  {category_of_investment && category_of_investment !== ""
                    ? category_of_investment.split(",").map((item, index) => {
                        return (
                          <span
                            key={index}
                            className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-1 leading-none flex items-center"
                          >
                            {item.trim()}
                          </span>
                        );
                      })
                    : ""}
                </div>
                <button
                  onClick={() =>
                    id ? navigate(`/view-investor-details/${id}`) : ""
                  }
                  className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                >
                  View Profile
                </button>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default InvestorsList;
