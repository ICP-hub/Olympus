import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../Mentors/Event/NoDataCard";

const InvestorsList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);

  const getAllInvestors = async (caller) => {
    await caller.list_all_vcs().then((result) => {
      console.log('result-in-get-all-investors', result)
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
      console.log('error-in-get-all-investors', error)
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
    return <div className="items-center w-full">
      <NoDataCard />
    </div>
  }
  return (
    <div className="flex flex-col lg:flex-row items-center mt-8 gap-4 w-full">
      {data && data.slice(0, 3).map((investor, index) => {
        let id = investor[0].toText();
        let img = uint8ArrayToBase64(investor[1]?.vc_profile?.params?.user_data?.profile_picture[0]);
        let name = investor[1]?.vc_profile?.params?.user_data?.full_name;
        let company = investor[1]?.vc_profile?.params?.name_of_fund;
        let role = 'Investor';

        return (
          <div key={index} className="flex-shrink-0 overflow-hidden bg-white rounded-lg max-w-xs shadow-lg p-5 w-full lg:w-1/3">
            <div className=" flex items-center justify-center px-8">
              <img className="w-full h-40 object-cover rounded-md" src={img} alt="" />
            </div>
            <div className="text-black mt-2 text-center">
              <span className="font-semibold text-lg line-clamp-1">
                {name}
              </span>
              <span className="block font-semibold line-clamp-2 h-10">
                {role}
              </span>
              <div className="flex flex-wrap gap-2 border-t-2 mt-5 py-3">
                <span className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2">
                  {company}
                </span>
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
