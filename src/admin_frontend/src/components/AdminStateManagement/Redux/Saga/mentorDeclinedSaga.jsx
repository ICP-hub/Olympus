import { takeLatest, call, put, select } from "redux-saga/effects";

import { mentorDeclinedFailure, mentorDeclinedSuccess, mentorDeclinedRequest } from "../Reducers/mentorDeclined";

const selectActor = (currState) => currState.actors.actor;


function* fetchMentorDeclinedHandler() {
  try {

    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)

    const allMentorDeclinedStatus = yield call([actor, actor.mentor_declined]);

    console.log('allMentorDeclinedStatus in allMentorDeclinedStatus => ', allMentorDeclinedStatus)

    yield put(mentorDeclinedSuccess(allMentorDeclinedStatus));
  } catch (error) {
    yield put(mentorDeclinedFailure(error.toString()));
  }
}

export function* fetchMentorDeclinedSaga() {
  yield takeLatest(mentorDeclinedRequest.type, fetchMentorDeclinedHandler);
}
