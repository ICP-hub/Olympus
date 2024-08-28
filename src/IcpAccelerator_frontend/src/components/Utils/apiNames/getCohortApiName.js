export default function fetchRequestCohort(activeTab, role, actor, principal) {
    console.log('activeTab', activeTab);
    console.log('role', role);
    console.log('principal', principal.toText());

    if (activeTab) {
        let api_name = null;
        if (role === 'mentor') {
            switch (activeTab) {
                case 'pending':
                    api_name = actor.get_my_pending_enrollment_requests(principal);
                    break;
                case 'approved':
                    api_name = actor.get_my_approved_enrollment_requests(principal);
                    break;
                case 'declined':
                    api_name = actor.get_my_rejected_enrollment_requests(principal);
                    break;
                default:
                    api_name = null;
                    break;
            }
        }
        return api_name;
    }
    return null;
}
