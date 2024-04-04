import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  updateUserProfileFailure,
  updateUserProfileSuccess,
  checkUpdateUserProfileStart,
} from "../Reducers/UpdateUserProfile";

const selectActor = (currState) => currState.actors.actor;

function* fetchUpdateUserProfileHandler() {
  try {
    const actor = yield select(selectActor);
    // console.log("actor in fetchCycleHandler => => => ", actor);

    const total_Update = yield call([actor, actor.count_live_projects]);

    const convertedUpdateUserProfile = Number(total_Update);

    // console.log("total_Live aaya => ", convertedUpdateUserProfile);

    yield put(updateUserProfileSuccess(convertedUpdateUserProfile));
  } catch (error) {
    yield put(updateUserProfileFailure(error.toString()));
  }
}

export function* updateUserProfileSaga() {
  yield takeLatest(
    checkUpdateUserProfileStart.type,
    fetchUpdateUserProfileHandler
  );
}
