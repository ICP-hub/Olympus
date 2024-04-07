import { takeLatest, call, put, select } from "redux-saga/effects";
import { userRegisteredHandlerFailure, userRegisteredHandlerRequest, userRegisteredHandlerSuccess } from "../Reducers/userRegisteredData";


const selectActor = (currState) => currState.actors.actor;

function uint8ArrayToBase64(uint8Arr) {

  let buffer = Buffer.from(uint8Arr[0]);
  const decryptedBlob = new Blob([buffer]);
  const url = URL.createObjectURL(decryptedBlob)
  return url
}

function* fetchUserHandler() {

  try {
    const actor = yield select(selectActor);
    let userData = yield call([actor, actor.get_user_information]);
    // console.log("userData====>>>", userData)
    if (userData?.Ok?.profile_picture.length > 0) {
      const updatedProfileData = uint8ArrayToBase64(userData?.Ok?.profile_picture)
      userData?.Ok?.profile_picture[0] = updatedProfileData
    }
    yield put(userRegisteredHandlerSuccess(userData));
  } catch (error) {
    yield put(userRegisteredHandlerFailure(error.toString()));
  }

}



export function* fetchUserSaga() {
  yield takeLatest(userRegisteredHandlerRequest.type, fetchUserHandler);
}
