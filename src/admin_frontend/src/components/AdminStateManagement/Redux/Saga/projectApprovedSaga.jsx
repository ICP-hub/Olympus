import { takeLatest, call, put, select } from "redux-saga/effects";

import { projectApprovedFailure, projectApprovedSuccess, projectApprovedRequest } from "../Reducers/projectApproved";
const selectActor = (currState) => currState.actors.actor;


function* fetchProjectApprovedHandler() {
  try {

    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)

    const allProjectApprovedStatus = yield call([actor, actor.list_all_projects]);

    console.log('allProjectApprovedStatus in allProjectApprovedStatus => ', allProjectApprovedStatus)

    yield put(projectApprovedSuccess(allProjectApprovedStatus));
  } catch (error) {
    yield put(projectApprovedFailure(error.toString()));
  }
}

export function* fetchProjectApprovedSaga() {
  yield takeLatest(projectApprovedRequest.type, fetchProjectApprovedHandler);
}
