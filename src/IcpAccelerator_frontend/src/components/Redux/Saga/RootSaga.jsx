import { all } from 'redux-saga/effects';
import { walletSagas } from './AuthSaga';
 import { roleSaga } from './RoleSaga';
import { allHubsSaga } from './AllHub';
import { internetIdentitySaga } from './InternetIdentitySaga';
import { actorSaga } from './actorBindSaga';

export default function* rootSaga() {
    yield all([
        walletSagas(),
        roleSaga(),
        allHubsSaga(),
        internetIdentitySaga(),
        actorSaga()
    ]);
}
