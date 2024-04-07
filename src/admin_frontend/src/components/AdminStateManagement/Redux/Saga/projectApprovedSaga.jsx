import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";
import {
  projectApprovedFailure,
  projectApprovedSuccess,
  projectApprovedRequest,
} from "../Reducers/projectApproved";

const selectActor = (currState) => currState.actors.actor;

function* fetchProjectApprovedHandler() {
  try {
    const actor = yield select(selectActor);
    const allProjectApprovedStatus = yield call([
      actor,
      actor.list_all_projects_for_admin,
    ]);

    // console.log("allProjectApprovedStatus  => ", allProjectApprovedStatus);
    const updatedProjectProfiles = allProjectApprovedStatus.map(
      ([principal, { project_profile, roles }]) => {
        const principalText = principalToText(principal);

        const profilePictureBase64 =
          project_profile[0].params.user_data.profile_picture[0] &&
          project_profile[0].params.user_data.profile_picture[0] instanceof
            Uint8Array &&
          project_profile[0].params.user_data.profile_picture[0].length > 0
            ? uint8ArrayToBase64(
                project_profile[0].params.user_data.profile_picture[0]
              )
            : null;

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
            ...project_profile[0].params,
            user_data: {
              ...project_profile[0].params.user_data,
              profile_picture: profilePictureBase64,
            },
          },
          requestedTime: requestedTimeFormatted,
          rejectedTime: rejectedTimeFormatted,
          role: roles,
        };
      }
    );

    yield put(projectApprovedSuccess(updatedProjectProfiles));
  } catch (error) {
    console.error("Error in fetchProjectApprovedHandler:", error);
    yield put(projectApprovedFailure(error.toString()));
  }
}

export function* fetchProjectApprovedSaga() {
  yield takeLatest(projectApprovedRequest.type, fetchProjectApprovedHandler);
}
