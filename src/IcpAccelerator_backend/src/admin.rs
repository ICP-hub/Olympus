use crate::associations::*;
use crate::cohort::InviteRequest;
use crate::is_admin;
use crate::mentor::*;
use crate::mentor_investor_ratings::find_mentor_by_uid;
use crate::mentor_investor_ratings::find_vc_by_uid;
use crate::project_registration::*;
use crate::state_handler::mutate_state;
use crate::state_handler::read_state;
use crate::state_handler::Candid;
use crate::state_handler::StoredPrincipal;
use crate::user_module::*;
use crate::vc_registration::*;
use crate::CohortRequest;
use candid::{CandidType, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::management_canister::main::{canister_info, CanisterInfoRequest};
use ic_cdk::api::{caller, id};
use ic_cdk::api::{canister_balance128, time};
use ic_cdk::storage;
use ic_cdk::storage::stable_restore;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use std::borrow::Cow;
use std::cell::RefCell;
use std::cmp;
use std::collections::{HashMap, HashSet};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct ApprovalRequest {
    sender: Principal,
    receiver: Principal,
    photo: Vec<u8>,
    name: String,
    country: String,
    tag_used: String,
    requested_for: String,
    bio: String,
    status: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
enum NotificationType {
    ApprovalRequest(ApprovalRequest),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Notification {
    notification_type: NotificationType,
    timestamp: u64,
}

#[derive(Debug)]
enum MyError {
    CanisterInfoError(String),
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct UpdateCounts {
    project_update: Option<u32>,
    mentor_update: Option<u32>,
    vc_update: Option<u32>,
}

// thread_local! {
//     static ADMIN_NOTIFICATIONS : RefCell<HashMap<Principal, Vec<Notification>>> = RefCell::new(HashMap::new());
//     static COHORT_REQUEST : RefCell<HashMap<String, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
//     static ACCEPTED_COHORTS : RefCell<HashMap<String, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
//     static DECLINED_COHORTS: RefCell<HashMap<String, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
// }

fn change_notification_status(requester: Principal, requested_for: String, changed_status: String) {
    mutate_state(|admin_notifications| {
        let mut notifications = &mut admin_notifications.admin_notifications;
        for (_, mut admin_notif_list) in notifications.iter() {
            for notification in admin_notif_list.0.iter_mut() {
                match &mut notification.notification_type {
                    NotificationType::ApprovalRequest(approval_request)
                        if approval_request.sender == requester
                            && approval_request.status == "pending"
                            && approval_request.requested_for == requested_for =>
                    {
                        approval_request.status = changed_status.clone()
                    }
                    _ => {} // Do nothing for other cases or variants
                }
            }
        }
    });
}

pub async fn send_approval_request(
    photo: Vec<u8>,
    name: String,
    country: String,
    tag_used: String,
    requested_for: String,
    bio: String,
) -> String {
    //sender
    let caller: Principal = caller();

    //access whom you wanna send the notification; receiver
    match get_info().await {
        Ok(res) => {
            let controllers = res;

            ic_cdk::println!("these controllers got accessed {:#?}", controllers);

            for c in controllers {
                let i: i8 = 1;

                ic_cdk::println!("no = {} c = {}", i, c);

                let approval_request = ApprovalRequest {
                    sender: caller,
                    receiver: c,
                    photo: photo.clone(),
                    name: name.clone(),
                    country: country.clone(),
                    tag_used: tag_used.clone(),
                    requested_for: requested_for.clone(),
                    bio: bio.clone(),
                    status: "pending".to_string(),
                };

                let notification_to_send = Notification {
                    notification_type: NotificationType::ApprovalRequest(approval_request),
                    timestamp: time(),
                };
                mutate_state(|state| {
                    let principal = c;

                    let mut notifications = state
                        .admin_notifications
                        .get(&StoredPrincipal(principal))
                        .map_or(Vec::new(), |candid_vec| {
                            Candid::from_bytes(Cow::Borrowed(&candid_vec.to_bytes())).0
                        });

                    notifications.push(notification_to_send);

                    state
                        .admin_notifications
                        .insert(StoredPrincipal(principal), Candid(notifications));
                });
            }
            format!("approval request is sent")
        }
        Err(e) => {
            format!("unable to get canister information {:?}", e)
        }
    }
}

pub fn approve_mentor_creation_request(requester: Principal, approve: bool) -> String {
    // First, perform a read to determine if action is required
    let (mentor_internal, should_update) = read_state(|state| {
        if let Some(mentor) = state
            .mentor_awaits_response
            .get(&StoredPrincipal(requester))
        {
            let should_update = mentor.0.approve != approve;
            (Some(mentor), should_update) // Directly pass reference or copy data as needed
        } else {
            (None, false)
        }
    });

    // Process the read data
    if let Some(mentor) = mentor_internal {
        if approve {
            // Handle approvals
            mutate_state(|state| {
                // Update various parts of the state
                state
                    .mentor_storage
                    .insert(StoredPrincipal(requester), mentor.clone());
                state
                    .mentor_awaits_response
                    .remove(&StoredPrincipal(requester));
                let role_status = &mut state.role_status;

                if let Some(mut role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(requester))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "mentor" {
                            role.status = "approved".to_string();
                            role.approved_on = Some(time());
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(requester), Candid(role_status_vec));
                }
            });

            if should_update {
                change_notification_status(requester, "mentor".to_string(), "approved".to_string());
            }
            format!("Requester with principal id {} is approved", requester)
        } else {
            format!(
                "Requester with principal id {} could not be approved",
                requester
            )
        }
    } else {
        format!(
            "Requester with principal id {} has not registered",
            requester
        )
    }
}

pub fn decline_mentor_creation_request(requester: Principal, decline: bool) -> String {
    // Step 1: Read all necessary data
    let (mentor_internal_opt, res_opt, user_roles_opt) = read_state(|state| {
        let mentor_internal = state.mentor_awaits_response.get(&StoredPrincipal(requester)).map(|mentor| mentor.0.clone());
        let res = state.mentor_awaits_response.get(&StoredPrincipal(requester)).map(|res| res.0.clone());
        let user_roles = state.role_status.get(&StoredPrincipal(requester)).map(|roles| roles.0.clone());
        (mentor_internal, res, user_roles)
    });

    // Check if the mentor_internal is available
    if let Some(mut mentor_internal) = mentor_internal_opt {
        if decline {
            mentor_internal.decline = true;
            mentor_internal.approve = false;

            // Step 2: Perform the state mutations
            mutate_state(|state| {
                if let Some(res) = res_opt {
                    state.mentor_declined_request.insert(StoredPrincipal(requester), Candid(res));

                    if let Some(mut roles_clone) = user_roles_opt {
                        if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "mentor") {
                            user_role.status = "default".to_string();
                            user_role.rejected_on = Some(time());
                        }
                        state.role_status.insert(StoredPrincipal(requester), Candid(roles_clone));
                    }

                    state.mentor_awaits_response.remove(&StoredPrincipal(requester));
                }
            });

            // Step 3: Call change_notification_status after other mutations
            change_notification_status(requester, "mentor".to_string(), "declined".to_string());

            format!("Requester with principal id {} is declined", requester)
        } else {
            format!(
                "Requester with principal id {} could not be declined",
                requester
            )
        }
    } else {
        format!(
            "Requester with principal id {} has not registered",
            requester
        )
    }
}


pub fn get_admin_notifications() -> Vec<Notification> {
    let caller = caller();

    read_state(|alerts| {
        let mut alerts = alerts
            .admin_notifications
            .get(&StoredPrincipal(caller))
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_default();
        // Sort the alerts by timestamp in descending order
        alerts.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        alerts
    })
}

#[query(guard = "is_admin")]
pub fn get_pending_admin_notifications() -> Vec<Notification> {
    let caller = caller();

    read_state(|alerts| {
        let alerts = &alerts.admin_notifications;

        // First, get the caller's notifications, if any, and filter them by "pending" status.
        let pending_alerts: Vec<Notification> = alerts
            .get(&StoredPrincipal(caller))
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_default()
            .iter()
            .filter(|notification| {
                // Check if the notification is an ApprovalRequest and its status is "pending".
                // This assumes all notifications you're interested in are of type ApprovalRequest.
                // If there are other types with a status field, you'll need to adjust this logic accordingly.
                matches!(&notification.notification_type, NotificationType::ApprovalRequest(approval_request) if approval_request.status == "pending")
            })
            .cloned() // Clone the filtered notifications to a new vector
            .collect();

        // Now, sort the filtered alerts by timestamp in descending order
        let mut sorted_pending_alerts = pending_alerts;
        sorted_pending_alerts.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

        sorted_pending_alerts
    })
}

async fn get_info() -> Result<Vec<Principal>, MyError> {
    let canister_id: candid::Principal = id();

    ic_cdk::println!("{}", canister_id);

    let v: u64 = 3;

    let canister_infoo: CanisterInfoRequest = CanisterInfoRequest {
        canister_id: canister_id,
        num_requested_changes: Some(v),
    };

    match canister_info(canister_infoo).await {
        Ok(response) => {
            // ic_cdk::println!(response.0.controllers);
            Ok(response.0.controllers)
        }
        Err(e) => Err(MyError::CanisterInfoError(format!(
            "Error getting the information {:?}",
            e
        ))),
    }
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
pub struct MentorWithRoles {
    pub mentor_profile: MentorInternal,
    pub roles: Vec<Role>,
}
#[derive(Debug, Serialize, Deserialize, Clone, CandidType)]
pub struct VcWithRoles {
    pub vc_profile: VentureCapitalistInternal,
    pub roles: Vec<Role>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
pub struct ProjectWithRoles {
    pub project_profile: ProjectInfoInternal,
    pub roles: Vec<Role>,
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnMentorDataRequest {
    pub data: HashMap<Principal, MentorWithRoles>,
    pub count: u64,
}

#[query(guard = "is_admin")]
pub fn mentors_awaiting_approval(
    pagination_params: PaginationParams,
) -> PaginationReturnMentorDataRequest {
    let mentors_count = read_state(|state| state.mentor_awaits_response.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, mentors_count.try_into().unwrap());

    let mentors_snapshot = read_state(|state| {
        state.mentor_awaits_response.iter()
            .skip(start)
            .take(end - start)
            .map(|(principal, mentor_internal)| {
                let roles = get_roles_for_principal(principal.0); 
                (principal.0, MentorWithRoles { 
                    mentor_profile: mentor_internal.0.clone(),
                    roles,
                })
            })
            .collect::<HashMap<Principal, MentorWithRoles>>() 
    });

    PaginationReturnMentorDataRequest {
        data: mentors_snapshot,
        count: mentors_count,
    }
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnVcDataRequest {
    pub data: HashMap<Principal, VcWithRoles>,
    pub count: u64,
}

#[query(guard = "is_admin")]
pub fn vc_awaiting_approval(pagination_params: PaginationParams) -> PaginationReturnVcDataRequest {
    let vc_count = read_state(|state| state.vc_awaits_response.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, vc_count.try_into().unwrap());

    let vcs_snapshot = read_state(|state| {
        state.vc_awaits_response.iter()
            .skip(start)
            .take(end - start)
            .map(|(principal, vc_internal)| {
                let roles = get_roles_for_principal(principal.0);
                let vc_with_roles = VcWithRoles {
                    vc_profile: vc_internal.0.clone(),
                    roles,
                };
                (principal.0, vc_with_roles)
            })
            .collect::<Vec<_>>()
    });

    let paginated_vcs: HashMap<Principal, VcWithRoles> = vcs_snapshot.into_iter().collect();

    PaginationReturnVcDataRequest {
        data: paginated_vcs,
        count: vc_count,
    }
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnProjectDataRequest {
    pub data: HashMap<Principal, ProjectWithRoles>,
    pub count: u64,
}

#[query(guard = "is_admin")]
pub fn project_awaiting_approval(
    pagination_params: PaginationParams,
) -> PaginationReturnProjectDataRequest {
    let project_count = read_state(|state| state.project_awaits_response.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, project_count.try_into().unwrap());

    let projects_snapshot = read_state(|state| {
        state.project_awaits_response.iter()
            .skip(start)
            .take(end - start)
            .map(|(principal, project_internal)| {
                let roles = get_roles_for_principal(principal.0);
                let project_with_roles = ProjectWithRoles {
                    project_profile: project_internal.0.clone(),
                    roles,
                };
                (principal.0, project_with_roles)
            })
            .collect::<Vec<_>>()
    });

    let paginated_projects: HashMap<Principal, ProjectWithRoles> = projects_snapshot.into_iter().collect();

    PaginationReturnProjectDataRequest {
        data: paginated_projects,
        count: project_count,
    }
}

#[query(guard = "is_admin")]
pub fn project_declined(pagination_params: PaginationParams) -> PaginationReturnProjectDataRequest {
    let project_count = read_state(|state| state.project_declined_request.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, project_count.try_into().unwrap());

    let projects_snapshot = read_state(|state| {
        state.project_declined_request.iter()
            .skip(start)
            .take(end - start)
            .map(|(principal, project_internal)| {
                let roles = get_roles_for_principal(principal.0);
                let project_with_roles = ProjectWithRoles {
                    project_profile: project_internal.0.clone(),
                    roles,
                };
                (principal.0, project_with_roles)
            })
            .collect::<Vec<_>>()
    });

    let paginated_projects: HashMap<Principal, ProjectWithRoles> = projects_snapshot.into_iter().collect();

    PaginationReturnProjectDataRequest {
        data: paginated_projects,
        count: project_count,
    }
}

#[query(guard = "is_admin")]
pub fn vc_declined(pagination_params: PaginationParams) -> PaginationReturnVcDataRequest {
    let vc_count = read_state(|state| state.vc_declined_request.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, vc_count.try_into().unwrap());

    let vcs_snapshot = read_state(|state| {
        state.vc_declined_request.iter()
            .skip(start)
            .take(end - start)
            .map(|(principal, vc_internal)| {
                let roles = get_roles_for_principal(principal.0);
                let vc_with_roles = VcWithRoles {
                    vc_profile: vc_internal.0.clone(),
                    roles,
                };
                (principal.0, vc_with_roles)
            })
            .collect::<Vec<_>>()
    });

    let paginated_vcs: HashMap<Principal, VcWithRoles> = vcs_snapshot.into_iter().collect();

    PaginationReturnVcDataRequest {
        data: paginated_vcs,
        count: vc_count,
    }
}

#[query(guard = "is_admin")]
pub fn mentor_declined(pagination_params: PaginationParams) -> PaginationReturnMentorDataRequest {
    let mentor_count = read_state(|state| state.mentor_declined_request.len());

    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, mentor_count.try_into().unwrap());

    let mentors_snapshot = read_state(|state| {
        state.mentor_declined_request.iter()
            .skip(start)
            .take(end - start)
            .map(|(principal, mentor_internal)| {
                let roles = get_roles_for_principal(principal.0);
                let mentor_with_roles = MentorWithRoles {
                    mentor_profile: mentor_internal.0.clone(),
                    roles,
                };
                (principal.0, mentor_with_roles)
            })
            .collect::<Vec<_>>()
    });

    let paginated_mentors: HashMap<Principal, MentorWithRoles> = mentors_snapshot.into_iter().collect();

    PaginationReturnMentorDataRequest {
        data: paginated_mentors,
        count: mentor_count,
    }
}

#[query(guard = "is_admin")]
fn mentor_profile_edit_awaiting_approval() -> HashMap<Principal, MentorUpdateRequest> {
    read_state(|state| {
        state
            .mentor_profile_edit_awaits
            .iter()
            .map(|(stored_principal, request)| (stored_principal.0, request.0.clone()))
            .collect()
    })
}

#[query(guard = "is_admin")]
fn vc_profile_edit_awaiting_approval() -> HashMap<Principal, UpdateInfoStruct> {
    read_state(|state| {
        state
            .vc_profile_edit_awaits
            .iter()
            .map(|(stored_principal, request)| (stored_principal.0, request.0.clone()))
            .collect()
    })
}

#[query(guard = "is_admin")]
fn project_update_awaiting_approval() -> HashMap<String, ProjectUpdateRequest> {
    read_state(|state| {
        state
            .pending_project_details
            .iter()
            .map(|(stored_principal, request)| (stored_principal.to_string(), request.0.clone()))
            .collect()
    })
}

#[update(guard = "is_admin")]
pub fn decline_vc_creation_request(requester: Principal, decline: bool) -> String {
    // Step 1: Read all necessary data
    let (vc_internal_opt, res_opt, user_roles_opt) = read_state(|state| {
        let vc_internal = state.vc_awaits_response.get(&StoredPrincipal(requester)).map(|vc| vc.0.clone());
        let res = state.vc_awaits_response.get(&StoredPrincipal(requester)).map(|res| res.0.clone());
        let user_roles = state.role_status.get(&StoredPrincipal(requester)).map(|roles| roles.0.clone());
        (vc_internal, res, user_roles)
    });

    // Check if the vc_internal is available
    if let Some(mut vc_internal) = vc_internal_opt {
        if decline {
            vc_internal.decline = true;
            vc_internal.approve = false;

            // Step 2: Perform the state mutations
            mutate_state(|state| {
                if let Some(res) = res_opt {
                    state.vc_declined_request.insert(StoredPrincipal(requester), Candid(res));

                    if let Some(mut roles_clone) = user_roles_opt {
                        if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "vc") {
                            user_role.status = "default".to_string();
                            user_role.rejected_on = Some(time());
                        }
                        state.role_status.insert(StoredPrincipal(requester), Candid(roles_clone));
                    }

                    state.vc_awaits_response.remove(&StoredPrincipal(requester));
                }
            });

            // Step 3: Call change_notification_status after other mutations
            change_notification_status(requester, "vc".to_string(), "declined".to_string());

            format!("Requester with principal id {} is declined", requester)
        } else {
            format!(
                "Requester with principal id {} could not be declined",
                requester
            )
        }
    } else {
        format!(
            "Requester with principal id {} has not registered",
            requester
        )
    }
}


#[update(guard = "is_admin")]
pub fn approve_vc_creation_request(requester: Principal, approve: bool) -> String {
    let (vc_internal, should_update) = read_state(|state| {
        state
            .vc_awaits_response
            .get(&StoredPrincipal(requester))
            .map(|vc| (Some(vc.clone()), !vc.0.decline)) // Ensure Some is wrapped around the vc.clone()
            .unwrap_or((None, false)) // This is now correct as the first element of the tuple is an Option
    });

    // Process the read data
    if let Some(mut vc) = vc_internal {
        if should_update && approve {
            vc.0.approve = true;
            vc.0.decline = false;
            mutate_state(|state| {
                // Updating vc_storage to reflect approval status
                state
                    .vc_storage
                    .insert(StoredPrincipal(requester), Candid(vc.0.clone()));

                // Remove the vc request from awaits response as it's now processed
                state.vc_awaits_response.remove(&StoredPrincipal(requester));

                let role_status = &mut state.role_status;

                if let Some(mut role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(requester))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "vc" {
                            role.status = "approved".to_string();
                            role.approved_on = Some(time());
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(requester), Candid(role_status_vec));
                }
            });

            // Send notification about the approval
            change_notification_status(requester, "vc".to_string(), "approved".to_string());
            return format!("Requester with principal id {} is approved", requester);
        } else {
            return format!(
                "Requester with principal id {} could not be approved",
                requester
            );
        }
    } else {
        return format!(
            "Requester with principal id {} has not registered",
            requester
        );
    }
}

#[update(guard = "is_admin")]
pub fn approve_vc_profile_update(requester: Principal, approve: bool) -> String {
    let mut notification_needed = false;

    let update_result = mutate_state(|state| {
        if let Some(vc_internal) = state.vc_profile_edit_awaits.remove(&StoredPrincipal(requester)) {
            if approve {
                if let Some(mut existing_vc_internal) = state.vc_storage.get(&StoredPrincipal(requester)) {
                    if let Some(update) = &vc_internal.0.updated_info {
                        existing_vc_internal.0.params.registered_under_any_hub = update.registered_under_any_hub.clone()
                            .or(existing_vc_internal.0.params.registered_under_any_hub.clone());
                        existing_vc_internal.0.params.project_on_multichain = update.project_on_multichain.clone()
                            .or(existing_vc_internal.0.params.project_on_multichain.clone());
                        existing_vc_internal.0.params.money_invested = update.money_invested.clone()
                            .or(existing_vc_internal.0.params.money_invested.clone());
                        existing_vc_internal.0.params.existing_icp_portfolio = update.existing_icp_portfolio.clone()
                            .or(existing_vc_internal.0.params.existing_icp_portfolio.clone());
                        existing_vc_internal.0.params.announcement_details = update.announcement_details.clone()
                            .or(existing_vc_internal.0.params.announcement_details.clone());
                        existing_vc_internal.0.params.registered_country = update.registered_country.clone()
                            .or(existing_vc_internal.0.params.registered_country.clone());
                        existing_vc_internal.0.params.fund_size = Some(update.fund_size.unwrap_or(0.0));
                        existing_vc_internal.0.params.assets_under_management = update.assets_under_management.clone();
                        existing_vc_internal.0.params.category_of_investment = update.category_of_investment.clone();
                        existing_vc_internal.0.params.logo = update.logo.clone();
                        existing_vc_internal.0.params.average_check_size = update.average_check_size;
                        existing_vc_internal.0.params.existing_icp_investor = update.existing_icp_investor;
                        existing_vc_internal.0.params.investor_type = update.investor_type.clone();
                        existing_vc_internal.0.params.number_of_portfolio_companies = update.number_of_portfolio_companies;
                        existing_vc_internal.0.params.portfolio_link = update.portfolio_link.clone();
                        existing_vc_internal.0.params.reason_for_joining = update.reason_for_joining.clone();
                        existing_vc_internal.0.params.name_of_fund = update.name_of_fund.clone();
                        existing_vc_internal.0.params.preferred_icp_hub = update.preferred_icp_hub.clone();
                        existing_vc_internal.0.params.type_of_investment = update.type_of_investment.clone();
                        existing_vc_internal.0.params.linkedin_link = update.linkedin_link.clone();
                        existing_vc_internal.0.params.website_link = update.website_link.clone();
                        existing_vc_internal.0.params.registered = update.registered.clone();

                        notification_needed = true; 
                        state.vc_storage.insert(StoredPrincipal(requester), existing_vc_internal);
                        return Ok("Profile updated successfully and ready for notification.");
                    }
                }
                return Err("No existing VC profile found to update.");
            }
        }
        Err("No pending approval request found.")
    });

    match update_result {
        Ok(message) => {
            if notification_needed {
                change_notification_status(requester, "vc".to_string(), "approved".to_string());
            }
            format!("{} Notification sent.", message)
        },
        Err(error) => format!("Error processing request: {}", error),
    }
}


#[update(guard = "is_admin")]
pub fn decline_vc_profile_update_request(requester: Principal, decline: bool) -> String {
    let mut declined_data: Option<UpdateInfoStruct> = None;


    let update_result = mutate_state(|state| {
        if let Some(vc_internal) = state.vc_profile_edit_awaits.remove(&StoredPrincipal(requester)) {
            let previous_profile = state
                .vc_storage
                .get(&StoredPrincipal(requester))
                .map(|vc_internal| vc_internal.0.params.clone());

            declined_data = Some(UpdateInfoStruct {
                original_info: previous_profile,
                updated_info: vc_internal.0.updated_info.clone(),
                approved_at: 0,
                rejected_at: ic_cdk::api::time(),
                sent_at: vc_internal.0.sent_at,
            });

            ic_cdk::println!("VC profile update request for {} has been declined.", requester);
            Ok("Decline processed successfully, ready for notification.")
        } else {
            Err("No pending approval request found for decline.")
        }
    });

    match update_result {
        Ok(message) => {
            if let Some(data) = declined_data {
                mutate_state(|state| {
                    state.vc_profile_edit_declined.insert(StoredPrincipal(requester), Candid(data));
                });
                change_notification_status(requester, "vc".to_string(), "declined".to_string());
            }
            format!("{} Notification sent.", message)
        },
        Err(error) => format!("Error processing request: {}", error),
    }
}


#[update(guard = "is_admin")]
pub fn decline_project_profile_update_request(requester: String, decline: bool) -> String {
    mutate_state(|state| {
        if let Some(vc_internal) = state.pending_project_details.get(&requester) {
            if decline {
                state
                    .declined_project_details
                    .insert(requester.clone(), Candid(vc_internal.0.clone()));
                state.pending_project_details.remove(&requester);
                format!("Requester with principal id {} is declined", requester)
            } else {
                format!(
                    "Requester with principal id {} could not be declined",
                    requester
                )
            }
        } else {
            format!(
                "Requester with principal id {} has not registered",
                requester
            )
        }
    })
}

#[update(guard = "is_admin")]

pub fn approve_mentor_profile_update(requester: Principal, approve: bool) -> String {
    let mut updated_profile_data: Option<MentorProfile> = None;

    let update_result = mutate_state(|state| {
        if let Some(updated_profile) = state.mentor_profile_edit_awaits.remove(&StoredPrincipal(requester)) {
            if let Some(mut mentor_internal) = state.mentor_storage.get(&StoredPrincipal(requester)) {
                if let Some(ref updated_info) = updated_profile.0.updated_info {
                    mentor_internal.0.profile.preferred_icp_hub = updated_info.preferred_icp_hub.clone()
                        .or_else(|| mentor_internal.0.profile.preferred_icp_hub.clone());
                    mentor_internal.0.profile.multichain = updated_info.multichain.clone()
                        .or_else(|| mentor_internal.0.profile.multichain.clone());
                    mentor_internal.0.profile.existing_icp_project_porfolio = updated_info.existing_icp_project_porfolio.clone()
                        .or_else(|| mentor_internal.0.profile.existing_icp_project_porfolio.clone());
                    mentor_internal.0.profile.area_of_expertise = updated_info.area_of_expertise.clone();
                    mentor_internal.0.profile.category_of_mentoring_service = updated_info.category_of_mentoring_service.clone();
                    mentor_internal.0.profile.existing_icp_mentor = updated_info.existing_icp_mentor;
                    mentor_internal.0.profile.icp_hub_or_spoke = updated_info.icp_hub_or_spoke;
                    mentor_internal.0.profile.linkedin_link = updated_info.linkedin_link.clone();
                    mentor_internal.0.profile.website = updated_info.website.clone();
                    mentor_internal.0.profile.years_of_mentoring = updated_info.years_of_mentoring.clone();
                    mentor_internal.0.profile.reason_for_joining = updated_info.reason_for_joining.clone();
                    mentor_internal.0.profile.hub_owner = updated_info.hub_owner.clone()
                        .or_else(|| mentor_internal.0.profile.hub_owner.clone());
                }
                updated_profile_data = Some(mentor_internal.0.profile.clone());
                state.mentor_storage.insert(StoredPrincipal(requester), mentor_internal);

                ic_cdk::println!("Mentor profile for {} has been approved and updated.", requester);
                Ok("Approval processed successfully, ready for notification.")
            } else {
                Err("Mentor profile not found in storage.")
            }
        } else {
            Err("No mentor profile edit request found.")
        }
    });

    match update_result {
        Ok(message) => {
            if let Some(profile_data) = updated_profile_data {
                change_notification_status(requester, "mentor".to_string(), "approved".to_string());
                println!("Updated mentor profile after approval: {:?}", profile_data);
                format!("{} Notification sent.", message)
            } else {
                format!("Error: Mentor profile data was not available after update.")
            }
        },
        Err(error) => format!("Error processing approval: {}", error),
    }
}


#[update(guard = "is_admin")]
pub fn decline_mentor_profile_update_request(requester: Principal, decline: bool) -> String {
    let result = mutate_state(|state| {
        if let Some(updated_profile) = state.mentor_profile_edit_awaits.remove(&StoredPrincipal(requester)) {
            let previous_profile = state
                .mentor_storage
                .get(&StoredPrincipal(requester))
                .map(|mentor_internal| mentor_internal.0.profile.clone());

            let declined_data = MentorUpdateRequest {
                original_info: previous_profile,
                updated_info: updated_profile.0.updated_info.clone(),
                approved_at: 0,
                rejected_at: time(),
                sent_at: 0,
            };

            state.mentor_profile_edit_declined.insert(StoredPrincipal(requester), Candid(declined_data));
            Ok("Profile update declined successfully.")
        } else {
            Err("Requester has not registered or does not have a pending update request.")
        }
    });

    match result {
        Ok(_) => {
            change_notification_status(requester, "mentor".to_string(), "declined".to_string());
            format!("Requester with principal id {} is declined", requester)
        },
        Err(msg) => msg.to_string(),
    }
}


#[update(guard = "is_admin")]
pub fn approve_project_creation_request(requester: Principal) -> String {
    let (project_internal, should_update) = read_state(|state| {
        if let Some(project) = state
            .project_awaits_response
            .get(&StoredPrincipal(requester))
        {
            let should_update = !project.0.is_verified;
            (Some(project.clone()), should_update) // Clone to avoid borrow issues
        } else {
            (None, false)
        }
    });

    // Process the read data
    if let Some(mut project) = project_internal {
        if should_update {
            project.0.is_verified = true;
            mutate_state(|state| {
                state
                    .project_storage
                    .insert(StoredPrincipal(requester), Candid(vec![project.0.clone()]));
                state
                    .project_awaits_response
                    .remove(&StoredPrincipal(requester));
                let role_status = &mut state.role_status;
                if let Some(mut role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(requester))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "project" {
                            role.status = "approved".to_string();
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(requester), Candid(role_status_vec));
                }
            });
            change_notification_status(requester, "project".to_string(), "approved".to_string());
            format!("Requester with principal id {} is approved", requester)
        } else {
            format!(
                "Requester with principal id {} could not be approved",
                requester
            )
        }
    } else {
        format!(
            "Requester with principal id {} has not registered",
            requester
        )
    }
}

#[update(guard = "is_admin")]
pub fn decline_project_creation_request(requester: Principal) -> String {
    // Step 1: Read all necessary data
    let (project_internal_opt, res_opt, user_roles_opt) = read_state(|state| {
        let project_internal = state.project_awaits_response.get(&StoredPrincipal(requester)).map(|pi| pi.0.clone());
        let res = state.project_awaits_response.get(&StoredPrincipal(requester)).map(|res| res.0.clone());
        let user_roles = state.role_status.get(&StoredPrincipal(requester)).map(|roles| roles.0.clone());
        (project_internal, res, user_roles)
    });

    // Check if the project_internal is available
    if let Some(mut project_internal) = project_internal_opt {
        project_internal.is_verified = false;

        // Step 2: Perform the state mutations
        mutate_state(|state| {
            if let Some(res) = res_opt {
                state.project_declined_request.insert(StoredPrincipal(requester), Candid(res));

                if let Some(mut roles_clone) = user_roles_opt {
                    if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "project") {
                        user_role.status = "default".to_string();
                        user_role.rejected_on = Some(time());
                    }
                    state.role_status.insert(StoredPrincipal(requester), Candid(roles_clone));
                }

                state.project_awaits_response.remove(&StoredPrincipal(requester));
            }
        });

        // Step 3: Call change_notification_status after other mutations
        change_notification_status(requester, "project".to_string(), "declined".to_string());

        format!("Requester with principal id {} is declined", requester)
    } else {
        format!(
            "Requester with principal id {} has not registered or could not be declined",
            requester
        )
    }
}



#[update(guard = "is_admin")]
pub fn approve_project_update(requester: Principal, project_id: String, approve: bool) -> String {
    ic_cdk::println!("1");
    let project_update_request = mutate_state(|state| state.pending_project_details.remove(&project_id));
    ic_cdk::println!("2");
    if let Some(project_update_request) = project_update_request {
        ic_cdk::println!("3");
        if approve {
            ic_cdk::println!("4");
            let mut result = String::new();
            ic_cdk::println!("5");
            mutate_state(|state| {
                ic_cdk::println!("6");
                if let Some( mut project_list) = state.project_storage.get(&StoredPrincipal(requester)) {
                    ic_cdk::println!("7");
                    if let Some(project) = project_list.0.iter_mut().find(|p| p.uid == project_id) {
                        ic_cdk::println!("8");
                        project.params.project_name = project_update_request.0.updated_info.project_name;
                        project.params.project_logo = project_update_request.0.updated_info.project_logo;
                        project.params.preferred_icp_hub = project_update_request.0.updated_info.preferred_icp_hub;
                        project.params.live_on_icp_mainnet = project_update_request.0.updated_info.live_on_icp_mainnet;
                        project.params.money_raised_till_now = project_update_request.0.updated_info.money_raised_till_now;
                        project.params.supports_multichain = project_update_request.0.updated_info.supports_multichain;
                        project.params.project_elevator_pitch = project_update_request.0.updated_info.project_elevator_pitch;
                        project.params.project_area_of_focus = project_update_request.0.updated_info.project_area_of_focus;
                        project.params.promotional_video = project_update_request.0.updated_info.promotional_video;
                        project.params.github_link = project_update_request.0.updated_info.github_link;
                        project.params.reason_to_join_incubator = project_update_request.0.updated_info.reason_to_join_incubator;
                        project.params.project_description = project_update_request.0.updated_info.project_description;
                        project.params.project_cover = project_update_request.0.updated_info.project_cover;
                        project.params.project_team = project_update_request.0.updated_info.project_team;
                        project.params.token_economics = project_update_request.0.updated_info.token_economics;
                        project.params.technical_docs = project_update_request.0.updated_info.technical_docs;
                        project.params.long_term_goals = project_update_request.0.updated_info.long_term_goals;
                        project.params.target_market = project_update_request.0.updated_info.target_market;
                        project.params.self_rating_of_project = project_update_request.0.updated_info.self_rating_of_project;
                        project.params.user_data = project_update_request.0.updated_info.user_data;
                        project.params.mentors_assigned = project_update_request.0.updated_info.mentors_assigned;
                        project.params.vc_assigned = project_update_request.0.updated_info.vc_assigned;
                        project.params.project_website = project_update_request.0.updated_info.project_website;
                        ic_cdk::println!("9");

                        result = format!(
                            "Project update for ID {} has been approved and applied.",
                            project_id
                        );
                        state.project_storage.insert(StoredPrincipal(requester), project_list.clone());
                        ic_cdk::println!("11");
                    }
                }
            });
            ic_cdk::println!("12");
            if result.is_empty() {
                ic_cdk::println!("13");
                return format!(
                    "Failed to apply update: Project ID {} not found under requester.",
                    project_id
                );
            } else {
                change_notification_status(
                    requester,
                    "project".to_string(),
                    "approved".to_string(),
                );
                ic_cdk::println!("14");
                return result;
            }
        } else {
            ic_cdk::println!("15");
            change_notification_status(
                requester,
                "project".to_string(),
                "declined".to_string(),
            );
            ic_cdk::println!("16");
            // Optionally handle declined updates, such as logging or notifying the requester.
            return format!("Project update for ID {} was declined.", project_id);
        }
    } else {
        ic_cdk::println!("17");
        return format!("No pending update found for project ID {}.", project_id);
    }
}

#[update(guard = "is_admin")]
pub fn add_job_type(job_type: String) -> String {
    mutate_state(|state| {
        state.job_type.insert(job_type.clone(), job_type);
        "Job type added".to_string()
    })
}

#[update(guard = "is_admin")]
pub async fn add_project_to_spotlight(project_id: String) -> Result<(), String> {
    let caller: Principal = caller();

    // Uncomment and use the following block if admin validation is needed
    // let admin_principals = match get_info().await {
    //     Ok(principals) => principals,
    //     Err(_) => return Err("Failed to retrieve admin principals".to_string()),
    // };

    // if !admin_principals.contains(&caller) {
    //     return Err("Unauthorized: Caller is not an admin.".to_string());
    // }

    let project_creator_and_info = read_state(|state| {
        state.project_storage.iter()
            .find_map(|(creator_principal, projects)| {
                projects.0.iter()
                    .find(|project| project.uid == project_id)
                    .map(|project_info| (creator_principal.clone(), project_info.clone()))
            })
    });

    match project_creator_and_info {
        Some((project_creator, project_info)) => {
            let spotlight_details = SpotlightDetails {
                added_by: project_creator.0,
                project_id: project_id.clone(),
                project_details: project_info,
                approval_time: time(),
            };

            mutate_state(|spotlight| {
                // Check if the project ID exists
                if let Some(mut existing_details) = spotlight.spotlight_projects.get(&project_id) {
                    // Update existing entry
                    existing_details.0.push(spotlight_details);
                } else {
                    // Insert new entry
                    spotlight
                        .spotlight_projects
                        .insert(project_id, Candid(vec![spotlight_details]));
                }
            });

            Ok(())
        }
        None => Err("Project not found.".to_string()),
    }
}

#[update(guard = "is_admin")]
pub fn remove_project_from_spotlight(project_id: String) -> Result<(), String> {
    mutate_state(|state| {
        if state.spotlight_projects.remove(&project_id).is_some() {
            Ok(())
        } else {
            Err("Project not found in spotlight.".to_string())
        }
    })
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnSpotlightProject {
    pub data: Vec<SpotlightDetails>,
    pub count: usize,
}

#[query(guard = "is_admin")]
pub fn get_spotlight_projects(
    pagination_params: PaginationParams,
) -> PaginationReturnSpotlightProject {
    // First, get the total count to calculate proper pagination bounds.
    let total_count = read_state(|state| state.spotlight_projects.iter().map(|(_, details)| details.0.len()).sum());

    // Calculate indices for pagination
    let start_index = (pagination_params.page - 1) * pagination_params.page_size;
    let end_index = start_index + pagination_params.page_size;

    // Early exit if start_index is out of bounds
    if start_index >= total_count {
        return PaginationReturnSpotlightProject {
            data: Vec::new(),
            count: total_count,
        };
    }

    // Now, fetch and process only the necessary slice of projects
    let mut projects_snapshot = read_state(|state| {
        state.spotlight_projects.iter()
            .flat_map(|(_, candid_value)| candid_value.0.clone()) // Clone each project details here
            .skip(start_index)
            .take(end_index - start_index)
            .collect::<Vec<SpotlightDetails>>()
    });

    // Sort the projects by approval_time in descending order
    projects_snapshot.sort_by(|a, b| b.approval_time.cmp(&a.approval_time));

    PaginationReturnSpotlightProject {
        data: projects_snapshot,
        count: total_count,
    }
}


#[query(guard = "is_admin")]
pub fn get_spotlight_project_uids() -> Vec<String> {
    read_state(|state| {
        let spotlight_hashmap = &state.spotlight_projects;
        spotlight_hashmap
            .iter()
            .map(|(key, _)| key.clone())
            .collect()
    })
}

#[query(guard = "is_admin")]
fn get_pending_cycles() -> u128 {
    canister_balance128()
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Counts {
    vc_count: usize,
    mentor_count: usize,
    project_count: usize,
    user_count: usize,
    only_user_count: usize,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]

pub struct ApprovedList {
    approved_type: Vec<String>,
    user_data: UserInformation,
}

fn get_principals_by_role(role_name: &str) -> HashSet<Principal> {
    read_state(|state| {
        state
            .role_status
            .iter()
            .filter_map(|(principal, roles)| {
                let has_target_role = roles.0.iter().any(|role| {
                    role.name == role_name && role.status != "default" && role.status != "requested"
                });
                if has_target_role {
                    Some(principal.0.clone()) // Extract Principal from StoredPrincipal
                } else {
                    None
                }
            })
            .collect()
    })
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationReturnUserData {
    pub data: HashMap<Principal, ApprovedList>,
    pub count: usize,
}

#[query(guard = "is_admin")]
fn get_total_approved_list_with_user_data(
    pagination_params: PaginationParams,
) -> PaginationReturnUserData {
    let roles_to_check = vec!["user", "mentor", "vc", "project"];
    let mut principals_roles: HashMap<StoredPrincipal, Vec<String>> = HashMap::new();

    for role_name in roles_to_check.iter() {
        let principals = get_principals_by_role(role_name); 
        for principal in principals {
            let stored_principal = StoredPrincipal(principal);
            principals_roles
                .entry(stored_principal)
                .or_default()
                .push(role_name.to_string());
        }
    }

    let total_count = principals_roles.len();
    let start = std::cmp::min((pagination_params.page - 1) * pagination_params.page_size, total_count);
    let end = std::cmp::min(start + pagination_params.page_size, total_count);

    let sliced_principals: Vec<_> = principals_roles.keys().skip(start).take(end - start).cloned().collect();

    let approved_list_map: HashMap<Principal, ApprovedList> = read_state(|state| {
        sliced_principals.into_iter()
            .filter_map(|stored_principal| {
                let binding = Vec::new();
                let roles = principals_roles.get(&stored_principal).unwrap_or(&binding);
                state.user_storage.get(&stored_principal).map(|user_info_internal| {
                    let principal = stored_principal.0; // Extract Principal
                    let approved_list = ApprovedList {
                        approved_type: roles.clone(),
                        user_data: user_info_internal.0.params.clone(),
                    };
                    (principal, approved_list)
                })
            })
            .collect()
    });

    PaginationReturnUserData {
        data: approved_list_map.into_iter().collect(),
        count: total_count, 
    }
}


#[query(guard = "is_admin")]
pub fn get_total_count() -> Counts {
    let vc_count = read_state(|state| state.vc_storage.len());
    let mentor_count = read_state(|state| state.mentor_storage.len());
    let project_count = read_state(|state| state.project_storage.len());
    let user_count = read_state(|state| state.user_storage.len());
    let only_user_count = read_state(|state| {
        state
            .role_status
            .iter()
            .filter(|(_, roles)| {
                let mut has_user_role = false;
                let mut other_roles_are_default_or_requested = true;

                for role in roles.0.iter() {
                    if role.name == "user" {
                        if role.status != "default" && role.status != "requested" {
                            has_user_role = true;
                        }
                    } else {
                        if role.status != "default" && role.status != "requested" {
                            other_roles_are_default_or_requested = false;
                            break;
                        }
                    }
                }

                has_user_role && other_roles_are_default_or_requested
            })
            .count()
    });

    Counts {
        vc_count: vc_count.try_into().unwrap(),
        mentor_count: mentor_count.try_into().unwrap(),
        project_count: project_count.try_into().unwrap(),
        user_count: user_count.try_into().unwrap(),
        only_user_count,
    }
}

#[query(guard = "is_admin")]
fn get_total_pending_request() -> usize {
    let mentor_pending = read_state(|state| state.mentor_awaits_response.len());
    let vc_pending = read_state(|state| state.vc_awaits_response.len());
    let project_pending = read_state(|state| state.project_awaits_response.len());

    (mentor_pending + vc_pending + project_pending)
        .try_into()
        .unwrap()
}

// #[query(guard = "is_admin")]
// fn get_top()

#[update(guard = "is_admin")]
fn update_dapp_link(project_id: String, new_dapp_link: String) -> String {
    mutate_state(|state| {
        // Access the project storage from the state
        if let Some(mut project_list) = state
            .project_storage
            .get(&StoredPrincipal(ic_cdk::caller()))
        {
            // Iterate through each project in the list
            if let Some(project) = project_list.0.iter_mut().find(|p| p.uid == project_id) {
                // If a project with the matching project_id is found, update its dapp_link
                project.params.dapp_link = Some(new_dapp_link.clone());
                return "Project updated successfully.".to_string(); // Confirm update
            }
        }
        // If no project with the matching ID was found
        "Project ID not found.".to_string()
    })
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct TopData {
    full_name: String,
    profile_picture: Option<Vec<u8>>, // Assuming profile_picture is optional
    area_of_interest: String,
    country: String,
    joined_on: u64,
}

fn get_joined_on_(principal: &Principal, roletype: String) -> Option<u64> {
    read_state(|state| {
        // Access the role status from the state
        state
            .role_status
            .get(&StoredPrincipal(*principal))
            .and_then(|roles| {
                // Find the role with the specified roletype and status "approved"
                roles
                    .0
                    .iter()
                    .find(|role| role.name == roletype && role.status == "approved")
                    .and_then(|role| role.approved_on)
            })
    })
}

#[query(guard = "is_admin")]
pub fn get_top_5_mentors() -> Vec<(Principal, TopData, usize)> {
    let mentor_data = read_state(|state| {
        state.mentor_storage.iter()
            .map(|(stored_principal, mentor_internal)| {
                let principal = stored_principal.0; 
                let project_count = get_projects_associated_with_mentor(principal).len(); 
                let joined_on = get_joined_on_(&principal, "mentor".to_string()).unwrap_or(0);

                let user_data = get_user_information_internal(principal);

                let top_data = TopData {
                    full_name: user_data.full_name.clone(),
                    profile_picture: user_data.profile_picture.clone(),
                    area_of_interest: mentor_internal.0.profile.area_of_expertise.clone(),
                    country: user_data.country.clone(),
                    joined_on,
                };

                (principal, top_data, project_count)
            })
            .collect::<Vec<_>>()
    });

    let mut sorted_mentor_data = mentor_data;
    sorted_mentor_data.sort_by_key(|k| std::cmp::Reverse(k.2));
    sorted_mentor_data.into_iter().take(5).collect()
}


#[query(guard = "is_admin")]
fn get_top_5_vcs() -> Vec<(Principal, TopData, usize)> {
    let vcs_snapshot = read_state(|state| {
        state.vc_storage.iter()
            .map(|(principal, vc_data)| {
                let principal = principal.0;  
                let vc_data_clone = vc_data.0.clone();  
                (principal, vc_data_clone)
            })
            .collect::<Vec<_>>()
    });

    let mut vc_details: Vec<(Principal, TopData, usize)> = vcs_snapshot
        .iter()
        .map(|(principal, vc_data)| {
            let project_count = get_projects_associated_with_investor(*principal).len();  
            let joined_on = get_joined_on_(&principal, "vc".to_string()).unwrap_or(0);  

            let user_data = get_user_information_internal(*principal);

            let top_data = TopData {
                full_name: user_data.full_name.clone(),
                profile_picture: user_data.profile_picture.clone(),
                area_of_interest: vc_data.params.category_of_investment.clone(),
                country: user_data.country.clone(),
                joined_on,
            };

            (*principal, top_data, project_count)
        })
        .collect();

    // Sort by the number of associated projects in descending order and take the top 5
    vc_details.sort_by_key(|k| std::cmp::Reverse(k.2));
    vc_details.into_iter().take(5).collect()
}


// #[query(guard = "is_admin")]
// fn get_top_5_projects() -> Vec<(String, TopData, usize)> {
//     // Temporarily holding the projects to sort and filter
//     let mut project_counts: Vec<(String, TopData, usize)> = Vec::new();

//     // Properly accessing the APPLICATION_FORM RefCell
//     APPLICATION_FORM.with(|application_form| {
//         let application_form = application_form.borrow(); // Access the RefCell for reading

//         for (_principal, projects) in application_form.iter() {

//             for project_internal in projects {

//                 let project_info = &project_internal.params;

//                 let mentor_count = project_info
//                     .mentors_assigned
//                     .as_ref()
//                     .map_or(0, |v| v.len());
//                 let vc_count = project_info.vc_assigned.as_ref().map_or(0, |v| v.len());
//                 let total_count = mentor_count + vc_count;

//                 // Placeholder for TopData - adjust according to actual data retrieval method

//                 let top_data = TopData {
//                     full_name: project_info.user_data.full_name.clone(),
//                     profile_picture: Some(project_info.project_logo.clone()),
//                     area_of_interest: project_info.project_area_of_focus.clone(),
//                     country: project_info.user_data.country.clone(),
//                     joined_on: project_internal.creation_date.clone(),
//                 };

//                 project_counts.push((project_internal.uid.clone(), top_data, total_count));
//             }
//         }
//     });

//     // Sorting by the total count of mentors and VCs in descending order
//     project_counts.sort_by(|a, b| b.2.cmp(&a.2));

//     // Taking the top 5 projects based on total counts
//     project_counts.into_iter().take(5).collect()
// }

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TopDataProject {
    full_name: String,
    profile_picture: Option<Vec<u8>>, // Assuming profile_picture is optional
    area_of_interest: String,
    country: String,
    joined_on: u64,
    principal: Principal,
}

#[query(guard = "is_admin")]
fn get_top_5_projects() -> Vec<(String, TopDataProject, usize)> {
    read_state(|state| {
        let projects = &state.project_storage;

        let mut project_counts: Vec<(String, TopDataProject, usize)> = projects.iter()
            .flat_map(|(principal, project_infos)| {
                project_infos.0.iter().map(move |project_internal| {
                    let mentor_count = project_internal.params.mentors_assigned.as_ref().map_or(0, |v| v.len());
                    let vc_count = project_internal.params.vc_assigned.as_ref().map_or(0, |v| v.len());
                    let total_count = mentor_count + vc_count;

                    let top_data = TopDataProject {
                        full_name: project_internal.params.user_data.full_name.clone(),
                        profile_picture: project_internal.params.project_logo.clone(),
                        area_of_interest: project_internal.params.project_area_of_focus.clone(),
                        country: project_internal.params.user_data.country.clone(),
                        joined_on: project_internal.creation_date,
                        principal: principal.0,
                    };

                    (project_internal.uid.clone(), top_data, total_count)
                }).collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        // Sorting by the total count of mentors and VCs in descending order
        project_counts.sort_by(|a, b| b.2.cmp(&a.2));

        // Taking the top 5 projects based on total counts
        project_counts.into_iter().take(5).collect()
    })
}

// #[query(guard = "is_admin")]
// fn get_top_5_projects() -> Vec<(String, TopData, usize)> {
//     // Temporarily holding the projects to sort and filter
//     let mut project_counts: Vec<(Principal, String, TopData, usize)> = Vec::new();

//     APPLICATION_FORM.with(|application_form| {
//         let application_form = application_form.borrow();

//         for (principal, projects) in application_form.iter() {

//             for project_internal in projects {

//                 let project_info = &project_internal.params;

//                 let mentor_count = project_info
//                     .mentors_assigned
//                     .as_ref()
//                     .map_or(0, |v| v.len());
//                 let vc_count = project_info.vc_assigned.as_ref().map_or(0, |v| v.len());
//                 let total_count = mentor_count + vc_count;

//                 let top_data = TopData {
//                     full_name: project_info.user_data.full_name.clone(),
//                     profile_picture: Some(project_info.project_logo.clone()),
//                     area_of_interest: project_info.project_area_of_focus.clone(),
//                     country: project_info.user_data.country.clone(),
//                     joined_on: project_internal.creation_date.clone(),
//                 };

//                 project_counts.push((*principal, project_internal.uid.clone(), top_data, total_count));
//             }
//         }
//     });

//     // Sorting by the total count of mentors and VCs in descending order
//     project_counts.sort_by(|a, b| b.2.cmp(&a.2));

//     // Taking the top 5 projects based on total counts
//     project_counts.into_iter().take(5).collect()
// }

#[query(guard = "is_admin")]
pub fn change_live_status(
    project_principal: Principal,
    project_id: String,
    live_status: bool,
    new_dapp_link: Option<String>,
) -> Result<String, String> {
    mutate_state(|state| {
        // Access the projects registry
        if let Some(mut project_list) = state
            .project_storage
            .get(&StoredPrincipal(project_principal))
        {
            if let Some(project_internal) = project_list.0.iter_mut().find(|p| p.uid == project_id)
            {
                // Log before update
                ic_cdk::println!(
                    "Before update: live_on_icp_mainnet = {:?}, dapp_link = {:?}",
                    project_internal.params.live_on_icp_mainnet,
                    project_internal.params.dapp_link
                );

                // Update project status and link based on live_status
                project_internal.params.live_on_icp_mainnet = Some(live_status);
                project_internal.params.dapp_link = if live_status {
                    new_dapp_link.clone()
                } else {
                    None
                };

                // Log after update
                ic_cdk::println!(
                    "After update: live_on_icp_mainnet = {:?}, dapp_link = {:?}",
                    project_internal.params.live_on_icp_mainnet,
                    project_internal.params.dapp_link
                );

                // Return success message
                return Ok(format!(
                    "Project updated successfully: live_on_icp_mainnet = {:?}, dapp_link = {:?}",
                    project_internal.params.live_on_icp_mainnet, project_internal.params.dapp_link
                ));
            }
        }

        // Log if the project is not found
        ic_cdk::println!("Project with ID: {} not found.", project_id);
        Err("Project not found.".to_string())
    })
}

#[query(guard = "is_admin")]

// fn get_user_all_data(user_principal: Principal) {}

pub fn get_vc_info_combined(caller: Principal) -> Option<VentureCapitalistInternal> {
    // First attempt with get_vc_info_using_principal
    if let Some(vc_info) = get_vc_info_using_principal(caller) {
        return Some(vc_info);
    }

    // Second attempt with get_vc_awaiting_info_using_principal
    if let Some(vc_awaiting_info) = get_vc_awaiting_info_using_principal(caller) {
        return Some(vc_awaiting_info);
    }

    if let Some(vc_declined_info) = get_vc_declined_info_using_principal(caller) {
        return Some(vc_declined_info);
    }

    // Return None if both attempts fail
    None
}

#[query(guard = "is_admin")]
pub fn get_mentor_info_combined(caller: Principal) -> Option<MentorInternal> {
    // First attempt with get_vc_info_using_principal
    if let Some(vc_info) = get_mentor_info_using_principal(caller) {
        return Some(vc_info);
    }

    // Second attempt with get_vc_awaiting_info_using_principal
    if let Some(vc_awaiting_info) = get_mentor_awaiting_info_using_principal(caller) {
        return Some(vc_awaiting_info);
    }

    if let Some(mentor_declined_info) = get_mentor_declined_info_using_principal(caller) {
        return Some(mentor_declined_info);
    }

    // Return None if both attempts fail
    None
}

#[query(guard = "is_admin")]
pub fn get_project_info_combined(caller: Principal) -> Option<ProjectInfoInternal> {
    // First attempt with get_vc_info_using_principal
    if let Some(vc_info) = get_project_info_using_principal(caller) {
        return Some(vc_info);
    }

    // Second attempt with get_vc_awaiting_info_using_principal
    if let Some(vc_awaiting_info) = get_project_awaiting_info_using_principal(caller) {
        return Some(vc_awaiting_info);
    }

    if let Some(vc_declined_info) = get_project_declined_info_using_principal(caller) {
        return Some(vc_declined_info);
    }

    // Return None if both attempts fail
    None
}

#[query(guard = "is_admin")]
pub fn get_user_all_data(
    caller: Principal,
) -> (
    Option<UserInfoInternal>,
    Option<VentureCapitalistInternal>,
    Option<MentorInternal>,
    Option<ProjectInfoInternal>,
    Vec<Role>,
) {
    let user_info = get_user_info_using_principal(caller);
    let vc_info = get_vc_info_combined(caller);
    let mentor_info = get_mentor_info_combined(caller);
    let project_info = get_project_info_combined(caller);

    let role_status_info = get_roles_for_principal(caller);

    (
        user_info,
        vc_info,
        mentor_info,
        project_info,
        role_status_info,
    )
}

#[query(guard = "is_admin")]
fn count_live_projects() -> usize {
    read_state(|state| {
        state
            .project_storage
            .iter()
            .flat_map(|(_principal, projects)| {
                projects
                    .0
                    .iter()
                    .filter(|project_internal| {
                        let project_info = &project_internal.params;
                        project_info.live_on_icp_mainnet == Some(true)
                            && project_info
                                .dapp_link
                                .as_ref()
                                .map_or(false, |d| !d.is_empty())
                    })
                    .cloned()
                    .collect::<Vec<_>>()
            })
            .count()
    })
}

// #[update(guard = "is_admin")]
// pub async fn update_vc_profile(requester: Principal, mut vc_internal: VentureCapitalist) -> String {
//     let temp_image = vc_internal.user_data.profile_picture.clone();
//     let canister_id = crate::asset_manager::get_asset_canister();

//     if temp_image.is_none() {
//         let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
//         vc_internal.user_data.profile_picture = Some((full_url).as_bytes().to_vec());
//     } else if temp_image.clone().unwrap().len() < 300 {
//         ic_cdk::println!("Profile image is already uploaded");
//     } else {
//         let key = "/uploads/".to_owned() + &requester.to_string() + "_user.jpeg";

//         let arg = StoreArg {
//             key: key.clone(),
//             content_type: "image/*".to_string(),
//             content_encoding: "identity".to_string(),
//             content: ByteBuf::from(temp_image.unwrap()),
//             sha256: None,
//         };

//         let delete_asset = DeleteAsset { key: key.clone() };

//         let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
//             .await
//             .unwrap();

//         let (result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

//         vc_internal.user_data.profile_picture =
//             Some((canister_id.to_string() + &key).as_bytes().to_vec());
//     }
//     mutate_state(|state| {
//         if let Some(mut existing_vc_internal) = state.vc_storage.get(&StoredPrincipal(requester)) {
//             existing_vc_internal.0.params.registered_under_any_hub = vc_internal
//                 .registered_under_any_hub
//                 .clone()
//                 .or(existing_vc_internal
//                     .0
//                     .params
//                     .registered_under_any_hub
//                     .clone());

//             existing_vc_internal.0.params.project_on_multichain = vc_internal
//                 .project_on_multichain
//                 .clone()
//                 .or(existing_vc_internal.0.params.project_on_multichain.clone());

//             existing_vc_internal.0.params.money_invested = vc_internal
//                 .money_invested
//                 .clone()
//                 .or(existing_vc_internal.0.params.money_invested.clone());

//             existing_vc_internal.0.params.existing_icp_portfolio = vc_internal
//                 .existing_icp_portfolio
//                 .clone()
//                 .or(existing_vc_internal.0.params.existing_icp_portfolio.clone());
//             existing_vc_internal.0.params.announcement_details = vc_internal
//                 .announcement_details
//                 .clone()
//                 .or(existing_vc_internal.0.params.announcement_details.clone());

//             existing_vc_internal.0.params.registered_country = vc_internal
//                 .registered_country
//                 .clone()
//                 .or(existing_vc_internal.0.params.registered_country.clone());

//             existing_vc_internal.0.params.fund_size = Some(
//                 vc_internal
//                     .fund_size
//                     .map(|size| (size * 100.0).round() / 100.0)
//                     .unwrap_or(0.0),
//             );
//             existing_vc_internal.0.params.assets_under_management =
//                 vc_internal.assets_under_management.clone();

//             existing_vc_internal.0.params.category_of_investment =
//                 vc_internal.category_of_investment.clone();

//             existing_vc_internal.0.params.logo = vc_internal.logo.clone();
//             existing_vc_internal.0.params.average_check_size =
//                 (vc_internal.average_check_size * 100.0).round() / 100.0;
//             existing_vc_internal.0.params.existing_icp_investor = vc_internal.existing_icp_investor;
//             existing_vc_internal.0.params.investor_type = vc_internal.investor_type.clone();
//             existing_vc_internal.0.params.number_of_portfolio_companies =
//                 vc_internal.number_of_portfolio_companies;
//             existing_vc_internal.0.params.portfolio_link = vc_internal.portfolio_link.clone();
//             existing_vc_internal.0.params.reason_for_joining =
//                 vc_internal.reason_for_joining.clone();
//             existing_vc_internal.0.params.name_of_fund = vc_internal.name_of_fund.clone();

//             existing_vc_internal.0.params.preferred_icp_hub = vc_internal.preferred_icp_hub.clone();
//             existing_vc_internal.0.params.type_of_investment =
//                 vc_internal.type_of_investment.clone();
//             existing_vc_internal.0.params.user_data = vc_internal.user_data.clone();
//             existing_vc_internal.0.params.linkedin_link = vc_internal.linkedin_link.clone();
//             existing_vc_internal.0.params.website_link = vc_internal.website_link.clone();
//             existing_vc_internal.0.params.registered = vc_internal.registered.clone();

//             "Venture Capitalist profile updated successfully.".to_string()
//         } else {
//             // This else block handles the case where the `requester` does not exist in `VENTURECAPITALIST_STORAGE`
//             "Venture Capitalist profile not found.".to_string()
//         }
//     })
// }

// #[update(guard = "is_admin")]
// pub async fn update_mentor_profile(
//     requester: Principal,
//     mut updated_profile: MentorProfile,
// ) -> String {
//     let temp_image = updated_profile.user_data.profile_picture.clone();
//     let canister_id = crate::asset_manager::get_asset_canister();

//     if temp_image.is_none() {
//         let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
//         updated_profile.user_data.profile_picture = Some((full_url).as_bytes().to_vec());
//     } else if temp_image.clone().unwrap().len() < 300 {
//         ic_cdk::println!("Profile image is already uploaded");
//     } else {
//         let key = "/uploads/".to_owned() + &requester.to_string() + "_user.jpeg";

//         let arg = StoreArg {
//             key: key.clone(),
//             content_type: "image/*".to_string(),
//             content_encoding: "identity".to_string(),
//             content: ByteBuf::from(temp_image.unwrap()),
//             sha256: None,
//         };

//         let delete_asset = DeleteAsset { key: key.clone() };

//         let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
//             .await
//             .unwrap();

//         let (result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

//         updated_profile.user_data.profile_picture =
//             Some((canister_id.to_string() + &key).as_bytes().to_vec());
//     }
//     mutate_state(|state| {
//         if let Some(mut mentor_internal) = state.mentor_storage.get(&StoredPrincipal(requester)) {
//             mentor_internal.0.profile.preferred_icp_hub = updated_profile
//                 .preferred_icp_hub
//                 .clone()
//                 .or(mentor_internal.0.profile.preferred_icp_hub.clone());

//             mentor_internal.0.profile.multichain = updated_profile
//                 .multichain
//                 .clone()
//                 .or(mentor_internal.0.profile.multichain.clone());
//             mentor_internal.0.profile.existing_icp_project_porfolio = updated_profile
//                 .existing_icp_project_porfolio
//                 .clone()
//                 .or(mentor_internal
//                     .0
//                     .profile
//                     .existing_icp_project_porfolio
//                     .clone());

//             mentor_internal.0.profile.area_of_expertise = updated_profile.area_of_expertise.clone();
//             mentor_internal.0.profile.category_of_mentoring_service =
//                 updated_profile.category_of_mentoring_service.clone();

//             mentor_internal.0.profile.existing_icp_mentor =
//                 updated_profile.existing_icp_mentor.clone();
//             mentor_internal.0.profile.icp_hub_or_spoke = updated_profile.icp_hub_or_spoke.clone();
//             mentor_internal.0.profile.linkedin_link = updated_profile.linkedin_link.clone();
//             mentor_internal.0.profile.website = updated_profile.website.clone();
//             mentor_internal.0.profile.years_of_mentoring =
//                 updated_profile.years_of_mentoring.clone();
//             mentor_internal.0.profile.reason_for_joining =
//                 updated_profile.reason_for_joining.clone();
//             mentor_internal.0.profile.user_data = updated_profile.user_data.clone();
//             mentor_internal.0.profile.hub_owner = updated_profile
//                 .hub_owner
//                 .clone()
//                 .or(mentor_internal.0.profile.hub_owner.clone());
//             "Mentor profile updated successfully.".to_string()
//         } else {
//             "Mentor profile not found.".to_string()
//         }
//     })
// }

//cohort admin operations

pub async fn send_cohort_request_to_admin(cohort_request: CohortRequest) -> String {
    let cohort_id = cohort_request.cohort_details.cohort_id.clone(); // Clone the cohort ID for use in the message.
    let message = format!(
        "Cohort creation request with ID {} has been sent to admin.",
        cohort_id
    );

    mutate_state(|state| {
        let cohort_requests = &mut state.cohort_request_admin;

        if let Some(mut requests) = cohort_requests.get(&cohort_request.cohort_details.cohort_id) {
            requests.0.push(cohort_request);
        } else {
            cohort_requests.insert(
                cohort_request.cohort_details.cohort_id.clone(),
                Candid(vec![cohort_request]),
            );
        }
    });

    ic_cdk::println!("REQUEST HAS BEEN SENT TO ADMIN"); // Confirm the action in the logs
    message
}

#[query(guard = "is_admin")]
pub fn get_pending_cohort_requests_for_admin() -> Vec<CohortRequest> {
    read_state(|state| {
        let mut pending_requests = Vec::new();
        for (_cohort_id, candid_requests) in state.cohort_request_admin.iter() {
            pending_requests.extend(candid_requests.0.clone());
        }
        pending_requests
    })
}

#[update(guard = "is_admin")]
pub fn accept_cohort_creation_request(cohort_id: String) -> String {
    let already_accepted = read_state(|state| {
        state
            .accepted_cohorts
            .get(&cohort_id)
            .map_or(false, |requests| requests.0.iter().any(|r| r.request_status == "accepted"))
    });

    if already_accepted {
        return format!("Cohort request with id: {} has already been accepted.", cohort_id);
    }

    let mut response_message = String::new();
    mutate_state(|state| {
        let mut request_found_and_updated = false;

        // Check and update the request status to accepted
        if let Some(mut requests) = state.cohort_request_admin.get(&cohort_id) {
            if let Some(index) = requests.0.iter().position(|r| r.request_status == "pending") {
                let mut request = requests.0.remove(index);
                request.request_status = "accepted".to_string();
                request.accepted_at = ic_cdk::api::time();

                // Add updated request to cohort_info
                state.cohort_info.insert(cohort_id.clone(), Candid(request.cohort_details.clone()));
                if !requests.0.is_empty() {
                    state.cohort_request_admin.insert(cohort_id.clone(), Candid(requests.0.clone()));
                } else {
                    // Otherwise, remove the entry if no requests are left
                    state.cohort_request_admin.remove(&cohort_id);
                }

                // Add or update the accepted_cohorts list
                if let Some(mut existing) = state.accepted_cohorts.get(&cohort_id) {
                    existing.0.push(request);
                } else {
                    state.accepted_cohorts.insert(cohort_id.clone(), Candid(vec![request]));
                }

                request_found_and_updated = true;
                response_message = format!("Cohort request with id: {} has been accepted.", cohort_id);
            }
        }

        if !request_found_and_updated {
            response_message = format!("No pending cohort request found with cohort id: {}", cohort_id);
        }
    });

    response_message
}


#[update(guard = "is_admin")]
pub fn decline_cohort_creation_request(cohort_id: String) -> String {
    let mut response_message = String::new();

    mutate_state(|state| {
        let mut request_found_and_updated = false;

        // Access and modify the pending request
        if let Some(mut requests) = state.cohort_request_admin.get(&cohort_id) {
            if let Some(index) = requests.0.iter().position(|r| r.request_status == "pending") {
                let mut request = requests.0.remove(index);
                request.request_status = "declined".to_string();
                request.rejected_at = ic_cdk::api::time();

                // Check if there is an existing list for declined cohorts
                if let Some(mut existing) = state.declined_cohorts.get(&cohort_id) {
                    existing.0.push(request);
                } else {
                    // If no list exists, create one and add the declined request
                    state.declined_cohorts.insert(cohort_id.clone(), Candid(vec![request]));
                }

                request_found_and_updated = true;
                response_message = format!(
                    "You have declined the cohort creation request: {}",
                    cohort_id
                );
            }
        }

        if !request_found_and_updated {
            response_message = format!(
                "No pending cohort request found with cohort id: {}",
                cohort_id
            );
        }
    });

    response_message
}


#[query(guard = "is_admin")]
pub fn get_accepted_cohort_creation_request_for_admin() -> Vec<CohortRequest> {
    read_state(|state| {
        let mut accepted_requests = Vec::new();
        for (_cohort_id, candid_requests) in state.accepted_cohorts.iter() {
            accepted_requests.extend(candid_requests.0.clone());
        }
        accepted_requests
    })
}

#[query(guard = "is_admin")]
pub fn get_declined_cohort_creation_request_for_admin() -> Vec<CohortRequest> {
    read_state(|state| {
        let mut declined_requests = Vec::new();
        for (_cohort_id, candid_requests) in state.declined_cohorts.iter() {
            declined_requests.extend(candid_requests.0.clone());
        }
        declined_requests
    })
}

#[update(guard = "is_admin")]
pub fn remove_mentor_from_cohort(
    cohort_id: String,
    uid: String,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", uid);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }
    let stored_mentor_principal = find_mentor_by_uid(uid.clone());
    let mentor_principal = stored_mentor_principal.0;
    mutate_state(|state| {
        if let Some(mentor_up_for_cohort) =
            state.mentor_storage.get(&StoredPrincipal(mentor_principal))
        {
            let mentor_clone = mentor_up_for_cohort.0.clone();

            if let Some(mut mentors) = state.mentor_applied_for_cohort.get(&cohort_id) {
                if let Some(index) = mentors.0.iter().position(|x| *x == mentor_clone) {
                    let mentor_data = mentors.0.remove(index);

                    if let Some(mut removed_mentors) =
                        state.mentor_removed_from_cohort.get(&cohort_id)
                    {
                        removed_mentors.0.push((mentor_principal, mentor_data));
                    } else {
                        state.mentor_removed_from_cohort.insert(
                            cohort_id.clone(),
                            Candid(vec![(mentor_principal, mentor_data)]),
                        );
                    }

                    if let Some(mut count) = state.applier_count.get(&cohort_id) {
                        count = count.saturating_sub(1);
                    }

                    return Ok(format!(
                        "Mentor successfully removed from the cohort with cohort id {}",
                        cohort_id
                    ));
                } else {
                    return Err("You are not part of this cohort".to_string());
                }
            } else {
                return Err("No mentors found for this cohort".to_string());
            }
        } else {
            return Err("Invalid mentor record".to_string());
        }
    })
}

#[update(guard = "is_admin")]
pub fn send_rejoin_invitation_to_mentor(
    cohort_id: String,
    mentor_principal: Principal,
    invite_message: String,
) -> Result<String, String> {
    let result = mutate_state(|state| {
        if let Some(mut mentors) = state.mentor_removed_from_cohort.get(&cohort_id) {
            if let Some((index, _)) = mentors
                .0
                .iter()
                .enumerate()
                .find(|(_, (pr, _))| *pr == mentor_principal)
            {
                let (principal, mentor_data) = mentors.0.remove(index);
                let invite_request = InviteRequest {
                    cohort_id: cohort_id.clone(),
                    sender_principal: principal,
                    mentor_data,
                    invite_message: invite_message.clone(),
                };

                if let Some(_) = state.mentor_invite_request.get(&cohort_id) {
                    state
                        .mentor_invite_request
                        .insert(cohort_id.clone(), Candid(invite_request));
                } else {
                    state
                        .mentor_invite_request
                        .insert(cohort_id.clone(), Candid(invite_request));
                }

                return Ok("Invitation sent to rejoin the cohort.".to_string());
            }
        }
        Err("No removed mentor found for this principal in the specified cohort.".to_string())
    });

    result
}

#[update(guard = "is_admin")]
pub fn accept_rejoin_invitation(cohort_id: String) -> Result<String, String> {
    let result = mutate_state(|state| {
        if let Some(invite_request) = state.mentor_invite_request.remove(&cohort_id) {
            let mentors = state.mentor_applied_for_cohort.get(&cohort_id);
            match mentors {
                Some(mut candid_mentors) => {
                    candid_mentors.0.push(invite_request.0.mentor_data);
                }
                None => {
                    state.mentor_applied_for_cohort.insert(
                        cohort_id.clone(),
                        Candid(vec![invite_request.0.mentor_data]),
                    );
                }
            }
            return Ok(format!(
                "Mentor has successfully rejoined the cohort {}",
                cohort_id
            ));
        }
        Err("No pending invitation found for this cohort.".to_string())
    });

    result
}

#[update(guard = "is_admin")]
pub fn decline_rejoin_invitation(cohort_id: String) -> Result<String, String> {
    let result = mutate_state(|state| {
        if state.mentor_invite_request.remove(&cohort_id).is_some() {
            return Ok(format!(
                "Mentor has declined the invitation to rejoin the cohort {}",
                cohort_id
            ));
        }
        Err("No pending invitation found for this cohort.".to_string())
    });

    result
}

#[query(guard = "is_admin")]
pub fn get_my_invitation_request(cohort_id: String) -> Result<InviteRequest, String> {
    let principal_id = ic_cdk::api::caller();

    read_state(|state| {
        if let Some(invite_request) = state.mentor_invite_request.get(&cohort_id) {
            if invite_request.0.sender_principal == principal_id {
                return Ok(invite_request.0.clone());
            } else {
                return Err("You are not authorized to view this invitation.".to_string());
            }
        }
        Err("No pending invitation found for this cohort.".to_string())
    })
}

#[query(guard = "is_admin")]
pub fn get_left_mentors_of_cohort(cohort_id: String) -> Vec<MentorInternal> {
    read_state(|state| {
        if let Some(mentors) = state.mentor_removed_from_cohort.get(&cohort_id) {
            return mentors
                .0
                .iter()
                .map(|(_, mentor_data)| mentor_data.clone())
                .collect();
        }
        Vec::new()
    })
}

#[update(guard = "is_admin")]
pub fn remove_vc_from_cohort(
    cohort_id: String,
    uid: String,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", uid);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }

    let stored_vc_principal = find_vc_by_uid(uid.clone());
    let vc_principal = stored_vc_principal.0;

    mutate_state(|state| {
        if let Some(vc_up_for_cohort) = state.vc_storage.get(&StoredPrincipal(vc_principal)) {
            let vc_clone = vc_up_for_cohort.0.clone();

            if let Some(mut vcs) = state.vc_applied_for_cohort.get(&cohort_id) {
                if let Some(index) = vcs.0.iter().position(|x| *x == vc_clone) {
                    vcs.0.remove(index);

                    if let Some(mut count) = state.applier_count.get(&cohort_id) {
                        count = count.saturating_sub(1);
                    }

                    Ok(format!(
                        "Venture capitalist successfully removed from the cohort with cohort id {}",
                        cohort_id
                    ))
                } else {
                    Err("You are not part of this cohort".to_string())
                }
            } else {
                Err("No venture capitalists found for this cohort".to_string())
            }
        } else {
            Err("Invalid venture capitalist record".to_string())
        }
    })
}

#[update(guard = "is_admin")]
pub fn remove_project_from_cohort(
    cohort_id: String,
    project_uid: String,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", project_uid);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }
    mutate_state(|state| {
        if let Some(mut projects) = state.project_applied_for_cohort.get(&cohort_id) {
            if let Some(index) = projects.0.iter().position(|p| p.uid == project_uid) {
                projects.0.remove(index);

                if let Some(mut count) = state.applier_count.get(&cohort_id) {
                    count = count.saturating_sub(1);
                }

                return Ok("Project successfully removed from the cohort.".to_string());
            } else {
                return Err("Project not found in this cohort.".to_string());
            }
        } else {
            return Err("Cohort not found or no projects applied.".to_string());
        }
    })
}

#[update(guard = "is_admin")]
pub fn admin_update_project(
    uid: String,
    is_live: bool,
    dapp_link: Option<String>,
) -> Result<(), String> {
    let mut project_to_classify = None;

    mutate_state(|state| {
        for (_key, mut project_list) in state.project_storage.iter() {
            if let Some(project_pos) = project_list.0.iter_mut().position(|p| p.uid == uid) {
                let project = &mut project_list.0[project_pos];
                project.params.live_on_icp_mainnet = Some(is_live);
                project.params.dapp_link = dapp_link.clone();
                project_to_classify = Some(project.clone());
                state.project_storage.insert(_key, project_list);
                break;
            }
        }
    });

    if let Some(project) = project_to_classify {
        match crate::latest_popular_projects::update_project_status_live_incubated(project) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to reclassify project: {}", e)),
        }
    } else {
        Err(format!("Project with UID {} not found.", uid))
    }
}

#[update(guard = "is_admin")]
pub fn deactivate_and_remove_project(project_id: String) -> Result<&'static str, &'static str> {
    let mut found_and_updated_in_application = false;
    let mut found_in_live_projects = false;

    // Update the project in project_storage
    mutate_state(|state| {
        for (_key, mut project_list) in state.project_storage.iter() {
            if let Some(project) = project_list.0.iter_mut().find(|p| p.uid == project_id) {
                project.params.live_on_icp_mainnet = Some(false);
                project.params.dapp_link = None;
                found_and_updated_in_application = true;
                state.project_storage.insert(_key, project_list);
                break;
            }
        }
    });

    if !found_and_updated_in_application {
        return Err("Project not found in main application storage.");
    }

    // Remove the project from live_projects
    mutate_state(|state| {
        if state.live_projects.remove(&project_id).is_some() {
            found_in_live_projects = true;
        }
    });

    if found_in_live_projects {
        Ok("Project successfully deactivated and removed from live projects.")
    } else {
        Err("Project was updated in main storage but not found in live projects.")
    }
}

#[update(guard = "is_admin")]
pub fn remove_project_from_incubated(project_id: String) -> Result<&'static str, &'static str> {
    mutate_state(|state| {
        if state.incubated_projects.remove(&project_id).is_some() {
            Ok("Project successfully removed from incubated projects.")
        } else {
            Err("Project not found in incubated projects.")
        }
    })
}

#[query(guard = "is_admin")]
pub fn get_update_request_count() -> UpdateCounts {
    read_state(|state| {
        let project_update_count = state.pending_project_details.len() as u32;
        let mentor_update_count = state.mentor_profile_edit_awaits.len() as u32;
        let vc_update_count = state.vc_profile_edit_awaits.len() as u32;

        UpdateCounts {
            project_update: Some(project_update_count),
            mentor_update: Some(mentor_update_count),
            vc_update: Some(vc_update_count),
        }
    })
}

#[query(guard = "is_admin")]
pub fn get_project_update_declined_request() -> HashMap<String, ProjectUpdateRequest> {
    read_state(|state| {
        state
            .declined_project_details
            .iter()
            .map(|(key, value)| (key.clone(), value.0.clone()))
            .collect()
    })
}

#[query(guard = "is_admin")]
pub fn get_mentor_update_declined_request() -> HashMap<Principal, MentorUpdateRequest> {
    read_state(|state| {
        state
            .mentor_profile_edit_declined
            .iter()
            .map(|(key, value)| (key.0, value.0.clone()))
            .collect()
    })
}

#[query(guard = "is_admin")]
pub fn get_vc_update_declined_request() -> HashMap<Principal, UpdateInfoStruct> {
    read_state(|state| {
        state
            .vc_profile_edit_declined
            .iter()
            .map(|(key, value)| (key.0, value.0.clone()))
            .collect()
    })
}

#[update(guard = "is_admin")]
pub fn delete_user_using_principal(principal: Principal) -> String {
    let stored_principal = StoredPrincipal(principal);

    mutate_state(|state| {
        if state.user_storage.remove(&stored_principal).is_some() {
            state.role_status.remove(&stored_principal);
            "User successfully deleted".to_string()
        } else {
            "User not found".to_string()
        }
    })
}

#[update(guard = "is_admin")]
pub fn delete_project_using_principal(principal: Principal) -> String {
    mutate_state(|state| {
        if state
            .project_storage
            .remove(&StoredPrincipal(principal))
            .is_some()
        {
            "Project successfully deleted".to_string()
        } else {
            "Project not found".to_string()
        }
    })
}

#[update(guard = "is_admin")]
pub fn delete_mentor_using_principal(principal: Principal) -> String {
    mutate_state(|state| {
        if state
            .mentor_storage
            .remove(&StoredPrincipal(principal))
            .is_some()
        {
            "Mentor successfully deleted".to_string()
        } else {
            "Mentor not found".to_string()
        }
    })
}

#[update(guard = "is_admin")]
pub fn delete_vc_using_principal(principal: Principal) -> String {
    mutate_state(|state| {
        if state
            .vc_storage
            .remove(&StoredPrincipal(principal))
            .is_some()
        {
            "VC successfully deleted".to_string()
        } else {
            "VC not found".to_string()
        }
    })
}

//b5pqo-yef5a-lut3t-kmrpc-h7dnp-v3d2t-ls6di-y33wa-clrtb-xdhl4-dae

#[update(guard = "is_admin")]
pub fn delete_mentor_announcement_by_index(mentor_principal: Principal, index: usize) -> String {
    mutate_state(|state| {
        if let Some(mut ann_list) = state
            .mentor_announcement
            .get(&StoredPrincipal(mentor_principal))
        {
            if index < ann_list.0.len() {
                ann_list.0.remove(index);
                "Announcement successfully deleted.".to_string()
            } else {
                "Invalid index provided, out of bounds.".to_string()
            }
        } else {
            "No announcements found for this mentor.".to_string()
        }
    })
}

#[update(guard = "is_admin")]
pub fn delete_project_announcement_by_index(project_principal: Principal, index: usize) -> String {
    mutate_state(|state| {
        if let Some(mut ann_list) = state
            .project_announcement
            .get(&StoredPrincipal(project_principal))
        {
            if index < ann_list.0.len() {
                ann_list.0.remove(index);
                "Announcement successfully deleted.".to_string()
            } else {
                "Invalid index provided, out of bounds.".to_string()
            }
        } else {
            "No announcements found for this project.".to_string()
        }
    })
}

#[update(guard = "is_admin")]
pub fn delete_vc_announcement_by_index(vc_principal: Principal, index: usize) -> String {
    mutate_state(|state| {
        if let Some(mut ann_list) = state.vc_announcement.get(&StoredPrincipal(vc_principal)) {
            if index < ann_list.0.len() {
                ann_list.0.remove(index);
                "Announcement successfully deleted.".to_string()
            } else {
                "Invalid index provided, out of bounds.".to_string()
            }
        } else {
            "No announcements found for this venture capitalist.".to_string()
        }
    })
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct NameDetails {
    pub vc_name: Vec<String>,
    pub mentor_name: Vec<String>,
}

// #[query(guard = "is_admin")]
// pub fn get_vc_and_mentor_name() -> NameDetails {
//     let vc_names = read_state(|state| {
//         state.vc_storage.iter()
//             .map(|(_, vc_data)| vc_data.0.params.user_data.full_name.clone())  
//             .collect::<Vec<String>>()
//     });

//     let mentor_names = read_state(|state| {
//         state.mentor_storage.iter()
//             .map(|(_, mentor_data)| mentor_data.0.profile.user_data.full_name.clone())  
//             .collect::<Vec<String>>()
//     });

//     NameDetails {
//         vc_name: vc_names,
//         mentor_name: mentor_names,
//     }
// }


//b5pqo-yef5a-lut3t-kmrpc-h7dnp-v3d2t-ls6di-y33wa-clrtb-xdhl4-dae
