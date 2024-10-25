// import React from 'react';

// const RatingComponent = () => {
//   return (
//     <div className='max-w-lg md:max-w-xl lg:max-w-3xl mx-auto bg-white p-4 md:p-6 border rounded-lg shadow-lg mt-5'>
//       {/* Overall Score */}
//       <div className='flex justify-between items-center border-b pb-4 mb-4'>
//         <div>
//           <h2 className='text-base md:text-lg lg:text-xl font-semibold'>
//             Overall score:
//           </h2>
//           <p className='text-gray-500 text-sm md:text-base lg:text-lg'>
//             15 votes
//           </p>
//         </div>

//         <div className='flex items-center'>
//           <div className='text-yellow-400 mr-2 text-sm md:text-lg lg:text-xl'>
//             {/* Stars */}
//             <span>⭐⭐⭐⭐⭐</span>
//           </div>
//           <span className='text-lg md:text-xl lg:text-2xl font-bold'>4.9</span>
//         </div>
//       </div>

//       <div className='flex space-x-2 md:space-x-4 my-4'>
//         <p className='text-gray-500 text-sm md:text-base '>Group scores by:</p>
//         <p className='text-gray-500 text-sm md:text-base lg:text-lg'>
//           Category
//         </p>
//         <p className='text-blue-500 text-sm md:text-base lg:text-lg'>Roles</p>
//       </div>

//       <div className='space-y-3 md:space-y-4'>
//         <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
//           <span className='font-medium text-sm md:text-base lg:text-lg'>
//             Self-report:
//           </span>
//           <div className='flex items-center'>
//             <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
//               ⭐⭐⭐⭐⭐
//             </span>
//             <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
//               5.0
//             </span>
//           </div>
//         </div>

//         <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
//           <span className='font-medium text-sm md:text-base lg:text-lg'>
//             Peers:
//           </span>
//           <div className='flex items-center'>
//             <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
//               ⭐⭐⭐⭐⭐
//             </span>
//             <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
//               4.9
//             </span>
//           </div>
//         </div>

//         <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
//           <span className='font-medium text-sm md:text-base lg:text-lg'>
//             Mentors:
//           </span>
//           <div className='flex items-center'>
//             <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
//               ⭐⭐⭐⭐
//             </span>
//             <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
//               4.5
//             </span>
//           </div>
//         </div>

//         <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
//           <span className='font-medium text-sm md:text-base lg:text-lg'>
//             Investors:
//           </span>
//           <div className='flex items-center'>
//             <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
//               ⭐⭐⭐⭐
//             </span>
//             <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
//               4.0
//             </span>
//           </div>
//         </div>

//         <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
//           <span className='font-medium text-sm md:text-base lg:text-lg'>
//             Users:
//           </span>
//           <div className='flex items-center'>
//             <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
//               ⭐⭐⭐⭐⭐
//             </span>
//             <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
//               5.0
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RatingComponent;
import React, { useState } from 'react';
import RadarChart from './RadarChart';

const RatingComponent = () => {
  const [activeTab, setActiveTab] = useState('scores');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Sample data for the scores
  const scoresData = [
    { category: 'Team', score: 1 },
    { category: 'Problem and vision', score: 9 },
    { category: 'Value proposition', score: 5 },
    { category: 'Product', score: 4 },
    { category: 'Market', score: 8 },
    { category: 'Business model', score: 5 },
    { category: 'Scale', score: 6 },
    { category: 'Exit', score: 2 },
  ];

  const renderScoreBoxes = (score) => {
    const totalBoxes = 10; // Total boxes to represent score
    const filledBoxes = score; // Number of filled boxes
    const emptyBoxes = totalBoxes - filledBoxes;

    return (
      <div className='flex space-x-1'>
        {/* Filled boxes */}
        {Array(filledBoxes)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className='w-2 xxs:w-3 h-4 xxs:h-5 bg-blue-500 rounded-sm'
            ></div>
          ))}
        {/* Empty boxes */}
        {Array(emptyBoxes)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className='w-2 xxs:w-3 h-4 xxs:h-5 bg-gray-200 rounded-sm'
            ></div>
          ))}
      </div>
    );
  };

  return (
    <div className='w-full p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-md'>
      <div className='xxs:flex justify-between items-center mb-4'>
        <h2 className='text-[15px] xxs:text-lg font-semibold '>
          Maturity level
        </h2>
        <p className='font-semibold  text-[14px] xxs:text-[16px] text-gray-400'>
          Based on 15 votes
        </p>
      </div>

      <p className='border mt-2 w-full'></p>

      {/* Tabs */}
      <div className='flex flex-wrap space-x-4 border-b my-4'>
        <button
          className={`py-2 text-[18px] font-medium ${
            activeTab === 'scores'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => handleTabChange('scores')}
        >
          Scores
        </button>
        <button
          className={`py-2 text-[18px] font-medium ${
            activeTab === 'chart'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => handleTabChange('chart')}
        >
          Chart
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'scores' && (
        <div>
          {scoresData.map((item, index) => (
            <div
              key={index}
              className='md:flex mt-2 md:mt-0 items-center justify-between mb-4'
            >
              <span className='text-[16px] font-medium text-gray-700 w-1/2'>
                {item.category}:
              </span>
              <div className='flex justify-between mt-1'>
                {renderScoreBoxes(item.score)}
                <span className='text-[16px] font-bold text-gray-700 xxs:ml-4 -mt-1'>
                  {item.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'chart' && (
        <div>
          {/* Replace with your chart component */}
          <RadarChart />
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
