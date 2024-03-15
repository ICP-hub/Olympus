import { takeLatest, call, put, select } from "redux-saga/effects";

import { investorPendingFailure ,investorPendingSuccess, investorPendingRequest } from "../Reducers/investorPending";
const selectActor = (currState) => currState.actors.actor;


function* fetchInvestorPendingHandler() {
  try {

    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)

    const allInvestorPendingStatus = yield call([actor, actor.vc_awaiting_approval]);

    console.log('allInvestorPendingStatus in allInvestorPendingStatus => ', allInvestorPendingStatus)

    yield put(investorPendingSuccess(allInvestorPendingStatus));
  } catch (error) {
    yield put(investorPendingFailure(error.toString()));
  }
}

export function* fetchInvestorPendingSaga() {
  yield takeLatest(investorPendingRequest.type, fetchInvestorPendingHandler);
}
