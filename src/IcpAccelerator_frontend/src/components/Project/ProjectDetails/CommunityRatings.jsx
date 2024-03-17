import React from "react";
import { Star, colorStar } from '../../Utils/Data/SvgData';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';


const CommunityRatings = ({ profile, type, name, role, socials, filter }) => {
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
        <div className="md1:flex sm:flex flex-wrap ">

            {/* Overall circlular   part1 Cards  Start */}
            <div className="flex w-full sm:w/1/2 md:w-1/3 justify-between">
                <div className="w-full sm:w-full md:w-full p-4">
                    <div className="shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-blue-200 p-4 h-full">
                        <div className='flex flex-row justify-between flex-wrap'>
                            <p className='text-lg text-black font-extrabold'>Overall Rating</p>
                            <p className='text-[#737373] text-sm flex items-center'>10 October, 2023</p>
                        </div>
                        <div className='flex flex-row gap-6 flex-wrap items-center'>
                            <div>
                                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#FF6347" />
                                            <stop offset="100%" stopColor="#32CD32" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <CircularProgressbar
                                    className="w-24 h-24 -rotate-90"
                                    value={10}
                                    strokeWidth={8}
                                    text={`${0}%`}
                                    styles={buildStyles({
                                        strokeLinecap: "round",
                                        pathTransitionDuration: 0.5,
                                        pathColor: `url(#progressGradient)`,
                                        trailColor: "",
                                        textColor: "#737373", // Set the color of the text
                                        textSize: "24px", // Set the size of the text
                                    })}
                                />
                            </div>
                            <div className='flex flex-row justify-center items-center gap-2'>
                                {/* Assuming Star is defined elsewhere */}
                                {Star}
                                {Star}
                                {Star}
                            </div>
                        </div>
                        <p className='text-[#737373]'>On basis of all Community ratings</p>
                    </div>
                </div>
            </div>

            {/* Overall rating part1 Cards Ending */}
            {/* Overall rating part2 Cards Start */}


            {/* Overall rating part2 Cards Ending */}

            {filteredArray.map((data, index) => {
                console.log("index", index)
                let bg_color = ((index % 2) == 0) ? 'bg-white' : 'bg-blue-200';
                console.log("bg_color", bg_color)

                return (
                    <div className="flex flex-wrap justify-center sm:justify-between w-full sm:w/1/2 md:w-1/3" key={index}>
                        <div className="w-full p-4">
                            <div className={`shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 p-4 ${bg_color}`}>
                                <div className='flex flex-row justify-start sm:justify-start lg:justify-start flex-wrap gap-2 items-center'>
                                    <img className='h-14 object-cover w-14 rounded-full' src={data.imageUrl} alt='No img' />
                                    <div className='flex flex-col'>
                                        <p className='text-2xl text-black font-extrabold'>SamyKarim</p>
                                        <p className='text-[#737373] flex items-center'>10 October, 2023</p>
                                    </div>
                                    {colorStar}
                                    {colorStar}
                                    {colorStar}
                                    {colorStar}
                                </div>
                                <div className='flex flex-col sm:flex-row lg:flex-col ml-0 sm:ml-0 lg:ml-12'>
                                    <p className='font-bold text-xl'>“Great work”</p>
                                    <p className='text-[#737373]'>The Student Side Dashboard provides students with access to the assigned tests and assessments created by their respective teachers.</p>
                                </div>
                            </div>
                        </div>
                    </div>)
            })}
        </div>

    );
};

export default CommunityRatings;
{/* <div key={index} className={`w-[100%] md1:w-[calc(100%/2-40px)] dxl:w-[calc(100%/3-40px)] xl2:w-[calc(25%-10px)] rounded-[10px] shadow-lg md:m-1 mb-10 p-6 ${index === 0 ? 'bg-blue-200' : 'bg-white'}`}>
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
                </div> */}


