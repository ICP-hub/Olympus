export default function fetchRequestDocument(activeTab,role,actor) {
    if (activeTab) {
        let api_name = null;
        if (role === 'project') {
        switch (activeTab) {
            case 'pending':
                api_name = actor.get_all_pending_docs_access_requests()
                case 'approved':
                api_name = actor.get_all_approved_docs_access_requests()
                case 'declined':
                api_name = actor.get_all_declined_docs_access_requests()
                default:
                    api_name = null;
                    break;
            }}
            return api_name;
        }
        return null;
}