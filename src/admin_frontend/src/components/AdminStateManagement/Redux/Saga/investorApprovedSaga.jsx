import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  uint8ArrayToBase64,
  principalToText,
  formatDateFromBigInt,
} from "../../../Utils/AdminData/saga_function/blobImageToUrl";
import {
  investorApprovedFailure,
  investorApprovedRequest,
  investorApprovedSuccess,
} from "../Reducers/investorApproved";

const selectActor = (currState) => currState.actors.actor;

function* fetchInvestorApprovedHandler() {
  try {
    const actor = yield select(selectActor);
    const allInvestorApprovedStatus = yield call([actor, actor.list_all_vcs]);

    const updatedInvestorProfiles = allInvestorApprovedStatus.map(
      ([principal, { vc_profile, roles }]) => {
        const principalText = principalToText(principal);
        // const profilePictureBase64 = vc_profile.params.user_data.profile_picture
        //   ? uint8ArrayToBase64(vc_profile.params.user_data.profile_picture)
        //   : null;


          const profilePictureBase64 = vc_profile.params.user_data.profile_picture[0] && vc_profile.params.user_data.profile_picture[0] instanceof Uint8Array && vc_profile.params.user_data.profile_picture[0].length > 0
          ? uint8ArrayToBase64(vc_profile.params.user_data.profile_picture[0])
          : null;


        const investorRole = roles.find((role) => role.name === "vc");
        let requestedTimeFormatted = "",
          rejectedTimeFormatted = "";
        if (investorRole) {
          requestedTimeFormatted = investorRole.requested_on
            .map((time) => formatDateFromBigInt(time))
            .join(", ");
          rejectedTimeFormatted = investorRole.rejected_on
            .map((time) => formatDateFromBigInt(time))
            .join(", ");
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
          rejectedTime: rejectedTimeFormatted,
          role :roles
        };
      }
    );

    yield put(investorApprovedSuccess(updatedInvestorProfiles));
  } catch (error) {
    console.error("Error in fetchInvestorApprovedHandler:", error);
    yield put(investorApprovedFailure(error.toString()));
  }
}

export function* fetchInvestorApprovedSaga() {
  yield takeLatest(investorApprovedRequest.type, fetchInvestorApprovedHandler);
}
