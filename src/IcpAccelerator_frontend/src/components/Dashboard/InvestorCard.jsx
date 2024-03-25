import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../Mentors/Event/NoDataCard";

const investors = [
  {
    id: null,
    image: image,
    name: "John Doe",
    role: "Investment Analyst",
    company: "Venture Capital Partners",
  },
  {
    id: null,
    image: image,
    name: "Jane Smith",
    role: "Senior Partner",
    company: "Tech Growth Fund",
  },
  {
    id: null,
    image: image,
    name: "Michael Johnson",
    role: "Managing Director",
    company: "Innovate Ventures",
  }
];


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

  if(noData){
    return <div className="items-center w-full">
    <NoDataCard />
        </div>
  }
  return (
    <div className="p-1 flex items-center mb-8 gap-4">
      {data.map((investor, index) => {
        let id = null
        let img = ""
        let name = ""
        let company = ""
        let role = '';

        if (noData === false) {

          id = investor[0].toText();
          img = uint8ArrayToBase64(investor[1]?.vc_profile?.params?.user_data?.profile_picture[0]);
          name = investor[1]?.vc_profile?.params?.user_data?.full_name;
          company = investor[1]?.vc_profile?.params?.name_of_fund;
          role = 'Investor';
        } else {
          id = investor.id
          img = investor.image
          name = investor.name
          company = investor.company
          role = investor.role;
        }
        return (
          <div key={index} className="flex-shrink-0 overflow-hidden bg-white rounded-lg max-w-xs shadow-lg p-5 w-1/2">
            <div className=" flex items-center justify-center px-8">
              <img className="w-full h-40 object-cover rounded-md" src={img} alt="" />
            </div>
            <div className="text-black mt-2">
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
