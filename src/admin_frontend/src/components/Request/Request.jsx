import React from 'react';

const Request = () => {
  const roadmapData = [
    {
      status: 'Request',
      items: [
        { title: 'Starknet', description: 'Request a feature' },
        { title: 'Another Feature', description: 'Planning stage' },
      ],
    },
    {
      status: 'Request in Progress',
      items: [
        { title: 'Feature 3', description: 'Development started' },
        { title: 'Another Feature', description: 'Planning stage' },

      ],
    },
    {
      status: 'Request Resolved',
      items: [
        { title: 'Feature 4', description: 'Deployed' },
        { title: 'Another Feature', description: 'Planning stage' },

      ],
    },
  ];

  return (
    <div className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
      <div className="flex flex-wrap justify-start gap-4 text-gray-700">
        <div className="cursor-pointer group font-bold transition-all duration-300 border-b-4 border-transparent rounded-b pb-1 hover:border-blue-800  hover:text-black">
          Roadmap
        </div>
        <div className="cursor-pointer group font-bold transition-all duration-300 border-b-4 border-transparent rounded-b pb-1 hover:border-blue-800  hover:text-black">
          Feedback
        </div>
      </div>

      <div className="mt-4">
        <h1 className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-extrabold mt-2 text-2xl">
          Boards
        </h1>
      </div>
      <div className="flex flex-wrap justify-start gap-4 text-blue-800 mt-2">
        <div className="cursor-pointer group font-bold border-2 border-gray-700 rounded-lg px-2 py-2">
          <h1 className="font-bold">
            Request a feature <span className="text-blue-800 ml-14">5</span>
          </h1>
        </div>
        <div className="cursor-pointer group font-bold border-2 border-gray-700 rounded-lg px-2 py-2">
          <h1 className="font-bold">
            Request a suggestion<span className="text-blue-800 ml-14">1</span>
          </h1>
        </div>
      </div>
      <div className="mt-8">
        <h1 className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-extrabold mt-4 text-2xl">
          Roadmap
        </h1>
      </div>
      <div className="flex flex-wrap mt-4 gap-6 ">
        {roadmapData.map(({ status, items }, index) => (
          <div key={index} className="flex-grow h-fit bg-gradient-to-r from-gray-300 via-gray-300 to-gray-300 rounded-md text-2xl shadow-md">
            <div className="flex items-center rounded-md rounded-b-none p-4">
              <span className={`rounded-full text-sm ${status === "In Progress" ? "bg-indigo-700" : "bg-green-600"} w-[10px] h-[10px]`}></span>
              <p className="ml-2 bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-bold text-lg">{status}</p>
            </div>
            <div className="h-fit bg-white rounded-md rounded-t-none overflow-y-auto p-6">
              {items.map(({ title, description }, itemIndex) => (
                <div key={itemIndex} className="flex-col flex justify-between mb-4">
                  <h1 className="text-black font-bold text-lg">{title}</h1>
                  <p className="text-gray-700 text-sm">{description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Request;

