import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";
import {
  mentorDeclinedFailure,
  mentorDeclinedSuccess,
  mentorDeclinedRequest,
} from "../Reducers/mentorDeclined";

const selectActor = (currState) => currState.actors.actor;

function* fetchMentorDeclinedHandler() {
  try {
    const actor = yield select(selectActor);
    const allMentorDeclinedStatus = yield call([actor, actor.mentor_declined]);

    const updatedMentorProfiles = allMentorDeclinedStatus.map(
      ([principal, { mentor_profile, roles }]) => {
        const principalText = principalToText(principal);

        // const profilePictureBase64 = mentor_profile.profile.user_data
        //   .profile_picture
        //   ? uint8ArrayToBase64(mentor_profile.profile.user_data.profile_picture)
        //   : null;

        const profilePictureBase64 =
          mentor_profile.profile.user_data.profile_picture[0] &&
          mentor_profile.profile.user_data.profile_picture[0] instanceof
            Uint8Array &&
          mentor_profile.profile.user_data.profile_picture[0].length > 0
            ? uint8ArrayToBase64(
                mentor_profile.profile.user_data.profile_picture[0]
              )
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

        const mentorRole = roles.find((role) => role.name === "mentor");
        let requestedTimeFormatted = mentorRole.requested_on
          .map((time) => formatDateFromBigInt(time))
          .join(", ");
        let rejectedTimeFormatted = mentorRole.rejected_on
          .map((time) => formatDateFromBigInt(time))
          .join(", ");

        return {
          principal: principalText,
          ...mentor_profile,
          profile: {
            ...mentor_profile.profile,
            user_data: {
              ...mentor_profile.profile.user_data,
              profile_picture: profilePictureBase64,
            },
          },
          requestedTime: requestedTimeFormatted,
          rejectedTime: rejectedTimeFormatted,
          role: updatedRoles,
        };
      }
    );

    yield put(mentorDeclinedSuccess(updatedMentorProfiles));
  } catch (error) {
    console.error(error);
    yield put(mentorDeclinedFailure(error.toString()));
  }
}

export function* fetchMentorDeclinedSaga() {
  yield takeLatest(mentorDeclinedRequest.type, fetchMentorDeclinedHandler);
}
