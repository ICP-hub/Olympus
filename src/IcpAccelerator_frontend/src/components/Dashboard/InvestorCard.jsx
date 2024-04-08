import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../Mentors/Event/InvestorsNoDataCard";

const InvestorsList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);

  const getAllInvestors = async (caller) => {
    await caller.list_all_vcs().then((result) => {
      if (!result || result.length == 0) {
        setNoData(true)
        setData([]);
      } else {
        setData(result);
        setNoData(false)
      }
    }).catch((error) => {
      setData([]);
      setNoData(true)
    })
  }

  useEffect(() => {
    if (actor) {
      getAllInvestors(actor);
    } else {
      getAllInvestors(IcpAccelerator_backend);
    }
  }, [actor]);

  if (noData) {
    return <div className="items-center w-full flex justify-center">
      <NoDataCard />
    </div>
  }
  return (
    <div className="flex items-stretch justify-between lg:flex-row md:gap-4 w-fit w-full pr-2 max-md:flex-col">
      {data && data.slice(0, 3).map((investor, index) => {
        let id = investor[0].toText();
        let img = uint8ArrayToBase64(investor[1]?.vc_profile?.params?.user_data?.profile_picture[0]);
        let name = investor[1]?.vc_profile?.params?.user_data?.full_name;
        let company = investor[1]?.vc_profile?.params?.name_of_fund;
        let role = 'Investor';
        let website_link = investor[1]?.vc_profile?.params?.website_link;
        let category_of_investment = investor[1]?.vc_profile?.params?.category_of_investment ?? ""

        return (
          <div key={index} className="bg-white duration-300 ease-in-out hover:scale-105 md:mb-0 mb-5 p-5 rounded-lg shadow-lg transition-transform flex-grow max-md:w-full md:w-1/3">
            <div className=" flex items-center justify-center w-1/2" style={{margin: "auto"}}>
              <img className="object-cover w-14 h-14" src={img} alt="" style={{borderRadius: '50%'}} />
            </div>
            <div className="text-black mt-4 text-center">
              <span className="font-semibold text-lg line-clamp-1">
                {name}
              </span>
              <span className="block text-gray-500">
                {company}
              </span>
              <div className="flex overflow-x-scroll gap-2 border-t-2 mt-5 py-4 max-md:justify-center">
              {category_of_investment && category_of_investment !== '' ? 
              category_of_investment.split(',').map((item, index) => {
                return (<span key={index} className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
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
  );
};

export default InvestorsList;
