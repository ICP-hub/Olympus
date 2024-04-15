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

    // console.log("allProjectPendingStatus =>",allProjectPendingStatus);
    const updatedProjectProfiles = allProjectPendingStatus.map(
      ([principal, { project_profile, roles }]) => {
        const principalText = principalToText(principal);
        const profilePictureURL =
          project_profile.params.user_data.profile_picture[0] instanceof
          Uint8Array
            ? uint8ArrayToBase64(
                project_profile.params.user_data.profile_picture[0]
              )
            : null;
        const projectCoverURL =
          project_profile.params.project_cover instanceof Uint8Array
            ? uint8ArrayToBase64(project_profile.params.project_cover)
            : null;
        const projectLogoURL =
          project_profile.params.project_logo instanceof Uint8Array
            ? uint8ArrayToBase64(project_profile.params.project_logo)
            : null;

        const weeklyUsers = formatDateFromBigInt(
          project_profile.params.weekly_active_users[0]
        );
        const updatedRevenue = formatDateFromBigInt(
          project_profile.params.revenue[0]
        );
        const projectRole = roles.find((role) => role.name === "project");
        let requestedTimeFormatted =
          projectRole?.requested_on
            ?.map((time) => formatDateFromBigInt(time))
            .join(", ") || "";

        const updatedRoles = roles.map((role) => ({
          ...role,
          approved_on: role.approved_on.map((time) =>
            formatDateFromBigInt(time)
          ),
          requested_on: role.requested_on.map((time) =>
            formatDateFromBigInt(time)
          ),
          rejected_on: role.rejected_on.map((time) =>
            formatDateFromBigInt(time)
          ),
        }));

        return {
          principal: principalText,
          profile: {
            ...project_profile.params,
            weekly_active_users: weeklyUsers,
            revenue: updatedRevenue,
            user_data: {
              ...project_profile.params.user_data,
              profile_picture: profilePictureURL,
            },
            project_cover: projectCoverURL,
            project_logo: projectLogoURL,
          },
          requestedTime: requestedTimeFormatted,
          role: updatedRoles,
        };
      }
    );

    // console.log("updatedProjectProfiles =>>>>>", updatedProjectProfiles);
    yield put(projectPendingSuccess(updatedProjectProfiles));
  } catch (error) {
    console.error("Error in fetchProjectPendingHandler:", error);
    yield put(projectPendingFailure(error.toString()));
  }
}

export function* fetchProjectPendingSaga() {
  yield takeLatest(projectPendingRequest.type, fetchProjectPendingHandler);
}
