export default function fetchRequestDocument(activeTab, role, actor) {
  if (activeTab) {
    let api_data = null;
    if (role === 'project') {
      switch (activeTab) {
        case 'pending':
          api_data = actor.get_all_pending_docs_access_requests();
          break;
        case 'approved':
          api_data = actor.get_all_approved_docs_access_requests();
          break;
        case 'declined':
          api_data = actor.get_all_declined_docs_access_requests();
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
