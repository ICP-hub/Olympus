import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TestimonialModal from "../../models/TestimonialModal";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const RegisterCard = ({ categories }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const [isTestimonialModalOpen, setTestimonialModalOpen] = useState(false);

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
      <div className="flex flex-wrap w-full">
        {categories.map((category, index) => (
          <div
            key={index}
            className="pr-4 w-full h-fit hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <div
              className={`bg-[#B9C0F2] ${
                category.title === "Add your testimonial"
                  ? ""
                  : "drop-shadow-2xl"
              } gap-2 overflow-hidden rounded-lg`}
            >
              <div className="px-4 pt-4">
                <img
                  className="h-[8.6rem] w-full rounded-md object-cover"
                  src={category.imgSrc}
                  alt="not found"
                />
                <div className="py-8">
                  <div className="text-xl sm:text-2xl text-white mt-4 font-bold line-clamp-2">
                    <h1>{category.title}</h1>
                  </div>
                  <p className="text-white mt-3 line-clamp-2">
                    {category.description}
                  </p>

                  <button
                    className="mt-4 uppercase bg-[#7283EA] text-white px-4 py-2 rounded-xl w-full justify-center items-center font-extrabold"
                    onClick={handleOpenModal}
                  >
                    {category.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
