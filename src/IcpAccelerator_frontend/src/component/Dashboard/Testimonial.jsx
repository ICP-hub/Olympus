import React, { useState, useEffect } from "react";
import user from "../../../assets/images/Ellipse 1382.svg";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import useFormatDateFromBigInt from "../hooks/useFormatDateFromBigInt";
import NoDataCard from "../Mentors/Event/NoDataCard";
const Testimonial = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [testimonialData, setTestimonialData] = useState([]);
  const [formatDate] = useFormatDateFromBigInt();

  const fetchTestimonial = async (caller) => {
    await caller
      .get_latest_testimonials()
      .then((result) => {
        if (result && result.length > 0) {
          setTestimonialData(result);
          setNoData(false);
        } else {
          setTestimonialData([]);
          setNoData(true);
        }
      })
      .catch((error) => {
        setNoData(true);
        setTestimonialData([]);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchTestimonial(actor);
    } else {
      fetchTestimonial(IcpAccelerator_backend);
    }
  }, [actor]);

  if (noData) {
    return <div className="items-center w-full">
      <NoDataCard />
    </div>
  }

  return (
    <div className="flex flex-row gap-4 mt-3 max-md:flex-col">
      {testimonialData &&
        testimonialData.slice(0, 3).map((card, index) => {
          let testimonialImage = uint8ArrayToBase64(card?.profile_pic);
          let testimonialName = card?.name;
          let testimoniaDescription = card?.message;
          let testimoniaDate = formatDate(card?.timestamp);

          return (
            <div
              key={index}
              className="bg-white duration-300 ease-in-out hover:scale-105 max-w-md mb-4 p-5 rounded-lg shadow-lg sm:max-w-sm transition-transform md:w-1/3"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={testimonialImage}
                  alt="profile picture"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <div className="font-semibold text-xl truncate w-28">{testimonialName}</div>
                  <div className="text-gray-500">{testimoniaDate}</div>
                </div>
              </div>
              <div className="mt-4 text-gray-800 h-60 overflow-y-scroll w-[270px] sm:w-[320px]">{testimoniaDescription}</div>
            </div>
          );
        })}
    </div>
  );
};

export default Testimonial;
