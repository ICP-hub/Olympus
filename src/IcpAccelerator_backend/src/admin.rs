use crate::associations::*;
use crate::mentor::*;
use crate::project_registration::*;
use crate::state_handler::mutate_state;
use crate::state_handler::read_state;
use crate::state_handler::Candid;
use crate::state_handler::StoredPrincipal;
use crate::user_module::*;
use crate::vc_registration::*;
use crate::cohort::InviteRequest;
use crate::CohortRequest;
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{canister_info, CanisterInfoRequest};
use ic_cdk::api::{caller, id};
use ic_cdk::api::{canister_balance128, time};
use ic_cdk::storage;
use ic_cdk::storage::stable_restore;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::cell::RefCell;
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

thread_local! {
    static ADMIN_NOTIFICATIONS : RefCell<HashMap<Principal, Vec<Notification>>> = RefCell::new(HashMap::new());
    static COHORT_REQUEST : RefCell<HashMap<String, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
    static ACCEPTED_COHORTS : RefCell<HashMap<String, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
    static DECLINED_COHORTS: RefCell<HashMap<String, Vec<CohortRequest>>> = RefCell::new(HashMap::new());
}

pub fn pre_upgrade_admin() {
    ADMIN_NOTIFICATIONS.with(
        |data| match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("ADMIN_NOTIFICATIONS saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save ADMIN_NOTIFICATIONS: {:?}", e),
        },
    );
}

pub fn post_upgrade_admin() {
    match stable_restore::<(HashMap<Principal, Vec<Notification>>,)>() {
        Ok((restored_admin_notifications,)) => {
            ADMIN_NOTIFICATIONS.with(|data| *data.borrow_mut() = restored_admin_notifications);
            ic_cdk::println!("ADMIN_NOTIFICATIONS restored successfully.");
        }
        Err(e) => ic_cdk::println!("Failed to restore ADMIN_NOTIFICATIONS: {:?}", e),
    }
}

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
        if let Some(mentor) = state.mentor_awaits_response.get(&StoredPrincipal(requester)) {
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
                state.mentor_storage.insert(StoredPrincipal(requester), mentor.clone());
                state.mentor_awaits_response.remove(&StoredPrincipal(requester));
                if let Some(mut user_roles) = state.role_status.get(&StoredPrincipal(requester)) {
                    if let Some(role) = user_roles.0.iter_mut().find(|r| r.name == "mentor") {
                        role.status = "approved".to_string();
                        role.approved_on = Some(time());
                    }
                }
            });

            if should_update {
                change_notification_status(requester, "mentor".to_string(), "approved".to_string());
            }
            format!("Requester with principal id {} is approved", requester)
        } else {
            format!("Requester with principal id {} could not be approved", requester)
        }
    } else {
        format!("Requester with principal id {} has not registered", requester)
    }
}


pub fn decline_mentor_creation_request(requester: Principal, decline: bool) -> String {
    mutate_state(|state| {
        if let Some(mut mentor_internal) = state
            .mentor_awaits_response
            .get(&StoredPrincipal(requester))
        {
            if decline {
                mentor_internal.0.decline = decline;
                mentor_internal.0.approve = false;

                if let Some(res) = state
                    .mentor_awaits_response
                    .get(&StoredPrincipal(requester))
                {
                    state
                        .mentor_declined_request
                        .insert(StoredPrincipal(requester), res);
                    if let Some(user_roles) = state.role_status.get(&StoredPrincipal(requester)) {
                        let mut roles_clone = user_roles.0.clone();
                        if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "mentor")
                        {
                            user_role.status = "default".to_string();
                            user_role.rejected_on = Some(time());
                        }
                    }

                    state
                        .mentor_awaits_response
                        .remove(&StoredPrincipal(requester));
                    change_notification_status(
                        requester,
                        "mentor".to_string(),
                        "declined".to_string(),
                    )
                } else {
                    return "Requester has not registered".to_string();
                }

                return format!("Requester with principal id {} is declined", requester);
            } else {
                return format!(
                    "Requester with principal id {} could not be declined",
                    requester
                );
            }
        } else {
            return format!(
                "Requester with principal id {} has not registered",
                requester
            );
        }
    });

    "".to_string() // Return an empty string in case no other value is returned
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


#[query]
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
#[derive(Serialize, Deserialize, Clone, CandidType)]
pub struct VcWithRoles {
    pub vc_profile: VentureCapitalistInternal,
    pub roles: Vec<Role>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
pub struct ProjectWithRoles {
    pub project_profile: ProjectInfoInternal,
    pub roles: Vec<Role>,
}

#[query]
pub fn mentors_awaiting_approval() -> HashMap<Principal, MentorWithRoles> {
    read_state(|state| {
        let mentor_awaiters = &state.mentor_awaits_response;

        let mut mentor_with_roles_map: HashMap<Principal, MentorWithRoles> = HashMap::new();

        for (principal, mentor_internal) in mentor_awaiters.iter() {
            let roles = get_roles_for_principal(principal.0);
            let mentor_with_roles = MentorWithRoles {
                mentor_profile: mentor_internal.0.clone(),
                roles,
            };

            mentor_with_roles_map.insert(principal.0, mentor_with_roles);
        }
        ic_cdk::println!("Mentors awaiting approval: {:?}", mentor_with_roles_map);
        mentor_with_roles_map
    })
}

#[query]
pub fn vc_awaiting_approval() -> HashMap<Principal, VcWithRoles> {
    read_state(|state| {
        let vc_awaiters = &state.vc_awaits_response;

        let mut vc_with_roles_map: HashMap<Principal, VcWithRoles> = HashMap::new();

        for (principal, vc_internal) in vc_awaiters.iter() {
            let roles = get_roles_for_principal(principal.0);
            let vc_with_roles = VcWithRoles {
                vc_profile: vc_internal.0.clone(),
                roles,
            };

            vc_with_roles_map.insert(principal.0, vc_with_roles);
        }

        vc_with_roles_map
    })
}

#[query]
pub fn project_awaiting_approval() -> HashMap<Principal, ProjectWithRoles> {
    read_state(|state| {
        let project_awaiters = &state.project_awaits_response;

        let mut project_with_roles_map: HashMap<Principal, ProjectWithRoles> = HashMap::new();

        for (principal, project_internal) in project_awaiters.iter() {
            let roles = get_roles_for_principal(principal.0);
            let project_with_roles = ProjectWithRoles {
                project_profile: project_internal.0.clone(),
                roles,
            };

            project_with_roles_map.insert(principal.0, project_with_roles);
        }

        project_with_roles_map
    })
}

#[query]
pub fn project_declined() -> HashMap<Principal, ProjectWithRoles> {
    read_state(|state| {
        let project_awaiters = &state.project_declined_request;

        let mut project_with_roles_map: HashMap<Principal, ProjectWithRoles> = HashMap::new();

        for (principal, project_internal) in project_awaiters.iter() {
            let roles = get_roles_for_principal(principal.0);
            let project_with_roles = ProjectWithRoles {
                project_profile: project_internal.0.clone(),
                roles,
            };

            project_with_roles_map.insert(principal.0, project_with_roles);
        }

        project_with_roles_map
    })
}

#[query]
pub fn vc_declined() -> HashMap<Principal, VcWithRoles> {
    read_state(|state| {
        let vc_awaiters = &state.vc_declined_request;

        let mut vc_with_roles_map: HashMap<Principal, VcWithRoles> = HashMap::new();

        for (principal, vc_internal) in vc_awaiters.iter() {
            let roles = get_roles_for_principal(principal.0);
            let vc_with_roles = VcWithRoles {
                vc_profile: vc_internal.0.clone(),
                roles,
            };

            vc_with_roles_map.insert(principal.0, vc_with_roles);
        }

        vc_with_roles_map
    })
}

#[query]
pub fn mentor_declined() -> HashMap<Principal, MentorWithRoles> {
    read_state(|state| {
        let mentor_awaiters = &state.mentor_declined_request;

        let mut mentor_with_roles_map: HashMap<Principal, MentorWithRoles> = HashMap::new();

        for (principal, mentor_internal) in mentor_awaiters.iter() {
            let roles = get_roles_for_principal(principal.0);
            let mentor_with_roles = MentorWithRoles {
                mentor_profile: mentor_internal.0.clone(),
                roles,
            };

            mentor_with_roles_map.insert(principal.0, mentor_with_roles);
        }

        mentor_with_roles_map
    })
}

#[query]
fn mentor_profile_edit_awaiting_approval() -> HashMap<Principal, MentorUpdateRequest> {
    read_state(|state| {
        state
            .mentor_profile_edit_awaits
            .iter()
            .map(|(stored_principal, request)| (stored_principal.0, request.0.clone()))
            .collect()
    })
}

#[query]
fn vc_profile_edit_awaiting_approval() -> HashMap<Principal, UpdateInfoStruct> {
    read_state(|state| {
        state
            .vc_profile_edit_awaits
            .iter()
            .map(|(stored_principal, request)| (stored_principal.0, request.0.clone()))
            .collect()
    })
}

#[query]
fn project_update_awaiting_approval() -> HashMap<String, ProjectUpdateRequest> {
    read_state(|state| {
        state
            .pending_project_details
            .iter()
            .map(|(stored_principal, request)| (stored_principal.to_string(), request.0.clone()))
            .collect()
    })
}

#[update]
pub fn decline_vc_creation_request(requester: Principal, decline: bool) -> String {
    mutate_state(|state| {
        if let Some(mut vc_internal) = state.vc_awaits_response.get(&StoredPrincipal(requester)) {
            if decline {
                vc_internal.0.decline = decline;
                vc_internal.0.approve = false;

                match state.vc_awaits_response.get(&StoredPrincipal(requester)) {
                    Some(res) => {
                        state
                            .vc_declined_request
                            .insert(StoredPrincipal(requester), Candid(res.0.clone()));
                        if let Some(user_roles) = state.role_status.get(&StoredPrincipal(requester))
                        {
                            let mut roles_clone = user_roles.0.clone();
                            if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "vc")
                            {
                                user_role.status = "default".to_string();
                                user_role.rejected_on = Some(time());
                            }
                        }

                        state.vc_awaits_response.remove(&StoredPrincipal(requester));
                        change_notification_status(
                            requester,
                            "vc".to_string(),
                            "declined".to_string(),
                        )
                    }
                    None => {
                        return format!(
                            "Requester with principal id {} has not registered",
                            requester
                        );
                    }
                }

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

#[update]
pub fn approve_vc_creation_request(requester: Principal, approve: bool) -> String {
    mutate_state(|state| {
        if let Some(mut vc_internal) = state.vc_awaits_response.get(&StoredPrincipal(requester)) {
            if approve || vc_internal.0.approve {
                vc_internal.0.decline = false;
                vc_internal.0.approve = approve;

                match state.vc_awaits_response.get(&StoredPrincipal(requester)) {
                    Some(res) => {
                        state
                            .vc_storage
                            .insert(StoredPrincipal(requester), Candid(res.0.clone()));

                        if let Some(user_roles) = state.role_status.get(&StoredPrincipal(requester))
                        {
                            let mut roles_clone = user_roles.0.clone();
                            if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "vc")
                            {
                                user_role.status = "approved".to_string();
                                user_role.approved_on = Some(time());
                            }
                        }

                        state.vc_awaits_response.remove(&StoredPrincipal(requester));
                        change_notification_status(
                            requester,
                            "vc".to_string(),
                            "approved".to_string(),
                        )
                    }
                    None => {
                        return format!(
                            "Requester with principal id {} has not registered",
                            requester
                        );
                    }
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
    })
}

#[update]
pub fn approve_vc_profile_update(requester: Principal, approve: bool) -> String {
    mutate_state(|state| {
        if let Some(vc_internal) = state
            .vc_profile_edit_awaits
            .get(&StoredPrincipal(requester))
        {
            if approve {
                if let Some(mut existing_vc_internal) =
                    state.vc_storage.get(&StoredPrincipal(requester))
                {
                    if let Some(update) = &vc_internal.0.updated_info {
                        existing_vc_internal.0.params.registered_under_any_hub = update
                            .registered_under_any_hub
                            .clone()
                            .or(existing_vc_internal
                                .0
                                .params
                                .registered_under_any_hub
                                .clone());

                        existing_vc_internal.0.params.project_on_multichain = update
                            .project_on_multichain
                            .clone()
                            .or(existing_vc_internal.0.params.project_on_multichain.clone());

                        existing_vc_internal.0.params.money_invested = update
                            .money_invested
                            .clone()
                            .or(existing_vc_internal.0.params.money_invested.clone());

                        existing_vc_internal.0.params.existing_icp_portfolio = update
                            .existing_icp_portfolio
                            .clone()
                            .or(existing_vc_internal.0.params.existing_icp_portfolio.clone());

                        existing_vc_internal.0.params.announcement_details = update
                            .announcement_details
                            .clone()
                            .or(existing_vc_internal.0.params.announcement_details.clone());

                        existing_vc_internal.0.params.registered_country = update
                            .registered_country
                            .clone()
                            .or(existing_vc_internal.0.params.registered_country.clone());

                        existing_vc_internal.0.params.fund_size = Some(
                            update
                                .fund_size
                                .map(|size| (size * 100.0).round() / 100.0)
                                .unwrap_or(0.0),
                        );

                        existing_vc_internal.0.params.assets_under_management =
                            update.assets_under_management.clone();

                        existing_vc_internal.0.params.category_of_investment =
                            update.category_of_investment.clone();

                        existing_vc_internal.0.params.logo = update.logo.clone();

                        existing_vc_internal.0.params.average_check_size =
                            (update.average_check_size * 100.0).round() / 100.0;

                        existing_vc_internal.0.params.existing_icp_investor =
                            update.existing_icp_investor;

                        existing_vc_internal.0.params.investor_type = update.investor_type.clone();

                        existing_vc_internal.0.params.number_of_portfolio_companies =
                            update.number_of_portfolio_companies;

                        existing_vc_internal.0.params.portfolio_link =
                            update.portfolio_link.clone();

                        existing_vc_internal.0.params.reason_for_joining =
                            update.reason_for_joining.clone();

                        existing_vc_internal.0.params.name_of_fund = update.name_of_fund.clone();

                        existing_vc_internal.0.params.preferred_icp_hub =
                            update.preferred_icp_hub.clone();

                        existing_vc_internal.0.params.type_of_investment =
                            update.type_of_investment.clone();

                        existing_vc_internal.0.params.user_data = update.user_data.clone();

                        existing_vc_internal.0.params.linkedin_link = update.linkedin_link.clone();

                        existing_vc_internal.0.params.website_link = update.website_link.clone();

                        existing_vc_internal.0.params.registered = update.registered.clone();
                    }
                }
            }

            state
                .vc_profile_edit_awaits
                .remove(&StoredPrincipal(requester));
            change_notification_status(requester, "vc".to_string(), "approved".to_string());

            if approve {
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
    })
}

#[update]
pub fn decline_vc_profile_update_request(requester: Principal, decline: bool) -> String {
    mutate_state(|state| {
        let previous_profile = state
            .vc_storage
            .get(&StoredPrincipal(requester))
            .map(|vc_internal| vc_internal.0.params.clone());

        if let Some(vc_internal) = state
            .vc_profile_edit_awaits
            .get(&StoredPrincipal(requester))
        {
            let declined_data = UpdateInfoStruct {
                original_info: previous_profile,
                updated_info: vc_internal.0.updated_info.clone(),
                approved_at: 0,
                rejected_at: time(),
                sent_at: 0,
            };
            if decline {
                state
                    .vc_profile_edit_declined
                    .insert(StoredPrincipal(requester), Candid(declined_data.clone()));
                state
                    .vc_profile_edit_awaits
                    .remove(&StoredPrincipal(requester));
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
    })
}

#[update]
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

#[update]

pub fn approve_mentor_profile_update(requester: Principal, approve: bool) -> String {
    mutate_state(|state| {
        if let Some(updated_profile) = state
            .mentor_profile_edit_awaits
            .get(&StoredPrincipal(requester))
        {
            if approve {
                if let Some(mut mentor_internal) =
                    state.mentor_storage.get(&StoredPrincipal(requester))
                {
                    if let Some(ref updated_info) = updated_profile.0.updated_info {
                        mentor_internal.0.profile.preferred_icp_hub = updated_info
                            .preferred_icp_hub
                            .clone()
                            .or(mentor_internal.0.profile.preferred_icp_hub.clone());

                        mentor_internal.0.profile.multichain = updated_info
                            .multichain
                            .clone()
                            .or(mentor_internal.0.profile.multichain.clone());

                        mentor_internal.0.profile.existing_icp_project_porfolio = updated_info
                            .existing_icp_project_porfolio
                            .clone()
                            .or(mentor_internal
                                .0
                                .profile
                                .existing_icp_project_porfolio
                                .clone());

                        mentor_internal.0.profile.area_of_expertise =
                            updated_info.area_of_expertise.clone();
                        mentor_internal.0.profile.category_of_mentoring_service =
                            updated_info.category_of_mentoring_service.clone();

                        mentor_internal.0.profile.existing_icp_mentor =
                            updated_info.existing_icp_mentor;
                        mentor_internal.0.profile.icp_hub_or_spoke = updated_info.icp_hub_or_spoke;
                        mentor_internal.0.profile.linkedin_link =
                            updated_info.linkedin_link.clone();
                        mentor_internal.0.profile.website = updated_info.website.clone();
                        mentor_internal.0.profile.years_of_mentoring =
                            updated_info.years_of_mentoring.clone();
                        mentor_internal.0.profile.reason_for_joining =
                            updated_info.reason_for_joining.clone();
                        mentor_internal.0.profile.user_data = updated_info.user_data.clone();
                        mentor_internal.0.profile.hub_owner = updated_info
                            .hub_owner
                            .clone()
                            .or(mentor_internal.0.profile.hub_owner.clone());
                    }
                }

                state
                    .mentor_profile_edit_awaits
                    .remove(&StoredPrincipal(requester));
                change_notification_status(requester, "mentor".to_string(), "approved".to_string());
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
    })
}

#[update]
pub fn decline_mentor_profile_update_request(requester: Principal, decline: bool) -> String {
    mutate_state(|state| {
        let previous_profile = state
            .mentor_storage
            .get(&StoredPrincipal(requester))
            .map(|mentor_internal| mentor_internal.0.profile.clone());

        if let Some(updated_profile) = state
            .mentor_profile_edit_awaits
            .get(&StoredPrincipal(requester))
        {
            let declined_data = MentorUpdateRequest {
                original_info: previous_profile,
                updated_info: updated_profile.0.updated_info.clone(),
                approved_at: 0,
                rejected_at: time(),
                sent_at: 0,
            };

            if decline {
                state
                    .mentor_profile_edit_declined
                    .insert(StoredPrincipal(requester), Candid(declined_data.clone()));
                state
                    .mentor_profile_edit_awaits
                    .remove(&StoredPrincipal(requester));
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
    })
}

#[update]
pub fn approve_project_creation_request(requester: Principal) -> String {
    mutate_state(|state| {
        if let Some(mut project_internal) = state
            .project_awaits_response
            .get(&StoredPrincipal(requester))
        {
            project_internal.0.is_verified = true;

            if let Some(res) = state
                .project_awaits_response
                .get(&StoredPrincipal(requester))
            {
                state
                    .project_storage
                    .insert(StoredPrincipal(requester), Candid(vec![res.0.clone()]));

                if let Some(user_roles) = state.role_status.get(&StoredPrincipal(requester)) {
                    let mut roles_clone = user_roles.0.clone();
                    if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "project") {
                        user_role.status = "approved".to_string();
                        user_role.approved_on = Some(time());
                    }
                }

                state
                    .project_awaits_response
                    .remove(&StoredPrincipal(requester));
                change_notification_status(
                    requester,
                    "project".to_string(),
                    "approved".to_string(),
                );

                format!("Requester with principal id {} is approved", requester)
            } else {
                format!(
                    "Requester with principal id {} has not registered",
                    requester
                )
            }
        } else {
            format!(
                "Requester with principal id {} could not be approved",
                requester
            )
        }
    })
}

#[update]
pub fn decline_project_creation_request(requester: Principal) -> String {
    mutate_state(|state| {
        if let Some(mut project_internal) = state
            .project_awaits_response
            .get(&StoredPrincipal(requester))
        {
            project_internal.0.is_verified = false;

            if let Some(res) = state
                .project_awaits_response
                .get(&StoredPrincipal(requester))
            {
                state
                    .project_declined_request
                    .insert(StoredPrincipal(requester), Candid(res.0.clone()));

                if let Some(user_roles) = state.role_status.get(&StoredPrincipal(requester)) {
                    let mut roles_clone = user_roles.0.clone();
                    if let Some(user_role) = roles_clone.iter_mut().find(|r| r.name == "project") {
                        user_role.status = "default".to_string();
                        user_role.rejected_on = Some(time());
                    }
                }

                state
                    .project_awaits_response
                    .remove(&StoredPrincipal(requester));
                change_notification_status(
                    requester,
                    "project".to_string(),
                    "declined".to_string(),
                );

                format!("Requester with principal id {} is declined", requester)
            } else {
                format!(
                    "Requester with principal id {} has not registered",
                    requester
                )
            }
        } else {
            format!(
                "Requester with principal id {} could not be declined",
                requester
            )
        }
    })
}
//todo:- change the function according to new struct
#[update]
pub fn approve_project_update(requester: Principal, project_id: String, approve: bool) -> String {
    mutate_state(|state| {
        if let Some(project_update_request) = state.pending_project_details.remove(&project_id) {
            if approve {
                if let Some(mut project_list) =
                    state.project_storage.get(&StoredPrincipal(requester))
                {
                    if let Some(project) = project_list.0.iter_mut().find(|p| p.uid == project_id) {
                        project.params.project_name =
                            project_update_request.0.updated_info.project_name;
                        project.params.project_logo =
                            project_update_request.0.updated_info.project_logo;
                        project.params.preferred_icp_hub =
                            project_update_request.0.updated_info.preferred_icp_hub;
                        project.params.live_on_icp_mainnet =
                            project_update_request.0.updated_info.live_on_icp_mainnet;
                        project.params.money_raised_till_now =
                            project_update_request.0.updated_info.money_raised_till_now;
                        project.params.supports_multichain =
                            project_update_request.0.updated_info.supports_multichain;
                        project.params.project_elevator_pitch =
                            project_update_request.0.updated_info.project_elevator_pitch;
                        project.params.project_area_of_focus =
                            project_update_request.0.updated_info.project_area_of_focus;
                        project.params.promotional_video =
                            project_update_request.0.updated_info.promotional_video;
                        project.params.github_link =
                            project_update_request.0.updated_info.github_link;
                        project.params.reason_to_join_incubator = project_update_request
                            .0
                            .updated_info
                            .reason_to_join_incubator;
                        project.params.project_description =
                            project_update_request.0.updated_info.project_description;
                        project.params.project_cover =
                            project_update_request.0.updated_info.project_cover;
                        project.params.project_team =
                            project_update_request.0.updated_info.project_team;
                        project.params.token_economics =
                            project_update_request.0.updated_info.token_economics;
                        project.params.technical_docs =
                            project_update_request.0.updated_info.technical_docs;
                        project.params.long_term_goals =
                            project_update_request.0.updated_info.long_term_goals;
                        project.params.target_market =
                            project_update_request.0.updated_info.target_market;
                        project.params.self_rating_of_project =
                            project_update_request.0.updated_info.self_rating_of_project;
                        project.params.user_data = project_update_request.0.updated_info.user_data;
                        project.params.mentors_assigned =
                            project_update_request.0.updated_info.mentors_assigned;
                        project.params.vc_assigned =
                            project_update_request.0.updated_info.vc_assigned;

                        change_notification_status(
                            requester,
                            "project".to_string(),
                            "approved".to_string(),
                        );

                        return format!(
                            "Project update for ID {} has been approved and applied.",
                            project_id
                        );
                    }
                }
                return format!(
                    "Failed to apply update: Project ID {} not found under requester.",
                    project_id
                );
            } else {
                change_notification_status(
                    requester,
                    "project".to_string(),
                    "declined".to_string(),
                );
                // Optionally handle declined updates, such as logging or notifying the requester.
                return format!("Project update for ID {} was declined.", project_id);
            }
        }
        return format!("No pending update found for project ID {}.", project_id);
    })
}

#[update]
pub fn add_job_type(job_type: String) -> String {
    mutate_state(|state| {
        state.job_type.insert(job_type.clone(), job_type);
        "Job type added".to_string()
    })
}

#[update]
pub async fn add_project_to_spotlight(project_id: String) -> Result<(), String> {
    let caller = caller();

    // let admin_principals = match get_info().await {
    //     Ok(principals) => principals,
    //     Err(e) => return Err(format!("Failed to retrieve admin principals")),
    // };

    // if !admin_principals.contains(&caller) {
    //     return Err("Unauthorized: Caller is not an admin.".to_string());
    // }

    let project_creator_and_info = APPLICATION_FORM.with(|details| {
        details
            .borrow()
            .iter()
            .find_map(|(creator_principal, projects)| {
                projects
                    .iter()
                    .find(|project| project.uid == project_id)
                    .map(|project_info| (creator_principal.clone(), project_info.clone()))
            })
    });

    match project_creator_and_info {
        Some((project_creator, project_info)) => {
            let spotlight_details = SpotlightDetails {
                added_by: project_creator,
                project_id: project_id,
                project_details: project_info,
                approval_time: time(),
            };

            SPOTLIGHT_PROJECTS.with(|spotlight| {
                spotlight.borrow_mut().push(spotlight_details);
            });
            Ok(())
        }
        None => Err("Project not found.".to_string()),
    }
}

#[update]
pub fn remove_project_from_spotlight(project_id: String) -> Result<(), String> {
    SPOTLIGHT_PROJECTS.with(|spotlight| {
        let mut spotlight = spotlight.borrow_mut();
        if let Some(index) = spotlight.iter().position(|x| x.project_id == project_id) {
            spotlight.remove(index);
            Ok(())
        } else {
            Err("Project not found in spotlight.".to_string())
        }
    })
}

#[query]
pub fn get_spotlight_projects() -> Vec<SpotlightDetails> {
    let mut projects = SPOTLIGHT_PROJECTS.with(|spotlight| spotlight.borrow().clone());

    projects.sort_by(|a, b| b.approval_time.cmp(&a.approval_time));

    projects
}

#[query]
pub fn get_spotlight_project_uids() -> Vec<String> {
    SPOTLIGHT_PROJECTS.with(|spotlight| {
        spotlight
            .borrow()
            .iter()
            .map(|details| details.project_id.clone())
            .collect()
    })
}

#[query]
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

#[query]

fn get_total_approved_list_with_user_data() -> HashMap<Principal, ApprovedList> {
    let roles_to_check = vec!["user", "mentor", "vc", "project"];

    let mut principals_roles: HashMap<StoredPrincipal, Vec<String>> = HashMap::new();

    // Collect principals for each role
    for role_name in roles_to_check.iter() {
        let principals = get_principals_by_role(role_name); // Assuming this function exists and works as described
        for principal in principals {
            let stored_principal = StoredPrincipal(principal);
            principals_roles
                .entry(stored_principal)
                .or_default()
                .push(role_name.to_string());
        }
    }

    // Fetch user data once for each unique principal and create ApprovedList
    let approved_list_map: HashMap<Principal, ApprovedList> = read_state(|state| {
        principals_roles
            .iter()
            .filter_map(|(stored_principal, roles)| {
                state
                    .user_storage
                    .get(stored_principal)
                    .map(|user_info_internal| {
                        let principal = stored_principal.0; // Extract Principal from StoredPrincipal
                        let approved_list = ApprovedList {
                            approved_type: roles.clone(),
                            user_data: user_info_internal.0.params.clone(), // Directly use UserInformation
                        };
                        (principal, approved_list)
                    })
            })
            .collect()
    });

    approved_list_map
}
#[query]
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

#[query]
fn get_total_pending_request() -> usize {
    let mentor_pending = read_state(|state| state.mentor_awaits_response.len());
    let vc_pending = read_state(|state| state.vc_awaits_response.len());
    let project_pending = read_state(|state| state.project_awaits_response.len());

    (mentor_pending + vc_pending + project_pending)
        .try_into()
        .unwrap()
}

// #[query]
// fn get_top()

#[update]
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

#[query]
fn get_top_5_mentors() -> Vec<(Principal, TopData, usize)> {
    let mentor_vec = MENTOR_REGISTRY.with(|registry| {
        registry
            .borrow()
            .keys()
            .cloned()
            .collect::<Vec<Principal>>()
    });

    let mut mentor_project_counts: Vec<(Principal, TopData, usize)> = mentor_vec
        .into_iter()
        .map(|principal| {
            let project_count = get_projects_associated_with_mentor(principal.clone()).len();
            let joined_on = get_joined_on_(&principal, "mentor".to_string()).unwrap_or(0); // Fetch the joined_on date
            let mentor_data = MENTOR_REGISTRY.with(|registry| {
                registry
                    .borrow()
                    .get(&principal)
                    .map(|full_mentor_data| TopData {
                        full_name: full_mentor_data.profile.user_data.full_name.clone(),
                        profile_picture: full_mentor_data.profile.user_data.profile_picture.clone(),
                        area_of_interest: full_mentor_data.profile.area_of_expertise.clone(),
                        country: full_mentor_data.profile.user_data.country.clone(),
                        joined_on,
                    })
                    .unwrap_or_default() // Provide a default in case data is missing
            });
            (principal, mentor_data, project_count)
        })
        .collect();

    // Sort by the number of associated projects in descending order and take the top 5
    mentor_project_counts.sort_by_key(|k| std::cmp::Reverse(k.2));
    mentor_project_counts.into_iter().take(5).collect()
}

#[query]
fn get_top_5_vcs() -> Vec<(Principal, TopData, usize)> {
    let vc_vec = VENTURECAPITALIST_STORAGE.with(|registry| {
        registry
            .borrow()
            .keys()
            .cloned()
            .collect::<Vec<Principal>>()
    });

    let mut mentor_project_counts: Vec<(Principal, TopData, usize)> = vc_vec
        .into_iter()
        .map(|principal| {
            let project_count = get_projects_associated_with_investor(principal.clone()).len();
            let joined_on = get_joined_on_(&principal, "vc".to_string()).unwrap_or(0); // Fetch the joined_on date
            let mentor_data = VENTURECAPITALIST_STORAGE.with(|registry| {
                registry
                    .borrow()
                    .get(&principal)
                    .map(|full_mentor_data| TopData {
                        full_name: full_mentor_data.params.user_data.full_name.clone(),
                        profile_picture: full_mentor_data.params.user_data.profile_picture.clone(),
                        area_of_interest: full_mentor_data.params.category_of_investment.clone(),
                        country: full_mentor_data.params.user_data.country.clone(),
                        joined_on,
                    })
                    .unwrap_or_default() // Provide a default in case data is missing
            });
            (principal, mentor_data, project_count)
        })
        .collect();

    // Sort by the number of associated projects in descending order and take the top 5
    mentor_project_counts.sort_by_key(|k| std::cmp::Reverse(k.2));
    mentor_project_counts.into_iter().take(5).collect()
}

// #[query]
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

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct TopDataProject {
    full_name: String,
    profile_picture: Option<Vec<u8>>, // Assuming profile_picture is optional
    area_of_interest: String,
    country: String,
    joined_on: u64,
    principal: String,
}

#[query]
fn get_top_5_projects() -> Vec<(String, TopDataProject, usize)> {
    // Temporarily holding the projects to sort and filter
    let mut project_counts: Vec<(String, TopDataProject, usize)> = Vec::new();

    // Properly accessing the APPLICATION_FORM RefCell
    APPLICATION_FORM.with(|application_form| {
        let application_form = application_form.borrow(); // Access the RefCell for reading

        for (_principal, projects) in application_form.iter() {
            for project_internal in projects {
                let project_info = &project_internal.params;

                let mentor_count = project_info
                    .mentors_assigned
                    .as_ref()
                    .map_or(0, |v| v.len());
                let vc_count = project_info.vc_assigned.as_ref().map_or(0, |v| v.len());
                let total_count = mentor_count + vc_count;

                // Placeholder for TopData - adjust according to actual data retrieval method

                let top_data = TopDataProject {
                    full_name: project_info.user_data.full_name.clone(),
                    profile_picture: project_info.project_logo.clone(),
                    area_of_interest: project_info.project_area_of_focus.clone(),
                    country: project_info.user_data.country.clone(),
                    joined_on: project_internal.creation_date.clone(),
                    principal: _principal.to_string(),
                };

                project_counts.push((project_internal.uid.clone(), top_data, total_count));
            }
        }
    });

    // Sorting by the total count of mentors and VCs in descending order
    project_counts.sort_by(|a, b| b.2.cmp(&a.2));

    // Taking the top 5 projects based on total counts
    project_counts.into_iter().take(5).collect()
}

// #[query]
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

#[query]
pub fn change_live_status(
    project_principal: Principal,
    project_id: String,
    live_status: bool,
    new_dapp_link: Option<String>,
) -> Result<String, String> {
    mutate_state(|state| {
        // Access the projects registry
        if let Some(mut project_list) = state.project_storage.get(&StoredPrincipal(project_principal)) {
            if let Some(project_internal) = project_list.0.iter_mut().find(|p| p.uid == project_id) {
                // Log before update
                ic_cdk::println!(
                    "Before update: live_on_icp_mainnet = {:?}, dapp_link = {:?}",
                    project_internal.params.live_on_icp_mainnet, project_internal.params.dapp_link
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
                    project_internal.params.live_on_icp_mainnet, project_internal.params.dapp_link
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

#[query]

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

#[query]
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

#[query]
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

#[query]
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

#[query]
fn count_live_projects() -> usize {
    read_state(|state| {
        state.project_storage.iter()
            .flat_map(|(_principal, projects)| {
                projects.0.iter().filter(|project_internal| {
                    let project_info = &project_internal.params; 
                    project_info.live_on_icp_mainnet == Some(true) &&
                    project_info.dapp_link.as_ref().map_or(false, |d| !d.is_empty())
                }).cloned().collect::<Vec<_>>() 
            })
            .count()  
    })
}

#[update]
pub fn update_vc_profile(requester: Principal, vc_internal: VentureCapitalist) -> String {
    mutate_state(|state| {
        if let Some(mut existing_vc_internal) = state.vc_storage.get(&StoredPrincipal(requester)) {
            existing_vc_internal.0.params.registered_under_any_hub = vc_internal
                .registered_under_any_hub
                .clone()
                .or(existing_vc_internal.0.params.registered_under_any_hub.clone());

            existing_vc_internal.0.params.project_on_multichain = vc_internal
                .project_on_multichain
                .clone()
                .or(existing_vc_internal.0.params.project_on_multichain.clone());

            existing_vc_internal.0.params.money_invested = vc_internal
                .money_invested
                .clone()
                .or(existing_vc_internal.0.params.money_invested.clone());

            existing_vc_internal.0.params.existing_icp_portfolio = vc_internal
                .existing_icp_portfolio
                .clone()
                .or(existing_vc_internal.0.params.existing_icp_portfolio.clone());
            existing_vc_internal.0.params.announcement_details = vc_internal
                .announcement_details
                .clone()
                .or(existing_vc_internal.0.params.announcement_details.clone());

            existing_vc_internal.0.params.registered_country = vc_internal
                .registered_country
                .clone()
                .or(existing_vc_internal.0.params.registered_country.clone());

            existing_vc_internal.0.params.fund_size = Some(
                vc_internal
                    .fund_size
                    .map(|size| (size * 100.0).round() / 100.0)
                    .unwrap_or(0.0),
            );
            existing_vc_internal.0.params.assets_under_management =
                vc_internal.assets_under_management.clone();

            existing_vc_internal.0.params.category_of_investment =
                vc_internal.category_of_investment.clone();

            existing_vc_internal.0.params.logo = vc_internal.logo.clone();
            existing_vc_internal.0.params.average_check_size =
                (vc_internal.average_check_size * 100.0).round() / 100.0;
            existing_vc_internal.0.params.existing_icp_investor = vc_internal.existing_icp_investor;
            existing_vc_internal.0.params.investor_type = vc_internal.investor_type.clone();
            existing_vc_internal.0.params.number_of_portfolio_companies =
                vc_internal.number_of_portfolio_companies;
            existing_vc_internal.0.params.portfolio_link = vc_internal.portfolio_link.clone();
            existing_vc_internal.0.params.reason_for_joining = vc_internal.reason_for_joining.clone();
            existing_vc_internal.0.params.name_of_fund = vc_internal.name_of_fund.clone();

            existing_vc_internal.0.params.preferred_icp_hub = vc_internal.preferred_icp_hub.clone();
            existing_vc_internal.0.params.type_of_investment = vc_internal.type_of_investment.clone();
            existing_vc_internal.0.params.user_data = vc_internal.user_data.clone();
            existing_vc_internal.0.params.linkedin_link = vc_internal.linkedin_link.clone();
            existing_vc_internal.0.params.website_link = vc_internal.website_link.clone();
            existing_vc_internal.0.params.registered = vc_internal.registered.clone();

            "Venture Capitalist profile updated successfully.".to_string()
        } else {
            // This else block handles the case where the `requester` does not exist in `VENTURECAPITALIST_STORAGE`
            "Venture Capitalist profile not found.".to_string()
        }
    })
}

#[update]
pub fn update_mentor_profile(requester: Principal, updated_profile: MentorProfile) -> String {
    mutate_state(|state| {
        if let Some(mut mentor_internal) = state.mentor_storage.get(&StoredPrincipal(requester)) {
            mentor_internal.0.profile.preferred_icp_hub = updated_profile
                .preferred_icp_hub
                .clone()
                .or(mentor_internal.0.profile.preferred_icp_hub.clone());

            mentor_internal.0.profile.multichain = updated_profile
                .multichain
                .clone()
                .or(mentor_internal.0.profile.multichain.clone());
            mentor_internal.0.profile.existing_icp_project_porfolio = updated_profile
                .existing_icp_project_porfolio
                .clone()
                .or(mentor_internal
                    .0.profile
                    .existing_icp_project_porfolio
                    .clone());

            mentor_internal.0.profile.area_of_expertise = updated_profile.area_of_expertise.clone();
            mentor_internal.0.profile.category_of_mentoring_service =
                updated_profile.category_of_mentoring_service.clone();

            mentor_internal.0.profile.existing_icp_mentor =
                updated_profile.existing_icp_mentor.clone();
            mentor_internal.0.profile.icp_hub_or_spoke = updated_profile.icp_hub_or_spoke.clone();
            mentor_internal.0.profile.linkedin_link = updated_profile.linkedin_link.clone();
            mentor_internal.0.profile.website = updated_profile.website.clone();
            mentor_internal.0.profile.years_of_mentoring = updated_profile.years_of_mentoring.clone();
            mentor_internal.0.profile.reason_for_joining = updated_profile.reason_for_joining.clone();
            mentor_internal.0.profile.user_data = updated_profile.user_data.clone();
            mentor_internal.0.profile.hub_owner = updated_profile
                .hub_owner
                .clone()
                .or(mentor_internal.0.profile.hub_owner.clone());
            "Mentor profile updated successfully.".to_string()
        } else {
            "Mentor profile not found.".to_string()
        }
    })
}

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
            cohort_requests.insert(cohort_request.cohort_details.cohort_id.clone(), Candid(vec![cohort_request]));
        }
    });

    ic_cdk::println!("REQUEST HAS BEEN SENT TO ADMIN"); // Confirm the action in the logs
    message
}

#[query]
pub fn get_pending_cohort_requests_for_admin() -> Vec<CohortRequest> {
    read_state(|state| {
        let mut pending_requests = Vec::new();
        for (_cohort_id, candid_requests) in state.cohort_request_admin.iter() {
            pending_requests.extend(candid_requests.0.clone());
        }
        pending_requests
    })
}

#[update]
pub fn accept_cohort_creation_request(cohort_id: String) -> String {
    let mut response_message = String::new();

    let already_accepted = read_state(|state| {
        state.accepted_cohorts.get(&cohort_id).map_or(false, |requests| {
            requests.0.iter().any(|r| r.request_status == "accepted")
        })
    });

    if already_accepted {
        return format!(
            "Cohort request with id: {} has already been accepted.",
            cohort_id
        );
    }

    mutate_state(|state| {
        let mut request_found_and_updated = false;

        for (_principal, mut requests) in state.cohort_request_admin.iter() {
            if let Some(index) = requests.0.iter().position(|r| {
                r.cohort_details.cohort_id == cohort_id && r.request_status == "pending"
            }) {
                let mut request = requests.0.remove(index);
                request.request_status = "accepted".to_string();
                request.accepted_at = ic_cdk::api::time();

                state.cohort_info.insert(cohort_id.clone(), Candid(request.cohort_details.clone()));

                let accepted_requests = state.accepted_cohorts.get(&cohort_id);
                match accepted_requests {
                    Some(mut candid_requests) => {
                        candid_requests.0.push(request);
                    },
                    None => {
                        state.accepted_cohorts.insert(cohort_id.clone(), Candid(vec![request]));
                    }
                }

                request_found_and_updated = true;
                response_message = format!("Cohort request with id: {} has been accepted.", cohort_id);
                break;
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

#[update]
pub fn decline_cohort_creation_request(cohort_id: String) -> String {
    let mut response_message = String::new();

    mutate_state(|state| {
        let mut request_found_and_updated = false;

        if let Some(mut requests) = state.cohort_request_admin.get(&cohort_id) {
            if let Some(index) = requests.0.iter().position(|r| r.request_status == "pending") {
                let mut request = requests.0.remove(index);
                request.request_status = "declined".to_string();
                request.rejected_at = ic_cdk::api::time();
                request_found_and_updated = true;

                let declined_requests = state.declined_cohorts.get(&cohort_id);
                match declined_requests {
                    Some(mut candid_requests) => {
                        candid_requests.0.push(request);
                    },
                    None => {
                        state.declined_cohorts.insert(cohort_id.clone(), Candid(vec![request]));
                    }
                }

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

#[query]
pub fn get_accepted_cohort_creation_request_for_admin() -> Vec<CohortRequest> {
    read_state(|state| {
        let mut accepted_requests = Vec::new();
        for (_cohort_id, candid_requests) in state.accepted_cohorts.iter() {
            accepted_requests.extend(candid_requests.0.clone());
        }
        accepted_requests
    })
}

#[query]
pub fn get_declined_cohort_creation_request_for_admin() -> Vec<CohortRequest> {
    read_state(|state| {
        let mut declined_requests = Vec::new();
        for (_cohort_id, candid_requests) in state.declined_cohorts.iter() {
            declined_requests.extend(candid_requests.0.clone());
        }
        declined_requests
    })

}

#[update]
pub fn remove_mentor_from_cohort(
    cohort_id: String,
    mentor_principal: Principal,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", mentor_principal);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }
    mutate_state(|state| {
        if let Some(mentor_up_for_cohort) = state.mentor_storage.get(&StoredPrincipal(mentor_principal)) {
            let mentor_clone = mentor_up_for_cohort.0.clone();

            if let Some(mut mentors) = state.mentor_applied_for_cohort.get(&cohort_id) {
                if let Some(index) = mentors.0.iter().position(|x| *x == mentor_clone) {
                    let mentor_data = mentors.0.remove(index);

                    if let Some(mut removed_mentors) = state.mentor_removed_from_cohort.get(&cohort_id) {
                        removed_mentors.0.push((mentor_principal, mentor_data));
                    } else {
                        state.mentor_removed_from_cohort.insert(cohort_id.clone(), Candid(vec![(mentor_principal, mentor_data)]));
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

#[update]
pub fn send_rejoin_invitation_to_mentor(cohort_id: String, mentor_principal: Principal, invite_message: String) -> Result<String, String> {
    let result = mutate_state(|state| {
        if let Some(mut mentors) = state.mentor_removed_from_cohort.get(&cohort_id) {
            if let Some((index, _)) = mentors.0.iter().enumerate().find(|(_, (pr, _))| *pr == mentor_principal) {
                let (principal, mentor_data) = mentors.0.remove(index);
                let invite_request = InviteRequest {
                    cohort_id: cohort_id.clone(),
                    sender_principal: principal,
                    mentor_data,
                    invite_message: invite_message.clone(),
                };

                if let Some(_) = state.mentor_invite_request.get(&cohort_id) {
                    state.mentor_invite_request.insert(cohort_id.clone(), Candid(invite_request));
                } else {
                    state.mentor_invite_request.insert(cohort_id.clone(), Candid(invite_request));
                }

                return Ok("Invitation sent to rejoin the cohort.".to_string());
            }
        }
        Err("No removed mentor found for this principal in the specified cohort.".to_string())
    });

    result
}



#[update]
pub fn accept_rejoin_invitation(cohort_id: String) -> Result<String, String> {
    let result = mutate_state(|state| {
        if let Some(invite_request) = state.mentor_invite_request.remove(&cohort_id) {
            let mentors = state.mentor_applied_for_cohort.get(&cohort_id);
            match mentors {
                Some(mut candid_mentors) => {
                    candid_mentors.0.push(invite_request.0.mentor_data);
                }
                None => {
                    state.mentor_applied_for_cohort.insert(cohort_id.clone(), Candid(vec![invite_request.0.mentor_data]));
                }
            }
            return Ok(format!("Mentor has successfully rejoined the cohort {}", cohort_id));
        }
        Err("No pending invitation found for this cohort.".to_string())
    });

    result
}


#[update]
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

#[query]
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

#[query]
pub fn get_left_mentors_of_cohort(cohort_id: String) -> Vec<MentorInternal> {
    read_state(|state| {
        if let Some(mentors) = state.mentor_removed_from_cohort.get(&cohort_id) {
            return mentors.0.iter().map(|(_, mentor_data)| mentor_data.clone()).collect();
        }
        Vec::new()
    })
}

#[update]
pub fn remove_vc_from_cohort(
    cohort_id: String,
    vc_principal: Principal,
    passphrase_key: String,
) -> Result<String, String> {
    let required_key = format!("delete/{}", vc_principal);

    if passphrase_key != required_key {
        return Err("Unauthorized attempt: Incorrect passphrase key.".to_string());
    }
     mutate_state(|state| {
        if let Some(vc_up_for_cohort) = state.vc_storage.get(&StoredPrincipal(vc_principal)) {
            let vc_clone = vc_up_for_cohort.0.clone();

            if let Some(mut vcs) = state.vc_applied_for_cohort.get(&cohort_id) {
                if let Some(index) = vcs.0.iter().position(|x| *x == vc_clone) {
                    vcs.0.remove(index);

                    if let Some(mut count) = state.applier_count.get(&cohort_id) {
                        count = count.saturating_sub(1);
                    }

                    return Ok(format!(
                        "Venture capitalist successfully removed from the cohort with cohort id {}",
                        cohort_id
                    ));
                } else {
                    return Err("You are not part of this cohort".to_string());
                }
            } else {
                return Err("No venture capitalists found for this cohort".to_string());
            }
        } else {
            return Err("Invalid venture capitalist record".to_string());
        }
    })
}


#[update]
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

#[update]
pub fn admin_update_project(
    uid: String,
    is_live: bool,
    dapp_link: Option<String>,
) -> Result<(), String> {
    let mut project_to_classify = None;

    mutate_state(|state| {
        for (_, mut project_list) in state.project_storage.iter() {
            if let Some(project_pos) = project_list.0.iter_mut().position(|p| p.uid == uid) {
                let project = &mut project_list.0[project_pos];
                project.params.live_on_icp_mainnet = Some(is_live);
                project.params.dapp_link = dapp_link.clone();
                project_to_classify = Some(project.clone());
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

#[update]
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

#[update]
pub fn remove_project_from_incubated(project_id: String) -> Result<&'static str, &'static str> {
    mutate_state(|state| {
        if state.incubated_projects.remove(&project_id).is_some() {
            Ok("Project successfully removed from incubated projects.")
        } else {
            Err("Project not found in incubated projects.")
        }
    })
}

#[query]
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

#[query]
pub fn get_project_update_declined_request() -> HashMap<String, ProjectUpdateRequest> {
    read_state(|state| {
        state.declined_project_details.iter()
            .map(|(key, value)| (key.clone(), value.0.clone()))
            .collect()
    })
}

#[query]
pub fn get_mentor_update_declined_request() -> HashMap<Principal, MentorUpdateRequest> {
    read_state(|state| {
        state.mentor_profile_edit_declined.iter()
            .map(|(key, value)| (key.0, value.0.clone()))
            .collect()
    })
}

#[query]
pub fn get_vc_update_declined_request() -> HashMap<Principal, UpdateInfoStruct> {
    read_state(|state| {
        state.vc_profile_edit_declined.iter()
            .map(|(key, value)| (key.0, value.0.clone()))
            .collect()
    })
}

#[update]
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

#[update]
pub fn delete_project_using_principal(principal: Principal) -> String {
    mutate_state(|state| {
        if state.project_storage.remove(&StoredPrincipal(principal)).is_some() {
            "Project successfully deleted".to_string()
        } else {
            "Project not found".to_string()
        }
    })
}

#[update]
pub fn delete_mentor_using_principal(principal: Principal) -> String {
    mutate_state(|state| {
        if state.mentor_storage.remove(&StoredPrincipal(principal)).is_some() {
            "Mentor successfully deleted".to_string()
        } else {
            "Mentor not found".to_string()
        }
    })
}

#[update]
pub fn delete_vc_using_principal(principal: Principal) -> String {
    mutate_state(|state| {
        if state.vc_storage.remove(&StoredPrincipal(principal)).is_some() {
            "VC successfully deleted".to_string()
        } else {
            "VC not found".to_string()
        }
    })
}


//b5pqo-yef5a-lut3t-kmrpc-h7dnp-v3d2t-ls6di-y33wa-clrtb-xdhl4-dae

#[update]
pub fn delete_mentor_announcement_by_index(mentor_principal: Principal, index: usize) -> String {
    mutate_state(|state| {
        if let Some(mut ann_list) = state.mentor_announcement.get(&StoredPrincipal(mentor_principal)) {
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

#[update]
pub fn delete_project_announcement_by_index(project_principal: Principal, index: usize) -> String {
    mutate_state(|state| {
        if let Some(mut ann_list) = state.project_announcement.get(&StoredPrincipal(project_principal)) {
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

#[update]
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
pub struct NameDetails{
    pub vc_name: Vec<String>,
    pub mentor_name: Vec<String>,
}

#[query]
pub fn get_vc_and_mentor_name() -> NameDetails {
    let mut vc_new: Vec<String> = Vec::new();
    VENTURECAPITALIST_STORAGE.with(|state| {
        let vc_details = state.borrow();
        for (_, vc) in vc_details.iter() {
            vc_new.push(vc.params.user_data.full_name.clone());
        }
    });

    let mut mentor_new: Vec<String> = Vec::new();
    MENTOR_REGISTRY.with(|state| {
        let mentor_details = state.borrow();
        for (_, mentor) in mentor_details.iter() {
            mentor_new.push(mentor.profile.user_data.full_name.clone());
        }
    });

    let new_details = NameDetails {
        vc_name: vc_new,
        mentor_name: mentor_new,
    };

    new_details
}

//b5pqo-yef5a-lut3t-kmrpc-h7dnp-v3d2t-ls6di-y33wa-clrtb-xdhl4-dae
