import { takeLatest, call, put, select } from "redux-saga/effects";
import { userRegisteredHandlerFailure, userRegisteredHandlerRequest, userRegisteredHandlerSuccess } from "../Reducers/userRegisteredData";


const selectActor = (currState) => currState.actors.actor;

function uint8ArrayToBase64(uint8Arr) {
  // console.log('uint8Arr', uint8Arr)
  // let buffer = Buffer.from(uint8Arr[0])
  // let buffer = Buffer.from(uint8Arr[0]);
  // const decryptedBlob = new Blob([buffer]);
  // console.log('decryptedBlob', decryptedBlob)
  // const url = URL.createObjectURL(decryptedBlob)
  // console.log('uint8Arr heree', uint8Arr)
  
  
  var rawString = new TextDecoder().decode(uint8Arr[0]);
  // console.log('string in userSagea', rawString)
  var canister_id = rawString.split('/')[0]
  var key = rawString.substring(rawString.indexOf('/'))
  // console.log(canister_id, key);
  var finalString = ""
  if (process.env.DFX_NETWORK === "ic"){
    finalString = "https://" + canister_id + ".icp0.io" + key
  }else {
    finalString = "http://" + canister_id + ".localhost:4943" + key
  }
  // console.log('finalString', finalString)

  // const decryptedBlob = new Blob([finalString]);
  // console.log('decryptedBlob', decryptedBlob)
  
  // const url = URL.createObjectURL(decryptedBlob)
  // console.log('url', url)
  return finalString
  // return uint8Arr
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
