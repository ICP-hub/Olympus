import { takeLatest, call, put, select } from "redux-saga/effects";
import { userRegisteredHandlerFailure, userRegisteredHandlerRequest, userRegisteredHandlerSuccess } from "../Reducers/userRegisteredData";


const selectActor = (currState) => currState.actors.actor;

function uint8ArrayToBase64(uint8Arr) {

  // console.log('image in mentor >>>>>',uint8Arr);
  let buffer = Buffer.from(uint8Arr[0]);
  // console.log("buffer ==========>",buffer)
  const decryptedBlob = new Blob([buffer]);
  const url = URL.createObjectURL(decryptedBlob)
  return url
}

function* fetchUserHandler() {
  const actor = yield select(selectActor);
  const userData = yield call([actor, actor.get_user_information]);
  console.log('actor => => => ', actor)

  console.log('userData in saga ', userData)
  try {


    const updatedProfileData = uint8ArrayToBase64(userData?.Ok?.profile_picture)
    const updatedUserData = {
      ...userData,
      profile_picture: updatedProfileData,
    };
    console.log('updatedUserData', updatedUserData)
    yield put(userRegisteredHandlerSuccess(updatedUserData));
  } catch (error) {
    yield put(userRegisteredHandlerFailure(error.toString()));
  }
}

export function* fetchUserSaga() {
  yield takeLatest(userRegisteredHandlerRequest.type, fetchUserHandler);
}
