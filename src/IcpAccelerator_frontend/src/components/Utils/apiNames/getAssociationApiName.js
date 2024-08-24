
export default function fetchRequestAssociation(activeTab, selectedStatus, role) {
    console.log('activeTab',activeTab)
    console.log('selectedStatus',selectedStatus)
    console.log('role',role)

    if (activeTab && selectedStatus && role) {
        let api_name = null;
        switch (activeTab) {
            case 'pending':
                switch (role) {
                    case 'project':
                        switch (selectedStatus) {
                            case 'to-mentor':
                                api_name = `get_pending_request_from_mentor_to_project_via_project()`;
                                break;
                            case 'from-mentor':
                                api_name = `get_all_offers_which_are_pending_for_project_from_mentor(${project_id})`;
                                break;
                            case 'to-investor':
                                api_name = `get_pending_request_for_investor_sent_by_project(${principal})`;
                                break;
                            case 'from-investor':
                                api_name = `get_all_offers_which_are_pending_for_project_from_investor(${project_id})`;
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'get_all_offers_which_are_pending_for_mentor_via_mentor()';
                                break;
                            case 'from-project':
                                api_name = `get_pending_request_from_project_to_mentor_via_project(${principal})`;
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'get_all_offers_which_are_pending_for_investor()';
                                break;
                            case 'from-project':
                                api_name = `get_pending_request_for_investor_sent_by_project(${principal})`;
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
                                api_name = 'get_approved_request_from_project_to_mentor_via_project()';
                                break;
                            case 'from-mentor':
                                api_name = `get_all_requests_which_got_accepted_for_project_from_mentor(${project_id})`;
                                break;
                            case 'to-investor':
                                api_name = `get_accepted_request_of_project_by_investor(${project_id})`;
                                break;
                            case 'from-investor':
                                api_name = `get_all_requests_which_got_accepted_by_project_of_investor(${project_id})`;
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'get_all_requests_which_got_accepted_for_mentor_via_mentor()';
                                break;
                            case 'from-project':
                                api_name = `get_approved_request_from_mentor_to_project_via_project(${principal})`;
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'get_all_requests_which_got_accepted_for_investor()';
                                break;
                            case 'from-project':
                                api_name = 'get_accepted_request_for_investor()';
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
                                api_name = 'get_declined_request_from_project_to_mentor_via_project()';
                                break;
                            case 'from-mentor':
                                api_name = `get_all_requests_which_got_declined_for_project_from_mentor(${project_id})`;
                                break;
                            case 'to-investor':
                                api_name = `get_declined_request_of_project_by_investor(${project_id})`;
                                break;
                            case 'from-investor':
                                api_name = `get_all_requests_which_got_declined_by_project_of_investor(${project_id})`;
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'get_all_requests_which_got_declined_for_mentor_via_mentor()';
                                break;
                            case 'from-project':
                                api_name = `get_declined_request_from_mentor_to_project_via_project(${principal})`;
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'get_all_requests_which_got_declined_for_investor()';
                                break;
                            case 'from-project':
                                api_name = 'get_declined_request_for_investor()';
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
                                api_name = 'get_self_declined_requests_for_project()';
                                break;
                            case 'from-mentor':
                                api_name = `get_all_requests_which_got_self_declined_for_project(${project_id})`;
                                break;
                            case 'to-investor':
                                api_name = `get_self_declined_requests_of_project(${project_id})`;
                                break;
                            case 'from-investor':
                                api_name = 'get_all_requests_which_got_self_declined_by_project()';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'mentor':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = 'get_all_requests_which_got_self_declined_for_mentor_via_mentor()';
                                break;
                            case 'from-project':
                                api_name = 'get_self_declined_requests_for_mentor()';
                                break;
                            default:
                                api_name = null;
                                break;
                        }
                        break;
                    case 'vc':
                        switch (selectedStatus) {
                            case 'to-project':
                                api_name = `get_all_requests_which_got_self_declined_by_investor(${project_id})`;
                                break;
                            case 'from-project':
                                api_name = 'get_self_declined_requests_for_investor()';
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