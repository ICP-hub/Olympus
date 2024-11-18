use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use sha2::Digest;

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
pub enum NotificationStatus {
    Read,
    Unread
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum NotificationApprovalStatus {
    Pending,
    Accepted,
    Declined
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NotificationStructure{
    pub unique_id: String,
    pub sender_principal: Principal,
    pub receiver_principal: Principal,
    pub sender_data: UserInfoInternal,
    pub receiver_data: UserInfoInternal,
    pub notification_data: NotificationInternal,
    pub sent_at: u64,
    pub status: NotificationStatus,
    pub approval_status: NotificationApprovalStatus,
}

pub async fn add_notification(sender_principal: Principal, receiver_principal: Principal, noti_data: NotificationInternal, initial_approval_status: NotificationApprovalStatus) -> Result<String, String> {
    let sender_user_data = get_user_info_using_principal(sender_principal).unwrap();
    let receiver_user_data = get_user_info_using_principal(receiver_principal).unwrap();

    let uuids = ic_cdk::api::management_canister::main::raw_rand().await.unwrap().0;
    let uid = format!("{:x}", sha2::Sha256::digest(&uuids));
    let unique_id = uid[..6].to_string();

    let notification = NotificationStructure {
        unique_id: unique_id.clone(),
        sender_principal: sender_principal,
        receiver_principal: receiver_principal,
        sender_data: sender_user_data,
        receiver_data: receiver_user_data,
        notification_data: noti_data,
        sent_at: ic_cdk::api::time(),
        status: NotificationStatus::Unread,
        approval_status: initial_approval_status     
    };

    mutate_state(|state| {
        //state.request_to_notification_map.insert(request_id, unique_id);
        let mut notifications = state.notification_data.remove(&StoredPrincipal(receiver_principal)).unwrap_or_else(|| Candid(Vec::new()));

        notifications.0.push(notification);

        state.notification_data.insert(StoredPrincipal(receiver_principal), notifications);
    });
    Ok("Notification added successfully.".to_string())
}

#[ic_cdk::query]
pub fn get_notifications_by_principal(receiver_principal: Principal) -> Result<Vec<NotificationStructure>, String> {
    read_state(|state| {
        if let Some(notifications) = state.notification_data.get(&StoredPrincipal(receiver_principal)) {
            Ok(notifications.0.clone())
        } else {
            Err("No notifications found for the specified principal.".to_string())
        }
    })
}


#[ic_cdk::update]
pub fn mark_notification_as_read(receiver_principal: Principal, notification_index: usize) -> Result<String, String> {
    mutate_state(|state| {
        if let Some(mut notifications) = state.notification_data.get(&StoredPrincipal(receiver_principal)) {
            if notification_index < notifications.0.len() {
                notifications.0[notification_index].status = NotificationStatus::Read;
                return Ok("Notification marked as read.".to_string());
            }
        }
        Err("Notification not found.".to_string())
    })
}

#[ic_cdk::update]
pub fn mark_notification_as_unread(receiver_principal: Principal, notification_index: usize) -> Result<String, String> {
    mutate_state(|state| {
        if let Some(mut notifications) = state.notification_data.get(&StoredPrincipal(receiver_principal)) {
            if notification_index < notifications.0.len() {
                notifications.0[notification_index].status = NotificationStatus::Unread;
                return Ok("Notification marked as unread.".to_string());
            }
        }
        Err("Notification not found.".to_string())
    })
}

// #[ic_cdk::update]
// pub fn update_notification_approval_status(receiver_principal: Principal, notification_index: usize, new_status: NotificationApprovalStatus) -> Result<String, String> {
//     mutate_state(|state| {
//         if let Some(notifications) = state.notification_data.get(&StoredPrincipal(receiver_principal)) {
//             if notification_index < notifications.0.len() {
//                 notifications.0[notification_index].approval_status = new_status;
//                 return Ok(format!("Notification approval status updated to {:?}.", new_status));
//             }
//         }
//         Err("Notification not found.".to_string())
//     })
// }


