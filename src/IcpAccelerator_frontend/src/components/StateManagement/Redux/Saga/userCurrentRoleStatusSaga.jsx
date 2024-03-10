import { takeLatest, call, put, select } from "redux-saga/effects";
import { getCurrentRoleStatusRequestHandler, getCurrentRoleStatusFailureHandler, setCurrentRoleStatus, setCurrentActiveRole, newRoleOrSwitchRoleRequestHandler, newRoleOrSwitchRoleRequestFailureHandler } from '../Reducers/userCurrentRoleStatusReducer'


const selectActor = (currState) => currState.actors.actor;

// check if any role have status current ?? 
function getNameOfCurrentStatus(rolesStatusArray) {
    const currentStatus = rolesStatusArray.find(role => role.status === 'active');
    return currentStatus ? currentStatus.name : null;
}


function* fetchCurrentRoleStatus() {
    const currentRoleArray = [
        {
            name: 'user',
            status: 'active'
        },
        {
            name: 'project',
            status: 'default'
        },
        {
            name: 'mentor',
            status: 'default'
        },
        {
            name: 'vc',
            status: 'default'
        }
    ];

    try {
        const actor = yield select(selectActor);
        // const currentRoleArray = yield call([actor, actor.get_user_current_role_status]);
        const currentActiveRole = yield call(getNameOfCurrentStatus, currentRoleArray)
        yield put(setCurrentRoleStatus(currentRoleArray));
        yield put(setCurrentActiveRole(currentActiveRole));
    } catch (error) {
        yield put(getCurrentRoleStatusFailureHandler(error.toString()));
        yield put(setCurrentActiveRole(null));
    }
}

function* newRoleOrSwitchRoleRequestHandlerFunc(action) {
    const { calltype, roleName, newStatus } = action.payload;
    try {
        const actor = yield select(selectActor);
        if (calltype === 'switch') {
            yield call([actor, actor.request_for_switch_role]);
        } else {
            yield call([actor, actor.request_for_a_new_role]);
        }
        yield call(fetchCurrentRoleStatus());
    } catch (error) {
        yield put(newRoleOrSwitchRoleRequestFailureHandler(error.toString()));
    }
}

// export default function newRoleOrSwitchRoleRequestHandlerFunc(props) {
//     const { calltype, roleName, newStatus } = props;
//     console.log('props', props)
// try {
//     const actor = yield select(selectActor);
//     if (calltype === 'switch') {
//         yield call([actor, actor.request_for_switch_role]);
//     } else {
//         yield call([actor, actor.request_for_a_new_role]);
//     }
//     yield call(fetchCurrentRoleStatus());
// } catch (error) {
//     yield put(newRoleOrSwitchRoleRequestFailureHandler(error.toString()));
// }
// }

export function* userCurrentRoleSaga() {
    yield takeLatest(getCurrentRoleStatusRequestHandler().type, fetchCurrentRoleStatus);
    yield takeLatest(newRoleOrSwitchRoleRequestHandler().type, newRoleOrSwitchRoleRequestHandlerFunc);
}
