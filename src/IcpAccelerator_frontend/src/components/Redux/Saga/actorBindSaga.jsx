import { takeLatest, call, put, select } from "redux-saga/effects";
import { setActor } from "../Reducers/actorBindReducer";
import { createActor } from "../../../../../declarations/internet_identity/index";

const selectedIdentity = (currState) => currState.internet.identity;

function* initActor() {
  try {
    const identity = yield select(selectedIdentity);
    const canisterId =
      process.env.CANISTER_ID_ICPACCELERATOR_BACKEND ||
      process.env.ICPACCELERATOR_BACKEND_CANISTER_ID;

    console.log("canister id + identity =>", canisterId, identity);

    const actor = yield call(
      createActor(canisterId, { agentOptions: { identity } })
    );
    yield put(setActor(actor));
  } catch (err) {
    console.log("actor error =>", err);
  }
}

export function* actorSaga() {
  yield takeLatest(setActor().type, initActor);
}
