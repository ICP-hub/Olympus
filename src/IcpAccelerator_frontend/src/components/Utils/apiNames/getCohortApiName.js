export default function fetchRequestCohort(activeTab, role, actor, principal) {
    console.log('activeTab', activeTab);
    console.log('role', role);
    console.log('principal', principal.toText());

    if (activeTab) {
        let api_data = null;
        if (role === 'mentor' || role ==='project' ||role ==='vc') {
            switch (activeTab) {
                case 'pending':
                    api_data = actor.get_my_pending_enrollment_requests(principal);
                    break;
                case 'approved':
                    api_data = actor.get_my_approved_enrollment_requests(principal);
                    break;
                case 'declined':
                    api_data = actor.get_my_rejected_enrollment_requests(principal);
                    break;
                default:
                    api_data = null;
                    break;
            }
        }
         return {
            activeTab,
            role,
            api_data,
        };
    }
    return {
        activeTab,
        role,
        api_data: null,
    };
}
