import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  hubRegisteredHandlerFailure,
  hubRegisteredHandlerRequest,
  hubRegisteredHandlerSuccess,
} from '../Reducers/hubRegisteredData';

const selectActor = (currState) => currState.actors.actor;

function* fetchHubHandler() {
  try {
    const actor = yield select(selectActor);
    const hubData = yield call([actor, actor.get_hub_organizer_candid]);
    yield put(hubRegisteredHandlerSuccess(hubData));
  } catch (error) {
    yield put(hubRegisteredHandlerFailure(error.toString()));
  }
}

export function* fetchHubSaga() {
  yield takeLatest(hubRegisteredHandlerRequest.type, fetchHubHandler);
}
