import { takeLatest, call, put } from "redux-saga/effects";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import {
  rolesHandlerFailure,
  rolesHandlerRequest,
  rolesHandlerSuccess,
} from "../Reducers/RoleReducer";

function* fetchRoleHandler() {
  try {
    const roles = yield call(IcpAccelerator_backend.get_all_roles);
    yield put(rolesHandlerSuccess(roles));
  } catch (error) {
    yield put(rolesHandlerFailure(error.toString()));
  }
}

export function* roleSaga() {
  yield takeLatest(rolesHandlerRequest.type, fetchRoleHandler);
}
