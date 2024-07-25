// src/App.js
import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import TestimonialProfile from "../../../assets/ProfIleEdit/TestimonialProfile.png";
import TestAvatar from "../../../assets/ProfIleEdit/TestAvatar.png";
import { useState } from 'react';

const ArrowButton = ({ direction, onClick,visible }) => {
  const isLeft = direction === 'left';
  return (
    <button
    className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center focus:outline-none hover:bg-gray-100 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    onClick={onClick}
  >
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={isLeft ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
};

const testimonials = [
  {
    text: "Using Olympus has been a game-changer for our team. The platform's simplicity and the quick customer support have truly exceeded our expectations.",
    name: "Aaron King",
    title: "Fund Manager, Infinity Capital",
    avatar: TestAvatar,
    profile: TestimonialProfile
  },
  {
    text: "Olympus provided us with all the tools we needed to grow our business. Their customer service is fantastic, and the platform is very user-friendly.",
    name: "Emma Watson",
    title: "CEO, Tech Innovators",
    avatar: TestAvatar,
    profile: TestimonialProfile
  }
  
];

function TestimonialSection() {
  const [buttonVisible, setButtonVisible] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const handleClick = (direction) => {
    setButtonVisible(false);
    setTimeout(() => {
      if (direction === 'left') {
        prevRef.current.click();
      } else {
        nextRef.current.click();
      }
      // setTimeout(() => {
      //   setButtonVisible(true);
      // }, ); 
      setButtonVisible(true);
    }, 300); 
  };

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      prevRef.current.classList.add('swiper-button-prev');
      nextRef.current.classList.add('swiper-button-next');
    }
  }, []);
 

  return (
    <div className="flex items-center justify-center bg-white py-10 px-4">
      <div className="w-full max-w-5xl relative">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            });
          }}
          onSlideChange={() => setButtonVisible(true)}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 flex items-center mx-auto">
                <div className="md:pr-8">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 text-lg mb-6">{testimonial.text}</p>
                  <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full mr-4" src={testimonial.avatar} alt={testimonial.name} />
                    <div className="text-sm">
                      <p className="text-gray-900 leading-none">{testimonial.name}</p>
                      <p className="text-gray-600">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:pl-8">
                  <img className="rounded-lg max-w-[300px]" src={testimonial.profile} alt={testimonial.name} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute top-[70%] left-[500px] transform -translate-y-1/2 z-10" ref={prevRef}>
        <ArrowButton direction="left" onClick={() => handleClick('left')} visible={buttonVisible} />
        </div>
        <div className="absolute top-[70%] right-[415px] transform -translate-y-1/2 z-10" ref={nextRef}>
        <ArrowButton direction="right" onClick={() => handleClick('right')} visible={buttonVisible} />
        </div>
      </div>
    </div>
  );
}

export default TestimonialSection;