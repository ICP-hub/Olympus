import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import RatingCard from './RatingCard';
import Avatar from '@mui/material/Avatar';
import images from '../../../../assets/images/bg.png';
import { useSelector } from 'react-redux';
import { rubric_table_data } from '../../Utils/jsondata/data/projectRatingsRubrics';
import toast, { Toaster } from 'react-hot-toast';

const RatingMain = ({
  position,
  projectId,
  cohortid,
  setIsRating,
  setIsRatingMainOpen,
  setShowRatingModal,
}) => {
  const [currentRubricId, setCurrentRubricId] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [selectedRubricId, setSelectedRubricId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const handleLevelClick = (rubricId) => {
    const maxEnabledStep = ratings.length;
    const rubricIndex = rubric_table_data.findIndex(
      (rubric) => rubric.id === rubricId
    );

    if (isContinueClicked && rubricIndex <= maxEnabledStep) {
      setCurrentRubricId(rubricId);
    } else if (!isContinueClicked) {
      setSelectedRubricId(rubricId);
    }
  };

  const handleRatingChange = (level) => {
    const currentRubric = rubric_table_data.find(
      (rubric) => rubric.id === currentRubricId
    );
    const currentIndex = rubric_table_data.findIndex(
      (rubric) => rubric.id === currentRubricId
    );

    setRatings((prevRatings) => {
      // Remove any existing rating for the current rubric
      const filteredRatings = prevRatings.filter(
        (rating) => rating.level_number !== currentIndex + 1
      );

      return [
        ...filteredRatings,
        {
          level_name: currentRubric.title,
          level_number: currentIndex + 1,
          sub_level: currentRubric.levels[level - 1]?.title || '',
          sub_level_number: level,
          rating: level,
        },
      ];
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRatingMainOpen(false);
    setIsRating(false);
    setShowRatingModal(false);
  };

  const handleSubmit = async () => {
    console.log('Form submitted:', ratings);
    if (actor) {
      if (cohortid) {
        let argument = {
          cohort_id: cohortid,
          project_id: projectId,
          ratings,
        };
        console.log(argument);
        await actor
          .update_peer_rating_api(argument)
          .then((result) => {
            console.log('result-in-update_peer_rating_api', result);
            if (result && result.includes(`Ratings updated successfully`)) {
              toast.success(result);
              setIsModalOpen(false);
              setIsRatingMainOpen(false);
              setIsRating(false);
              setShowRatingModal(false);
            } else {
              toast.error(result);
              setIsModalOpen(false);
              setIsRatingMainOpen(false);
              setIsRating(false);
              setShowRatingModal(false);
            }
          })
          .catch((error) => {
            console.log('error-in-update_rating', error);
            toast.error('Something went wrong');
            setIsModalOpen(false);
            setIsRatingMainOpen(false);
            setIsRating(false);
            setShowRatingModal(false);
          });
      } else {
        let argument = {
          project_id: projectId,
          current_role: userCurrentRoleStatusActiveRole,
          ratings,
        };
        if (
          userCurrentRoleStatusActiveRole &&
          userCurrentRoleStatusActiveRole !== 'user'
        ) {
          console.log(argument);
          await actor
            .update_rating(argument)
            .then((result) => {
              console.log('result-in-update_rating', result);
              if (result && result.includes(`Ratings updated successfully`)) {
                toast.success(result);
                setIsModalOpen(false);
                setIsRatingMainOpen(false);
                setIsRating(false);
              } else {
                toast.error(result);
                setIsModalOpen(false);
                setIsRatingMainOpen(false);
                setIsRating(false);
              }
            })
            .catch((error) => {
              console.log('error-in-update_rating', error);
              toast.error('Something went wrong');
              setIsModalOpen(false);
              setIsRatingMainOpen(false);
              setIsRating(false);
            });
        }
      }
    } else {
      toast.error('No Authorization !!');
    }
  };

  const handleContinueFromSelection = () => {
    setIsContinueClicked(true);
    setCurrentRubricId(selectedRubricId);
  };

  const handleNextStep = () => {
    const currentIndex = rubric_table_data.findIndex(
      (rubric) => rubric.id === currentRubricId
    );

    const ratingExists = ratings.some(
      (rating) => rating.level_number === currentIndex + 1
    );

    if (!ratingExists) {
      console.log(
        `Please provide a rating for rubric ${currentRubricId} before continuing.`
      );
      return;
    }

    if (currentIndex < rubric_table_data.length - 1) {
      const nextRubricId = rubric_table_data[currentIndex + 1].id;
      setCurrentRubricId(nextRubricId);
    } else {
      // All ratings are complete, proceed to review page
      setCurrentRubricId('review');
    }
  };

  const LevelSelectionPage = ({
    handleLevelClick,
    handleContinueFromSelection,
    isContinueClicked,
    selectedRubricId,
  }) => {
    const maxEnabledStep = ratings.length;
    return (
      <div className='max-h-screen flex flex-col'>
        <h2 className='text-3xl font-bold mb-4'>Team</h2>
        <p className='mb-6'>How would you rate the team's maturity level?</p>
        <div className='flex-grow overflow-y-auto max-h-[65vh]'>
          {rubric_table_data.map((rubric, idx) => {
            const isEnabled = idx <= maxEnabledStep;
            const isSelected =
              selectedRubricId === rubric.id ||
              ratings.some((rating) => rating.level_number === idx + 1);
            return (
              <div
                key={rubric.id}
                className={`cursor-pointer mb-2 p-4 border rounded-lg flex justify-between items-center ${
                  isEnabled ? '' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isEnabled && handleLevelClick(rubric.id)}
              >
                <div className='flex items-center'>
                  <div
                    className={`w-9 h-[1.12rem] rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isSelected ? 'bg-blue-600' : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <div className='ml-4'>
                    <h3 className='font-semibold'>{rubric.title}</h3>
                    <p className='text-sm text-gray-500 line-clamp-2'>
                      {rubric.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isContinueClicked && selectedRubricId !== null && (
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

  const RatingPage = ({
    currentRubricId,
    setCurrentRubricId,
    ratings,
    setRatings,
    handleNextStep,
  }) => {
    const currentRubric = rubric_table_data.find(
      (rubric) => rubric.id === currentRubricId
    );
    const currentIndex = rubric_table_data.findIndex(
      (rubric) => rubric.id === currentRubricId
    );

    if (!currentRubric) {
      return <div>Loading...</div>;
    }

    const currentRating = ratings.find(
      (rating) => rating.level_number === currentIndex + 1
    )?.sub_level_number;

    return (
      <div className='max-h-screen flex flex-col'>
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
          <p className='text-sm text-gray-500 my-4'>
            Step {currentIndex + 1} of {rubric_table_data.length}
          </p>
          <h2 className='text-3xl font-bold mb-6 truncate'>
            {currentRubric.title}
          </h2>
          <p className='mb-4 line-clamp-3'>{currentRubric.desc}</p>
        </div>

        <RatingCard
          levels={currentRubric.levels}
          onRatingChange={handleRatingChange}
          currentRating={currentRating}
          step={currentIndex + 1}
          totalSteps={rubric_table_data.length}
        />

        <div className='flex justify-between mt-6'>
          <button
            type='button'
            className='py-2 px-4 text-gray-600 border rounded'
            onClick={() => setCurrentRubricId(null)}
          >
            <ArrowBackIcon fontSize='medium' /> Back
          </button>
          {currentIndex < rubric_table_data.length - 1 ? (
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
              onClick={() => setCurrentRubricId('review')}
            >
              Review <ArrowForwardIcon fontSize='medium' className='ml-1' />
            </button>
          )}
        </div>
      </div>
    );
  };

  const ReviewPage = ({ ratings, setCurrentRubricId, handleSubmit }) => (
    <div className='max-h-screen flex flex-col'>
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
          <span className='text-gray-500 truncate'>CypherPunkLabs</span>
        </span>
      </div>
      <p className='text-sm text-gray-500 my-4'>
        Step {rubric_table_data.length} of {rubric_table_data.length}
      </p>

      <div className='flex flex-col space-y-4'>
        {rubric_table_data.map((rubric, idx) => {
          const ratingForRubric = ratings.find(
            (rating) => rating.level_number === idx + 1
          );
          return (
            <div key={rubric.id} className='flex justify-between'>
              <span>{rubric.title}:</span>
              <div className='flex space-x-1'>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-4 rounded-sm ${
                      ratingForRubric && i < ratingForRubric.sub_level_number
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
                <span className='pl-4 -mt-1'>
                  {ratingForRubric?.rating || '-'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className='flex justify-between mt-6'>
        <button
          type='button'
          className='py-2 px-4 text-gray-600 border rounded'
          onClick={() =>
            setCurrentRubricId(
              rubric_table_data[rubric_table_data.length - 1].id
            )
          }
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-${position} bg-black bg-opacity-50`}
    >
      <div className='relative bg-white rounded-lg shadow-lg w-[500px] mx-4 p-6 pt-4 max-h-screen'>
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </button>

        {currentRubricId === null ? (
          <LevelSelectionPage
            handleLevelClick={handleLevelClick}
            handleContinueFromSelection={handleContinueFromSelection}
            isContinueClicked={isContinueClicked}
            selectedRubricId={selectedRubricId}
          />
        ) : currentRubricId !== 'review' ? (
          <RatingPage
            currentRubricId={currentRubricId}
            setCurrentRubricId={setCurrentRubricId}
            ratings={ratings}
            setRatings={setRatings}
            handleNextStep={handleNextStep}
          />
        ) : (
          <ReviewPage
            ratings={ratings}
            setCurrentRubricId={setCurrentRubricId}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default RatingMain;
