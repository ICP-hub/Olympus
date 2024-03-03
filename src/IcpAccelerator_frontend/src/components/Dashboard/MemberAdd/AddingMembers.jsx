import React, { useState } from "react";
import Sidebar from "../../Layout/SidePanel/Sidebar";
import project from "../../../../assets/images/project.png";
import Bottombar from "../../Layout/BottomBar/Bottombar";
import Footer from "../../Footer/Footer";
import CompressedImage from "../../StateManagement/Redux/ImageCompressed/CompressedImage";

const AddingMembers = () => {
  const [imageArr, setImageArr] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await CompressedImage(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          const updatedImages = [...imageArr];
          updatedImages.push(event.target.result); // Add the new image to the array
          setImageArr(updatedImages);
          setCurrentIndex(currentIndex + 1);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error during image processing:", error);
      }
    }
  };

  return (
    <section className="overflow-hidden relative">
      <div className="w-[1279.64px] h-[1279.64px] opacity-70 bg-fuchsia-800 rounded-full blur-[169px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="font-fontUse flex flex-row w-full h-fit px-[5%] lg1:pl-[4%] lg1:pr-[2%] py-[6%] lg1:py-[4%] bg-gradient-to-br from-purple-800 from-10% via-purple-600 via-60%   to-violet-900 to-95%">
        <div className="w-2/8 hidden md:block z-1 relative">
          <Sidebar />
        </div>

        <div className="flex flex-grow ml-8 text-white z-1 relative">
          <div className="flex flex-col w-full">
            <h1 className="font-bold text-3xl">Team members</h1>

            <div className="mt-4 grid md:grid-cols-3 grid-cols-1 gap-4 ">
              {Array.from({ length: currentIndex }).map((_, index) => (
                <div key={index} className="flex-1 mx-2 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                    id={`file-input-${index}`}
                    style={{ display: "none" }}
                  />
                  {imageArr[index] ? (
                    <div className="flex flex-row w-full ">
                      <img
                        src={imageArr[index]}
                        alt={`Image ${index}`}
                        className="w-24 h-32 rounded-lg object-contain"
                      />
                      <div className="my-2 ml-3 justify-around flex flex-col">
                        <p className="font-bold">Samy Karim</p>
                        <p className="text-gray-400">
                          Toshi, Managing Partner. Ex-Binance
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="custom-input h-32 w-24 flex justify-center items-center border border-dashed border-gray-400  bg-transparent rounded cursor-pointer"
                      onClick={() =>
                        document.getElementById(`file-input-${index}`).click()
                      }
                    >
                      <span className="flex flex-col items-center justify-center text-xs text-white">
                        <svg
                          className="w-6 h-6 text-gray-200 mb-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                        <span>Add Member</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <Footer />
      </div>

      <div className="md:hidden">
        <Bottombar />
      </div>
    </section>
  );
};

export default AddingMembers;
