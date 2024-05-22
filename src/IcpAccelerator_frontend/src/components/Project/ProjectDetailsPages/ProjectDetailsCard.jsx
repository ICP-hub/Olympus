import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { globesvg, linkedInSvg, twitterSvg } from "../../Utils/Data/SvgData";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import girl from "../../../../assets/images/girl.jpeg";
import {
  formatDateFromBigInt,
  formatFullDateFromBigInt,
} from "../../Utils/formatter/formatDateFromBigInt";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import LiveModal from "../../../../../admin_frontend/src/components/models/LiveModal";

function ProjectDetailsCard({
  data,
  image,
  title,
  rubric,
  tags,
  socials,
  doj,
  country,
  website,
  dapp,
}) {
  if (!data) {
    return null;
  }
  const [modalData, setModalData] = useState(null);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const toggleAcceptModal = (id) => {
    setModalData(id);
    setIsAcceptModalOpen(!isAcceptModalOpen);
  };
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);

  let logo = data?.params?.project_logo
    ? uint8ArrayToBase64(data?.params?.project_logo)
    : girl;
  let name = data?.params?.project_name ?? "";
  let area_tags = data?.params?.user_data?.area_of_interest ?? "";
  let linkedin_link =
    data?.params?.project_linkedin?.[0] &&
    data?.params?.project_linkedin?.[0].trim() !== ""
      ? data?.params?.project_linkedin?.[0]
      : null;
  let twitter_link =
    data?.params?.user_data?.twitter_id?.[0] &&
    data?.params?.user_data?.twitter_id?.[0].trim() !== ""
      ? data?.params?.user_data?.twitter_id?.[0]
      : null;
  let website_link =
    data?.params?.project_website?.[0] &&
    data?.params?.project_website?.[0].trim() !== ""
      ? data?.params?.project_website?.[0]
      : null;
  let dapp_link =
    data?.params?.dapp_link?.[0] && data?.params?.dapp_link?.[0].trim() !== ""
      ? data?.params?.dapp_link[0]
      : null;
  let pro_country = data?.params?.user_data?.country ?? "";
  let joined_on = data?.creation_date
    ? formatFullDateFromBigInt(data?.creation_date)
    : "";

  const [rubRating, setRubRating] = useState([]);

  const fetchRubricRating = async (val) => {
    await actor
      .calculate_average(val?.uid)
      .then((result) => {
        console.log("result-in-calculate_average", result);
        if (result && Object.keys(result).length > 0) {
          setRubRating(result);
        } else {
          setRubRating([]);
        }
      })
      .catch((error) => {
        console.log("error-in-calculate_average", error);
        setRubRating([]);
      });
  };

  useEffect(() => {
    if (rubric && data) {
      fetchRubricRating(data);
    }
  }, [rubric]);

  return (
    <>
      {isAcceptModalOpen && (
        <LiveModal onClose={() => setIsAcceptModalOpen(false)} id={data?.uid} />
      )}
      <div className="p-6 sm5:block hidden shadow-2xl bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]">
        <div className="flex items-center">
          <div className="flex">
            {image && (
              <img
                src={logo}
                alt="img"
                className="w-16 aspect-square object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="px-2">
              <div className="flex items-center">
                {title && (
                  <div className="flex items-center">
                    <p className="font-bold text-lg pr-2">{name}</p>
                    {rubric && (
                      <CircularProgressbar
                        value={
                          rubRating?.overall_average &&
                          rubRating?.overall_average.length > 0
                            ? (rubRating?.overall_average[
                                rubRating?.overall_average.length - 1
                              ] /
                                9) *
                              100
                            : (0 / 9) * 100
                        }
                        text={
                          rubRating?.overall_average &&
                          rubRating?.overall_average.length > 0
                            ? `${
                                rubRating?.overall_average[
                                  rubRating?.overall_average.length - 1
                                ]
                              }/9`
                            : `0/9`
                        }
                        className="w-14 h-14 font-extrabold"
                        strokeWidth={8}
                        styles={buildStyles({
                          strokeLinecap: "round",
                          pathTransitionDuration: 0.5,
                          pathColor: `#2247AF`,
                          trailColor: "#d6d6d6",
                          textColor: "#6E7291",
                          textSize: "24px",
                        })}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="md:flex block text-xs md:text-sm text-[#737373]">
                {tags && (
                  <p className="flex items-center flex-wrap py-2 gap-2">
                    {area_tags
                      .split(",")
                      .slice(0, 3)
                      .map((val, index) => (
                        <span
                          className="bg-[#B5B5B54D] px-4 rounded-full"
                          key={index}
                        >
                          {val}
                        </span>
                      ))}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-2 text-xs md:text-sm text-right">
              {socials && (
                <div className="flex gap-2.5 mr-2 mt-1.5">
                  {linkedin_link && (
                    <div className="w-4 h-4">
                      <a href={linkedin_link} target="_blank">
                        {linkedInSvg}
                      </a>
                    </div>
                  )}
                  {twitter_link && (
                    <div className="w-4 h-4">
                      <a href={twitter_link} target="_blank">
                        {twitterSvg}
                      </a>
                    </div>
                  )}
                </div>
              )}
              {website_link && (
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
                  <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap"
                  onClick={() => toggleAcceptModal(data?.uid)}>
                    Live Now
                  </button>
                ))}
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
              </div>
            )}
          </div>
          <div></div>
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
      <div className="sm1:p-6 py-2 sm5:hidden block shadow-2xl bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]">
        <div>
          <div className="flex sm1:hidden justify-center">
            {image && (
              <img
                src={logo}
                alt="img"
                className="w-16 aspect-square object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex items-center">
            <div className="sm1:flex hidden">
              {image && (
                <img
                  src={logo}
                  alt="img"
                  className="w-16 aspect-square object-cover rounded-md"
                />
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="sm1:px-2 w-full">
                <div className="flex items-center justify-center sm1:justify-between">
                  {title && (
                    <div className="flex items-center">
                      <p className="font-bold truncate text-lg pr-2">{name}</p>
                      {rubric && (
                        <CircularProgressbar
                          value={
                            rubRating?.overall_average &&
                            rubRating?.overall_average.length > 0
                              ? (rubRating?.overall_average[
                                  rubRating?.overall_average.length - 1
                                ] /
                                  9) *
                                100
                              : (0 / 9) * 100
                          }
                          text={
                            rubRating?.overall_average &&
                            rubRating?.overall_average.length > 0
                              ? `${
                                  rubRating?.overall_average[
                                    rubRating?.overall_average.length - 1
                                  ]
                                }/9`
                              : `0/9`
                          }
                          className="w-8 h-8 font-extrabold"
                          strokeWidth={8}
                          styles={buildStyles({
                            strokeLinecap: "round",
                            pathTransitionDuration: 0.5,
                            pathColor: `#2247AF`,
                            trailColor: "#d6d6d6",
                            textColor: "#6E7291",
                            textSize: "24px",
                          })}
                        />
                      )}
                    </div>
                  )}
                  <div className="sm1:flex hidden text-xs">
                    {website_link && (
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
                      ))}
                  </div>
                </div>
                <div className="md:flex block text-xs py-1 md:text-sm text-[#737373]">
                  {tags && (
                    <p className="flex items-center flex-wrap py-2 gap-2 justify-center sm1:justify-start">
                      {area_tags
                        .split(",")
                        .slice(0, 3)
                        .map((val, index) => (
                          <span
                            className="bg-[#B5B5B54D] px-4 truncate rounded-full"
                            key={index}
                          >
                            {val}
                          </span>
                        ))}
                    </p>
                  )}
                </div>
                <div className="flex justify-center sm1:justify-start text-gray-500">
                  <div className="flex items-center">
                    {country && (
                      <div className="flex items-center gap-1">
                        <span className="capitalize text-xs md:text-sm">
                          {pro_country}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <p>
                          {doj && (
                            <div className="flex text-xs truncate md:text-sm text-[#737373]">
                              <span>Platform Joined On {joined_on}</span>
                            </div>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end text-xs">
                  {socials && (
                    <div className="flex gap-2.5 mr-2 mt-1.5 mb-2">
                      {linkedin_link && (
                        <div className="w-4 h-4">
                          <a href={linkedin_link} target="_blank">
                            {linkedInSvg}
                          </a>
                        </div>
                      )}
                      {twitter_link && (
                        <div className="w-4 h-4">
                          <a href={twitter_link} target="_blank">
                            {twitterSvg}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex sm1:hidden justify-around text-xs mt-1.5">
            {website_link && (
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
              ))}
          </div>
          {/* <div className="flex flex-row flex-wrap gap-2 text-xs md:text-sm text-right justify-around">
            <div className="flex justify-end text-gray-500 px-2 pb-2 text-lg font-extrabold">
              <div className="flex">
                <div className="flex">
                  <div className="flex items-center">
                    <p className="font-bold text-lg pr-2">{name}</p>
                   
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default ProjectDetailsCard;
