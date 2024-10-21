import { AuthClient } from '@dfinity/auth-client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createActor } from '../../../../../declarations/IcpAccelerator_backend/index';
import { Actor, HttpAgent } from '@dfinity/agent';
import { useDispatch } from 'react-redux';
import { setActor } from '../Redux/Reducers/actorBindReducer';
import {
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from '../Redux/Reducers/InternetIdentityReducer';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // set to 30 minutes
      disableDefaultIdleCallback: true, // disable the default reload behavior
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptionsii: {
    identityProvider:
      process.env.DFX_NETWORK === 'ic'
        ? 'https://identity.ic0.app/#authorize'
        : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
  },
  loginOptionsnfid: {
    identityProvider:
      process.env.DFX_NETWORK === 'ic'
        ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
        : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
  },
};

/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuthClient = async () => {
      try {
        const client = await AuthClient.create(options.createOptions);
        if (client) {
          console.log('client', client);
          setAuthClient(client);
          console.log('AuthClient initialized');
        } else {
          console.error('AuthClient initialization failed', error);
          window.location.href = '/';
        }
      } catch (error) {
        console.error('AuthClient initialization failed', error);
        window.location.href = '/';
      }
    };
    initializeAuthClient();
  }, []);

  const login = (val) => {
    return new Promise(async (resolve, reject) => {
      if (!authClient) {
        reject(new Error('AuthClient is not initialized yet'));
        return;
      }
      try {
        if (
          authClient.isAuthenticated() &&
          (await authClient.getIdentity().getPrincipal().isAnonymous()) ===
            false
        ) {
          updateClient(authClient);
          resolve(AuthClient);
        } else {
          let opt = val === 'ii' ? 'loginOptionsii' : 'loginOptionsnfid';
          authClient.login({
            ...options[opt],
            onError: (error) => {
              console.error('Login error', error);
              window.location.href = '/';
              reject(error);
            },
            onSuccess: () => {
              updateClient(authClient);
              resolve(authClient);
            },
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const reloadLogin = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          (await authClient.getIdentity().getPrincipal().isAnonymous()) ===
            false
        ) {
          updateClient(authClient);
          resolve(AuthClient);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  async function updateClient(client) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal().toText();
    setPrincipal(principal);

    setAuthClient(client);
    const agent = new HttpAgent({
      identity,
      verifyQuerySignatures: process.env.DFX_NETWORK === 'ic' ? true : false,
    });

    if (process.env.DFX_NETWORK !== 'ic') {
      await agent.fetchRootKey().catch((err) => {
        console.warn('Unable to fetch root key:', err);
      });
    }

    const actor = createActor(process.env.CANISTER_ID_ICPACCELERATOR_BACKEND, {
      agent,
    });

    if (isAuthenticated === true) {
      dispatch(
        loginSuccess({
          isAuthenticated: true,
          identity,
          principal,
        })
      );
      dispatch(setActor(actor));
    }
    setBackendActor(actor);
  }

  async function logout() {
    try {
      await authClient?.logout();
      await updateClient(authClient);
      setIsAuthenticated(false);
      await dispatch(logoutSuccess());
    } catch (error) {
      dispatch(logoutFailure(error.toString()));
    }
  }

  const canisterId =
    process.env.CANISTER_ID_ICPACCELERATOR_BACKEND ||
    process.env.ICPACCELERATOR_BACKEND_CANISTER_ID ||
    'default_canister_id';

  const actor = createActor(canisterId, {
    agentOptions: { identity, verifyQuerySignatures: false },
  });

  return {
    isAuthenticated,
    login,
    logout,
    updateClient,
    authClient,
    identity,
    principal,
    actor,
    reloadLogin,
  };
};

/**
 * @type {React.FC}
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  if (auth.authClient && auth.actor) {
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
  } else {
    return null;
  }
};

export const useAuth = () => useContext(AuthContext);
