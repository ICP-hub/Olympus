import { takeLatest, call, put, select } from "redux-saga/effects";
import { mentorPendingFailure, mentorPendingSuccess, mentorPendingRequest } from "../Reducers/mentorPending";

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

function* fetchMentorPendingHandler() {
    try {
        const actor = yield select(selectActor);
        const allMentorPendingStatus = yield call([actor, actor.mentors_awaiting_approval]);
        console.log('allMentorPendingStatus in allMentorPendingStatus => ', allMentorPendingStatus);

        const updatedMentorProfiles = allMentorPendingStatus.map(([principal, data]) => {
            const profilePictureBase64 = uint8ArrayToBase64(data.profile.user_data.profile_picture);
            const principalText = principalToText(principal);

            return {
                principal: principalText,
                ...data,
                profile: {
                    ...data.profile,
                    user_data: {
                        ...data.profile.user_data,
                        profile_picture: profilePictureBase64,
                    },
                },
            };
        });

        yield put(mentorPendingSuccess(updatedMentorProfiles));
    } catch (error) {
        yield put(mentorPendingFailure(error.toString()));
    }
}


export function* fetchMentorPendingSaga() {
    yield takeLatest(mentorPendingRequest.type, fetchMentorPendingHandler);
}
