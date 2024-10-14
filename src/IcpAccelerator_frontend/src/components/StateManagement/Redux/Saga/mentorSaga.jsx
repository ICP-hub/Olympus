import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  mentorRegisteredHandlerFailure,
  mentorRegisteredHandlerRequest,
  mentorRegisteredHandlerSuccess,
} from '../Reducers/mentorRegisteredData';
import { Principal } from '@dfinity/principal';

const selectActor = (currState) => currState.actors.actor;
const selectPrincipal = (currState) => currState.internet.principal;

function* fetchMentorHandler() {
  try {
    const actor = yield select(selectActor);
    const principal = yield select(selectPrincipal);
    const covertedPrincipal = Principal.fromText(principal);
    const mentorData = yield call(
      [actor, actor.get_mentor_info_using_principal],
      covertedPrincipal
    );

    // Convert any BigInt values to strings
    const serializedMentorData = JSON.parse(
      JSON.stringify(mentorData, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    console.log('mentorData functn run hua => ', serializedMentorData);

    yield put(mentorRegisteredHandlerSuccess(serializedMentorData));
  } catch (error) {
    yield put(mentorRegisteredHandlerFailure(error.toString()));
  }
}

export function* fetchMentorSaga() {
  yield takeLatest(mentorRegisteredHandlerRequest.type, fetchMentorHandler);
}
