import React from 'react';
import ment from "../../../assets/images/ment.jpg";
import inv from "../../../assets/images/inv.jpeg";
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';


const InvestedProjects = ({ data }) => {

  let name = data?.project_name ?? '';
  let paragraph = data?.reason_to_join_incubator ?? '';
  let project = data?.preferred_icp_hub ?? '';
  let logo = data?.project_logo ? uint8ArrayToBase64(data?.project_logo) : "";
  let cover = data?.project_cover ? uint8ArrayToBase64(data?.project_cover) : "";

    return (
        <div className='md:mx-6 mx-0'>
          
            <div className="lg:w-[415px] md:w-72 w-60 shadow-md rounded-lg overflow-hidden  mx-4  border-2  bg-white  p-4 mb-4">
                <img className='h-26 w-full mx-auto rounded-3xl p-4 object-cover' src={cover} alt='InvestorData' />
                <div className='flex justify-end mr-2 oveflow-x-auto'>
                    <p className='text-[#6B7280] font-bold text-md mr-2 '>{project}</p>
                </div>
                <div className='ml-2'>
                    <div className='text-2xl text-black flex flex-row space-x-2'>
                         <img className="w-12 h-12 rounded-lg object-cover" src={logo} alt="logo" />
                        <div className='flex flex-col text-[15px] flex-wrap '>
                            <h3 className='font-bold text-black flex-wrap'>{name}</h3>
                            <p className='mt-[-2px]'>{paragraph}</p>
                        </div>
                    </div>
                    <div className='p-4 overflow-x-auto'>
                        <p className="text-[#6B7280] mt-2 line-clamp-2 ">{}</p>
                    </div>
                    {/* <div className='flex mt-4 text-sm bg-[#3505B2] rounded-md justify-center mr-2'>
                        <button className="flex justify-center items-center text-white px-4 py-2 font-bold ">See projects</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default InvestedProjects;
