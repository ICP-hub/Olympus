import { takeLatest, call, put, select } from "redux-saga/effects";
import { userRoleHandler, userRoleFailureHandler, userRoleSuccessHandler } from "../Reducers/userRoleReducer";


const selectActor = (currState) => currState.actors.actor;


function* fetchUserRoleHandler() {
  try {

    const actor = yield select(selectActor);
    console.log('actor => => => ', actor)

    const userCurrentRole = yield call([actor, actor.yaha_role_ka_function]);

    // console.log('roles in rolesaga => ', roles)

    yield put(userRoleSuccessHandler(userCurrentRole));
  } catch (error) {
    yield put(userRoleFailureHandler(error.toString()));
  }
}

export function* userRoleSaga() {
  yield takeLatest(userRoleHandler().type, fetchUserRoleHandler);
}
