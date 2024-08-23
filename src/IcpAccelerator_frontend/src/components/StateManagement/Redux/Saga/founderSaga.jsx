import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  founderRegisteredHandlerFailure,
  founderRegisteredHandlerRequest,
  founderRegisteredHandlerSuccess,
} from "../Reducers/founderRegisteredData";
import { Principal } from "@dfinity/principal";

const selectActor = (currState) => currState.actors.actor;
const selectPrincipal = (currState) => currState.internet.principal;

function* fetchFounderHandler() {
  try {
    const actor = yield select(selectActor);
    const principal = yield select(selectPrincipal);
    const covertedPrincipal = Principal.fromText(principal);

    console.log("actor => => => ", actor);
    console.log("principal => => => ", principal);

    const founderData = yield call([actor, actor.get_project_info_using_principal], covertedPrincipal);

    // Convert any BigInt values to strings
    const serializedFounderData = JSON.parse(JSON.stringify(founderData, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    console.log("get_my_project in FounderSaga => ", serializedFounderData);

    yield put(founderRegisteredHandlerSuccess(serializedFounderData));
  } catch (error) {
    yield put(founderRegisteredHandlerFailure(error.toString()));
  }
}


export function* fetchFounderSaga() {
  yield takeLatest(founderRegisteredHandlerRequest.type, fetchFounderHandler);
}
