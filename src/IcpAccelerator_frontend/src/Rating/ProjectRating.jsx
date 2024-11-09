import React, { useState, useEffect } from 'react';
import RadarChart from './RadarChart';
import { useSelector } from 'react-redux';

const RatingComponent = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('scores');
  const [rubricRatingData, setRubricRatingData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRatingData, setAverageRatingData] = useState([]);
  const [averageNoData, setAverageNoData] = useState(false);
  const [isAverageLoading, setIsAverageLoading] = useState(true);
  const [showOverallRating, setShowOverallRating] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);

  const fetchRubricRating = async () => {
    if (projectId) {
      setIsLoading(true);
      try {
        const result = await actor.get_ratings_by_principal(projectId);
        if (!result || result.length === 0) {
          setNoData(true);
          setRubricRatingData([]);
        } else {
          setRubricRatingData(result?.Ok);
          setNoData(false);
        }
      } catch (error) {
        setNoData(true);
        setRubricRatingData([]);
        console.error('Error fetching rubric:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error('Error fetching rubric:');
    }
  };

  const fetchAveragerating = async () => {
    if (projectId) {
      setIsAverageLoading(true);

      try {
        const result = await actor.calculate_average(projectId);
        // const result = await actor.get_stored_average_rating(cohort_id,projectId);

        console.log('result average', result);

        if (!result || result.length === 0) {
          setAverageNoData(true);
          setAverageRatingData([]);
        } else {
          setAverageRatingData(result?.Ok);
          setAverageNoData(false);
        }
      } catch (error) {
        setAverageNoData(true);
        setAverageRatingData([]);
        console.error('Error fetching rubric:', error);
      } finally {
        setIsAverageLoading(false);
      }
    } else {
      console.error('Error fetching rubric:');
    }
  };

  useEffect(() => {
    if (actor && projectId) {
      fetchRubricRating();
      fetchAveragerating();
    }
  }, [actor, projectId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleOverallRating = () => {
    setShowOverallRating(!showOverallRating);
  };

  const renderScoreBoxes = (score) => {
    const totalBoxes = 9;
    const filledBoxes = score;
    const emptyBoxes = totalBoxes - filledBoxes;

    return (
      <div className='flex space-x-1'>
        {Array(filledBoxes)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className='w-2 xxs:w-3 h-4 xxs:h-5 bg-blue-500 rounded-sm'
            ></div>
          ))}
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

  const renderOverAllScoreBoxes = (score = 0) => {
    const totalBoxes = 8;
    const filledBoxes = Math.min(Math.max(Math.round(score), 0), totalBoxes);
    const emptyBoxes = totalBoxes - filledBoxes;

    return (
      <div className='flex space-x-1'>
        {Array.from({ length: filledBoxes }).map((_, idx) => (
          <div
            key={`filled-${idx}`}
            className='w-2 xxs:w-3 h-4 xxs:h-5 bg-blue-500 rounded-sm'
          ></div>
        ))}
        {Array.from({ length: emptyBoxes }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className='w-2 xxs:w-3 h-4 xxs:h-5 bg-gray-200 rounded-sm'
          ></div>
        ))}
      </div>
    );
  };
  if (showOverallRating) {
    return (
      <div className='max-w-lg md:max-w-xl lg:max-w-3xl mx-auto bg-white p-4 md:p-6 border rounded-lg shadow-lg mt-5'>
        <button onClick={toggleOverallRating} className='  mb-4'>
          Back
        </button>
        <div className='flex justify-between items-center border-b pb-4 mb-4'>
          <div>
            <h2 className='text-base md:text-lg lg:text-xl font-semibold'>
              Overall score:
            </h2>{' '}
            <p className='text-gray-500 text-sm md:text-base lg:text-lg'>
              15 votes
            </p>
          </div>

          <div className='flex items-center'>
            <div className='text-yellow-400 mr-2 text-sm md:text-lg lg:text-xl'>
              {/* Stars */}
              <span>⭐⭐⭐⭐⭐</span>
            </div>
            <span className='text-lg md:text-xl lg:text-2xl font-bold'>
              4.9
            </span>
          </div>
        </div>

        <div className='flex space-x-2 md:space-x-4 my-4'>
          <p className='text-gray-500 text-sm md:text-base '>
            Group scores by:
          </p>
          <p className='text-gray-500 text-sm md:text-base lg:text-lg'>
            Category
          </p>
          <p className='text-blue-500 text-sm md:text-base lg:text-lg'>Roles</p>
        </div>

        <div className='space-y-3 md:space-y-4'>
          <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
            <span className='font-medium text-sm md:text-base lg:text-lg'>
              Self-report:
            </span>
            <div className='flex items-center'>
              {' '}
              <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
                ⭐⭐⭐⭐⭐
              </span>
              <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
                5.0
              </span>
            </div>
          </div>

          <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
            <span className='font-medium text-sm md:text-base lg:text-lg'>
              Peers:
            </span>
            <div className='flex items-center'>
              <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
                ⭐⭐⭐⭐⭐
              </span>
              <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
                4.9
              </span>
            </div>
          </div>

          <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
            <span className='font-medium text-sm md:text-base lg:text-lg'>
              Mentors:
            </span>
            <div className='flex items-center'>
              <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
                ⭐⭐⭐⭐
              </span>
              <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
                4.5
              </span>
            </div>
          </div>

          <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
            <span className='font-medium text-sm md:text-base lg:text-lg'>
              Investors:
            </span>
            <div className='flex items-center'>
              <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
                ⭐⭐⭐⭐
              </span>{' '}
              <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
                4.0
              </span>
            </div>
          </div>

          <div className='flex justify-between items-center border-t pt-3 md:pt-4'>
            <span className='font-medium text-sm md:text-base lg:text-lg'>
              Users:
            </span>
            <div className='flex items-center'>
              <span className='text-yellow-400 text-sm md:text-base lg:text-lg'>
                ⭐⭐⭐⭐⭐
              </span>
              <span className='ml-2 text-sm md:text-lg lg:text-xl font-semibold'>
                5.0
              </span>
            </div>
          </div>
        </div>
        {/* Additional rating categories */}
        <div className='space-y-3 md:space-y-4'>
          {/* Add more rating details here as needed */}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-md'>
      <div
        className='flex justify-between items-center mb-4 cursor-pointer'
        onClick={toggleOverallRating}
      >
        <div>
          <h2 className='text-[15px] xxs:text-lg font-semibold'>
            Overall score:
          </h2>
          <p className='font-semibold text-[14px] xxs:text-[16px] text-gray-400'>
            Based on 15 votes
          </p>
        </div>
        <div className='flex justify-between mt-1'>
          {renderOverAllScoreBoxes(
            Array.isArray(averageRatingData?.overall_average) &&
              averageRatingData.overall_average?.length > 0
              ? Number(averageRatingData.overall_average[0])
              : 0 // Default to 0 if data is missing or invalid
          )}

          <span className='text-[16px] font-bold text-gray-700 xxs:ml-4 -mt-1'>
            {Array.isArray(averageRatingData?.overall_average) &&
            averageRatingData.overall_average?.length > 0
              ? Number(averageRatingData.overall_average[0]).toFixed(1) // Display 1 decimal if it’s a float
              : 'No Data'}
          </span>
        </div>
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
          {rubricRatingData && rubricRatingData.length > 0
            ? rubricRatingData.map((item, index) => (
                <div
                  key={index}
                  className='md:flex mt-2 md:mt-0 items-center justify-between mb-4'
                >
                  <span className='text-[16px] font-medium text-gray-700 w-1/2'>
                    {item?.level_name}:
                  </span>
                  <div className='flex justify-between mt-1'>
                    {renderScoreBoxes(item?.rating)}
                    <span className='text-[16px] font-bold text-gray-700 xxs:ml-4 -mt-1'>
                      {item?.rating}
                    </span>
                  </div>
                </div>
              ))
            : ''}
        </div>
      )}

      {activeTab === 'chart' && (
        <div>
          <RadarChart rubricRatingData={rubricRatingData} />
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
