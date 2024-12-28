import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
} from '../Reducers/getAllUsersReducer';

// Mock API call function
async function fetchUsersApi(actor, page, itemsPerPage) {
  return await actor.list_all_users({
    page_size: itemsPerPage,
    page,
  });
}
function uint8ArrayToBase64(uint8Arr) {
  console.log('uint8Arr', uint8Arr);
  if (!uint8Arr || uint8Arr.length === 0 || !uint8Arr[0]) {
    console.error('Invalid Uint8Array provided:', uint8Arr);
    return '';
  }

  var rawString = new TextDecoder().decode(uint8Arr[0]);
  var canister_id = rawString.split('/')[0];
  var key = rawString.substring(rawString.indexOf('/'));

  var finalString = '';
  if (process.env.DFX_NETWORK === 'ic') {
    finalString = 'https://' + canister_id + '.icp0.io' + key;
  } else {
    finalString = 'http://' + canister_id + '.localhost:4943' + key;
  }

  return finalString;
}

function* fetchUsers(action) {
  try {
    const { actor, page, itemsPerPage } = action.payload;
    const result = yield call(fetchUsersApi, actor, page, itemsPerPage);

    if (result) {
      //       const updatedResult = result.map(user => {
      // console.log('user',user)
      //         if (user?.profile_picture?.length > 0) {
      //           const updatedProfilePicture = uint8ArrayToBase64(user?.profile_picture[0]);
      //           return {
      //             ...user,
      //             profile_picture: [updatedProfilePicture],
      //           };
      //         }
      //         return user;
      //       });

      yield put(
        fetchUsersSuccess({
          users: result,
          currentPage: page,
          hasMore: result.length === itemsPerPage,
        })
      );
    } else {
      yield put(
        fetchUsersSuccess({
          users: [],
          currentPage: page,
          hasMore: false,
        })
      );
    }
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

export function* GetAllUserSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsers);
}
