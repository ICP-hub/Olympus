import React from "react";
import {
    linkedInSvg,
    twitterSvg,
} from "../../Utils/Data/SvgData";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from 'react-router-dom';
import NoDataCard from "../../Mentors/Event/MentorAssociatedNoDataCard";

const MentorsProfileDetailsCard = ({ data, isProjectLive, profile, type, name, role, socials, addButton, filter }) => {
    const navigate = useNavigate();

    if (!data) {
        return null;
    }

    return (
        <>
            {addButton && isProjectLive && (
                <div className="w-full flex justify-end mb-4">
                    <button onClick={() => navigate(`/view-mentors/${data?.uid}`)} className="border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900">
                        Associate Mentor
                    </button>
                </div>
            )}

            <div className="md:flex">
                {data?.params?.mentors_assigned && data.params.mentors_assigned.length > 0 ?
                    data.params.mentors_assigned[0]?.map((data, index) => {

                        let name = data?.user_data?.full_name ?? ""
                        let linked_in_link = data?.linkedin_link ?? ""
                        let twitter_link = data?.user_data?.twitter_id[0] ?? ""
                        let image = data?.user_data?.profile_picture[0] ? uint8ArrayToBase64(data?.user_data?.profile_picture[0]) : ""
                        return (
                            <div key={index} className="flex flex-wrap sm:w-full md:w-full lg:w-1/3 xl:w-1/3 justify-between p-4">
                                <div className="w-full p-4">
                                    <div className=" relative shadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-white h-32 ">
                                        <div className=" shadow-md rounded-lg overflow-hidden  drop-shadow-2xl gap-2 bg-blue-200 h-16 mb-[-2rem]">
                                            {socials && (
                                                <div className="flex gap-3 justify-end p-4">
                                                    {linked_in_link &&
                                                        (<div className="w-4 h-4">
                                                            <a href={linked_in_link} target="_blank">
                                                                {linkedInSvg}
                                                            </a>
                                                        </div>
                                                        )}
                                                    {twitter_link &&
                                                        (<div className="w-4 h-4">
                                                            <a href={linked_in_link} target="_blank">
                                                                {twitterSvg}
                                                            </a>
                                                        </div>
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                        <div className=' absolute flex flex-row gap 2 p-4 mt[-20px] gap-4'>
                                            <img
                                                className='h-20 w-20 rounded-full border-2 object-cover border-white mt-[-2rem]'
                                                src={image} alt='Img'
                                            />
                                            <div className='flex-col flex mt-4'>
                                                <p className='text-black font-bold tex-lg md:text-2xl'>{name}</p>
                                                <p>Mentor</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div className="w-full">
                        <NoDataCard/>
                    </div>}
            </div>
        </>
    );
};

export default MentorsProfileDetailsCard;
