import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import RatingCard from './RatingCard';
import Avatar from '@mui/material/Avatar';
import images from '../../../../assets/images/bg.png';

const RatingMain = () => {
  const [index, setIndex] = useState(null);
  const [ratings, setRatings] = useState(Array(8).fill(null));
  const [selectedStep, setSelectedStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isContinueClicked, setIsContinueClicked] = useState(false);

  const steps = [
    {
      title: 'Team',
      description:
        'Strong founding team - at least 2 people with different skillsets.',
    },
    {
      title: 'Problem and Vision',
      description: "Setting a clear vision for the team's long-term goals.",
    },
    {
      title: 'Value proposition',
      description:
        'Ensuring a strong value proposition that addresses the market needs.',
    },
    {
      title: 'Product',
      description: 'Product innovation and market differentiation.',
    },
    {
      title: 'Market',
      description: 'Understanding market demand and addressing customer needs.',
    },
    {
      title: 'Business Model',
      description: 'Sustainable and scalable business model.',
    },
    {
      title: 'Scale',
      description: 'Capacity for scaling operations effectively.',
    },
    {
      title: 'Exit',
      description: 'Exit strategy and future plans for growth or acquisition.',
    },
  ];

  const handleLevelClick = (stepIndex) => {
    if (
      isContinueClicked &&
      stepIndex <= ratings.filter((r) => r !== null).length
    ) {
      setIndex(stepIndex);
    } else if (!isContinueClicked) {
      setSelectedStep(stepIndex);
    }
  };

  const handleRatingChange = (rating) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = rating;
    setRatings(updatedRatings);
    console.log(`Rating for level ${index + 1} is: ${rating}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    console.log('User Ratings Submitted: ', ratings);
    setIsModalOpen(false);
  };

  const handleContinueFromSelection = () => {
    setIsContinueClicked(true);
    setIndex(0);
  };

  const handleNextStep = () => {
    if (ratings[index] === null) {
      console.log(
        `Please provide a rating for level ${index + 1} before continuing.`
      );
      return;
    }
    console.log(`Proceeding to level ${index + 2}`);
    setIndex(index + 1);
  };

  const LevelSelectionPage = () => {
    const maxEnabledStep = ratings.filter((r) => r !== null).length;
    return (
      <div className='max-h-[90vh] flex flex-col'>
        <h2 className='text-3xl font-bold mb-4'>Team</h2>
        <p className='mb-6'>How would you rate the team's maturity level?</p>
        <div className='flex-grow overflow-y-auto max-h-[65vh]'>
          {steps.map((step, stepIndex) => (
            <div
              key={stepIndex}
              className={`cursor-pointer mb-2 p-4 border rounded-lg flex justify-between items-center ${
                stepIndex <= maxEnabledStep
                  ? ''
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => handleLevelClick(stepIndex)}
            >
              <div className='flex items-center'>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedStep === stepIndex || ratings[stepIndex] !== null
                      ? 'border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedStep === stepIndex || ratings[stepIndex] !== null
                        ? 'bg-blue-600'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
                <div className='ml-4'>
                  <h3 className='font-semibold'>{step.title}</h3>
                  <p className='text-sm text-gray-500'>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isContinueClicked && selectedStep !== null && (
          <div className='flex justify-end my-4'>
            <button
              className='py-2 px-4 bg-blue-600 text-white rounded'
              onClick={handleContinueFromSelection}
            >
              Continue <ArrowForwardIcon fontSize='medium' className='ml-1' />
            </button>
          </div>
        )}
      </div>
    );
  };

  const RatingPage = () => (
    <div className='max-h-[90vh] flex flex-col'>
      <div className='mb-4'>
        <div className='mt-6'>
          <span className='flex py-2'>
            <Avatar
              alt='Mentor'
              src={images}
              className='mr-2'
              sx={{ width: 24, height: 24 }}
            />
            <span className='text-gray-500'>CypherPunkLabs</span>
          </span>
        </div>
        <p className='text-sm text-gray-500 my-4'>Step {index + 1} of 9</p>
        <h2 className='text-3xl font-bold mb-6'>{steps[index].title}</h2>
        <p className='mb-4'>{steps[index].description}</p>
      </div>

      <RatingCard
        title={steps[index].title}
        description={steps[index].description}
        onRatingChange={handleRatingChange}
        currentRating={ratings[index]}
        step={index + 1}
        totalSteps={steps.length}
      />

      <div className='flex justify-between mt-6'>
        <button
          type='button'
          className='py-2 px-4 text-gray-600 border rounded'
          onClick={() => setIndex(null)}
        >
          <ArrowBackIcon fontSize='medium' /> Back
        </button>
        {index < steps.length - 1 ? (
          <button
            type='button'
            className='py-2 px-4 bg-blue-600 text-white rounded'
            onClick={handleNextStep}
          >
            Continue <ArrowForwardIcon fontSize='medium' className='ml-1' />
          </button>
        ) : (
          <button
            type='button'
            className='py-2 px-4 bg-blue-600 text-white rounded'
            onClick={() => setIndex(steps.length)}
          >
            Review <ArrowForwardIcon fontSize='medium' className='ml-1' />
          </button>
        )}
      </div>
    </div>
  );

  const ReviewPage = () => (
    <div className='max-h-[90vh] flex flex-col'>
      <div className='mb-4'>
        <h2 className='text-3xl font-bold mb-6'>Review Scores</h2>
      </div>

      <div className='mt-6'>
        <span className='flex py-2'>
          <Avatar
            alt='Mentor'
            src={images}
            className='mr-2'
            sx={{ width: 24, height: 24 }}
          />
          <span className='text-gray-500'>CypherPunkLabs</span>
        </span>
      </div>
      <p className='text-sm text-gray-500 my-4'>Step 9 of 9</p>

      <div className='flex flex-col space-y-4'>
        {steps.map((step, idx) => (
          <div key={idx} className='flex justify-between'>
            <span>{step.title}:</span>
            <div className='flex space-x-1'>
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-4 rounded-sm ${ratings[idx] && i < ratings[idx] ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}
              <span className='pl-4 -mt-1'>{ratings[idx]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between mt-6'>
        <button
          type='button'
          className='py-2 px-4 text-gray-600 border rounded'
          onClick={() => setIndex(steps.length - 1)}
        >
          <ArrowBackIcon fontSize='medium' /> Back
        </button>
        <button
          type='button'
          className='py-2 px-4 bg-blue-600 text-white rounded'
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );

  if (!isModalOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative bg-white rounded-lg shadow-lg w-[500px] mx-4 p-6 pt-4 max-h-[90vh]'>
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </button>

        {index === null ? (
          <LevelSelectionPage />
        ) : index < steps.length - 1 ? (
          <RatingPage />
        ) : (
          <ReviewPage />
        )}
      </div>
    </div>
  );
};

export default RatingMain;
