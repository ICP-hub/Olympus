import { createSlice } from "@reduxjs/toolkit";

const initialRoleState = {
    // // NEW USER, NO ACCOUNT [NO ROLE ASSIGNED, NO ROLE GET FROM BACKEND] !!
    rolesStatusArray: [],

    // // NEW USER, NO ACCOUNT [NO ROLE ASSIGNED, GET ROLE FROM BACKEND] !!
    // rolesStatusArray: [
    //     {
    //         name: 'user',
    //         status: 'default'
    //     },
    //     {
    //         name: 'project',
    //         status: 'default'
    //     },
    //     {
    //         name: 'mentor',
    //         status: 'default'
    //     },
    //     {
    //         name: 'vc',
    //         status: 'default'
    //     }
    // ],
    
    // // REGISTERED AS A USER, [USER ROLE ASSIGNED] !!
    // rolesStatusArray: [
    //     {
    //         name: 'user',
    //         status: 'active'
    //     },
    //     {
    //         name: 'project',
    //         status: 'default'
    //     },
    //     {
    //         name: 'mentor',
    //         status: 'default'
    //     },
    //     {
    //         name: 'vc',
    //         status: 'default'
    //     }
    // ],

    // // REGISTERED AS A USER ALSO REQUEST FOR PROJECT ROLE [USER ROLE ASSIGNED] !!
    // rolesStatusArray: [
    //     {
    //         name: 'user',
    //         status: 'active'
    //     },
    //     {
    //         name: 'project',
    //         status: 'requested'
    //     },
    //     {
    //         name: 'mentor',
    //         status: 'default'
    //     },
    //     {
    //         name: 'vc',
    //         status: 'default'
    //     }
    // ],

    // // REGISTERED AS A USER ALSO REGISTERED AS A PROJECT ROLE [USER ROLE ASSIGNED & PROJECT ROLE ASSIGNED] !!
    // rolesStatusArray: [
    //     {
    //         name: 'user',
    //         status: 'active'
    //     },
    //     {
    //         name: 'project',
    //         status: 'approved'
    //     },
    //     {
    //         name: 'mentor',
    //         status: 'requested'
    //     },
    //     {
    //         name: 'vc',
    //         status: 'default'
    //     }
    // ],
    activeRole: null,
    loading: false,
    error: null,
};

const userCurrentRoleStatusSlice = createSlice({
    name: "userCurrentRoleStatus",
    initialState: initialRoleState,
    reducers: {

        getCurrentRoleStatusRequestHandler: (state) => {
            state.loading = true;
            state.error = null;
        },

        getCurrentRoleStatusFailureHandler: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        setCurrentRoleStatus: (state, action) => {
            state.rolesStatusArray = action.payload,
                state.loading = false,
                state.error = null
        },

        setCurrentActiveRole: (state, action) => {
            state.activeRole = action.payload
            state.loading = false,
                state.error = null
        },

        newRoleOrSwitchRoleRequestHandler: (state, action) => {
            state.loading = false,
            state.error = null
        },

        newRoleOrSwitchRoleRequestFailureHandler: (state, action) => {
            state.loading = false,
                state.error = action.payload
        },

        // newRoleRequestHandler: (state, action) => {
        //     const { roleName, newStatus } = action.payload;

        //     state.rolesStatusArray =
        //         state.rolesStatusArray.map(role =>
        //             role.name === roleName ? { ...role, status: newStatus } : role
        //         );
        //     state.loading = false;
        //     state.error = null;
        // },

        // switchRoleRequestHandler: (state, action) => {
        //     const { roleName, newStatus } = action.payload;

        //     state.rolesStatusArray =
        //         state.rolesStatusArray.map(role =>
        //             role.status === newStatus ? { ...role, status: 'approved' } : role
        //                 && role.name === roleName ? { ...role, status: newStatus } : role
        //         );
        //     state.loading = false;
        //     state.error = null;
        // },
    },
});

export const { getCurrentRoleStatusRequestHandler, getCurrentRoleStatusFailureHandler, setCurrentRoleStatus, setCurrentActiveRole, newRoleOrSwitchRoleRequestHandler, newRoleOrSwitchRoleRequestFailureHandler } =
    userCurrentRoleStatusSlice.actions;

export default userCurrentRoleStatusSlice.reducer;
