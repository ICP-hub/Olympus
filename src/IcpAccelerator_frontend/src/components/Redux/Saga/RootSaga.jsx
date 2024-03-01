import { all } from 'redux-saga/effects';
import { walletSagas } from './AuthSaga';
 import { roleSaga } from './RoleSaga';
import { allHubsSaga } from './AllHub';
import { internetIdentitySaga } from './InternetIdentitySaga';
import { actorSaga } from './actorBindSaga';
import { userRoleSaga } from './userRoleSaga';
import { fetchFounderSaga } from './founderSaga';
import { fetchHubSaga } from './hubSaga';
import { fetchInvestorSaga } from './investorSaga';
import { fetchMentorSaga } from './mentorSaga';
export default function* rootSaga() {
    yield all([
        walletSagas(),
        roleSaga(),
        allHubsSaga(),
        internetIdentitySaga(),
        actorSaga(),
        userRoleSaga(),
        fetchFounderSaga(),
        fetchHubSaga(),
        fetchInvestorSaga(),
        fetchMentorSaga()
    ]);
}
