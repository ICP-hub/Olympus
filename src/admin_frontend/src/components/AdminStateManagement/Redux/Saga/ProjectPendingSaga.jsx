import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";
import {
  projectPendingFailure,
  projectPendingSuccess,
  projectPendingRequest,
} from "../Reducers/projectPending";

const selectActor = (currState) => currState.actors.actor;

function* fetchProjectPendingHandler() {
  try {
    const actor = yield select(selectActor);
    const allProjectPendingStatus = yield call([
      actor,
      actor.project_awaiting_approval,
    ]);

    const updatedProjectProfiles = allProjectPendingStatus.map(
      ([principal, { project_profile, roles }]) => {
        const principalText = principalToText(principal);
        const profilePictureBase64 = project_profile.params.user_data
          .profile_picture
          ? uint8ArrayToBase64(project_profile.params.user_data.profile_picture)
          : null;

        const projectRole = roles.find((role) => role.name === "project");
        let requestedTimeFormatted = "";
        if (projectRole && projectRole.requested_on.length > 0) {
          requestedTimeFormatted = formatDateFromBigInt(
            projectRole.requested_on[0]
          );
        }

        return {
          principal: principalText,
          ...project_profile,
          profile: {
            ...project_profile.params,
            user_data: {
              ...project_profile.params.user_data,
              profile_picture: profilePictureBase64,
            },
          },
          requestedTime: requestedTimeFormatted,
        };
      }
    );

    yield put(projectPendingSuccess(updatedProjectProfiles));
  } catch (error) {
    console.error("Error in fetchProjectPendingHandler:", error);
    yield put(projectPendingFailure(error.toString()));
  }
}

export function* fetchProjectPendingSaga() {
  yield takeLatest(projectPendingRequest.type, fetchProjectPendingHandler);
}
