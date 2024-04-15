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

        const projectCoverURL =
          project_profile[0]?.params?.project_cover instanceof Uint8Array
            ? uint8ArrayToBase64(project_profile[0].params.project_cover)
            : null;

        const projectLogoURL =
          project_profile[0]?.params?.project_logo instanceof Uint8Array
            ? uint8ArrayToBase64(project_profile[0].params.project_logo)
            : null;

        const weeklyUsers = formatDateFromBigInt(
          project_profile[0]?.params?.weekly_active_users[0]
        );
        const updatedRevenue = formatDateFromBigInt(
          project_profile[0]?.params?.revenue[0]
        );

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

        const projectRole = roles.find((role) => role.name === "project");
        let requestedTimeFormatted =
          projectRole?.requested_on?.map(formatDateFromBigInt).join(", ") || "";
        let rejectedTimeFormatted =
          projectRole?.rejected_on?.map(formatDateFromBigInt).join(", ") || "";

        return {
          principal: principalText,
          profile: {
            ...project_profile[0].params,
            project_cover: projectCoverURL,
            project_logo: projectLogoURL,
            weekly_active_users: weeklyUsers,
            revenue: updatedRevenue,
            user_data: {
              ...project_profile[0].params.user_data,
              profile_picture: profilePictureBase64,
            },
          },
          requestedTime: requestedTimeFormatted,
          rejectedTime: rejectedTimeFormatted,
          role: updatedRoles,
        };
      }
    );

    // console.log("updatedProjectProfiles =>", updatedProjectProfiles);
    yield put(projectApprovedSuccess(updatedProjectProfiles));
  } catch (error) {
    console.error("Error in fetchProjectApprovedHandler:", error);
    yield put(projectApprovedFailure(error.toString()));
  }
}

export function* fetchProjectApprovedSaga() {
  yield takeLatest(projectApprovedRequest.type, fetchProjectApprovedHandler);
}
