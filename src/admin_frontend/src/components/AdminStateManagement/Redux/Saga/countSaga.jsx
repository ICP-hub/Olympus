import { takeLatest, call, put, select } from "redux-saga/effects";
import { countSuccess, countFailure, checkCountStart } from "../Reducers/CountReducer";

const selectActor = (currState) => currState.actors.actor;


function* fetchCountHandler() {
  
  try {
    const actor = yield select(selectActor);
    // console.log('actor in fetchCountHandler => => => ', actor)

    const allCount = yield call([actor, actor.get_total_count]);

    const convertedCount = {
        user_count: Number(allCount.user_count),
        only_user_count: Number(allCount.only_user_count),
        mentor_count: Number(allCount.mentor_count),
        vc_count: Number(allCount.vc_count),
        project_count: Number(allCount.project_count),
      };
  

    // console.log('allCount aaya => ', convertedCount)

    yield put(countSuccess(convertedCount));
  } catch (error) {
    yield put(countFailure(error.toString()));
  }
}

export function* CountSaga() {
  yield takeLatest(checkCountStart.type, fetchCountHandler);
}
