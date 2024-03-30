import React, { useState, useEffect } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import NoDataCard from "../Mentors/Event/NoDataCard";

const SpotLight = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [spotLightData, setSpotLightData] = useState([]);

  const fetchSpotLight = async (caller) => {
    await caller
      .get_spotlight_projects()
      .then((result) => {
        console.log("result-in-spotlight", result);
        if (result && result.length > 0) {
          setSpotLightData(result);
          setNoData(false);
        } else {
          setSpotLightData([]);
          setNoData(true);
        }
      })
      .catch((error) => {
        setNoData(true);
        setSpotLightData([]);
        console.log("error-in-spotlight", error);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchSpotLight(actor);
    } else {
      fetchSpotLight(IcpAccelerator_backend);
    }
  }, [actor]);

  return (
    <div className="py-4">
      <div className="flex justify-between  gap-4 overflow-x-auto">
        {noData ? (
          <NoDataCard />
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            spaceBetween={30}
            slidesPerView="auto"
            slidesOffsetAfter={100}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {spotLightData &&
              spotLightData.map((data, index) => {
                console.log("spotlight", data);
                let addedBy = data?.added_by?.toText();
                let userImage = data?.user_data?.profile_picture[0];
                let projectName = data?.project_details?.project_name;
                let projectImage = uint8ArrayToBase64(
                  data?.project_details?.project_logo
                );
                let projectDescription =
                  data?.project_details?.project_description;
                let projectAreaOfFocus =
                  data?.project_details?.project_area_of_focus;
                return (
                  <SwiperSlide key={index}>
                    <div className="mb-2 shadow-md rounded-3xl overflow-hidden border-2 spotlight-card-image w-full">
                      <div className="p-6">
                        <div className="flex flex-row gap-2">
                          <img
                            className="rounded-lg w-12 h-12"
                            src={projectImage}
                            alt={"img"}
                          />
                          <div className="flex flex-col">
                            <div className="text-[#7283EA] font-bold">
                              {projectName}
                            </div>

                            <div className="flex flex-row gap-2 items-center">
                              <img
                                className="h-6 w-6 rounded-full"
                                src={userImage}
                                alt="User Profile"
                              />
                              <div className="text-xs truncate w-56 lg:w-56 sxs:w-36 md:w-56">
                                {addedBy}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm my-2 line-clamp-3 min-h-16">
                          {projectDescription}
                        </div>
                        <div className="flex flex-row gap-4 mt-2">
                          <div className="flex gap-2 mt-2 text-xs items-center">
                            {projectAreaOfFocus
                              .split(",")
                              .slice(0, 3)
                              .map((tag, index) => (
                                <div
                                  key={index}
                                  className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                                >
                                  {tag.trim()}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default SpotLight;
