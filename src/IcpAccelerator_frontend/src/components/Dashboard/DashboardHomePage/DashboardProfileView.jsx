import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { HiDotsVertical } from 'react-icons/hi'; // 3-dot icon import
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

const data = {
  labels: [
    '3 Jul',
    '7 Jul',
    '11 Jul',
    '15 Jul',
    '19 Jul',
    '23 Jul',
    '27 Jul',
    '31 Jul',
  ],
  datasets: [
    {
      data: [0, 0, 0, 0, 3, 0, 1, 0], // Adjusted data points to create two peaks
      borderColor: '#8B5CF6',
      borderWidth: 1,
      fill: false,
      tension: 0.1,
      pointRadius: 0,
    },
  ],
};

const options = {
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        color: '#4B5563', // Tailwind gray-600 color
        font: {
          family: 'sans-serif', // Font-family to match the design
          size: 12,
        },
      },
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false, // Disable tooltip for a clean look
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const DashboardProfileView = () => {
  const [selectedOption, setSelectedOption] = useState('All time');
  const [dropdownOpen, setDropdownOpen] = useState(false); // For toggling the dropdown

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className='bg-white w-full rounded-xl shadow-lg p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='ss2:text-xl font-semibold text-gray-900'>
          Profile views
        </h2>

        {/* Buttons for tablet and larger screens */}
        <div className='hidden md:flex space-x-2'>
          <button className='px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm'>
            All time
          </button>
          <button className='px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm'>
            30 days
          </button>
          <button className='px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm'>
            7 days
          </button>
        </div>

        {/* 3-Dot Icon for mobile screens */}
        <div className='md:hidden relative left-[5.04]'>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className=' rounded-full hover:bg-gray-200 focus:outline-none'
          >
            <HiDotsVertical className=' text-gray-600' />
          </button>

          {/* Custom dropdown menu */}
          {dropdownOpen && (
            <div className='absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10'>
              <div
                onClick={() => handleOptionClick('All time')}
                className='block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer'
              >
                All time
              </div>
              <div
                onClick={() => handleOptionClick('30 days')}
                className='block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer'
              >
                30 days
              </div>
              <div
                onClick={() => handleOptionClick('7 days')}
                className='block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer'
              >
                7 days
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='text-4xl sm4:text-6xl font-bold text-gray-900'>3</div>
      <div className='mt-6'>
        <div className='h-28 w-full'>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DashboardProfileView;
