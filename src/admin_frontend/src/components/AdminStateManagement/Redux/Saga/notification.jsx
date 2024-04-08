import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  notificationHandlerFailure,
  notificationHandlerRequest,
  notificationHandlerSuccess,
} from "../Reducers/notificationReducer";
import {
  principalToText,
  uint8ArrayToBase64,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";

const selectActor = (currState) => currState.actors.actor;

function* fetchNotificationHandler() {
  try {
    const actor = yield select(selectActor);
    const allNotifications = yield call([actor, actor.get_pending_admin_notifications]);

    // console.log("get_pending_admin_notifications =>", allNotifications)
    const formattedNotifications = allNotifications.map((notification) => {
      const {
        notification_type: { ApprovalRequest: details },
        timestamp,
      } = notification;

      const photo =
        details.photo &&
        details.photo instanceof Uint8Array &&
        details.photo.length > 0
          ? uint8ArrayToBase64(details.photo)
          : null;

      return {
        country: details.country,
        name: details.name,
        sender: details.sender ? principalToText(details.sender) : "Unknown",
        requestedFor: details.requested_for,
        photo: photo,
        tagUsed: details.tag_used,
        timestamp: formatDateFromBigInt(BigInt(timestamp)),
      };
    });

    // console.log("Formatted notifications:", formattedNotifications);
    yield put(notificationHandlerSuccess(formattedNotifications));
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    yield put(notificationHandlerFailure(error.toString()));
  }
}

export function* notificationSaga() {
  yield takeLatest(notificationHandlerRequest.type, fetchNotificationHandler);
}
