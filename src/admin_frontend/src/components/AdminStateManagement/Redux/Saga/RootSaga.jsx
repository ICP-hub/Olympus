import { all } from 'redux-saga/effects';
import { actorSaga } from './actorBindSaga';
import { fetchInvestorApprovedSaga } from './investorApprovedSaga';
import { fetchInvestorDeclinedSaga } from './investorDeclinedSaga';
import { fetchInvestorPendingSaga } from './investorPendingSaga';
import { fetchMentorApprovedSaga } from './mentorApprovedSaga';
import { fetchMentorDeclinedSaga } from './mentorDeclinedSaga';
import { fetchMentorPendingSaga } from './mentorPendingSaga';
import { fetchProjectApprovedSaga } from './projectApprovedSaga';
import { fetchProjectDeclinedSaga } from './ProjectDeclinedSaga';
import { fetchProjectPendingSaga } from './ProjectPendingSaga';
import { CountSaga } from './countSaga';
import { cycleSaga } from './cycleSaga';
import { totalPendingSaga } from './totalPendingSaga';
import { notificationSaga } from './notification';

export default function* rootSaga() {
    yield all([
        actorSaga(),
        fetchInvestorApprovedSaga(),
        fetchInvestorDeclinedSaga(),
        fetchInvestorPendingSaga(),
        fetchMentorApprovedSaga(),
        fetchMentorDeclinedSaga(),
        fetchMentorPendingSaga(),
        fetchProjectApprovedSaga(),
        fetchProjectDeclinedSaga(),
        fetchProjectPendingSaga(),
        notificationSaga(),
        CountSaga(),
        cycleSaga(),
        totalPendingSaga()
    ]);
}
