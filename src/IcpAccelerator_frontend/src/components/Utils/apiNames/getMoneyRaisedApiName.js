export default function fetchRequestMoneyRaised(
  activeTab,
  role,
  actor,
  projectId
) {
  console.log('activeTab', activeTab);
  console.log('role', role);
  console.log('project_id', projectId);
  console.log('actor', actor);

  if (activeTab) {
    let api_data = null;
    if (role === 'project') {
      switch (activeTab) {
        case 'pending':
          api_data = actor.get_pending_money_requests(projectId);
          break; // Add break statement here
        case 'approved':
          api_data = actor.get_approved_money_requests(projectId);
          break; // Add break statement here
        case 'declined':
          api_data = actor.get_declined_money_requests(projectId);
          break; // Add break statement here
        default:
          api_data = null;
          break;
      }
    }
    console.log('api_data', api_data);
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
