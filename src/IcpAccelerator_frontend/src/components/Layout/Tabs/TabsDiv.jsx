
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { switchRoleRequestHandler } from '../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer';

export default function TabsDiv({ role, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const commonCss = "border-2 border-gray-400 flex items-baseline justify-between p-4 rounded-full bg-gradient-to-l to-white ease-in-out duration-500 transition-colors transform";
    const activeCss = `${commonCss} cursor-not-allowed from-green-500 hover:from-green-600 hover:to-green-300`;
    const approvedCss = `${commonCss} cursor-pointer from-blue-500 hover:from-blue-600 hover:to-blue-300`;
    const requestedCss = `${commonCss} cursor-not-allowed from-red-500 hover:from-red-600 hover:to-red-300`;
    const defaultCss = `${commonCss} cursor-pointer from-blue-300 hover:from-blue-400 hover:to-blue-200`;

    const redirectPath = (val) => {
        switch (val) {
            case 'project':
                return '/create-project'
            case 'mentor':
                return '/create-mentor'
            case 'vc':
                return '/create-vc'
            default:
                return '/';
        }
    }

    const clickEventHandler = async (roleName, status) => {
        if (status === 'request') {
            navigate(redirectPath(roleName));
            onClose();
        } else if (status === 'switch') {
            await dispatch(switchRoleRequestHandler({
                roleName,
                newStatus: 'active'
            }));
            onClose();
            window.location.href = "/";
        } else { }
    }


    const getSpans = (css, roleName, status) => {
        return (
            <div className={css} onClick={() => clickEventHandler(roleName, status)}>
                <span className="font-semibold text-xl uppercase">{roleName}</span>
                <span className="text-white text-xl capitalize">{status}</span>
            </div>
        )
    };

    switch (role?.status) {
        case 'active':
            return getSpans(activeCss, role?.name, 'current')
        case 'approved':
            return getSpans(approvedCss, role?.name, 'switch')
        case 'requested':
            return getSpans(requestedCss, role?.name, 'pending')
        case 'default':
            return getSpans(defaultCss, role?.name, 'request')
        default:
            return null;
    }
}