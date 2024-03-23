import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";
import {
  investorPendingFailure,
  investorPendingSuccess,
  investorPendingRequest,
} from "../Reducers/investorPending";

const selectActor = (currState) => currState.actors.actor;

function* fetchInvestorPendingHandler() {
  try {
    const actor = yield select(selectActor);
    // console.log('actor in investor pending saga:', actor);

    const allInvestorPendingStatus = yield call([
      actor,
      actor.vc_awaiting_approval,
    ]);
    // console.log('allInvestorPendingStatus:', allInvestorPendingStatus);

    const updatedInvestorProfiles = allInvestorPendingStatus.map(
      ([principal, { vc_profile, roles }]) => {
        // const profilePictureBase64 = uint8ArrayToBase64(
        //   vc_profile.params.user_data.profile_picture
        // );

        const profilePictureBase64 = vc_profile.params.user_data.profile_picture && vc_profile.params.user_data.profile_picture instanceof Uint8Array && vc_profile.params.user_data.profile_picture.length > 0
        ? uint8ArrayToBase64(vc_profile.params.user_data.profile_picture)
        : null;
        
        
        const principalText = principalToText(principal);

        const investorRole = roles.find((role) => role.name === "vc");
        let requestedTimeFormatted = "";
        if (investorRole && investorRole.requested_on.length > 0) {
          requestedTimeFormatted = formatDateFromBigInt(
            investorRole.requested_on[0]
          );
        }

        return {
          principal: principalText,
          ...vc_profile,
          profile: {
            ...vc_profile.params,
            user_data: {
              ...vc_profile.params.user_data,
              profile_picture: profilePictureBase64,
            },
          },
          requestedTime: requestedTimeFormatted,
        };
      }
    );

    yield put(investorPendingSuccess(updatedInvestorProfiles));
  } catch (error) {
    console.error("Error fetching investor pending data:", error);
    yield put(investorPendingFailure(error.toString()));
  }
}

export function* fetchInvestorPendingSaga() {
  yield takeLatest(investorPendingRequest.type, fetchInvestorPendingHandler);
}
