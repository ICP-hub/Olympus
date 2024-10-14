import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  typeOfProfileSliceHandlerRequest,
  typeOfProfileSliceHandlerSuccess,
  typeOfProfileSliceHandlerFailure,
} from '../Reducers/getTypeOfProfile';

const selectActor = (currState) => currState.actors.actor;

function* fetchTypeOfProfileHandler() {
  try {
    const actor = yield select(selectActor);
    const typeOfProfile = yield call([actor, actor.type_of_user_profile]);
    yield put(typeOfProfileSliceHandlerSuccess(typeOfProfile));
  } catch (error) {
    yield put(typeOfProfileSliceHandlerFailure(error.toString()));
  }
}

export function* typeOfProfileSaga() {
  yield takeLatest(
    typeOfProfileSliceHandlerRequest.type,
    fetchTypeOfProfileHandler
  );
}
