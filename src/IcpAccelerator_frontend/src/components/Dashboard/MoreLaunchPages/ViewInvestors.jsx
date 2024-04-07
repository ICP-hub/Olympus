import React, { useEffect, useState } from "react";
import image from "../../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../../Mentors/Event/NoDataCard";
const investors = [
  {
    id: 1,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: ["SRE", "Observability ", "Kubernetes"],
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Reliability Engineer and DevOps",
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Reliability Engineer and DevOps",
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Tech Growth Fund",
  },
  {
    id: 2,
    image: image,
    name: "SamyKarim",
    role: "Toshi, Managing Partner. Ex-Binance",
    company: "Innovate Ventures",
  },
];

const ViewInvestor = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);

  const getAllInvestors = async (caller) => {
    await caller
      .list_all_vcs()
      .then((result) => {
        console.log("result-in-get-all-investors", result);
        if (!result || result.length == 0) {
          setNoData(true);
          setData([]);
        } else {
          setNoData(false);
          setData(result);
        }
      })
      .catch((error) => {
        setNoData(true);
        setData([]);
        console.log("error-in-get-all-investors", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllInvestors(actor);
    } else {
      getAllInvestors(IcpAccelerator_backend);
    }
  }, [actor]);
  return (
    <div className="px-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="flex flex-col text-center items-center justify-center">
        <div className="py-8">
          <h2 className="text-[40px] font-black leading-10 bg-gradient-to-r from-[#7283EA] to-[#4087BF] bg-clip-text text-transparent transform">
            Our{" "}
            <span className=" bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text text-transparent transform">
              Investors
            </span>
          </h2>
        </div>
        {/* <div className="flex items-center relative md1:w-1/2 sm1:w-3/4 w-full p-2 mb-8 border border-[#737373] rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by company, skills or role"
            className="flex-grow bg-transparent rounded focus:outline-none"
          />
          <button className="md1:block absolute hidden right-0 bg-[#3505B2] font-black text-xs text-white px-4 py-2 mr-1 rounded-md focus:outline-none">
            Search Investor
          </button>
          <button className="block absolute md1:hidden right-0 bg-transparent font-black text-xs text-[#3505B2] px-4 py-2 mr-1 rounded-md focus:outline-none">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div> */}
      </div>
      <div className="md:gap-4 md:grid md:grid-cols-4 max-md:flex max-md:flex-col justify-center mb-5">
        {noData ? <NoDataCard /> :
          data.map((investor, index) => {

            
            let id = investor[0].toText();
            let img = uint8ArrayToBase64(investor[1]?.vc_profile?.params?.user_data?.profile_picture[0]);
            let name = investor[1]?.vc_profile?.params?.user_data?.full_name;
            let company = investor[1]?.vc_profile?.params?.name_of_fund;
            let role = 'Investor';
            let website_link = investor[1]?.vc_profile?.params?.website_link;
            let category_of_investment = investor[1]?.vc_profile?.params?.category_of_investment ?? ""

            return (
              <div key={index} className="bg-white duration-300 ease-in-out hover:scale-105 mb-5 md:mb-0 p-5 rounded-lg shadow-lg transition-transform w-full">
                <div className=" flex items-center justify-center w-1/2" style={{margin: "auto"}}>
                  <img className="w-full object-cover" src={img} alt="" style={{borderRadius: '50%'}} />
                </div>
                <div className="text-black mt-4 text-center">
                  <span className="font-semibold text-lg line-clamp-1">
                    {name}
                  </span>
                  <span className="block text-gray-500">
                    {company}
                  </span>
                  <div className="flex flex-wrap gap-2 border-t-2 mt-5 py-4 max-md:justify-center">
                  {category_of_investment && category_of_investment !== '' ? 
                  category_of_investment.split(',').map(function(item) {
                    return (<span className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                    {item.trim()}
                    </span>  )
                  })
                  : 
                  
                  ""} 
                   {/* <span className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                      {category_of_investment}
                      </span>       */}
                          
                  </div>
                  <button onClick={() => id ? navigate(`/view-investor-details/${id}`) : ''} className="mt-4  text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out">
                    View Profile
                  </button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  );
};

export default ViewInvestor;
