import React from "react";
import {
    linkedInSvg,
    twitterSvg,
} from "../../Utils/Data/SvgData";

const MembersProfileDetailsCard = ({ data, profile, type, name, role, socials, filter }) => {
    if (!data) {
        return null;
    }

    // const cardData = [
    //     {
    //         id: 1,
    //         type: 'vc',
    //         name: "SamyKarim",
    //         role: "Toshi, Managing Partner. Ex-Binance",
    //         imageUrl:
    //             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    //     },
    //     {
    //         id: 2,
    //         type: 'mentor',
    //         name: "SamyKarim",
    //         role: "Toshi, Managing Partner. Ex-Binance",
    //         imageUrl:
    //             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    //     },
    //     {
    //         id: 3,
    //         type: 'mentor',
    //         name: "SamyKarim",
    //         role: "Toshi, Managing Partner. Ex-Binance",
    //         imageUrl:
    //             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    //     },
    //     {
    //         id: 4,
    //         type: 'user',
    //         name: "SamyKarim",
    //         role: "Toshi, Managing Partner. Ex-Binance",
    //         imageUrl:
    //             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    //     },
    // ];
    // const filteredArray = filter === 'team' ? cardData : cardData.filter((val) => val.type === filter);
    return (
        <div className="md1:flex flex-wrap gap-10">
            {data?.params?.project_team && data?.params?.project_team.length > 0 ?
                data?.params?.project_team.map((data, index) => (
                    <div key={index} className={`w-[100%] md1:w-[calc(100%/2-40px)] dxl:w-[calc(100%/3-40px)] xl2:w-[calc(25%-10px)] rounded-[10px] shadow-lg md:m-1 mb-10 p-6 ${index === 0 ? 'bg-blue-200' : 'bg-white'}`}>
                        <div className="flex w-full justify-between">
                            {profile && (
                                <div className="p-[3px] rounded-full flex bg-blend-overlay "
                                    style={{
                                        boxSizing: "border-box",
                                        background: `url(${data.imageUrl}) center / cover, linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                                        backdropFilter: "blur(20px)"
                                    }}>
                                    <img className="rounded-full object-cover w-20 h-20"
                                        src={data.imageUrl} alt={data.name} />
                                </div>)}
                            {socials && (
                                <div className="flex gap-3">
                                    <div className="w-4 h-4">
                                        {linkedInSvg}
                                    </div>
                                    <div className="w-4 h-4">
                                        {twitterSvg}
                                    </div>
                                </div>
                            )}
                        </div>
                        {type && (
                            <span className="text-sm font-bold text-gray-500 mb-2 px-4 uppercase">
                                {data?.type ?? ""}
                            </span>
                        )}
                        {name && role && (<div className="pt-4 pb-4 sm:pb-2 md:pb-0">
                            <div className="font-extrabold text-lg md:text-2xl mb-1">{data?.name ?? ""}</div>
                            <p className="text-gray-700 text-base capitalize">{index === 0 ? 'Author' : 'project member'}</p>
                        </div>
                        )}
                    </div>
                ))
                :
                <div>
                    <h1>No Data</h1>
                </div>
            }
        </div>
    );
};

export default MembersProfileDetailsCard;
