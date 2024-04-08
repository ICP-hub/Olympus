import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  mentorPendingFailure,
  mentorPendingSuccess,
  mentorPendingRequest,
} from "../Reducers/mentorPending";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";

const selectActor = (currState) => currState.actors.actor;

function* fetchMentorPendingHandler() {
  try {
    const actor = yield select(selectActor);
    const allMentorPendingStatus = yield call([
      actor,
      actor.mentors_awaiting_approval,
    ]);


    // console.log("allMentorPendingStatus =>", allMentorPendingStatus);

    
    const updatedMentorProfiles = allMentorPendingStatus.map(
      ([principal, { mentor_profile, roles }]) => {

        // const profilePictureBase64 = uint8ArrayToBase64(
        //   mentor_profile.profile.user_data.profile_picture
        // );

        const profilePictureBase64 = mentor_profile.profile.user_data.profile_picture[0] && mentor_profile.profile.user_data.profile_picture[0] instanceof Uint8Array && mentor_profile.profile.user_data.profile_picture[0].length > 0
          ? uint8ArrayToBase64(mentor_profile.profile.user_data.profile_picture[0])
          : null;

          
          // console.log("profilePictureBase64 in allMentorPendingStatus =>", mentor_profile.profile.user_data.profile_picture[0]);

        const principalText = principalToText(principal);

        const mentorRole = roles.find((role) => role.name === "mentor");
        // const mentorRole = roles;

        let requestedTimeFormatted = "";
        if (mentorRole && mentorRole.requested_on.length > 0) {
          requestedTimeFormatted = formatDateFromBigInt(
            mentorRole.requested_on[0]
          );
        }

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
          role :roles
        };
      }
    );

    // console.log("updatedMentorProfiles ,,,,,,,,,,,,,,,,", updatedMentorProfiles);
    yield put(mentorPendingSuccess(updatedMentorProfiles));
  } catch (error) {
    console.error(error);
    yield put(mentorPendingFailure(error.toString()));
  }
}

export function* fetchMentorPendingSaga() {
  yield takeLatest(mentorPendingRequest.type, fetchMentorPendingHandler);
}
