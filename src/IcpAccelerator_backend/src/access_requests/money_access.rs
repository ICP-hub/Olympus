use crate::add_notification;
use crate::project_module::post_project::find_project_owner_principal;
use crate::state_handler::*;
use crate::user_modules::get_user::*;
use crate::user_modules::user_types::*;
use crate::project_module::project_types::*;
use crate::types::individual_types::*;
use crate::guard::*;
use crate::NotificationInternal;
use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_cdk::api::caller;

#[update(guard = "combined_guard")]
pub async fn update_money_raised_data(project_id: String, new_money_raised: MoneyRaised) -> Result<String, String> {
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
                project.params.money_raised_till_now = Some(true);
                project.params.money_raised = Some(new_money_raised.clone());

                state.project_storage.insert(StoredPrincipal(caller), project_list.clone());
                return Ok("Money raised details updated successfully".to_string());
            }
        }
        Err("No existing Project profile found to update.".to_string())
    });

    update_result
}



#[update(guard = "combined_guard")]
pub async fn send_money_access_request(project_id: String) -> String {
    let caller = caller();
    let mut has_pending_request = false;

    ic_cdk::println!("Checking for existing pending requests for caller {}", caller);

    let has_pending_request_result = read_state(|state| {
        if let Some(request_vec) = state.money_access_request.get(&StoredPrincipal(caller)) {
            has_pending_request = request_vec
                .0
                .iter()
                .any(|request| request.project_id == project_id && request.status == "pending");
        }
        has_pending_request
    });

    if has_pending_request_result {
        ic_cdk::println!("Pending request found for project {}", project_id);
        return "You already have a pending request for this project.".to_string();
    }

    let user_data: Result<UserInformation, &str> = get_user_information();
    let user_data = user_data.unwrap_or_else(|_| panic!("Failed to get user data"));
    ic_cdk::println!("User data retrieved successfully");

    let access_request = AccessRequest {
        sender: caller.clone(),
        name: user_data.full_name,
        image: user_data.profile_picture.expect("Profile picture not found"),
        project_id: project_id.clone(),
        request_type: "money_details_access".to_string(),
        status: "pending".to_string(),
    };

    let noti_to_send = NotificationInternal{
        cohort_noti: None,
        docs_noti: None,
        money_noti: Some(access_request.clone()),
        association_noti: None,
    };
    let reciever_principal = find_project_owner_principal(&project_id.clone()).unwrap();

    let _ = add_notification(caller, reciever_principal, noti_to_send);

    ic_cdk::println!("Access request created for project {}", project_id);

    mutate_state(|state| {
        if let Some(mut request_vec) = state.money_access_request.get(&StoredPrincipal(caller)) {
            request_vec.0.push(access_request.clone());
            state.money_access_request.insert(
                StoredPrincipal(caller), request_vec);
            ic_cdk::println!("Added access request to existing vector for caller {}", caller);
        } else {
            state.money_access_request.insert(
                StoredPrincipal(caller),
                Candid(vec![access_request.clone()]),
            );
            ic_cdk::println!("Inserted new access request vector for caller {}", caller);
        }
    });

    let notification_to_send = ProjectNotification {
        notification_type: ProjectNotificationType::AccessRequest(access_request.clone()),
        timestamp: time(),
    };

    ic_cdk::println!("Created notification for access request");

    mutate_state(|state| {
        if let Some(mut notifications) = state.project_access_notifications.get(&project_id) {
            notifications.0.push(notification_to_send);
            state.project_access_notifications.insert(project_id.clone(), notifications);
            ic_cdk::println!("Added notification to existing notifications for project {}", project_id);
        } else {
            state.project_access_notifications.insert(project_id.clone(), Candid(vec![notification_to_send]));
            ic_cdk::println!("Inserted new notifications vector for project {}", project_id);
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

#[update(guard = "combined_guard")]
pub async fn approve_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    mutate_state(|state| {
        if let Some(request_vec) = state.money_access_request.remove(&StoredPrincipal(sender_id)) {
            let updated_request_vec = request_vec.0.into_iter().map(|mut request| {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "approved".to_string();
                    request_found_and_updated = true;
                }
                request
            }).collect::<Vec<_>>();

            state.money_access_request.insert(StoredPrincipal(sender_id), Candid(updated_request_vec));
        }
    });

    if !request_found_and_updated {
        return "Request not found or already approved.".to_string();
    }

    mutate_state(|state| {
        if let Some(notification_vec) = state.project_access_notifications.remove(&project_id) {
            let updated_notification_vec = notification_vec.0.into_iter().map(|mut notification| {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "money_details_access" => {
                            access_request.status = "approved".to_string();
                            request_found_and_updated = true; 
                        },
                    _ => {}
                }
                notification
            }).collect::<Vec<_>>();

            state.project_access_notifications.insert(project_id.clone(), Candid(updated_notification_vec));
        }
    });

    add_user_to_money_access(project_id, sender_id);

    "Money access request approved successfully.".to_string()
}


#[update(guard = "combined_guard")]
pub fn decline_money_access_request(project_id: String, sender_id: Principal) -> String {
    let mut request_found_and_updated = false;

    mutate_state(|state| {
        if let Some(request_vec) = state.money_access_request.remove(&StoredPrincipal(sender_id)) {
            let updated_request_vec = request_vec.0.into_iter().map(|mut request| {
                if request.project_id == project_id && request.status == "pending" {
                    request.status = "declined".to_string();
                    request_found_and_updated = true;
                }
                request
            }).collect::<Vec<_>>();

            state.money_access_request.insert(StoredPrincipal(sender_id), Candid(updated_request_vec));
        }
    });

    if !request_found_and_updated {
        return "Request not found or not in pending status.".to_string();
    }

    mutate_state(|state| {
        if let Some(notification_vec) = state.project_access_notifications.remove(&project_id) {
            let updated_notification_vec = notification_vec.0.into_iter().map(|mut notification| {
                match &mut notification.notification_type {
                    ProjectNotificationType::AccessRequest(access_request)
                        if access_request.sender == sender_id
                            && access_request.status == "pending"
                            && access_request.request_type == "money_details_access" => {
                            access_request.status = "declined".to_string();
                            request_found_and_updated = true; 
                        },
                    _ => {} 
                }
                notification
            }).collect::<Vec<_>>();

            state.project_access_notifications.insert(project_id, Candid(updated_notification_vec));
        }
    });

    "Money access request declined successfully.".to_string()
}


#[query(guard = "combined_guard")]
pub fn get_pending_money_requests(project_id: String) -> Vec<ProjectNotification> {
    ic_cdk::println!("Retrieving pending money requests for project_id: {}", project_id);

    let pending_requests = read_state(|state| {
        match state.project_access_notifications.get(&project_id) {
            Some(info) => {
                ic_cdk::println!("Notifications found for project_id: {}. Total notifications: {}", project_id, info.0.len());
                info.0.iter()
                    .enumerate()
                    .filter(|(index, notif)| {
                        ic_cdk::println!("Processing notification #{}: {:?}", index, notif);
                        match &notif.notification_type {
                            ProjectNotificationType::AccessRequest(access_request) => {
                                let is_pending = access_request.request_type == "money_details_access" && 
                                                 access_request.status == "pending";
                                ic_cdk::println!("AccessRequest #{}: type={}, status={}, is_pending={}", 
                                                 index, access_request.request_type, access_request.status, is_pending);
                                is_pending
                            }
                        }
                    })
                    .map(|(_, notif)| notif.clone())
                    .collect()
            },
            None => {
                ic_cdk::println!("No notifications found for project_id: {}", project_id);
                Vec::new()
            },
        }
    });

    ic_cdk::println!("Total pending requests found: {}", pending_requests.len());
    pending_requests
}



#[query(guard = "combined_guard")]
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

#[query(guard = "combined_guard")]
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

#[query(guard = "combined_guard")]
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