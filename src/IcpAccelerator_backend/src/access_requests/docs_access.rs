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

#[update(guard = "combined_guard")]
pub async fn update_project_private_docs(project_id: String, new_docs: Docs, status: bool) -> Result<String, String> {
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
    let mut project_list = state.project_storage.get(&StoredPrincipal(caller))
        .map(|candid_data| {
            candid_data.0.to_vec() 
        })
        .unwrap_or_else(Vec::new);

    let _found = project_list.iter_mut().any(|project| {
        if project.uid == project_id {
            if status {
                project.params.upload_private_documents = Some(true);
                let docs = project.params.private_docs.get_or_insert_with(Vec::new);
                docs.push(new_docs.clone());
            } else {
                let docs = project.params.public_docs.get_or_insert_with(Vec::new);
                docs.push(new_docs.clone());
            }
            return true;
        }
        false
    });
    state.project_storage.insert(StoredPrincipal(caller), Candid(project_list)); 
    Ok("Project docs updated successfully".to_string())
});



    update_result
}


#[update(guard = "combined_guard")]
pub async fn send_private_docs_access_request(project_id: String) -> String {
    let caller = caller();

    let has_pending_request = read_state(|state| {
        if let Some(request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(caller))
        {
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

    let user_data = user_data.unwrap_or_else(|_| panic!("Failed to get user data"));

    let access_request = AccessRequest {
        sender: caller.clone(), 
        name: user_data.full_name,
        image: user_data.profile_picture.expect("Profile picture not found"),
        project_id: project_id.clone(),
        request_type: "private_docs_access".to_string(),
        status: "pending".to_string(),
    };

    mutate_state(|state| {
        if let Some(mut request_vec) = state
            .private_docs_access_request
            .get(&StoredPrincipal(caller))
        {
            request_vec.0.push(access_request.clone());
        } else {
            state.private_docs_access_request.insert(
                StoredPrincipal(caller.clone()),
                Candid(vec![access_request.clone()]),
            );
        }
    });

    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()), 
        timestamp: time(), 
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

#[update(guard = "combined_guard")]
pub async fn approve_private_docs_access_request(
    project_id: String,
    sender_id: Principal,
) -> String {
    let mut request_found_and_updated = false;

    // Update the status in MONEY_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(request_vec) = state.private_docs_access_request.remove(&StoredPrincipal(sender_id)) {
            let mut modified = false;
            let updated_request_vec = request_vec.0.into_iter().map(|mut request| {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "approved".to_string();
                    modified = true;
                }
                request
            }).collect::<Vec<_>>();

            // Reinsert the updated vector back into the state map
            state.private_docs_access_request.insert(StoredPrincipal(sender_id), Candid(updated_request_vec));
            if modified {
                request_found_and_updated = true;
            }
        }
    });

    if !request_found_and_updated {
        return "Request not found or already approved.".to_string();
    }

    // Update the status in PROJECT_ACCESS_NOTIFICATIONS
    mutate_state(|state| {
    // Retrieve a copy of the notification vector for modification by removing it first
        if let Some(notification_vec) = state.project_access_notifications.remove(&project_id) {
            let mut updated = false;
            let mut updated_notification_vec = Vec::new();

            for mut notification in notification_vec.0 {
                // Directly extract access_request from the notification
                let access_request = match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request) => access_request,
                };

                // Check and update the access request if it matches the criteria
                if access_request.sender == sender_id
                    && access_request.status == "pending"
                    && access_request.request_type == "private_docs_access" {
                    access_request.status = "approved".to_string();
                    updated = true;
                }

                updated_notification_vec.push(notification);
                if updated { break; }  // Stop processing once the first match is updated
            }

            // Reinsert the modified vector back into the state
            state.project_access_notifications.insert(project_id.clone(), Candid(updated_notification_vec));
        }
    });

    // Assuming the existence of a function or mechanism to add the sender's Principal to a money_access vector
    add_user_to_private_docs_access(project_id, sender_id);

    "Private docs access request approved successfully.".to_string()
}

#[update(guard = "combined_guard")]
pub fn decline_private_docs_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    // Update the status in PRIVATE_DOCS_ACCESS_REQUESTS
    mutate_state(|state| {
        if let Some(request_vec) = state.private_docs_access_request.remove(&StoredPrincipal(sender_id)) {
            let updated_request_vec = request_vec.0.into_iter().map(|mut request| {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "declined".to_string();
                    request_found_and_updated = true;
                }
                request
            }).collect::<Vec<_>>();

            state.private_docs_access_request.insert(StoredPrincipal(sender_id), Candid(updated_request_vec));
        }
    });

    if !request_found_and_updated {
        return "Request not found or already processed.".to_string();
    }

    mutate_state(|state| {
        if let Some(notification_vec) = state.project_access_notifications.remove(&project_id) {
            let updated_notification_vec = notification_vec.0.into_iter().map(|mut notification| {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request) if access_request.sender == sender_id
                        && access_request.status == "pending"
                        && access_request.request_type == "private_docs_access" => {
                            access_request.status = "declined".to_string();
                        },
                    _ => {}
                }
                notification
            }).collect::<Vec<_>>();

            // Reinsert the modified vector back into the state map
            state.project_access_notifications.insert(project_id, Candid(updated_notification_vec));
        }
    });

    "Private docs access request declined successfully.".to_string()
}


#[query(guard = "combined_guard")]
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

#[query(guard = "combined_guard")]
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

#[query(guard = "combined_guard")]
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

#[query(guard = "combined_guard")]
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