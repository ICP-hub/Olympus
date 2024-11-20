use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

use crate::{state_handler::{mutate_state, read_state, Candid, StoredPrincipal}, user_modules::get_user::get_user_info_using_principal, AccessRequest, CohortEnrollmentRequest, MentorInternal, ProjectInfoInternal, UserInfoInternal, VentureCapitalist};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AssociationNotificationProjectToInvestor{
    pub sender_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub reciever_data: Option<(VentureCapitalist, UserInfoInternal)>,
    pub offer: String,
    pub sent_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AssociationNotificationProjectToMentor{
    pub sender_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub reciever_data: Option<(MentorInternal, UserInfoInternal)>,
    pub offer: String,
    pub sent_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AssociationNotificationInvestorToProject{
    pub sender_data: Option<(VentureCapitalist, UserInfoInternal)>,
    pub reciever_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub offer: String,
    pub sent_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AssociationNotificationMentorToProject{
    pub sender_data: Option<(MentorInternal, UserInfoInternal)>,
    pub reciever_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub offer: String,
    pub sent_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AssociationNotification{
    pub project_to_investor_noti: Option<AssociationNotificationProjectToInvestor>,
    pub project_to_mentor_noti: Option<AssociationNotificationProjectToMentor>,
    pub investor_to_project_noti: Option<AssociationNotificationInvestorToProject>,
    pub mentor_to_project_noti: Option<AssociationNotificationMentorToProject>
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NotificationInternal{
    pub cohort_noti: Option<Vec<CohortEnrollmentRequest>>,
    pub docs_noti: Option<Vec<AccessRequest>>,
    pub money_noti: Option<Vec<AccessRequest>>,
    pub association_noti: Option<Vec<AssociationNotification>>
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NotificationStructure{
    pub sender_principal: Principal,
    pub receiver_principal: Principal,
    pub sender_data: UserInfoInternal,
    pub receiver_data: UserInfoInternal,
    pub notification_data: NotificationInternal,
    pub sent_at: u64,
}

#[ic_cdk::update]
pub fn add_notification(sender_principal: Principal, receiver_principal: Principal, noti_data: NotificationInternal,) -> Result<String, String> {
    let sender_user_data = get_user_info_using_principal(sender_principal).unwrap();
    let receiver_user_data = get_user_info_using_principal(receiver_principal).unwrap();
    let notification = NotificationStructure {
        sender_principal: sender_principal,
        receiver_principal: receiver_principal,
        sender_data: sender_user_data,
        receiver_data: receiver_user_data,
        notification_data: noti_data,
        sent_at: ic_cdk::api::time(),
    };

    mutate_state(|state| {
        // Remove the existing notifications vector to update it
        let mut notifications = state.notification_data.remove(&StoredPrincipal(receiver_principal)).unwrap_or_else(|| Candid(Vec::new()));

        // Append the new notification to the vector
        notifications.0.push(notification);

        // Re-insert the updated notifications vector back into the map
        state.notification_data.insert(StoredPrincipal(receiver_principal), notifications);
    });
    Ok("Notification added successfully.".to_string())
}

#[ic_cdk::query]
pub fn get_notifications_by_principal(receiver_principal: Principal) -> Result<Vec<NotificationStructure>, String> {
    // Attempt to read state to find notifications for the given receiver
    read_state(|state| {
        if let Some(notifications) = state.notification_data.get(&StoredPrincipal(receiver_principal)) {
            // Return a clone of the notifications vector if found
            Ok(notifications.0.clone())
        } else {
            // If no notifications are found, return an error
            Err("No notifications found for the specified principal.".to_string())
        }
    })
}