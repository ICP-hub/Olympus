import { takeLatest, call, put, select } from "redux-saga/effects";

import { investorDeclinedFailure, investorDeclinedSuccess, investorDeclinedRequest } from "../Reducers/investorDecline";
const selectActor = (currState) => currState.actors.actor;


function* fetchInvestorDeclinedHandler() {
  try {

    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)

    const allInvestorDeclinedStatus = yield call([actor, actor.vc_declined]);

    console.log('allInvestorDeclinedStatus in allInvestorDeclinedStatus => ', allInvestorDeclinedStatus)

    yield put(investorDeclinedSuccess(allInvestorDeclinedStatus));
  } catch (error) {
    yield put(investorDeclinedFailure(error.toString()));
  }
}

export function* fetchInvestorDeclinedSaga() {
  yield takeLatest(investorDeclinedRequest.type, fetchInvestorDeclinedHandler);
}
