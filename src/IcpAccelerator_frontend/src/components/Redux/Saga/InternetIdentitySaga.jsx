import { call, put, takeLatest } from "redux-saga/effects";
import { AuthClient } from "@dfinity/auth-client";
import {
  loginStart,
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutStart,
  logoutSuccess,
} from "../Reducers/InternetIdentityReducer";
import { initActor } from "../ActorManager";
import { setActor } from "../Reducers/actorBindReducer";


function* handleLogin() {
  try {
    const authClient = yield AuthClient.create();
    yield new Promise((resolve) => {
      authClient.login({
        identityProvider:
          process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app"
            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),

            onSuccess: resolve,
      });
    });
    const isAuthenticated = yield authClient.isAuthenticated();

    console.log("authclient in new code =>", isAuthenticated);
    if (isAuthenticated) {
      const identity = yield authClient.getIdentity();
      // const actor = yield initActor(identity);

      // yield put(setActor(actor));

     const principal = identity.getPrincipal().toText();

      console.log("best method identity =>", identity);
      console.log("best method isAuthenticated =>", isAuthenticated);
      console.log("best method authClient =>", authClient);
      console.log("best method principal =>", principal);
      // console.log("best method actor =>", actor);

      yield put(
        loginSuccess({
          isAuthenticated,
          authClient,
          identity,
          principal,
          // actor,
        })
      );
    } else {
      yield put(loginFailure("Authentication failed"));
    }
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* handleLogout() {
  try {
    const authClient = yield call(AuthClient.create); 
    yield call([authClient, authClient.logout]);
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(error.toString()));
  }
}


export function* internetIdentitySaga() {
  yield takeLatest(loginStart().type, handleLogin);
  yield takeLatest(logoutStart().type, handleLogout);
}
