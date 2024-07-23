
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { switchRoleRequestHandler } from '../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer';

export default function ButtonDiv({ role, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const redirectPath =
            role?.name === 'project'
            ? '/create-project'
            : role?.name === 'mentor'
                ? '/create-mentor'
                : role?.name === 'vc'
                    ? '/create-investor'
                    : '/';

    if (role?.status === 'active') {
        return (
            <div className="font-semibold text-xl w-2/6">
                <button className="text-gray-100 py-1 px-2 rounded-md w-full bg-green-600 capitalize cursor-not-allowed" disabled={true}>
                    current
                </button>
            </div>
        )
    } else if (role?.status === 'approved') {
        return (
            <div className="font-semibold text-xl w-2/6">
                <button className="text-white py-1 px-2 rounded-md w-full bg-blue-500 capitalize"
                    onClick={() => dispatch(switchRoleRequestHandler({ roleName: role?.name, newStatus: 'active' }))}>
                    switch
                </button>
            </div>
        )
    } else if (role?.status === 'requested') {
        return (
            <div className="font-semibold text-xl w-2/6">
                <button className="text-white py-1 px-2 rounded-md w-full bg-red-500 capitalize cursor-not-allowed" disabled={true}>
                    pending
                </button>
            </div>
        )
    } else if (role?.status === 'default') {
        return (
            <div className="font-semibold text-xl w-2/6">
                <button className="text-black py-1 px-2 rounded-md w-full bg-blue-300 capitalize"
                    // onClick={() => dispatch(switchRoleRequestHandler({ roleName: role?.name, newStatus: 'requested' }))}>
                    onClick={() => { navigate(redirectPath); onClose() }}>
                    request
                </button>
            </div>
        )
    } else {
        return null
    }
}