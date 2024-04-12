import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";
import {
  mentorApprovedFailure,
  mentorApprovedSuccess,
  mentorApprovedRequest,
} from "../Reducers/mentorApproved";

const selectActor = (currState) => currState.actors.actor;

function* fetchMentorApprovedHandler() {
  try {
    const actor = yield select(selectActor);
    const allMentorApprovedStatus = yield call([
      actor,
      actor.get_all_mentors_candid,
    ]);

    const updatedMentorProfiles = allMentorApprovedStatus.map(
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
        let requestedTimeFormatted =
          mentorRole &&
          mentorRole.requested_on
            .map((time) => formatDateFromBigInt(time))
            .join(", ");
        let rejectedTimeFormatted =
          mentorRole &&
          mentorRole.rejected_on
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

    yield put(mentorApprovedSuccess(updatedMentorProfiles));
  } catch (error) {
    console.error(error);
    yield put(mentorApprovedFailure(error.toString()));
  }
}

export function* fetchMentorApprovedSaga() {
  yield takeLatest(mentorApprovedRequest.type, fetchMentorApprovedHandler);
}
