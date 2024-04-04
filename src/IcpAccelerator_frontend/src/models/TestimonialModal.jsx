import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TestimonialModal = ({ onClose, categories }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();

  console.log(categories);
  const handleSubmit = async (categories) => {
    if (categories.id === "registerInvestor") {
      navigate("create-investor");
    } else if (categories.id === "registerMentor") {
      navigate("create-mentor");
    } else if (categories.id === "registerProject") {
      navigate("create-project");
    } else if (categories.id === "addTestimonial") {
      const description = document.getElementById("description").value;
      actor
        .add_testimonial(description)
        .then((result) => {
          console.log("result-in-add_testimonial", result);
          toast.success(
            "Your Insights are Valuable to us. Thank you for sharing your Testimonial it will br Added Shorlty!"
          );
          setTimeout(() => {
            window.location.reload();
          }, [2000])
        })
        .catch((error) => {
          console.log("error-in-add_testimonial", error);
          // Handle error
          // handleModalClose(); // You might need to define this function
          toast.error("Something went wrong");
        });

      await onClose();
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white   border-2 rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 md:p-5 rounded-t ">
              <h3 className="text-3xl font-bold text-black">
                {categories[0].title}
              </h3>
              <button
                type="button"
                className="text-black bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            <form className="p-4 md:p-5"
              onSubmit={() => handleSubmit(categories[0])}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                {categories[0].id === "addTestimonial" ? (
                  <div className="col-span-2">
                    <textarea
                      id="description"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-transparent backdrop:blur-md rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    ></textarea>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <button
                type="submit"
                className="text-white flex w-full items-center justify-center font-bold bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {categories[0].buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default TestimonialModal;
