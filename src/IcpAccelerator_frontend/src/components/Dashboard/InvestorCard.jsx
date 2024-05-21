import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../Mentors/Event/NoDataCard";
import NoData from "../../../assets/images/search_not_found.png"
const InvestorsList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);

  // const getAllInvestors = async (caller) => {
  //   await caller
  //     .list_all_vcs()
  //     .then((result) => {
  //       if (!result || result.length == 0) {
  //         setNoData(true);
  //         setData([]);
  //       } else {
  //         setData(result);
  //         setNoData(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setData([]);
  //       setNoData(true);
  //     });
  // };

  // useEffect(() => {
  //   if (actor) {
  //     getAllInvestors(actor);
  //   } else {
  //     getAllInvestors(IcpAccelerator_backend);
  //   }
  // }, [actor]);

  useEffect(() => {
    let isMounted = true; 
  
    const getAllInvestors = async (caller) => {
      await caller
        .list_all_vcs()
        .then((result) => {
          if (isMounted) {
          if (!result || result.length == 0) {
            setNoData(true);
            setData([]);
          } else {
            setData(result);
            setNoData(false);
          }
        }
        })
        .catch((error) => {
          if (isMounted) {
          setData([]);
          setNoData(true);
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
  if (noData) {
    return (
      <div className="items-center w-full flex justify-center">
        <NoDataCard image={NoData} desc={'You are not associated with any project yet'}/>
      </div>
    );
  }
  return (
    <>
      {data &&
        data.slice(0, 3).map((investor, index) => {
          let id = investor[0].toText();
          let img = uint8ArrayToBase64(
            investor[1]?.vc_profile?.params?.user_data?.profile_picture[0]
          );
          let name = investor[1]?.vc_profile?.params?.user_data?.full_name;
          let company = investor[1]?.vc_profile?.params?.name_of_fund;
          let role = "Investor";
          let website_link = investor[1]?.vc_profile?.params?.website_link;
          let category_of_investment =
            investor[1]?.vc_profile?.params?.category_of_investment ?? "";

          return (
            <div
              key={index}
              className="bg-white  hover:scale-105 w-full sm:w-1/2 md:w-1/3 rounded-lg mb-5 md:mb-0 p-6"
            >
              <div className="justify-center flex items-center">
              <div className="size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay"
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
                  <span className="font-semibold text-lg truncate">
                    {name}
                  </span>
                  <span className="block text-gray-500 truncate">{company}</span>
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
        })}
    </>
  );
};

export default InvestorsList;
