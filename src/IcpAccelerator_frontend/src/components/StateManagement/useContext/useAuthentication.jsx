import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createActor } from '../../../../../declarations/IcpAccelerator_backend/index';
import { useIdentityKit, useAgent } from '@nfid/identitykit/react';
import {
  loginStart,
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from '../Redux/Reducers/InternetIdentityReducer';
import Loader from '../../Loader/Loader';

const AuthContext = createContext();

export const useAuthClient = () => {
  const dispatch = useDispatch();
  const {
    user,
    isInitializing: isAuthInitializing,
    isUserConnecting: isUserAuthenticating,
    identity,
    delegationType,
    accounts: userAccounts,
    connect: initiateLogin,
    disconnect: initiateLogout,
    fetchIcpBalance: fetchUserIcpBalance,
  } = useIdentityKit();

  const agent = useAgent();
  const [backendActor, setBackendActor] = useState(null);

  useEffect(() => {
    if (user && agent) {
      const actor = createActor(
        process.env.CANISTER_ID_ICPACCELERATOR_BACKEND,
        { agent }
      );
      setBackendActor(actor);

      dispatch(
        loginSuccess({
          isAuthenticated: true,
          identity,
          principal: user?.principal.toText(),
        })
      );
    }
  }, [user, agent, dispatch]);

  const handleLogin = async () => {
    try {
      await initiateLogin();
      const principal = identity.getPrincipal().toText();
      dispatch(
        loginSuccess({
          isAuthenticated: true,
          identity,
          principal,
        })
      );
    } catch (error) {
      console.error('Login Error:', error);
      dispatch(loginFailure(error.toString()));
    }
  };

  const handleLogout = async () => {
    try {
      await initiateLogout();
      setBackendActor(null);
      dispatch(logoutSuccess());
    } catch (error) {
      console.error('Logout Error:', error);
      dispatch(logoutFailure(error.toString()));
    }
  };

  return {
    isAuthInitializing,
    isAuthenticated: !!user,
    isUserAuthenticating,
    userAccounts,
    identity,
    backendActor,
    delegationType,
    handleLogin,
    handleLogout,
    fetchUserIcpBalance,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();

  if (auth.isAuthInitializing) return <Loader />;

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
