import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  jobCategoryHandlerRequest,
  jobCategoryHandlerSuccess,
  jobCategoryHandlerFailure,
} from '../Reducers/getJobCategory';

const selectActor = (currState) => currState.actors.actor;
function* fetchJobCategoryHandler() {
  try {
    const actor = yield select(selectActor);
    const jobCategory = yield call([actor, actor.get_job_category]);
    yield put(jobCategoryHandlerSuccess(jobCategory));
  } catch (error) {
    yield put(jobCategoryHandlerFailure(error.toString()));
  }
}

export function* JobCategorySaga() {
  yield takeLatest(jobCategoryHandlerRequest.type, fetchJobCategoryHandler);
}
