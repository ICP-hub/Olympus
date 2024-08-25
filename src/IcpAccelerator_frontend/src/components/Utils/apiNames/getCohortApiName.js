export default function fetchRequestCohort(activeTab,role,actor,principal) {
    console.log('activeTab',activeTab)
    console.log('role',role)
    console.log('actor',principal)
    if (activeTab) {
        let api_name = null;
        if (role === 'mentor') {
        switch (activeTab) {
            case 'pending':
                api_name = actor.get_my_pending_enrollment_requests(principal)
                case 'approved':
                api_name = actor.get_my_approved_enrollment_requests(principal)
                case 'declined':
                api_name = actor.get_my_rejected_enrollment_requests(principal)
                default:
                    api_name = null;
                    break;
            }}
            return api_name;
        }
        return null;
}