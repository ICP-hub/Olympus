import { takeLatest, call, put, select } from "redux-saga/effects";
import {
    getCurrentRoleStatusRequestHandler,
    getCurrentRoleStatusFailureHandler,
    setCurrentRoleStatus,
    setCurrentActiveRole,
    switchRoleRequestHandler,
    switchRoleRequestFailureHandler
} from '../Reducers/userCurrentRoleStatusReducer'


const selectActor = (currState) => currState.actors.actor;

// check if any role have status current ?? 
function getNameOfCurrentStatus(rolesStatusArray) {
    const currentStatus = rolesStatusArray.find(role => role.status === 'active');
    return currentStatus ? currentStatus.name : null;
}

function formatFullDateFromBigInt(bigIntDate) {
    const date = new Date(Number(bigIntDate / 1000000n));
    const dateString = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${dateString}`;
  }

function cloneArrayWithModifiedValues(arr) {
    return arr.map((obj) => {
        const modifiedObj = {};

        Object.keys(obj).forEach((key) => {
            if (Array.isArray(obj[key]) && obj[key].length > 0) {
                if (
                    key === "approved_on" ||
                    key === "rejected_on" ||
                    key === "requested_on"
                ) {
                    // const date = new Date(Number(obj[key][0])).toLocaleDateString('en-US');
                    const date = formatFullDateFromBigInt(obj[key][0]);
                    modifiedObj[key] = date; // Convert bigint to string date
                } else {
                    modifiedObj[key] = obj[key][0]; // Keep the first element of other arrays unchanged
                }
            } else {
                modifiedObj[key] = obj[key]; // Keep other keys unchanged
            }
        });

        return modifiedObj;
    });
}

function* fetchCurrentRoleStatus() {
    const actor = yield select(selectActor);
    if (actor) {
        const currentRoleArray = yield call([actor, actor.get_role_status]);
        if (currentRoleArray && currentRoleArray.length !== 0) {
            const currentActiveRole = yield call(getNameOfCurrentStatus, currentRoleArray)
            yield put(setCurrentRoleStatus(cloneArrayWithModifiedValues(currentRoleArray)));
            yield put(setCurrentActiveRole(currentActiveRole));
        } else {
            yield put(getCurrentRoleStatusFailureHandler('error-in-fetching-role'));
            yield put(setCurrentActiveRole(null));
        }
    }
    // try {
    //     const currentRoleArray = yield call([actor, actor.get_role_status]);
    //     if (currentRoleArray && currentRoleArray.length !== 0) {
    //         const currentActiveRole = getNameOfCurrentStatus(currentRoleArray);
    //         dispatch(
    //             setCurrentRoleStatus(cloneArrayWithModifiedValues(currentRoleArray))
    //         );
    //         dispatch(setCurrentActiveRole(currentActiveRole));
    //     } else {
    //         dispatch(
    //             getCurrentRoleStatusFailureHandler("error-in-fetching-role-at-header")
    //         );
    //         dispatch(setCurrentActiveRole(null));
    //     }
    // } catch (error) {
    //     dispatch(getCurrentRoleStatusFailureHandler(error.toString()));
    //     dispatch(setCurrentActiveRole(null));
    // }
    // try {
    //     const actor = yield select(selectActor);
    //     const currentRoleArray = yield call([actor, actor.get_role_status]);
    //     const currentActiveRole = yield call(getNameOfCurrentStatus, currentRoleArray)
    //     yield put(setCurrentRoleStatus(currentRoleArray));
    //     yield put(setCurrentActiveRole(currentActiveRole));
    // } catch (error) {
    //     yield put(getCurrentRoleStatusFailureHandler(error.toString()));
    //     yield put(setCurrentActiveRole(null));
    // }
}

function* switchRoleRequestHandlerFunc(action) {
    const { roleName, newStatus } = action.payload;
    try {
        const actor = yield select(selectActor);
        yield call([actor, actor.switch_role], roleName, newStatus);
        yield call(fetchCurrentRoleStatus);
    } catch (error) {
        yield put(switchRoleRequestFailureHandler(error.toString()));
    }
}

// function formatFullDateFromBigInt(bigIntDate) {
//     const date = new Date(Number(bigIntDate / 1000000n));
//     const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
//     return `${dateString}`;
// }


// function cloneArrayWithModifiedValues(arr) {
//     return arr.map(obj => {
//         const modifiedObj = {};

//         Object.keys(obj).forEach(key => {
//             if (Array.isArray(obj[key]) && obj[key].length > 0) {
//                 if (key === 'approved_on' || key === "rejected_on" || key === "requested_on") {
//                     // const date = new Date(Number(obj[key][0])).toLocaleDateString('en-US');
//                     const date = formatFullDateFromBigInt(obj[key][0]);
//                     modifiedObj[key] = date; // Convert bigint to string date
//                 } else {
//                     modifiedObj[key] = obj[key][0]; // Keep the first element of other arrays unchanged
//                 }
//             } else {
//                 modifiedObj[key] = obj[key]; // Keep other keys unchanged
//             }
//         });

//         return modifiedObj;
//     });
// }



// function* setCurrentRoleStatusHandlerFunc(action) {
//     const roleArray = action.payload;
//     console.log('roleArray ======>>>>>', roleArray)
//     const clonedArray = cloneArrayWithModifiedValues(roleArray)
//     console.log('clonedArray ======>>>>>', clonedArray)
//     // let clonedRoleArray = roleArray.map((val, index) => {
//     //     return ({ val?.name, val?.status })
//     // })

//     // for (let i = 0; i < clonedRoleArray.length; i++) {
//     //     const element = array[i];

//     // }
//     // try {
//     //     const actor = yield select(selectActor);
//     //     yield call([actor, actor.switch_role], roleName, newStatus);
//     //     // yield call(fetchCurrentRoleStatus());
//     // } catch (error) {
//     //     yield put(switchRoleRequestFailureHandler(error.toString()));
//     // }
// }

export function* userCurrentRoleSaga() {
    yield takeLatest(getCurrentRoleStatusRequestHandler().type, fetchCurrentRoleStatus);
    yield takeLatest(switchRoleRequestHandler().type, switchRoleRequestHandlerFunc);
    // yield takeLatest(setCurrentRoleStatus().type, setCurrentRoleStatusHandlerFunc);

}
