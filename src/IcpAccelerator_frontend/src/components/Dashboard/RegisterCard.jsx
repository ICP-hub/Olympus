import React from 'react'

const RegisterCard = ({categories}) => {
    
  return (
    <div className="flex flex-wrap w-full">
    {categories.map((category, index) => (
      <div key={index} className="px-4 w-full h-fit">
        <div className="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-2xl gap-2 bg-[#B9C0F2]">
          <div className="p-4">
            <img
              className="h-[8.6rem] w-full rounded-md object-fill"
              src={category.imgSrc}
              alt="not found"
            />
            <div>
              <div className="text-xl sm:text-2xl text-white mt-4 font-bold line-clamp-2">
                <h1>{category.title}</h1>
              </div>
              <p className="text-white mt-3 line-clamp-2">
                {category.description}
              </p>
              <button className="mt-4 uppercase bg-[#7283EA] text-white px-4 py-2 rounded-xl w-full justify-center items-center font-extrabold">
                {category.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
}

export default RegisterCard