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

    // console.log(
    //   "allProjectDeclinedStatus =>CCCCCCCCCCCC",
    //   allProjectDeclinedStatus
    // );

    const updatedProjectProfiles = allProjectDeclinedStatus.map(
      ([principal, { project_profile, roles }]) => {
        const principalText = principalToText(principal);

        // const profilePictureBase64 = project_profile.params.user_data
        //   .profile_picture
        //   ? uint8ArrayToBase64(project_profile.params.user_data.profile_picture)
        //   : null;

        const weeklyUsers = formatDateFromBigInt(
          project_profile.params?.weekly_active_users[0]
        );
        const updatedRevenue = formatDateFromBigInt(
          project_profile.params?.revenue[0]
        );

        const profilePictureBase64 =
          project_profile.params.user_data.profile_picture[0] &&
          project_profile.params.user_data.profile_picture[0] instanceof
            Uint8Array &&
          project_profile.params.user_data.profile_picture[0].length > 0
            ? uint8ArrayToBase64(
                project_profile.params.user_data.profile_picture[0]
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
            ...project_profile.params,
            weekly_active_users: weeklyUsers,
            revenue: updatedRevenue,
            user_data: {
              ...project_profile.params.user_data,
              profile_picture: profilePictureBase64,
            },
            project_cover: projectCoverURL,
            project_logo: projectLogoURL,
          },
          requestedTime: requestedTimeFormatted,
          rejectedTime: rejectedTimeFormatted,
          role: updatedRoles,
        };
      }
    );

    // console.log(
    //   "updatedProjectProfiles =>CCCCCCCCCCCC",
    //   updatedProjectProfiles
    // );

    yield put(projectDeclinedSuccess(updatedProjectProfiles));
  } catch (error) {
    console.error("Error in fetchProjectDeclinedHandler:", error);
    yield put(projectDeclinedFailure(error.toString()));
  }
}

export function* fetchProjectDeclinedSaga() {
  yield takeLatest(projectDeclinedRequest.type, fetchProjectDeclinedHandler);
}
