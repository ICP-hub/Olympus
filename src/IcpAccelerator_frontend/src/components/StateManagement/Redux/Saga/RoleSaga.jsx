import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  rolesHandlerFailure,
  rolesHandlerRequest,
  rolesHandlerSuccess,
} from '../Reducers/RoleReducer';

const selectActor = (currState) => currState.actors.actor;

function* fetchRoleHandler() {
  try {
    const actor = yield select(selectActor);
    const roles = yield call([actor, actor.get_all_roles]);
    yield put(rolesHandlerSuccess(roles));
  } catch (error) {
    yield put(rolesHandlerFailure(error.toString()));
  }
}
export function* roleSaga() {
  yield takeLatest(rolesHandlerRequest.type, fetchRoleHandler);
}
