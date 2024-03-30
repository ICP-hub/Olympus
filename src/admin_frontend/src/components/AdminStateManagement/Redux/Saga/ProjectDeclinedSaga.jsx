import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";
import {
  projectDeclinedFailure,
  projectDeclinedSuccess,
  projectDeclinedRequest,
} from "../Reducers/projectDeclined";

const selectActor = (currState) => currState.actors.actor;

function* fetchProjectDeclinedHandler() {
  try {
    const actor = yield select(selectActor);
    const allProjectDeclinedStatus = yield call([
      actor,
      actor.project_declined,
    ]);

    const updatedProjectProfiles = allProjectDeclinedStatus.map(
      ([principal, { project_profile, roles }]) => {
        const principalText = principalToText(principal);
      
        // const profilePictureBase64 = project_profile.params.user_data
        //   .profile_picture
        //   ? uint8ArrayToBase64(project_profile.params.user_data.profile_picture)
        //   : null;

          const profilePictureBase64 = project_profile.params.user_data
          .profile_picture[0] && project_profile.params.user_data
          .profile_picture[0] instanceof Uint8Array && project_profile.params.user_data
          .profile_picture[0].length > 0
          ? uint8ArrayToBase64(project_profile.params.user_data
          .profile_picture[0])
          : null;


        // Assuming similar role structure as mentors for date formatting
        const projectRole = roles.find((role) => role.name === "project");
        let requestedTimeFormatted = "",
          rejectedTimeFormatted = "";
        if (projectRole) {
          requestedTimeFormatted = projectRole.requested_on
            .map((time) => formatDateFromBigInt(time))
            .join(", ");
          rejectedTimeFormatted = projectRole.rejected_on
            .map((time) => formatDateFromBigInt(time))
            .join(", ");
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
          rejectedTime: rejectedTimeFormatted,
          role :roles
        };
      }
    );

    yield put(projectDeclinedSuccess(updatedProjectProfiles));
  } catch (error) {
    console.error("Error in fetchProjectDeclinedHandler:", error);
    yield put(projectDeclinedFailure(error.toString()));
  }
}

export function* fetchProjectDeclinedSaga() {
  yield takeLatest(projectDeclinedRequest.type, fetchProjectDeclinedHandler);
}
