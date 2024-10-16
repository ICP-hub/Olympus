import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
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
// import NewHeader from "./component/Layout/Header/NewHeader";
// import Header from "./component/Layout/Header/Header";
import AppRoutes from './AppRoutes';
import ConnectWallet from './models/ConnectWallet';
import WarningMessage from './ScreenWarning';
import { founderRegisteredHandlerRequest } from './components/StateManagement/Redux/Reducers/founderRegisteredData';
import { investorRegisteredHandlerRequest } from './components/StateManagement/Redux/Reducers/investorRegisteredData';
import Loader from './components/Loader/Loader';

const App = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const identity = useSelector((currState) => currState.internet.identity);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const { reloadLogin } = useAuth();
  const dispatch = useDispatch();

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
    if (isAuthenticated && identity) {
      dispatch(handleActorRequest());
      dispatch(multiChainHandlerRequest());
      dispatch(areaOfExpertiseHandlerRequest());
      dispatch(typeOfProfileSliceHandlerRequest());
      dispatch(userRegisteredHandlerRequest());
      dispatch(founderRegisteredHandlerRequest());
      dispatch(investorRegisteredHandlerRequest());
      dispatch(mentorRegisteredHandlerRequest());
    }
  }, [isAuthenticated, identity, dispatch]);

  const loading = useSelector(
    (currState) => currState.currentRoleStatus.loading
  );

  // if (loading) {
  //   return <Loader />
  // }
  return (
    <>
      {/* <WarningMessage /> */}
      <div className='bg-gray-100'>
        <div className='container-lg mx-auto'>
          <ConnectWallet
            isModalOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
          <AppRoutes />
        </div>
      </div>
    </>
  );
};

export default App;
