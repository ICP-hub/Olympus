import { takeLatest, call, put, select } from "redux-saga/effects";
import {
  investorRegisteredHandlerFailure,
  investorRegisteredHandlerRequest,
  investorRegisteredHandlerSuccess,
} from "../Reducers/investorRegisteredData";

import { Principal } from "@dfinity/principal";

const selectActor = (currState) => currState.actors.actor;
const selectPrincipal = (currState) => currState.internet.principal;

function* fetchInvestorHandler() {
  try {
    const actor = yield select(selectActor);
    const principal = yield select(selectPrincipal);
    const covertedPrincipal = Principal.fromText(principal);
    console.log("actor in investor => => => ", actor);

    const investorData = yield call([actor, actor.get_vc_info_using_principal],covertedPrincipal);

     // Convert any BigInt values to strings
     const serializedInvestorData = JSON.parse(JSON.stringify(investorData, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    console.log("investorData in investorsaga  => ", serializedInvestorData);

    yield put(investorRegisteredHandlerSuccess(serializedInvestorData));
  } catch (error) {
    yield put(investorRegisteredHandlerFailure(error.toString()));
  }
}

export function* fetchInvestorSaga() {
  yield takeLatest(investorRegisteredHandlerRequest.type, fetchInvestorHandler);
}
