import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleActorRequest } from './components/StateManagement/Redux/Reducers/actorBindReducer';
import { mentorRegisteredHandlerRequest } from './components/StateManagement/Redux/Reducers/mentorRegisteredData';
import { useAuth } from './components/StateManagement/useContext/useAuth';
import { areaOfExpertiseHandlerRequest } from './components/StateManagement/Redux/Reducers/getAreaOfExpertise';
import { typeOfProfileSliceHandlerRequest } from './components/StateManagement/Redux/Reducers/getTypeOfProfile';
import {
  getCurrentRoleStatusFailureHandler,
  setCurrentActiveRole,
  setCurrentRoleStatus,
} from './components/StateManagement/Redux/Reducers/userCurrentRoleStatusReducer';
import { userRegisteredHandlerRequest } from './components/StateManagement/Redux/Reducers/userRegisteredData';
import { multiChainHandlerRequest } from './components/StateManagement/Redux/Reducers/getMultiChainList';
import AppRoutes from './AppRoutes';
import { founderRegisteredHandlerRequest } from './components/StateManagement/Redux/Reducers/founderRegisteredData';
import { investorRegisteredHandlerRequest } from './components/StateManagement/Redux/Reducers/investorRegisteredData';
import Loader from './components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const identity = useSelector((currState) => currState.internet.identity);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const { reloadLogin } = useAuth();
  const dispatch = useDispatch();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (userFullData) {
        console.log('Navigating to dashboard');
        navigate('/dashboard'); // Navigate if data is available
      } else {
        console.log('Navigating to register-user');
        navigate('/register-user'); // Navigate to register-user if data is missing
      }
    } else {
      console.log('Navigating to root');
      navigate('/');
    }
  }, [isAuthenticated, userFullData]);

  function getNameOfCurrentStatus(rolesStatusArray) {
    const currentStatus = rolesStatusArray.find(
      (role) => role.status === 'active'
    );
    return currentStatus ? currentStatus.name : null;
  }

  function formatFullDateFromBigInt(bigIntDate) {
    const date = new Date(Number(bigIntDate / 1000000n));
    const dateString = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return `${dateString}`;
  }

  function cloneArrayWithModifiedValues(arr) {
    return arr.map((obj) => {
      const modifiedObj = {};

      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          if (
            key === 'approved_on' ||
            key === 'rejected_on' ||
            key === 'requested_on'
          ) {
            // const date = new Date(Number(obj[key][0])).toLocaleDateString('en-US');
            const date = formatFullDateFromBigInt(obj[key][0]);
            modifiedObj[key] = date; // Convert bigint to string date
          } else {
            modifiedObj[key] = obj[key][0];
          }
        } else {
          modifiedObj[key] = obj[key];
        }
      });

      return modifiedObj;
    });
  }

  const initialApi = async () => {
    try {
      const currentRoleArray = await actor.get_role_status();
      if (currentRoleArray && currentRoleArray.length !== 0) {
        const currentActiveRole = getNameOfCurrentStatus(currentRoleArray);
        dispatch(
          setCurrentRoleStatus(cloneArrayWithModifiedValues(currentRoleArray))
        );
        dispatch(setCurrentActiveRole(currentActiveRole));
      } else {
        dispatch(
          getCurrentRoleStatusFailureHandler(
            'error-in-fetching-role-at-dashboard'
          )
        );
        dispatch(setCurrentActiveRole(null));
      }
    } catch (error) {
      dispatch(getCurrentRoleStatusFailureHandler(error.toString()));
      dispatch(setCurrentActiveRole(null));
    }
  };

  useEffect(() => {
    if (actor) {
      dispatch(mentorRegisteredHandlerRequest());
    }
    reloadLogin();
  }, []);

  useEffect(() => {
    if (actor && isAuthenticated && identity) {
      initialApi();
    }
  }, [actor, isAuthenticated, identity, dispatch]);

  useEffect(() => {
    const fetchDataSequentially = async () => {
      if (isAuthenticated && identity) {
        await dispatch(handleActorRequest());
        await dispatch(multiChainHandlerRequest());
        await dispatch(areaOfExpertiseHandlerRequest());
        await dispatch(typeOfProfileSliceHandlerRequest());
        await dispatch(userRegisteredHandlerRequest());
        await dispatch(founderRegisteredHandlerRequest());
        await dispatch(mentorRegisteredHandlerRequest());
        await dispatch(investorRegisteredHandlerRequest());
      }
    };

    fetchDataSequentially(); // Call the function to handle sequential dispatch
  }, [isAuthenticated, identity, dispatch]);

  const loading = useSelector(
    (currState) => currState.currentRoleStatus.loading
  );

  // if (loading) {
  //   return <Loader />
  // }
  return (
    <>
      <div className='bg-gray-100'>
        <div className='container-lg mx-auto'>
          <AppRoutes />
        </div>
      </div>
    </>
  );
};

export default App;
