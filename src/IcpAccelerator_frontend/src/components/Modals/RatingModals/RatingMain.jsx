import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ThreeDots } from 'react-loader-spinner';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { allHubHandlerRequest } from '../../StateManagement/Redux/Reducers/All_IcpHubReducer';
import { useNavigate } from 'react-router-dom';
import { rolesHandlerRequest } from '../../StateManagement/Redux/Reducers/RoleReducer';
import Rating1 from './Rating1';
// MAIN COMPONENT FOR MENTOR SIGNUP PROCESS
const RatingMain = ({}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // SETTING UP LOCAL STATE
  const [modalOpen, setModalOpen] = useState(true); // STATE TO CONTROL MODAL VISIBILITY
  const [index, setIndex] = useState(0);
  // FUNCTION TO HANDLE NAVIGATING TO NEXT STEP
  const handleNext = async () => {
    const isValid = await trigger(formFields[index], { shouldValidate: true });

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        ...getValues(),
      }));
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  // FUNCTION TO HANDLE NAVIGATING TO PREVIOUS STEP
  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  // FUNCTION TO RENDER COMPONENT BASED ON CURRENT STEP
  const renderComponent = () => {
    switch (index) {
      case 0:
        return <Rating1 />;
      case 1:
        return <Rating1 />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}
      >
        <div className='bg-white rounded-lg shadow-lg w-[500px] mx-4 p-6 pt-4 '>
          <div className='flex justify-end mr-4  '>
            <button
              className='text-2xl text-[#121926]'
              onClick={() => setModalOpen(!modalOpen)}
            >
              &times; {/* BUTTON TO CLOSE MODAL */}
            </button>
          </div>
          <h2 className='text-xs text-[#364152] mb-3'>Step {index + 1} of 2</h2>{' '}
          {/* DISPLAY CURRENT STEP */}
          <FormProvider>
            <form>
              {' '}
              {/* FORM SUBMISSION HANDLER */}
              {renderComponent()}
              <div
                className={`flex mt-4 ${index === 0 ? 'justify-end' : 'justify-between'}`}
              >
                {index > 0 && (
                  <button
                    type='button'
                    className='py-2 px-4 text-gray-600 rounded border border-[#CDD5DF] hover:text-black'
                    onClick={handleBack} // BUTTON TO GO BACK TO PREVIOUS STEP
                  >
                    <ArrowBackIcon fontSize='medium' /> Back
                  </button>
                )}
                {index === 1 ? (
                  <button
                    type='button'
                    onClick={onSubmitHandler}
                    className='py-2 px-4 bg-blue-600 text-white rounded  border-2 border-[#B2CCFF]'
                  >
                    {isSubmitting ? (
                      <ThreeDots
                        visible={true}
                        height='35'
                        width='35'
                        color='#FFFEFF'
                        radius='9'
                        ariaLabel='three-dots-loading'
                      /> // SHOW LOADER WHEN SUBMITTING
                    ) : (
                      'Submit' // SHOW SUBMIT BUTTON
                    )}
                  </button>
                ) : (
                  <button
                    type='button'
                    className='py-2 px-4 bg-blue-600 text-white rounded  border-2 border-[#B2CCFF] flex items-center'
                    onClick={handleNext} // BUTTON TO CONTINUE TO NEXT STEP
                  >
                    Continue
                    <ArrowForwardIcon fontSize='15px' className='ml-1' />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <Toaster /> {/* TOASTER FOR NOTIFICATIONS */}
    </>
  );
};

export default RatingMain;
