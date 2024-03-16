import React from "react";
import {
    linkedInSvg,
    twitterSvg,
} from "../Utils/Data/SvgData";

const MentorsProfileCard = ({ profile, type, name, role, socials, filter }) => {
    const cardData = [
        {
            id: 1,
            type: 'vc',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
        {
            id: 2,
            type: 'mentor',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
        {
            id: 3,
            type: 'mentor',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
        {
            id: 4,
            type: 'user',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
    ];
    const filteredArray = filter === 'team' ? cardData : cardData.filter((val) => val.type === filter);
    return (
        <div className="md:flex">
            {filteredArray.map((data, index) => (
                <div className="flex flex-wrap sm:w-full md:w-full lg:w-1/3 xl:w-1/3 justify-between p-4">
                    <div className="w-full p-4">
                        <div className=" relative shadow-md rounded-lg overflow-hidden  drop-shadow-xl gap-2 bg-white h-32 ">
                            <div className=" shadow-md rounded-lg overflow-hidden  drop-shadow-2xl gap-2 bg-blue-200 h-16 mb-[-2rem]">
                                {socials && (
                                    <div className="flex gap-3 justify-end p-4">
                                        <div className="w-4 h-4">
                                            {linkedInSvg}
                                        </div>
                                        <div className="w-4 h-4">
                                            {twitterSvg}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className=' absolute flex  flex-row gap 2 p-4 mt[-20px] gap-4'>
                                <img className='h-20 w-20 rounded-full border-2 object-cover border-white mt-[-2rem]' src={data.imageUrl} alt='No Img' />
                                <div className='flex-col flex mt-4'>
                                    <p className='text-black font-bold tex-lg md:text-2xl'>{data?.name ?? ""}</p>
                                    <p>Mentor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MentorsProfileCard;
