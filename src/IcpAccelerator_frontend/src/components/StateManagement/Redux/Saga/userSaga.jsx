import { takeLatest, call, put, select } from "redux-saga/effects";
import { userRegisteredHandlerFailure,userRegisteredHandlerRequest, userRegisteredHandlerSuccess } from "../Reducers/userRegisteredData";


const selectActor = (currState) => currState.actors.actor;


function* fetchUserHandler() {
  try {

    const actor = yield select(selectActor);
    console.log('actor => => => ', actor)

    const userData = yield call([actor, actor.get_user_info_caller]);

    // console.log('roles in rolesaga => ', roles)

    yield put(userRegisteredHandlerSuccess(userData));
  } catch (error) {
    yield put(userRegisteredHandlerFailure(error.toString()));
  }
}

export function* fetchUserSaga() {
  yield takeLatest(userRegisteredHandlerRequest.type, fetchUserHandler);
}
