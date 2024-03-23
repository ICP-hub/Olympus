import { takeLatest, call, put, select } from "redux-saga/effects";
import { totalPendingFailure, totalPendingSuccess, checkTotalPendingStart  } from "../Reducers/totalPendingRequestReducer";
const selectActor = (currState) => currState.actors.actor;

function* fetchTotalPendingHandler() {
  try {
    const actor = yield select(selectActor);
    // console.log("actor in fetchCycleHandler => => => ", actor);

    const total_pending = yield call([actor, actor.get_total_pending_request]);

    const convertedTotalPending = Number(total_pending);

    // console.log("total_pending aaya => ", convertedTotalPending);

    yield put(totalPendingSuccess(convertedTotalPending));
  } catch (error) {
    yield put(totalPendingFailure(error.toString()));
  }
}

export function* totalPendingSaga() {
  yield takeLatest(checkTotalPendingStart.type, fetchTotalPendingHandler);
}
