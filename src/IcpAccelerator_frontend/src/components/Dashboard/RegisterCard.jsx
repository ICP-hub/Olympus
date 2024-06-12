import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestimonialModal from "../../models/TestimonialModal";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { MentorCategorySkeleton } from "../Dashboard/Skeleton/Liveprojectskeleton";

const RegisterCard = ({ categories, border }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const [isTestimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [isloading, setloading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setloading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = () => {
    if (isAuthenticated) {
      setTestimonialModalOpen(true);
    } else {
      toast.error("Please Sign Up !!!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleCloseModal = () => setTestimonialModalOpen(false);

  return (
    <>
      <div
        className={`flex flex-wrap w-full justify-between h-full ${border === true ? 'border-2 rounded-lg h-full' : ''} ${
          categories.map(
            (category) => category.title === "Add your testimonial"
          )
            ? " "
            : "md:-mt-2 "
        }`}
      >
        {isloading ? (
          <MentorCategorySkeleton />
        ) : (
          categories.map((category, index) => (
            <div
              key={index}
              className="w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <div
                className={`bg-[#B9C0F2] h-full md:m-0 ${
                  category.title === "Add your testimonial"
                    ? ""
                    : "drop-shadow-2xl"
                } ${
                  category.title === "Register your Projects"
                    ? "max-md:mx-4"
                    : ""
                } gap-2 overflow-hidden rounded-lg`}
              >
                <div className="p-5 flex-col space-y-4 h-full relative">
                  <img
                    className={` w-full rounded-md object-cover ${
                      category.title === "Add your testimonial"
                        ? ""
                        : ""
                    }`}
                    src={category.imgSrc}
                    alt="not found"
                  />
                  <div className={`space-y-3 pb-12 ${border === true ? "py-3" : "" }`}>
                    <div className="text-xl sm:text-2xl text-white font-bold line-clamp-2">
                      <h1>{category.title}</h1>
                    </div>
                    <p className="text-white line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                  <div className="absolute left-0 right-0 bottom-0 px-5 pb-4">
                    <button
                      className="uppercase bg-[#7283EA] text-white px-4 py-2 rounded-xl w-full justify-center items-center font-extrabold"
                      onClick={handleOpenModal}
                    >
                      {category.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isTestimonialModalOpen && (
          <TestimonialModal
            onClose={handleCloseModal}
            categories={categories}
          />
        )}
      </div>
      <Toaster />
    </>
  );
};

export default RegisterCard;
