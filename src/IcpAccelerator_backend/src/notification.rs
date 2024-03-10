use crate::mentor::{MentorInternal, MENTOR_REGISTRY};
use crate::rbac::{self, has_required_role, has_required_role_by_principal};
use candid::Principal;
use candid::{CandidType, Deserialize};
use ic_cdk::api::caller;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk_macros::{query, update};
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;
use std::fmt::format;
use std::io::Read;

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
struct ConnectionRequest {
    startup_id: Principal,
    mentor_id: Principal,
    message: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
enum NotificationType {
    ConnectionRequest(ConnectionRequest),

    ConnectionAcknowledgement {
        mentor_id: Principal,
        accepted: bool,
        social_handles: Option<String>, // Include this only if accepted
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct Notification {
    notification_type: NotificationType,
    read: bool,
}

thread_local! {
    static NOTIFICATIONS : RefCell<HashMap<Principal, Vec<Notification>>> = RefCell::new(HashMap::new());
}

// pub fn pre_upgrade_notifications() {
//     NOTIFICATIONS.with(|notifications| {
//         let serialized = bincode::serialize(&*notifications.borrow())
//             .expect("Serialization failed");
//         let mut writer = StableWriter::default();
//         writer.write(&serialized).expect("Failed to write to stable storage");
//     });
// }

// pub fn post_upgrade_notifications() {
//     let mut reader = StableReader::default();
//     let mut data = Vec::new();
//     reader.read_to_end(&mut data).expect("Failed to read from stable storage");
//     let notifications: HashMap<Principal, Vec<Notification>> = bincode::deserialize(&data)
//         .expect("Deserialization failed of notification");
//     NOTIFICATIONS.with(|notifications_ref| {
//         *notifications_ref.borrow_mut() = notifications;
//     });
// }

pub fn send_connection_request(mentor_id: Principal, msg: String) -> String {
    let my_id = caller();

    let required_role = [crate::UserRole::Project];

    if has_required_role(&required_role) {
        if has_required_role_by_principal(mentor_id, &[crate::UserRole::Mentor]) {
            let connection_request = ConnectionRequest {
                startup_id: my_id,
                mentor_id: mentor_id,
                message: msg,
            };

            let notification = Notification {
                notification_type: NotificationType::ConnectionRequest(connection_request),
                read: false,
            };

            add_notification(mentor_id, notification);
            format!("Request is sent to mentor with id : {}", mentor_id)
        } else {
            format!("Mentor with id : {} doesn't exist", mentor_id)
        }
    } else {
        format!("Project with id : {} doesn't exist", my_id)
    }
}

pub fn add_notification(mentor_id: Principal, notification: Notification) {
    NOTIFICATIONS.with(|notifications| {
        let mut notifications = notifications.borrow_mut();
        notifications
            .entry(mentor_id)
            .or_default()
            .push(notification)
    })
}

pub fn view_notifications(mentor_id: Principal) -> Vec<Notification> {
    // let mentor_id = caller();

    NOTIFICATIONS.with(|notifications| {
        notifications
            .borrow()
            .get(&mentor_id)
            .cloned()
            .unwrap_or_default()
    })
}

pub fn respond_to_connection_request(startup_id: Principal, accept: bool) -> String {
    let mentor_id = caller();
    let required_roles = [rbac::UserRole::Mentor];

    if has_required_role(&required_roles) {
        if has_required_role_by_principal(startup_id, &[rbac::UserRole::Project]) {
            let mentor_internal: Option<MentorInternal> =
                MENTOR_REGISTRY.with(|registry| registry.borrow().get(&mentor_id).cloned());

            if let Some(profile_internal) = mentor_internal {
                let social_handles = if accept {
                    Some(profile_internal.profile.social_link) // As String, wrap in Some for consistency
                } else {
                    None // When not accepted, there's no social link to share
                };

                let ack_notification = Notification {
                    notification_type: NotificationType::ConnectionAcknowledgement {
                        mentor_id,
                        accepted: accept,
                        social_handles: social_handles.map(|handles| handles), // Convert to Option<String>
                    },
                    read: false,
                };

                // Send acknowledgement notification to the startup
                add_notification(startup_id, ack_notification);

                "Acknowledgement sent to startup".to_string()
            } else {
                "Mentor profile not found".to_string()
            }
        } else {
            "The principal you are responding to has not created any project".to_string()
        }
    } else {
        "Mentor profile not found".to_string()
    }
}
