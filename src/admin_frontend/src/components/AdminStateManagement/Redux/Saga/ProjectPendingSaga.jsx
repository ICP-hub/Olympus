import { takeLatest, call, put, select } from "redux-saga/effects";

import { projectPendingFailure ,projectPendingSuccess, projectPendingRequest } from "../Reducers/projectPending";
const selectActor = (currState) => currState.actors.actor;


function* fetchProjectPendingHandler() {
  try {

    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)

    const allProjectPendingStatus = yield call([actor, actor.project_awaiting_approval]);

    console.log('allProjectPendingStatus in allProjectPendingStatus => ', allProjectPendingStatus)

    yield put(projectPendingSuccess(allProjectPendingStatus));
  } catch (error) {
    yield put(projectPendingFailure(error.toString()));
  }
}

export function* fetchProjectPendingSaga() {
  yield takeLatest(projectPendingRequest.type, fetchProjectPendingHandler);
}
