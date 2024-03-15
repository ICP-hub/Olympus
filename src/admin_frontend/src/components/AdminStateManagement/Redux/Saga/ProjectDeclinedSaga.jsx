import { takeLatest, call, put, select } from "redux-saga/effects";

import { projectDeclinedFailure , projectDeclinedSuccess, projectDeclinedRequest } from "../Reducers/projectDeclined";
const selectActor = (currState) => currState.actors.actor;


function* fetchProjectDeclinedHandler() {
  try {

    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)

    const allProjectDeclinedStatus = yield call([actor, actor.project_declined]);

    console.log('allProjectDeclinedStatus in allProjectDeclinedStatus => ', allProjectDeclinedStatus)

    yield put(projectDeclinedSuccess(allProjectDeclinedStatus));
  } catch (error) {
    yield put(projectDeclinedFailure(error.toString()));
  }
}

export function* fetchProjectDeclinedSaga() {
  yield takeLatest(projectDeclinedRequest.type, fetchProjectDeclinedHandler);
}
