export default function fetchRequestMoneyRaised(activeTab,role,actor,projectId) {
    if (activeTab) {
        let api_name = null;
        if (role === 'project') {
        switch (activeTab) {
            case 'pending':
                api_name = actor.get_pending_money_requests(projectId)
                case 'approved':
                api_name = actor.get_approved_money_requests(projectId)
                case 'declined':
                api_name = actor.get_declined_money_requests(projectId)
                default:
                    api_name = null;
                    break;
            }}
            return api_name;
        }
        return null;
    }
