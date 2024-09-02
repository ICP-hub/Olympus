export default function fetchRequestMoneyRaised(activeTab,role,actor,projectId) {
    if (activeTab) {
        let api_data = null;
        if (role === 'project') {
        switch (activeTab) {
            case 'pending':
                api_data = actor.get_pending_money_requests(projectId)
                case 'approved':
                api_data = actor.get_approved_money_requests(projectId)
                case 'declined':
                api_data = actor.get_declined_money_requests(projectId)
                default:
                    api_data = null;
                    break;
            }}
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
