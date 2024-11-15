import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  userRoleHandler,
  userRoleFailureHandler,
  userRoleSuccessHandler,
} from '../Reducers/userRoleReducer';

const selectActor = (currState) => currState.actors.actor;

function* fetchUserRoleHandler() {
  try {
    const actor = yield select(selectActor);
    const userCurrentRole = yield call([actor, actor.get_role_from_p_id]);
    yield put(userRoleSuccessHandler(Object.keys(userCurrentRole[0][0])[0]));
  } catch (error) {
    yield put(userRoleFailureHandler(error.toString()));
  }
}

export function* userRoleSaga() {
  yield takeLatest(userRoleHandler().type, fetchUserRoleHandler);
}
