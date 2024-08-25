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
pub async fn update_project_private_docs(project_id: String, new_docs: Vec<Docs>, status: bool) -> Result<String, String> {
    let caller = ic_cdk::caller();

    // Check if the caller is the owner of the project
    let is_owner = read_state(|state| {
        state
            .project_storage
            .iter()
            .any(|(stored_principal, project_infos)| {
                stored_principal.0 == caller && project_infos.0.iter().any(|p| p.uid == project_id)
            })
    });

    if !is_owner {
        return Err("Error: Only the project owner can request updates.".to_string());
    }

    let update_result = mutate_state(|state| {
        if let Some(mut project_list) = state.project_storage.get(&StoredPrincipal(caller)) {
            if let Some(project) = project_list.0.iter_mut().find(|p| p.uid == project_id) {
                if status == true {
                    project.params.upload_private_documents = Some(true);
                    project.params.private_docs = Some(new_docs.clone());
                }else{
                    project.params.public_docs = Some(new_docs.clone());
                }

                state.project_storage.insert(StoredPrincipal(caller), project_list.clone());
                return Ok("Project docs updated successfully".to_string());
            }
        }
        Err("No existing Project profile found to update.".to_string())
    });

    update_result
}


#[update(guard = "is_user_anonymous")]
pub async fn send_private_docs_access_request(project_id: String) -> String {
    //sender
    let caller = caller();

    let has_pending_request = read_state(|state| {
        if let Some(request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(caller))
        {
            // Iterate through the Vec<AccessRequest> to find a matching and pending project_id request
            request_vec
                .0
                .iter()
                .any(|request| request.project_id == project_id && request.status == "pending")
        } else {
            false
        }
    });

    if has_pending_request {
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
        request_type: "private_docs_access".to_string(),
        status: "pending".to_string(),
    };

    // Add request to the MONEY_ACCESS_REQUESTS hashmap
    mutate_state(|state| {
        if let Some(mut request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(caller))
        {
            // If the caller already has requests, append the new one
            request_vec.0.push(access_request.clone());
        } else {
            // If the caller doesn't have any requests yet, create a new vector
            state.private_docs_access_request.insert(
                StoredPrincipal(caller.clone()),
                Candid(vec![access_request.clone()]),
            );
        }
    });

    // Create and send a notification for the request
    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()), // Cloned to satisfy borrow checker
        timestamp: time(), // Assuming the existence of time() that returns u64 timestamp
    };

    mutate_state(|state| {
        if let Some(mut notifications) = state.project_access_notifications.get(&project_id) {
            notifications.0.push(notification_to_send.clone());
        } else {
            state.project_access_notifications.insert(
                project_id.clone(),
                Candid(vec![notification_to_send.clone()]),
            );
        }
    });

    "Your access request has been sent and is pending approval.".to_string()
}

fn add_user_to_private_docs_access(project_id: String, user: Principal) {
    mutate_state(|state| {
        if let Some(mut access_list) = state.private_docs_access.get(&project_id) {
            access_list.0.push(user);
        } else {
            state
                .private_docs_access
                .insert(project_id, Candid(vec![user]));
        }
    });
}

#[update(guard = "is_user_anonymous")]
pub async fn approve_private_docs_access_request(
    project_id: String,
    sender_id: Principal,
) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(sender_id))
        {
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
                            && access_request.request_type == "private_docs_access" =>
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
    add_user_to_private_docs_access(project_id, sender_id);

    "Private docs access request approved successfully.".to_string()
}

#[update(guard = "is_user_anonymous")]
pub fn decline_private_docs_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in PRIVATE_DOCS_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(mut request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(sender_id))
        {
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
        return "Request not found or already processed.".to_string();
    }

    // Assuming you also track notifications for private docs requests
    mutate_state(|state| {
        if let Some(mut notification_vec) = state.project_access_notifications.get(&project_id) {
            for notification in notification_vec.0.iter_mut() {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "private_docs_access" =>
                    {
                        access_request.status = "declined".to_string();
                        break;
                    }
                    _ => {} // Do nothing for other cases or variants
                }
            }
        }
    });

    "Private docs access request declined successfully.".to_string()
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_pending_docs_access_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.request_type == "private_docs_access"
                                && access_request.status == "pending" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_approved_docs_access_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.request_type == "private_docs_access"
                                && access_request.status == "approved" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_declined_docs_access_requests() -> Vec<ProjectNotification> {
    read_state(|state| {
        state
            .project_access_notifications
            .iter()
            .flat_map(|(_, notifications)| {
                notifications
                    .0
                    .iter()
                    .filter_map(|notification| match &notification.notification_type {
                        ProjectNotificationType::AccessRequest(access_request)
                            if access_request.request_type == "private_docs_access"
                                && access_request.status == "declined" =>
                        {
                            Some(notification.clone())
                        }
                        _ => None,
                    })
                    .collect::<Vec<_>>()
            })
            .collect()
    })
}

#[query(guard = "is_user_anonymous")]
pub fn access_private_docs(project_id: String) -> Result<Vec<Docs>, CustomError> {
    let caller = ic_cdk::api::caller();

    let is_owner = read_state(|state| {
        state.project_storage.iter().any(|(principal, projects)| {
            principal == StoredPrincipal(caller) && projects.0.iter().any(|p| p.uid == project_id)
        })
    });

    let is_approved = is_owner
        || read_state(|state| {
            state
                .private_docs_access
                .get(&project_id)
                .map_or(false, |principals| {
                    principals.0.contains(&Principal::from(caller))
                })
        });

    if !is_approved {
        return Err(CustomError {
            message: "You do not have access to view the private documents for this project."
                .to_string(),
            is_owner,
        });
    }

    read_state(|state| {
        for (_, projects) in state.project_storage.iter() {
            for project in projects.0.iter() {
                if project.uid == project_id {
                    if let Some(private_docs) = &project.params.private_docs {
                        return Ok(private_docs.clone());
                    } else {
                        return Err(CustomError {
                            message: "Private Docs details not available for this project."
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