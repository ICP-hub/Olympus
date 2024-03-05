import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createActor,
  //   IcpAccelerator_backend,
  idlFactory,
} from "../../../../../declarations/IcpAccelerator_backend/index";
// import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Actor, HttpAgent } from "@dfinity/agent";
// import appConstants from "../../Constants/appConstants";
import { useDispatch } from "react-redux";
import { setActor } from "../Redux/Reducers/actorBindReducer";
import { loginSuccess } from "../Redux/Reducers/InternetIdentityReducer";

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
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
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
  //   const [accountIdString, setAccountIdString] = useState("");
  //   const [userType, setUserType] = useState(appConstants.UNKNOWN);
  //   const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create(options.createOptions).then((client) => {
      setAuthClient(client);
    });
  }, []);

  //   function toHexString(byteArray) {
  //     return Array.from(byteArray, function (byte) {
  //       return ("0" + (byte & 0xff).toString(16)).slice(-2);
  //     }).join("");
  //   }

  const login = () => {
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
          authClient.login({
            ...options.loginOptions,
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
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);
    const identity = client.getIdentity();
    setIdentity(identity);
    const principal = identity.getPrincipal().toText();
    setPrincipal(principal);
    setAuthClient(client);
    const agent = new HttpAgent({ identity });
    const actor = createActor(process.env.CANISTER_ID_ICPACCELERATOR_BACKEND, {
      agent,
    });
    dispatch(
      loginSuccess({
        isAuthenticated: true,
        identity,
        principal,
        navi: "roleSelect",
      })
    );
    dispatch(setActor(actor));
    setBackendActor(actor);

    // const accountId = AccountIdentifier.fromPrincipal({ principal });
    // setAccountId(toHexString(accountId.bytes));
    // let accountIdString = toHexString(accountId.bytes);
    // setAccountIdString(accountIdString);

    // let userType = await actor.check_user_type();
    // setUserType(userType);
  }

  //   const createLedgerActor = (canisterId) => {
  //     let identity = window.identity;
  //     const agent = new HttpAgent({ identity });
  //     // Creates an actor with using the candid interface and the HttpAgent
  //     return Actor.createActor(idlFactory, {
  //       agent,
  //       canisterId,
  //     });
  //   };

  async function logout() {
    await authClient?.logout();
    await updateClient(authClient);
    setIsAuthenticated(false);
  }

  //   const canisterId =
  //     process.env.CANISTER_ID_MANIPUR_EDU_BACKEND ||
  //     process.env.MANIPUR_EDU_BACKEND_CANISTER_ID;

  const canisterId =
    process.env.CANISTER_ID_ICPACCELERATOR_BACKEND ||
    process.env.ICPACCELERATOR_BACKEND_CANISTER_ID;

  const actor = createActor(canisterId, { agentOptions: { identity } });

  return {
    isAuthenticated,
    login,
    logout,
    updateClient,
    authClient,
    identity,
    principal,
    // backendActor,
    // accountId,
    // createLedgerActor,
    actor,
    reloadLogin,
    // accountIdString,
    // userType
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
    // Return null or a loading component when authClient or actor is not yet initialized
    return null; // or <LoadingIndicator /> if you prefer to show a loading state
  }
};

export const useAuth = () => useContext(AuthContext);
