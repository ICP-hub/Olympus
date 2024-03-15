import { takeLatest, call, put, select } from "redux-saga/effects";

import { investorApprovedFailure, investorApprovedRequest, investorApprovedSuccess } from "../Reducers/investorApproved";

const selectActor = (currState) => currState.actors.actor;


function* fetchInvestorApprovedHandler() {
  try {
    const actor = yield select(selectActor);
    // console.log('actor => => => ', actor)
    const allInvestorApprovedStatus = yield call([actor, actor.list_all_vcs]);

    console.log('allInvestorApprovedStatus in allInvestorApprovedStatus => ', allInvestorApprovedStatus)

    yield put(investorApprovedSuccess(allInvestorApprovedStatus));
  } catch (error) {
    yield put(investorApprovedFailure(error.toString()));
  }
}

export function* fetchInvestorApprovedSaga() {
  yield takeLatest(investorApprovedRequest.type, fetchInvestorApprovedHandler);
}
