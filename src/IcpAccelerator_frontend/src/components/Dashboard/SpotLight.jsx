import React from "react";
import ment from "../../../assets/images/ment.jpg";
import girl from "../../../assets/images/girl.jpeg";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import data from '../../data/spotlight.json';

const SpotLight = () => {
  // const cards = [
  //   {
  //     logo: ment,
  //     altText: "Dirac Finance Logo",
  //     title: "Dirac Finance",
  //     description: ["DeFi", "Q&A market place built on..."],
  //     userImage: girl,
  //     userAddress: "0x2085...016B",
  //     longDescription:
  //       "Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that... Beep! 2.0 by Beep! - New Era for Collaboration",
  //     tags: ["DAO", "Infrastructure", "+ 1 more"],
  //   },
  //   {
  //     logo: ment,
  //     altText: "Another Company Logo",
  //     title: "Another Company",
  //     description: ["Crypto", "Innovative solutions for..."],
  //     userImage: girl,
  //     userAddress: "0x1234...ABCD",
  //     longDescription:
  //       "Another Company provides cutting-edge solutions for the crypto market that... Disrupt 3.0 by Innovate! - The Future is Now",
  //     tags: ["Tech", "Blockchain", "+ 2 more"],
  //   },
  //   {
  //     logo: ment,
  //     altText: "Another Company Logo",
  //     title: "Another Company",
  //     description: ["Crypto", "Innovative solutions for..."],
  //     userImage: girl,
  //     userAddress: "0x1234...ABCD",
  //     longDescription:
  //       "Another Company provides cutting-edge solutions for the crypto market that... Disrupt 3.0 by Innovate! - The Future is Now",
  //     tags: ["Tech", "Blockchain", "+ 2 more"],
  //   },
  //   {
  //     logo: ment,
  //     altText: "Another Company Logo",
  //     title: "Another Company",
  //     description: ["Crypto", "Innovative solutions for..."],
  //     userImage: girl,
  //     userAddress: "0x1234...ABCD",
  //     longDescription:
  //       "Another Company provides cutting-edge solutions for the crypto market that... Disrupt 3.0 by Innovate! - The Future is Now",
  //     tags: ["Tech", "Blockchain", "+ 2 more"],
  //   },
  //   {
  //     logo: ment,
  //     altText: "Another Company Logo",
  //     title: "Another Company",
  //     description: ["Crypto", "Innovative solutions for..."],
  //     userImage: girl,
  //     userAddress: "0x1234...ABCD",
  //     longDescription:
  //       "Another Company provides cutting-edge solutions for the crypto market that... Disrupt 3.0 by Innovate! - The Future is Now",
  //     tags: ["Tech", "Blockchain", "+ 2 more"],
  //   },
  //   {
  //     logo: ment,
  //     altText: "Another Company Logo",
  //     title: "Another Company",
  //     description: ["Crypto", "Innovative solutions for..."],
  //     userImage: girl,
  //     userAddress: "0x1234...ABCD",
  //     longDescription:
  //       "Another Company provides cutting-edge solutions for the crypto market that... Disrupt 3.0 by Innovate! - The Future is Now",
  //     tags: ["Tech", "Blockchain", "+ 2 more"],
  //   },
  // ];

  return (
    <div className=" p-6 ">
      <div className="flex justify-between  gap-4 overflow-x-auto">
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
              <div className="shadow-md rounded-3xl overflow-hidden border-2 spotlight-card-image ">
                <div className="p-6">
                  <div className="flex flex-row gap-2">
                    <img
                      className="border-2 rounded-lg border-blue-400 w-12 h-12"
                      src={card.project_logo}
                      alt={'img'}
                    />
                    <div className="flex flex-col">
                      <p className="text-[#7283EA] font-bold">{card.project_name}</p>
                      <div className="text-sm line-clamp-2">
                        {card.project_area_of_focus.split(',').map((desc, index) => (
                          <p key={index}>{desc}</p>
                        ))}
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <img
                          className="h-6 w-6 rounded-full"
                          src={girl}
                          alt="User Profile"
                        />
                        <p className="text-xs truncate">{'0x1234...ABCD'}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mt-2 line-clamp-3 min-h-16">
                    {card.project_description}
                  </p>
                  <div className="flex flex-row gap-4 mt-2">
                    {card.project_tags.map((tag, index) => (
                      <p key={index} className="text-xs">
                        {tag}
                      </p>
                    ))}
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

export default SpotLight;
