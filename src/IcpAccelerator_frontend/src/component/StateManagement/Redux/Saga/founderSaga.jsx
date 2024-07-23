import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  founderRegisteredHandlerFailure,
  founderRegisteredHandlerRequest,
  founderRegisteredHandlerSuccess,
} from "../Reducers/founderRegisteredData";

const selectActor = (currState) => currState.actors.actor;

function* fetchFounderHandler() {
  try {
    const actor = yield select(selectActor);
    console.log("actor => => => ", actor);

    const founderData = yield call([actor, actor.get_my_project]);

    console.log("get_my_project in FounderSaga => ", founderData);

    yield put(founderRegisteredHandlerSuccess(founderData));
  } catch (error) {
    yield put(founderRegisteredHandlerFailure(error.toString()));
  }
}

export function* fetchFounderSaga() {
  yield takeLatest(founderRegisteredHandlerRequest.type, fetchFounderHandler);
}

