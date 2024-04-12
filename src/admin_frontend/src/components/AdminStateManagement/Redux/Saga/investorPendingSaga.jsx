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
    // console.log("allInvestorPendingStatus:", allInvestorPendingStatus);

    const updatedInvestorProfiles = allInvestorPendingStatus.map(
      ([principal, { vc_profile, roles }]) => {
        // const profilePictureBase64 = uint8ArrayToBase64(
        //   vc_profile.params.user_data.profile_picture
        // );

        const profilePictureBase64 =
          vc_profile.params.user_data.profile_picture[0] &&
          vc_profile.params.user_data.profile_picture[0] instanceof
            Uint8Array &&
          vc_profile.params.user_data.profile_picture[0].length > 0
            ? uint8ArrayToBase64(vc_profile.params.user_data.profile_picture[0])
            : null;

        const logoBase64 =
          vc_profile.params.logo[0] &&
          vc_profile.params.logo[0] instanceof Uint8Array
            ? vc_profile.params.logo[0].length > 0
              ? uint8ArrayToBase64(vc_profile.params.logo[0])
              : null
            : null;

        // console.log("profilePictureBase64 ====> ", vc_profile.params.user_data.profile_picture[0]);

        const principalText = principalToText(principal);

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
          params: {
            ...vc_profile.params,
            logo: logoBase64,
            user_data: {
              ...vc_profile.params.user_data,
              profile_picture: profilePictureBase64,
            },
          },
          profile: {
            ...vc_profile.params,
            logo: logoBase64,
            user_data: {
              ...vc_profile.params.user_data,
              profile_picture: profilePictureBase64,
            },
          },
          requestedTime: requestedTimeFormatted,
          role: updatedRoles,
        };
      }
    );
    // console.log("updatedInvestorProfiles", updatedInvestorProfiles);

    yield put(investorPendingSuccess(updatedInvestorProfiles));
  } catch (error) {
    console.error("Error fetching investor pending data:", error);
    yield put(investorPendingFailure(error.toString()));
  }
}

export function* fetchInvestorPendingSaga() {
  yield takeLatest(investorPendingRequest.type, fetchInvestorPendingHandler);
}
