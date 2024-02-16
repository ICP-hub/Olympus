import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  allHubHandlerRequest,
  allHubHandlerSuccess,
  allHubHandlerFailure,
} from "../Reducers/All_IcpHubReducer";

const actor = (state) => state.actors.actor;

function* fetchAllHubsHandler() {
  try {
    // const actor = yield select(selectActor);
    const Allhubs = yield call(actor.call_get_icp_hubs);

    console.log('allhubs data mc =>', Allhubs)
    yield put(allHubHandlerSuccess(Allhubs));
  } catch (error) {
    yield put(allHubHandlerFailure(error.toString()));
  }
}

export function* allHubsSaga() {
  yield takeLatest(allHubHandlerRequest().type, fetchAllHubsHandler);
}
