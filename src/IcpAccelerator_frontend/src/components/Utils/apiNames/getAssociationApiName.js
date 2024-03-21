
export default function fetchRequestFromUtils(activeTab, selectedStatus, role) {
    if (activeTab && selectedStatus && role) {
        let api_name = null;
        switch (activeTab) {
            case 'pending':
                switch (role) {
                    case 'project':
                        switch (selectedStatus) {
                            case 'to-mentor':
                                api_name = 'api_to_get_pending_request_from_project_to_mentor';
                                break;
                            case 'from-mentor':
                                api_name = 'api_to_get_pending_request_from_mentor_to_project';
                                break;
                            case 'to-investor':
                                api_name = 'api_to_get_pending_request_from_project_to_investor';
                                break;
                            case 'from-investor':
                                api_name = 'api_to_get_pending_request_from_investor_to_project';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_pending_request_from_mentor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_pending_request_from_project_to_mentor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_pending_request_from_investor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_pending_request_from_project_to_investor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    default:
                        api_name = null;
                        break;
                }
                break;
            case 'approved':
                switch (role) {
                    case 'project':
                        switch (selectedStatus) {
                            case 'to-mentor':
                                api_name = 'api_to_get_approved_request_from_project_to_mentor';
                                break;
                            case 'from-mentor':
                                api_name = 'api_to_get_approved_request_from_mentor_to_project';
                                break;
                            case 'to-investor':
                                api_name = 'api_to_get_approved_request_from_project_to_investor';
                                break;
                            case 'from-investor':
                                api_name = 'api_to_get_approved_request_from_investor_to_project';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_approved_request_from_mentor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_approved_request_from_project_to_mentor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_approved_request_from_investor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_approved_request_from_project_to_investor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    default:
                        api_name = null;
                        break;
                }
                break;
            case 'declined':
                switch (role) {
                    case 'project':
                        switch (selectedStatus) {
                            case 'to-mentor':
                                api_name = 'api_to_get_declined_request_from_project_to_mentor';
                                break;
                            case 'from-mentor':
                                api_name = 'api_to_get_declined_request_from_mentor_to_project';
                                break;
                            case 'to-investor':
                                api_name = 'api_to_get_declined_request_from_project_to_investor';
                                break;
                            case 'from-investor':
                                api_name = 'api_to_get_declined_request_from_investor_to_project';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_declined_request_from_mentor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_declined_request_from_project_to_mentor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_declined_request_from_investor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_declined_request_from_project_to_investor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    default:
                        api_name = null;
                        break;
                }
                break;
            case 'self-reject':
                switch (role) {
                    case 'project':
                        switch (selectedStatus) {
                            case 'to-mentor':
                                api_name = 'api_to_get_self_reject_request_from_project_to_mentor';
                                break;
                            case 'from-mentor':
                                api_name = 'api_to_get_self_reject_request_from_mentor_to_project';
                                break;
                            case 'to-investor':
                                api_name = 'api_to_get_self_reject_request_from_project_to_investor';
                                break;
                            case 'from-investor':
                                api_name = 'api_to_get_self_reject_request_from_investor_to_project';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_self_reject_request_from_mentor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_self_reject_request_from_project_to_mentor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'api_to_get_self_reject_request_from_investor_to_project';
                                break;
                            case 'from-project':
                                api_name = 'api_to_get_self_reject_request_from_project_to_investor';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    default:
                        api_name = null;
                        break;
                }
                break;
            default:
                api_name = null;
                break;
        }
        return api_name;
    }
    return null;
}