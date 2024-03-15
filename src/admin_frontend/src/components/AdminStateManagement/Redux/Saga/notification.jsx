import { takeLatest, call, put, select } from "redux-saga/effects";
import { notificationHandlerFailure,notificationHandlerRequest, notificationHandlerSuccess } from "../Reducers/notificationReducer";


const selectActor = (currState) => currState.actors.actor;


function* fetchNotificationHandler() {
  
  try {
    const actor = yield select(selectActor);
    console.log('actor in notification => => => ', actor)

    const allNotification = yield call([actor, actor.get_admin_notifications]);

    console.log('notification in allNotification => ', allNotification)

    yield put(notificationHandlerSuccess(allNotification));
  } catch (error) {
    yield put(notificationHandlerFailure(error.toString()));
  }
}

export function* notificationSaga() {
  yield takeLatest(notificationHandlerRequest.type, fetchNotificationHandler);
}
