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

const AuthContext = createContext();

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    // idleOptions: {
    //   // Set to true if you do not want idle functionality
    //   disableIdle: true,
    // },
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
    // : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
    // :`https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
  },
  loginOptionsnfid: {
    identityProvider:
      process.env.DFX_NETWORK === 'ic'
        ? // ? "https://identity.ic0.app/#authorize"
          // : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
          `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
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
    AuthClient.create(options.createOptions).then((client) => {
      setAuthClient(client);
    });
  }, []);

  const login = (val) => {
    return new Promise(async (resolve, reject) => {
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
            onError: (error) => reject(error),
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
    // console.log("client-use-Auth", client)
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);
    // console.log("isAuthenticated-use-Auth", isAuthenticated)

    const identity = client.getIdentity();
    setIdentity(identity);
    // console.log("identity-use-Auth", identity)

    const principal = identity.getPrincipal().toText();
    setPrincipal(principal);

    // console.log("principal-use-Auth", principal)

    setAuthClient(client);
    const agent = new HttpAgent({
      identity,
      verifyQuerySignatures: process.env.DFX_NETWORK === 'ic', // Enable signature verification only in production
    });

    if (process.env.DFX_NETWORK !== 'ic') {
      await agent.fetchRootKey().catch((err) => {
        console.warn('Unable to fetch root key:', err);
      });
    }

    const actor = createActor(process.env.CANISTER_ID_ICPACCELERATOR_BACKEND, {
      agent,
    });
    // console.log("actor-use-Auth", actor)

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
    process.env.ICPACCELERATOR_BACKEND_CANISTER_ID;

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
