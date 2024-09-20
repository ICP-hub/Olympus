import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  founderRegisteredHandlerFailure,
  founderRegisteredHandlerRequest,
  founderRegisteredHandlerSuccess,
} from "../Reducers/founderRegisteredData";
import { Principal } from "@dfinity/principal";

const selectActor = (currState) => currState.actors.actor;
const selectPrincipal = (currState) => currState.internet.principal;
function uint8ArrayToBase64(uint8Arr) {
  if (!uint8Arr || uint8Arr.length === 0 || !uint8Arr[0]) {
    console.error("Invalid Uint8Array provided:", uint8Arr);
    return "";
  }

  var rawString = new TextDecoder().decode(uint8Arr[0]);
  var canister_id = rawString.split("/")[0];
  var key = rawString.substring(rawString.indexOf("/"));

  var finalString = "";
  if (process.env.DFX_NETWORK === "ic") {
    finalString = "https://" + canister_id + ".icp0.io" + key;
  } else {
    finalString = "http://" + canister_id + ".localhost:4943" + key;
  }

  return finalString;
}
function* fetchFounderHandler() {
  try {
    const actor = yield select(selectActor);
    const principal = yield select(selectPrincipal);
    const covertedPrincipal = Principal.fromText(principal);

    console.log("actor => => => ", actor);
    console.log("principal => => => ", principal);

    const founderData = yield call([actor, actor.get_project_info_using_principal], covertedPrincipal);
console.log('founderData',founderData)
const [{ [0]: { params: { project_logo ,project_cover} = {} } = {} } = {}] = founderData;
if (project_logo ) {
  const updatedProfileData = uint8ArrayToBase64(project_logo)
  founderData[0]?.[0]?.params?.project_logo?.[0] = updatedProfileData
  console.log('updatedProfileData', updatedProfileData);
}

if (project_cover ) {
  const updatedProfileData = uint8ArrayToBase64(project_cover)
  founderData[0]?.[0]?.params?.project_cover?.[0] = updatedProfileData
}
    // Convert any BigInt values to strings
    const serializedFounderData = JSON.parse(JSON.stringify(founderData, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    console.log("get_my_project in FounderSaga => ", serializedFounderData);

    yield put(founderRegisteredHandlerSuccess(serializedFounderData));
  } catch (error) {
    yield put(founderRegisteredHandlerFailure(error.toString()));
  }
}


export function* fetchFounderSaga() {
  yield takeLatest(founderRegisteredHandlerRequest.type, fetchFounderHandler);
}
