import React from 'react';
import WorkSectionImage from "../../../../assets/Logo/WorkSectionImage.png";
import WorkSectionImage2 from "../../../../assets/Logo/WorkSectionImage2.png";
import WorkSectionImage3 from "../../../../assets/Logo/WorkSectionImage3.png";


const WorkSectionDetailPage = () => {
  const showcaseItems = [
    {
      img: WorkSectionImage,
    },
    {
      img: WorkSectionImage2,
    },
    {
      img: WorkSectionImage3,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Landing page design for Startup Business</h1>
      
      <div className="flex space-x-4 mb-6 border-b">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[2px]">Summary</button>
        <button className="text-gray-500 pb-2">Reviews</button>
      </div>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Deliverables</h2>
        <p className="font-semibold mb-2">Est quis ornare proin quisque lacinia ac tincidunt massa</p>
        <p className="text-gray-600 mb-4">
          Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa 
          fringilla. Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non 
          viverra massa fringilla.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Showcase</h2>
        {showcaseItems.map((item, index) => (
          <div key={index} className="mb-8">
            <div className={`rounded-lg overflow-hidden shadow-lg ${item.bgColor}`}>
              <div className="p-4">
                <img 
                  src={item.img}
                  alt={`Landing page design ${index + 1}`}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa 
              fringilla. Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non 
              viverra massa fringilla.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default WorkSectionDetailPage;