import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  totalLiveFailure,
  totalLiveSuccess,
  checkTotalLiveStart,
} from "../Reducers/TotalLiveReducer";
const selectActor = (currState) => currState.actors.actor;

function* fetchTotalLiveHandler() {
  try {
    const actor = yield select(selectActor);
    // console.log("actor in fetchCycleHandler => => => ", actor);

    const total_pending = yield call([actor, actor.count_live_projects]);

    const convertedTotalLive = Number(total_pending);

    // console.log("total_Live aaya => ", convertedTotalLive);

    yield put(totalLiveSuccess(convertedTotalLive));
  } catch (error) {
    yield put(totalLiveFailure(error.toString()));
  }
}

export function* totalLiveSaga() {
  yield takeLatest(checkTotalLiveStart.type, fetchTotalLiveHandler);
}
