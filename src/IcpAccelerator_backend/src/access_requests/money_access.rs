use crate::state_handler::*;
use crate::user_modules::get_user::*;
use crate::user_modules::user_types::*;
use crate::project_module::project_types::*;
use crate::types::individual_types::*;
use crate::guard::*;
use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_cdk::api::caller;

#[update(guard = "is_user_anonymous")]
pub async fn send_money_access_request(project_id: String) -> String {
    let caller = caller();
    let mut has_pending_request = false;

    let has_pending_request_result = read_state(|state| {
        // Check if the caller exists in the HashMap
        if let Some(request_vec) = state.money_access_request.get(&StoredPrincipal(caller)) {
            // Iterate through the Vec<AccessRequest> to find a matching and pending project_id request
            has_pending_request = request_vec
                .0
                .iter()
                .any(|request| request.project_id == project_id && request.status == "pending");
        }
        has_pending_request
    });

    if has_pending_request_result {
        return "You already have a pending request for this project.".to_string();
    }

    let user_data: Result<UserInformation, &str> = get_user_information();

    // Assuming the existence of get_user_info() which might fail hence the unwrap_or_else pattern
    let user_data = user_data.unwrap_or_else(|_| panic!("Failed to get user data"));

    let access_request = AccessRequest {
        sender: caller.clone(), // Assuming caller() gives us Principal
        name: user_data.full_name,
        image: user_data.profile_picture.expect("Profile picture not found"),
        project_id: project_id.clone(),
        request_type: "money_details_access".to_string(),
        status: "pending".to_string(),
    };

    // Add request to the MONEY_ACCESS_REQUESTS hashmap
    mutate_state(|state| {
        if let Some(mut request_vec) = state.money_access_request.get(&StoredPrincipal(caller)) {
            request_vec.0.push(access_request.clone());
        } else {
            state.money_access_request.insert(
                StoredPrincipal(caller),
                Candid(vec![access_request.clone()]),
            );
        }
    });

    // Create and send a notification for the request
    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()),
        timestamp: time(), 
    };

    mutate_state(|state| {
        if let Some(mut notifications) = state.project_access_notifications.get(&project_id) {
            notifications.0.push(notification_to_send);
        } else {
            state
                .project_access_notifications
                .insert(project_id.clone(), Candid(vec![notification_to_send]));
        }
    });

    "Your access request has been sent and is pending approval.".to_string()
}

fn add_user_to_money_access(project_id: String, user: Principal) {
    mutate_state(|state| {
        if let Some(mut access_list) = state.money_access.get(&project_id) {
            access_list.0.push(user);
        } else {
            state.money_access.insert(project_id, Candid(vec![user]));
        }
    });
}

#[update(guard = "is_user_anonymous")]
pub async fn approve_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state.money_access_request.get(&StoredPrincipal(sender_id)) {
            for request in request_vec.0.iter_mut() {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "approved".to_string();
                    request_found_and_updated = true;
                    break;
                }
            }
        }
    });

    if !request_found_and_updated {
        return "Request not found or already approved.".to_string();
    }

    // Update the status in PROJECT_ACCESS_NOTIFICATIONS
    mutate_state(|state| {
        if let Some(mut notification_vec) = state.project_access_notifications.get(&project_id) {
            for notification in notification_vec.0.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "money_details_access" =>
                    {
                        access_request.status = "approved".to_string();
                        break; // Exit after finding and updating the first matching request
                    }
                    _ => {} // Do nothing for other cases or variants
                }
            }
        }
    });

    // Assuming the existence of a function or mechanism to add the sender's Principal to a money_access vector
    add_user_to_money_access(project_id, sender_id);

    "Money access request approved successfully.".to_string()
}

#[update(guard = "is_user_anonymous")]
pub fn decline_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state.money_access_request.get(&StoredPrincipal(sender_id)) {
            for request in request_vec.0.iter_mut() {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "declined".to_string();
                    request_found_and_updated = true;
                    break;
                }
            }
        }
    });

    if !request_found_and_updated {
        return "Request not found or not in pending status.".to_string();
    }

    // Update the status in PROJECT_ACCESS_NOTIFICATIONS
    mutate_state(|state| {
        if let Some(mut notification_vec) = state.project_access_notifications.get(&project_id) {
            for notification in notification_vec.0.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "money_details_access" =>
                    {
                        access_request.status = "declined".to_string();
                        break;
                    }
                    _ => {} // Do nothing for other types or statuses
                }
            }
        }
    });

    "Money access request declined successfully.".to_string()
}

#[query(guard = "is_user_anonymous")]
pub fn get_pending_money_requests(project_id: String) -> Vec<ProjectNotification> {
    read_state(
        |state| match state.project_access_notifications.get(&project_id) {
            Some(info) => info.0.iter()
                .filter(|notif| match &notif.notification_type {
                    ProjectNotificationType::AccessRequest(access_request) => 
                        access_request.request_type == "money_details_access" && 
                        access_request.status == "pending",
                })
                .cloned()
                .collect(),
            None => Vec::new(),
        },
    )
}

#[query(guard = "is_user_anonymous")]
pub fn get_declined_money_requests(project_id: String) -> Vec<ProjectNotification> {
    read_state(
        |state| match state.project_access_notifications.get(&project_id) {
            Some(info) => info.0.iter()
                .filter(|notif| match &notif.notification_type {
                    ProjectNotificationType::AccessRequest(access_request) => 
                        access_request.request_type == "money_details_access" && 
                        access_request.status == "declined",
                })
                .cloned()
                .collect(),
            None => Vec::new(),
        },
    )
}

#[query(guard = "is_user_anonymous")]
pub fn get_approved_money_requests(project_id: String) -> Vec<ProjectNotification> {
    read_state(
        |state| match state.project_access_notifications.get(&project_id) {
            Some(info) => info.0.iter()
                .filter(|notif| match &notif.notification_type {
                    ProjectNotificationType::AccessRequest(access_request) => 
                        access_request.request_type == "money_details_access" && 
                        access_request.status == "approved",
                })
                .cloned()
                .collect(),
            None => Vec::new(),
        },
    )
}

#[query(guard = "is_user_anonymous")]
pub fn access_money_details(project_id: String) -> Result<MoneyRaised, CustomError> {
    let caller = ic_cdk::api::caller();

    let is_owner = read_state(|state| {
        state.project_storage.iter().any(|(principal, projects)| {
            principal == StoredPrincipal(caller) && projects.0.iter().any(|p| p.uid == project_id)
        })
    });

    // Check if the caller is approved to access the money details for this project
    let is_approved = is_owner
        || read_state(|state| {
            state
                .money_access
                .get(&project_id)
                .map_or(false, |principals| {
                    principals.0.contains(&Principal::from(caller))
                })
        });

    if !is_approved {
        return Err(CustomError {
            message: "You do not have access to view the money details for this project."
                .to_string(),
            is_owner,
        });
    }

    read_state(|state| {
        for (_, projects) in state.project_storage.iter() {
            for project in projects.0.iter() {
                if project.uid == project_id {
                    if let Some(money_raised) = &project.params.money_raised {
                        return Ok(money_raised.clone());
                    } else {
                        return Err(CustomError {
                            message: "Money raised details not available for this project."
                                .to_string(),
                            is_owner,
                        });
                    }
                }
            }
        }
        Err(CustomError {
            message: "Project ID not found.".to_string(),
            is_owner,
        })
    })
}