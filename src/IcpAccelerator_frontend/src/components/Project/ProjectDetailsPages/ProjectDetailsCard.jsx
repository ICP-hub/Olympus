import React from "react";
import { useNavigate } from 'react-router-dom'
import { globesvg, linkedInSvg, twitterSvg } from "../../Utils/Data/SvgData";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import girl from "../../../../assets/images/girl.jpeg";
import { formatDateFromBigInt, formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

function ProjectDetailsCard({ data, image, title, rubric, tags, socials, doj, country, website, dapp }) {
    if (!data) {
        return null;
    }
    const navigate = useNavigate();
    let logo = data?.params?.project_logo ? uint8ArrayToBase64(data?.params?.project_logo) : girl;
    let name = data?.params?.project_name ?? '';
    let area_tags = data?.params?.project_area_of_focus ?? '';
    let linkenin_link = data?.params?.project_linkedin[0] ?? '';
    let twitter_link = data?.params?.project_twitter[0] ?? '';
    let website_link = data?.params?.project_website[0] ?? '';
    let dapp_link = data?.params?.dapp_link?.[0].trim() !== '' ? data?.params?.dapp_link?.[0] : null;
    let pro_country = data?.params?.user_data?.country ?? "";
    let joined_on = data?.creation_date ? formatFullDateFromBigInt(data?.creation_date) : "";



    return (
        <>
            <div className="p-6 shadow-lg pb-1 bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]">
                <div className="flex items-center">
                    <div className="flex">
                        {image &&
                            (<img
                                src={logo}
                                alt="img"
                                className="w-16 aspect-square object-cover rounded-md"
                            />)}
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <div className="px-2">
                            <div className="flex items-center">
                                {title &&
                                    (
                                        <div className="flex items-center">
                                            <p className="font-bold text-lg pr-2">{name}</p>
                                            {rubric && (<CircularProgressbar
                                                value={(4 / 9) * 100}
                                                text={`4/9`}
                                                className="w-10 h-10 font-extrabold text-lg"
                                                strokeWidth={8}
                                                styles={buildStyles({
                                                    strokeLinecap: "round",
                                                    pathTransitionDuration: 0.5,
                                                    pathColor: `#2247AF`,
                                                    trailColor: "#d6d6d6",
                                                    textColor: "#3505B2",
                                                })}
                                            />)}
                                        </div>
                                    )}
                            </div>
                            <div className="md:flex block text-xs md:text-sm text-[#737373]">
                                {tags && (
                                    <p className="flex items-center flex-wrap py-2 gap-2">
                                        {area_tags.split(",").slice(0, 3).map((val, index) => (
                                            <span className="bg-[#B5B5B54D] px-4 rounded-full" key={index}>
                                                {val}
                                            </span>
                                        ))}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap gap-2 text-xs md:text-sm text-right pr-4">
                            {socials && (
                                <div className="flex gap-2.5 mr-2 mt-1.5">
                                    <div className="w-4 h-4">
                                        <a href={linkenin_link} target="_blank">
                                            {linkedInSvg}
                                        </a>
                                    </div>
                                    <div className="w-4 h-4">
                                        <a href={twitter_link} target="_blank">
                                            {twitterSvg}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {website && (
                                <a href={website_link} target="_blank">
                                    <button className="font-[950] border bg-[#3505B2] py-[7px] px-[9px] rounded-md text-white text-nowrap">
                                        Visit Website
                                    </button>
                                </a>
                            )}
                            {dapp &&
                                (dapp_link ? (
                                    <a href={dapp_link} target="_blank">
                                        <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                                            Visit Dapp
                                        </button>
                                    </a>
                                ) : (
                                    <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                                        Live Now
                                    </button>
                                )
                                )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between text-gray-500 px-2 pt-2">
                    <div className="flex items-center">
                        {country && (
                            <div className="flex items-center gap-2">
                                <span className="capitalize">{pro_country}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                <p>
                                    {doj && (
                                        <div className="flex text-xs md:text-sm text-[#737373]">
                                            <span>Platform Joined On {joined_on}</span>
                                        </div>
                                    )}
                                </p>
                            </div>)}
                    </div>
                    <div>
                    </div>
                </div>
                {/* {country && ( */}
                {/* <div className="flex justify-end text-gray-500 px-2 pb-2 text-lg font-extrabold">
                    <div className="flex">
                        <div className="flex">
                            <span className="capitalize">overall rank #3</span>
                        </div>
                    </div>
                    <div>
                    </div>
                </div> */}
                {/* // )} */}
            </div>
        </>
    );
}

export default ProjectDetailsCard;
