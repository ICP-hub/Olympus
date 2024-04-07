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
    // Fetch the update request count from the actor
    const updateCounts = yield call([actor, actor.get_update_request_count]);
    // console.log("Update counts received =>", updateCounts);

    // Calculate the total updates by summing up the first element of each array
    const totalUpdates = Object.values(updateCounts).reduce(
      (total, currentArray) => {
        return total + (currentArray.length > 0 ? currentArray[0] : 0);
      },
      0
    );

    // console.log("Total updates calculated => ", totalUpdates);

    // Dispatch the success action with the total update count
    yield put(updateUserProfileSuccess(totalUpdates));
  } catch (error) {
    console.error("Error in fetchUpdateUserProfileHandler:", error);
    yield put(updateUserProfileFailure(error.toString()));
  }
}

export function* updateUserProfileSaga() {
  yield takeLatest(
    checkUpdateUserProfileStart.type,
    fetchUpdateUserProfileHandler
  );
}
