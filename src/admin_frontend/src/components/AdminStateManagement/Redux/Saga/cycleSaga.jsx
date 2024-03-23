import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  cycleFailure,
  cycleSuccess,
  checkCycleStart,
} from "../Reducers/cyclePendingReducer";
const selectActor = (currState) => currState.actors.actor;

function* fetchCycleHandler() {
  try {
    const actor = yield select(selectActor);
    // console.log("actor in fetchCycleHandler => => => ", actor);

    const cyles = yield call([actor, actor.get_pending_cycles]);

    const convertedCycle = Number(cyles);

    // console.log("cyles aaya => ", convertedCycle);

    yield put(cycleSuccess(convertedCycle));
  } catch (error) {
    yield put(cycleFailure(error.toString()));
  }
}

export function* cycleSaga() {
  yield takeLatest(checkCycleStart.type, fetchCycleHandler);
}
