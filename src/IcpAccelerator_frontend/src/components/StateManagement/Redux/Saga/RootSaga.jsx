import { all } from 'redux-saga/effects';
import { roleSaga } from './RoleSaga';
import { allHubsSaga } from './AllHub';
import { internetIdentitySaga } from './InternetIdentitySaga';
import { actorSaga } from './actorBindSaga';
import { userRoleSaga } from './userRoleSaga';
import { fetchFounderSaga } from './founderSaga';
import { fetchHubSaga } from './hubSaga';
import { fetchInvestorSaga } from './investorSaga';
import { fetchMentorSaga } from './mentorSaga';
import { expertiseInSaga } from './areaOfExpertiseSaga';
import { typeOfProfileSaga } from './typeOfProfileSaga';
import { JobCategorySaga } from './jobCategorySaga';
import { userCurrentRoleSaga } from './userCurrentRoleStatusSaga';
import { fetchUserSaga } from './userSaga';
import { chainsSaga } from './multiChainSaga';

export default function* rootSaga() {
  yield all([
    roleSaga(),
    allHubsSaga(),
    internetIdentitySaga(),
    actorSaga(),
    userRoleSaga(),
    fetchUserSaga(),
    fetchFounderSaga(),
    fetchHubSaga(),
    fetchInvestorSaga(),
    fetchMentorSaga(),
    expertiseInSaga(),
    typeOfProfileSaga(),
    chainsSaga(),
    userCurrentRoleSaga(),
    JobCategorySaga(),
  ]);
}
