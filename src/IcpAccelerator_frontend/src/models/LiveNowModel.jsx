import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { founderRegisteredHandlerRequest } from '../component/StateManagement/Redux/Reducers/founderRegisteredData';

function LiveNowModel({ onClose, projectId }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleClick = () => {
    // Dispatch your action
    dispatch(founderRegisteredHandlerRequest());

    // Navigate to the update project page with state
    navigate('/update-project', { state: { projectId } });
  };
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 sm:px-6 lg:px-8'>
      <div className='bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full space-y-2'>
        <h2 className='text-sm  md:text-xl text-black font-semibold'>
          Update your project,
        </h2>
        <p className='text-black text-sm  md:text-xl font-semibold mb-4'>
          Do you want to Update?
        </p>
        <div className='flex justify-end space-x-2 sm:space-x-4'>
          <button
            onClick={onClose}
            className='px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-red-600 bg-white font-bold text-xs sm:text-sm focus:outline-none'
          >
            Cancel
          </button>
          <button
            onClick={handleClick}
            // {
            // () =>
            // navigate("/update-project", { state: { projectId } })
            // }
            className='px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white bg-red-600 font-bold text-xs sm:text-sm hover:bg-red-800 focus:outline-none'
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveNowModel;
