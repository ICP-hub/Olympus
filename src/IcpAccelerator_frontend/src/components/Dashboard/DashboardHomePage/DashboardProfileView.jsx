import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Line } from 'react-chartjs-2';
import { HiDotsVertical } from 'react-icons/hi';
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

const DashboardProfileView = () => {
  const [selectedOption, setSelectedOption] = useState('All time');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: '#8B5CF6', // Purple line color
        borderWidth: 2, // Thicker line
        fill: false,
        tension: 0.3, // Smooth curve
        pointRadius: 0, // No points visible
      },
    ],
  });
  const actor = useSelector((currState) => currState.actors.actor);

  const [loadingView, setIsLoadingView] = useState(true);
  const [profileViews, setProfileViews] = useState(null);
  const isMounted = useRef(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);

    // Update chart data based on the selected option
    if (profileViews) {
      if (option === '7 days') {
        const data = profileViews.views_last_7_days || [];
        updateChart(data, 'Last 7 Days');
      } else if (option === '30 days') {
        const data = profileViews.views_last_30_days || [];
        updateChart(data, 'Last 30 Days');
      } else {
        const data = profileViews.daily_views || [];
        updateChart(data, 'All Time');
      }
    }
  };

  const updateChart = (viewsData, title) => {
    const labels = viewsData.map(([date]) =>
      new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })
    );
    const data = viewsData.map(([, count]) => Number(count));

    setChartData({
      labels,
      datasets: [
        {
          label: title,
          data,
          borderColor: '#8B5CF6',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    });
  };

  const getProfileView = async (caller) => {
    try {
      const result = await caller.get_views();
      console.log('view result', result);
      if (isMounted.current) {
        if (result?.Ok) {
          setProfileViews(result.Ok);

          // Default chart for "All time"
          updateChart(result.Ok.daily_views || [], 'All Time');
        } else {
          setProfileViews(null);
          setChartData({
            labels: [],
            datasets: [
              {
                data: [],
                borderColor: '#8B5CF6',
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointRadius: 0,
              },
            ],
          });
        }
        setIsLoadingView(false);
      }
    } catch (error) {
      if (isMounted.current) {
        setIsLoadingView(false);
        console.error('Error fetching views:', error);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (actor) {
      getProfileView(actor);
    }
    return () => {
      isMounted.current = false;
    };
  }, [actor]);

  const options = {
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: '#6B7280', // Light gray ticks
          font: { family: 'sans-serif', size: 12 },
        },
      },
      y: {
        display: false, // Hide the Y-axis
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: { enabled: false }, // Disable tooltips
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className='bg-white w-full rounded-xl shadow-lg p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-900'>Profile views</h2>

        <div className='hidden md:flex space-x-2'>
          <button
            onClick={() => handleOptionClick('All time')}
            className={`px-4 py-2 ${
              selectedOption === 'All time' ? 'bg-gray-200' : 'bg-gray-100'
            } text-gray-600 rounded-md text-sm`}
          >
            All time
          </button>
          <button
            onClick={() => handleOptionClick('30 days')}
            className={`px-4 py-2 ${
              selectedOption === '30 days' ? 'bg-gray-200' : 'bg-gray-100'
            } text-gray-600 rounded-md text-sm`}
          >
            30 days
          </button>
          <button
            onClick={() => handleOptionClick('7 days')}
            className={`px-4 py-2 ${
              selectedOption === '7 days' ? 'bg-gray-200' : 'bg-gray-100'
            } text-gray-600 rounded-md text-sm`}
          >
            7 days
          </button>
        </div>

        <div className='md:hidden relative'>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='rounded-full hover:bg-gray-200 focus:outline-none'
          >
            <HiDotsVertical className='text-gray-600' />
          </button>
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

      <div className='text-4xl font-bold text-gray-900'>
        {loadingView
          ? 'Loading...'
          : selectedOption === 'All time'
            ? profileViews?.total_views
            : selectedOption === '30 days'
              ? profileViews?.views_last_30_days
              : profileViews?.views_last_7_days}
      </div>
      <div className='mt-6'>
        <div className='h-28 w-full'>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DashboardProfileView;
