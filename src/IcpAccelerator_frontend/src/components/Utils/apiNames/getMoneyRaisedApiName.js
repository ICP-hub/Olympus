export default function fetchRequestMoneyRaised(activeTab) {
    if (activeTab) {
        let api_name = null;
        switch (activeTab) {
            case 'pending':
                api_name = 'api';
                case 'approved':
                api_name = 'api';
                case 'declined':
                api_name = 'api';
                default:
                    api_name = null;
                    break;
            }
            return api_name;
        }
        return null;
    }
