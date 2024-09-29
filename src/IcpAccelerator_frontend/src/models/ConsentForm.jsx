import React, { useState } from 'react';
import { closeModalSvg } from '../component/Utils/Data/SvgData';
import { useSelector } from 'react-redux';
import TabsDiv from '../component/Layout/Tabs/TabsDiv';

const ConsentForm = ({
  isModalOpen,
  onNext,
  //   onBack,
  showSubmit,
  currentStep,
  main_level,
  selected_level,
  onSubmitHandler,
}) => {
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const [selectedLevel, setSelectedLevel] = useState(0); // Initialize selectedLevel state with a default value

  const onSelectLevel = (index) => {
    setSelectedLevel(index); // Update the selectedLevel state when a radio button is clicked
  };

  console.log('main_level===============>>>>>', main_level);
  console.log('selected_level===========>>>>>', selectedLevel);
  const onSubmit = () => {
    onSubmitHandler(main_level.title, selected_level);
  };
  return (
    <>
      {/* {isModalOpen && ( */}
      {/* <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50">
                    <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex"> */}
      {/* <div className="relative p-4 w-full max-w-2xl max-h-full"> */}
      {/* <div className="relative bg-white rounded-lg shadow">
                                <div className="flex p-4 md:p-5 rounded-t">
                                    <h3 className="text-lg font-bold text-gray-900 grow uppercase  border-b">
                                        {main_level.title} ({selected_level + 1}/9)
                                    </h3>
                                </div> */}
      <div className=' mb-2 pt-0'>
        <ul className='mb-4 space-y-1 cursor-pointer'>
          {main_level.levels.map((val, index) => {
            let li_css = index <= selected_level ? 'text-white' : 'text-white';
            return (
              <li className='flex py-4 items-center' key={index}>
                <div className='w-11/12'>
                  <div
                    className={`flex justify-between items-center py-2 w-full ${li_css}`}
                  >
                    <div className='flex'>
                      <span className='font-bold text-lg'>{index + 1}.</span>
                      <p className='font-bold text-lg ml-1'>{val?.title}</p>
                    </div>
                    <div className='text-end'>
                      <input
                        type='radio'
                        id={`consent_${index}`}
                        name='consent_levels'
                        value={index}
                        onChange={() => onSelectLevel(index)}
                      />
                    </div>
                  </div>
                  <p className='text-sm text-white px-5'>{val?.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='px-4 pt-0'>
        <div className='flex justify-end gap-2 border-t'>
          {currentStep > 0 && (
            <button
              type='button'
              className='font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap'
              //   onClick={onBack}
            >
              Back
            </button>
          )}
          {!showSubmit && (
            <button
              type='button'
              className='font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap'
              onClick={onNext}
            >
              Next{/*  ({selected_level + 1}/9) */}
            </button>
          )}
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* </div>
                </div> */}
      {/* )} */}
    </>
  );
};

export default ConsentForm;
