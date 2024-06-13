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

function* fetchMentorPendingHandler(action) {
  try {
    const { currentPage, itemsPerPage } = action.payload;
    const actor = yield select(selectActor);

    const allMentorPendingStatus = yield call(
      [actor, actor.mentors_awaiting_approval],
      {
        page_size: itemsPerPage,
        page: currentPage,
      }
    );

    // console.log("allMentorPendingStatus =>", allMentorPendingStatus);

    const updatedMentorProfiles = allMentorPendingStatus?.data.map(
      ([principal, { mentor_profile, roles }]) => {
        const profilePictureBase64 =
          mentor_profile.profile.user_data.profile_picture[0] &&
          mentor_profile.profile.user_data.profile_picture[0] instanceof
            Uint8Array &&
          mentor_profile.profile.user_data.profile_picture[0].length > 0
            ? uint8ArrayToBase64(
                mentor_profile.profile.user_data.profile_picture[0]
              )
            : null;

        const principalText = principalToText(principal);

        const mentorRole = roles.find((role) => role.name === "mentor");

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
          role: updatedRoles,
        };
      }
    );

    yield put(
      mentorPendingSuccess({
        profiles: updatedMentorProfiles,
        count: Number(allMentorPendingStatus.count),
      })
    );
  } catch (error) {
    console.error(error);
    yield put(mentorPendingFailure(error.toString()));
  }
}

export function* fetchMentorPendingSaga() {
  yield takeLatest(mentorPendingRequest.type, fetchMentorPendingHandler);
}
