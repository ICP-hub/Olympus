import React from "react";
import ment from "../../../assets/images/ment.jpg";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import data from "../../data/spotlight.json";

const AnnouncementCard = () => {
  return (
    <div className=" p-6 ">
      <div className="flex justify-between  gap-2 overflow-x-auto">
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
          {data.map((card, index) => (
            <SwiperSlide key={index}>
              <div className="shadow-md rounded-3xl overflow-hidden border-2 ">
                <div className="p-6">
                  <h1 className="text-[#7283EA] font-bold">Announcement</h1>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between mt-3">
                      <p className="text-black font-bold">New Feature</p>
                      <p className="text-black font-bold">10 October, 2023</p>
                    </div>

                    <p className="text-gray-500 text-sm mt-3">
                      The Student Side Dashboard provides students with access
                      to the assigned tests and assessments created by their
                      respective teachers. Students can log in to their
                      accounts, view a list of available tests, and choose the
                      tests they want to attempt.
                    </p>
                    <div className="flex flex-row gap-2 items-center">
                      <img
                        className="h-20 w-20 rounded-xl"
                        src={ment}
                        alt="User Profile"
                      />
                      <div className="flex flex-col justify-around gap-2">
                        <p className="text-md font-bold">Dirac Finance</p>
                        <p className="font-semibold text-gray-500  text-xs">
                          Dirac Finance is an institutional-grade decentralized
                          Options Vault (DOV) that...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AnnouncementCard;
