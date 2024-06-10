import React, { useEffect, useState } from "react";
import image from "../../../assets/images/samya.jpg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import NoDataCard from "../Mentors/Event/NoDataCard";
import NoData from "../../../assets/images/search_not_found.png";
import { MentorlistSkeleton } from "./Skeleton/Mentorlistskeleton";

const MentorCard = ({ numSkeletons }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);

  // const getAllMentors = async (caller) => {
  //   await caller
  //     .get_all_mentors_candid()
  //     .then((result) => {
  //       if (!result || result.length == 0) {
  //         setNoData(true);
  //         setData([]);
  //       } else {
  //         console.log("all mentors", result);
  //         setData(result);
  //         setNoData(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setNoData(true);
  //       setData([]);
  //     });
  // };

  // useEffect(() => {
  //   if (actor) {
  //     getAllMentors(actor);
  //   } else {
  //     getAllMentors(IcpAccelerator_backend);
  //   }
  // }, [actor]);

  useEffect(() => {
    let isMounted = true;

    const getAllMentors = async (caller) => {
      setIsLoading(true);
      await caller
        .get_all_mentors_candid()
        .then((result) => {
          if (isMounted) {
            if (!result || result.length == 0) {
              setNoData(true);
              setIsLoading(false);
              setData([]);
            } else {
              console.log("all mentors", result);
              setData(result);
              setIsLoading(false);
              setNoData(false);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            setNoData(true);
            setIsLoading(false);
            setData([]);
          }
        });
    };

    if (actor) {
      getAllMentors(actor);
    } else {
      getAllMentors(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);

  return (
    <>
      {isLoading ? (
        Array(numSkeletons)
          .fill(0)
          .map((_, index) => <MentorlistSkeleton key={index} />)
      ) : noData ? (
        <div className="items-center w-full flex justify-center">
          <NoDataCard image={NoData} desc={"Mentors not found at the moment"} />
        </div>
      ) : (
        data &&
        data.slice(0, numSkeletons).map((mentor, index) => {
          let id = null;
          let img = "";
          let name = "";
          let skills = "";
          let category_of_mentoring_service = "";
          let role = "Mentor";
          if (noData === false) {
            id = mentor[0].toText();
            img = uint8ArrayToBase64(
              mentor[1]?.mentor_profile?.profile?.user_data?.profile_picture[0]
            );
            name = mentor[1]?.mentor_profile?.profile?.user_data?.full_name;
            skills =
              mentor[1]?.mentor_profile?.profile?.user_data?.area_of_interest;
            category_of_mentoring_service =
              mentor[1]?.mentor_profile?.profile?.category_of_mentoring_service;
            role = "Mentor";
          } else {
            id = mentor.id;
            img = mentor.image;
            name = mentor.name;
            skills = mentor.areaOfFocus;
            role = mentor.role;
          }
          return (
            <div
              key={index}
              className="bg-white  hover:scale-105 w-full md3:w-1/2 dxl:w-1/3 rounded-lg mb-5 md:mb-0 p-6"
            >
              <div className="justify-center flex items-center">
                <div
                  className="size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay"
                  // style={{
                  //   backgroundImage: `url(${img}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                  //   backdropFilter: "blur(20px)",
                  // }}
                >
                  <img
                    className="object-cover size-48 max-h-44 rounded-full"
                    src={img}
                    alt=""
                  />
                </div>
              </div>
              <div className="text-black text-start">
                <div className="text-start my-3">
                  <span className="font-semibold text-lg truncate">{name}</span>
                  <span className="block text-gray-500 truncate">
                    {category_of_mentoring_service}
                  </span>
                </div>
                <div>
                  <div className="flex overflow-x-auto gap-2 pb-4 justify-start">
                    {skills?.split(",").map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2"
                        >
                          {item.trim()}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    onClick={() =>
                      id ? navigate(`/view-mentor-details/${id}`) : ""
                    }
                    className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default MentorCard;
