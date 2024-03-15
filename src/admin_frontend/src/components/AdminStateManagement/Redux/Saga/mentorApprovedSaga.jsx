import { takeLatest, call, put, select } from "redux-saga/effects";

import { mentorApprovedFailure, mentorApprovedSuccess, mentorApprovedRequest } from "../Reducers/mentorApproved";
const selectActor = (currState) => currState.actors.actor;


function uint8ArrayToBase64(uint8Arr) {
  let buffer = Buffer.from(uint8Arr);
  const decryptedBlob = new Blob([buffer]);
  const url = URL.createObjectURL(decryptedBlob);
  return url;
}


function principalToText(principal){
  return principal.toText()
}


function* fetchMentorApprovedHandler() {
  try {

    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)

    const allMentorApprovedStatus = yield call([actor, actor.get_all_mentors_candid]);

    console.log('allMentorApprovedStatus in allMentorApprovedStatus => ', allMentorApprovedStatus)

    const updatedMentorProfiles = allMentorApprovedStatus.map(([principal, data]) => {
      // const { data, principal } = mentor;
      const profilePictureBase64 = data.user_data.profile_picture ? uint8ArrayToBase64(data.user_data.profile_picture) : null;

      // const principalText = principalToText(principal);

      return {
        ...data,
        user_data: {
          ...data.user_data,
          profile_picture: profilePictureBase64,
        },
        // principal: principalToText(principal),
      };
    });

    yield put(mentorApprovedSuccess(updatedMentorProfiles));
  } catch (error) {
    yield put(mentorApprovedFailure(error.toString()));
  }
}

export function* fetchMentorApprovedSaga() {
  yield takeLatest(mentorApprovedRequest.type, fetchMentorApprovedHandler);
}
