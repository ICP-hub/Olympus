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
        console.log("result-in-Testimonial", result);
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
        console.log("error-in-Testimonial", error);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchTestimonial(actor);
    } else {
      fetchTestimonial(IcpAccelerator_backend);
    }
  }, [actor]);
  const data = [
    {
      id: 1,
      name: "James Dani",
      date: "15 Mar 2022",
      content:
        "Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice. :)",
      imageUrl: user,
    },
    {
      id: 2,
      name: "James Dani",
      date: "15 Mar 2022",
      content:
        "Araa and I talked about career field decisions and my portfolio. I really appreciated his feedback and advice. :)",
      imageUrl: user,
    },
  ];
  return (
    <div className="flex flex-row gap-4 mt-3">
      {testimonialData &&
        testimonialData.slice(0, 2).map((card, index) => {
          let testimonialImage = uint8ArrayToBase64(card?.profile_pic);
          let testimonialName = card?.name;
          let testimoniaDescription = card?.message;
          let testimoniaDate = formatDate(card?.timestamp);

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-sm p-8 mb-4:"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={testimonialImage}
                  alt="profile picture"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <div className="font-semibold text-xl truncate w-20">{testimonialName}</div>
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
