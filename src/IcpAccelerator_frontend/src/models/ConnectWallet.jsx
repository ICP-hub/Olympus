import React, { useEffect, useState } from 'react';
import {
  closeModalSvg,
  walletModalSvg,
} from '../components/Utils/Data/SvgData';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/StateManagement/useContext/useAuth';
import { userRegisteredHandlerRequest } from '../components/StateManagement/Redux/Reducers/userRegisteredData';

const ConnectWallet = ({ isModalOpen, onClose, modalRef }) => {
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const { login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === true) {
      dispatch(userRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    console.log('userFullData:', userFullData); // Check if userFullData is indeed populated

    if (isAuthenticated) {
      if (userFullData) {
        console.log('Navigating to dashboard');
        navigate('/dashboard'); // Navigate if data is available
      } else {
        console.log('Navigating to register-user');
        navigate('/register-user'); // Navigate to register-user if data is missing
      }

      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    } else {
      console.log('Navigating to root');
      navigate('/');
    }
  }, [isAuthenticated, userFullData, onClose, navigate]);

  const loginHandler = async (val) => {
    await login(val);
  };

  return (
    <div className='overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex'>
      <div className='relative p-4 w-full max-w-md max-h-full' ref={modalRef}>
        <div className='relative bg-white rounded-lg shadow'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t'>
            <button
              type='button'
              className='text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm h-8 w-8 inline-flex justify-center items-center z-10'
              onClick={onClose}
            >
              {closeModalSvg}
            </button>
            <h3 className='text-lg font-semibold text-gray-900 grow text-center absolute left-0 right-0'>
              Sign up / Sign in
            </h3>
          </div>
          <div className='p-4 md:p-5'>
            <ul className='cursor-pointer'>
              {walletModalSvg.map((wallet, index) => (
                <a
                  key={index}
                  onClick={() => loginHandler(wallet.id)}
                  target='_self'
                >
                  {wallet.content}
                </a>
              ))}
            </ul>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
