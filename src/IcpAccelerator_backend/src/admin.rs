use crate::associations::*;
use crate::mentor::*;
use crate::project_registration::*;
use crate::user_module::*;
use crate::vc_registration::*;
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{canister_info, CanisterInfoRequest};
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::{caller, id};
use ic_cdk::api::{canister_balance128, time};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::cmp::Reverse;
use std::collections::{HashMap, HashSet};
use std::io::{Read, Write};

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

thread_local! {
    static ADMIN_NOTIFICATIONS : RefCell<HashMap<Principal, Vec<Notification>>> = RefCell::new(HashMap::new())
}

fn change_notification_status(requester: Principal, requested_for: String, changed_status: String) {
    ADMIN_NOTIFICATIONS.with(|admin_notifications| {
        let mut notifications = admin_notifications.borrow_mut();
        for (_, admin_notif_list) in notifications.iter_mut() {
            for notification in admin_notif_list.iter_mut() {
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
                ADMIN_NOTIFICATIONS.with(|admin_notifications| {
                    let mut notifications = admin_notifications.borrow_mut();
                    notifications
                        .entry(c)
                        .or_default()
                        .push(notification_to_send)
                });
            }
            format!("approval request is sent")
        }
        Err(e) => {
            format!("unable to get canister information {:?}", e)
        }
    }
}

//
pub fn approve_mentor_creation_request(requester: Principal, approve: bool) -> String {
    // let caller = caller();

    // let controllers = get_info().await.unwrap();
    // if is_controller(principal)

    MENTOR_AWAITS_RESPONSE.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();
        // let mentor_internal = awaiters.get_mut(&requester);
        if let Some(mentor_internal) = awaiters.get_mut(&requester) {
            if approve || mentor_internal.approve {
                mentor_internal.decline = false;
                mentor_internal.approve = approve;

                match awaiters.get(&requester) {
                    Some(res) => {
                        //register_mentor
                        MENTOR_REGISTRY.with(|m_registry| {
                            let mut mentor = m_registry.borrow_mut();
                            mentor.insert(requester, res.clone())
                        });

                        //approve_mentor
                        ROLE_STATUS_ARRAY.with(|role_status| {
                            if let Some(user_role) = role_status
                                .borrow_mut()
                                .get_mut(&requester)
                                .expect("couldn't get requester's id")
                                .iter_mut()
                                .find(|r| r.name == "mentor")
                            {
                                user_role.status = "approved".to_string();
                                user_role.approved_on = Some(time());
                            }
                        });

                        awaiters.remove(&requester);
                        change_notification_status(
                            requester,
                            "mentor".to_string(),
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

pub fn decline_mentor_creation_request(requester: Principal, decline: bool) -> String {
    MENTOR_AWAITS_RESPONSE.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();
        // let mentor_internal = awaiters.get_mut(&requester);
        if let Some(mentor_internal) = awaiters.get_mut(&requester) {
            if decline {
                mentor_internal.decline = decline;
                mentor_internal.approve = false;

                match awaiters.get(&requester) {
                    Some(res) => {
                        DECLINED_MENTOR_REQUESTS.with(|d_m_registry| {
                            let mut d_mentor = d_m_registry.borrow_mut();
                            d_mentor.insert(requester, res.clone())
                        });
                        ROLE_STATUS_ARRAY.with(|role_status| {
                            if let Some(user_role) = role_status
                                .borrow_mut()
                                .get_mut(&requester)
                                .expect("couldn't get requester's id")
                                .iter_mut()
                                .find(|r| r.name == "mentor")
                            {
                                user_role.status = "default".to_string();
                                user_role.rejected_on = Some(time());
                            }
                        });

                        awaiters.remove(&requester);
                        change_notification_status(
                            requester,
                            "mentor".to_string(),
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

pub fn get_admin_notifications() -> Vec<Notification> {
    let caller = caller();

    ADMIN_NOTIFICATIONS.with(|alerts| {
        let mut alerts = alerts.borrow().get(&caller).cloned().unwrap_or_default();
        // Sort the alerts by timestamp in descending order
        alerts.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        alerts
    })
}

#[query]
pub fn get_pending_admin_notifications() -> Vec<Notification> {
    let caller = caller();

    ADMIN_NOTIFICATIONS.with(|alerts| {
        let alerts = alerts.borrow();

        // First, get the caller's notifications, if any, and filter them by "pending" status.
        let pending_alerts: Vec<Notification> = alerts
            .get(&caller)
            .unwrap_or(&Vec::new())
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

#[derive(Serialize, Deserialize, Clone, CandidType)]
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
    let mentor_awaiters = MENTOR_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().clone());

    let mut mentor_with_roles_map: HashMap<Principal, MentorWithRoles> = HashMap::new();

    for (principal, mentor_internal) in mentor_awaiters.iter() {
        let roles = get_roles_for_principal(*principal);
        let mentor_with_roles = MentorWithRoles {
            mentor_profile: mentor_internal.clone(),
            roles,
        };

        mentor_with_roles_map.insert(*principal, mentor_with_roles);
    }

    mentor_with_roles_map
}

#[query]
pub fn vc_awaiting_approval() -> HashMap<Principal, VcWithRoles> {
    let vc_awaiters = VC_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().clone());

    let mut vc_with_roles_map: HashMap<Principal, VcWithRoles> = HashMap::new();

    for (principal, vc_internal) in vc_awaiters.iter() {
        let roles = get_roles_for_principal(*principal);
        let vc_with_roles = VcWithRoles {
            vc_profile: vc_internal.clone(),
            roles,
        };

        vc_with_roles_map.insert(*principal, vc_with_roles);
    }

    vc_with_roles_map
}

#[query]
pub fn project_awaiting_approval() -> HashMap<Principal, ProjectWithRoles> {
    let project_awaiters = PROJECT_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().clone());

    let mut project_with_roles_map: HashMap<Principal, ProjectWithRoles> = HashMap::new();

    for (principal, vc_internal) in project_awaiters.iter() {
        let roles = get_roles_for_principal(*principal);
        let project_with_roles = ProjectWithRoles {
            project_profile: vc_internal.clone(),
            roles,
        };

        project_with_roles_map.insert(*principal, project_with_roles);
    }

    project_with_roles_map
}

#[query]
pub fn project_declined() -> HashMap<Principal, ProjectWithRoles> {
    let project_declined = DECLINED_PROJECT_REQUESTS.with(|awaiters| awaiters.borrow().clone());

    let mut project_with_roles_map: HashMap<Principal, ProjectWithRoles> = HashMap::new();

    for (principal, vc_internal) in project_declined.iter() {
        let roles = get_roles_for_principal(*principal);
        let project_with_roles = ProjectWithRoles {
            project_profile: vc_internal.clone(),
            roles,
        };

        project_with_roles_map.insert(*principal, project_with_roles);
    }

    project_with_roles_map
}

#[query]
pub fn vc_declined() -> HashMap<Principal, VcWithRoles> {
    let vc_declined = DECLINED_VC_REQUESTS.with(|awaiters| awaiters.borrow().clone());

    let mut vc_with_roles_map: HashMap<Principal, VcWithRoles> = HashMap::new();

    for (principal, vc_internal) in vc_declined.iter() {
        let roles = get_roles_for_principal(*principal);
        let vc_with_roles = VcWithRoles {
            vc_profile: vc_internal.clone(),
            roles,
        };

        vc_with_roles_map.insert(*principal, vc_with_roles);
    }

    vc_with_roles_map
}

#[query]
pub fn mentor_declined() -> HashMap<Principal, MentorWithRoles> {
    let mentor_awaiters = DECLINED_MENTOR_REQUESTS.with(|awaiters| awaiters.borrow().clone());

    let mut mentor_with_roles_map: HashMap<Principal, MentorWithRoles> = HashMap::new();

    for (principal, mentor_internal) in mentor_awaiters.iter() {
        let roles = get_roles_for_principal(*principal);
        let mentor_with_roles = MentorWithRoles {
            mentor_profile: mentor_internal.clone(),
            roles,
        };

        mentor_with_roles_map.insert(*principal, mentor_with_roles);
    }

    mentor_with_roles_map
}

#[query]
fn mentor_profile_edit_awaiting_approval() -> HashMap<Principal, MentorProfile> {
    MENTOR_PROFILE_EDIT_AWAITS.with(|awaiters| awaiters.borrow().clone())
}

#[query]
fn vc_profile_edit_awaiting_approval() -> HashMap<Principal, VentureCapitalist> {
    VC_PROFILE_EDIT_AWAITS.with(|awaiters| awaiters.borrow().clone())
}

#[query]
fn project_update_awaiting_approval() -> HashMap<String, ProjectUpdateRequest> {
    PENDING_PROJECT_UPDATES.with(|awaiters| awaiters.borrow().clone())
}

#[update]
pub fn decline_vc_creation_request(requester: Principal, decline: bool) -> String {
    VC_AWAITS_RESPONSE.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();

        if let Some(vc_internal) = awaiters.get_mut(&requester) {
            if decline {
                vc_internal.decline = decline;
                vc_internal.approve = false;

                match awaiters.get(&requester) {
                    Some(res) => {
                        DECLINED_VC_REQUESTS.with(|d_vc_registry| {
                            let mut d_vc = d_vc_registry.borrow_mut();
                            d_vc.insert(requester, res.clone())
                        });
                        ROLE_STATUS_ARRAY.with(|role_status| {
                            if let Some(user_role) = role_status
                                .borrow_mut()
                                .get_mut(&requester)
                                .expect("couldn't get requester's id")
                                .iter_mut()
                                .find(|r| r.name == "vc")
                            {
                                user_role.status = "default".to_string();
                                user_role.rejected_on = Some(time());
                            }
                        });

                        awaiters.remove(&requester);
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
    // let caller = caller();

    // let controllers = get_info().await.unwrap();
    // if is_controller(principal)

    VC_AWAITS_RESPONSE.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();
        // let mentor_internal = awaiters.get_mut(&requester);
        if let Some(vc_internal) = awaiters.get_mut(&requester) {
            if approve || vc_internal.approve {
                vc_internal.decline = false;
                vc_internal.approve = approve;

                match awaiters.get(&requester) {
                    Some(res) => {
                        VENTURECAPITALIST_STORAGE.with(|vc_registry| {
                            let mut vc = vc_registry.borrow_mut();
                            vc.insert(requester, res.clone())
                        });

                        ROLE_STATUS_ARRAY.with(|role_status| {
                            if let Some(user_role) = role_status
                                .borrow_mut()
                                .get_mut(&requester)
                                .expect("couldn't get requester's id")
                                .iter_mut()
                                .find(|r| r.name == "vc")
                            {
                                user_role.status = "approved".to_string();
                                user_role.approved_on = Some(time());
                            }
                        });

                        awaiters.remove(&requester);
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
    VC_PROFILE_EDIT_AWAITS.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();
        if let Some(vc_internal) = awaiters.get(&requester) {
            if approve {
                VENTURECAPITALIST_STORAGE.with(|vc_registry| {
                    let mut vc = vc_registry.borrow_mut();
                    if let Some(existing_vc_internal) = vc.get_mut(&requester) {
                        // existing_vc_internal.params = vc_internal.clone();
                        existing_vc_internal.params.registered_under_any_hub = vc_internal
                            .registered_under_any_hub
                            .clone()
                            .or(existing_vc_internal.params.registered_under_any_hub.clone());

                        existing_vc_internal.params.project_on_multichain = vc_internal
                            .project_on_multichain
                            .clone()
                            .or(existing_vc_internal.params.project_on_multichain.clone());

                        existing_vc_internal.params.money_invested = vc_internal
                            .money_invested
                            .clone()
                            .or(existing_vc_internal.params.money_invested.clone());

                        existing_vc_internal.params.existing_icp_portfolio = vc_internal
                            .existing_icp_portfolio
                            .clone()
                            .or(existing_vc_internal.params.existing_icp_portfolio.clone());
                        existing_vc_internal.params.announcement_details = vc_internal
                            .announcement_details
                            .clone()
                            .or(existing_vc_internal.params.announcement_details.clone());

                        existing_vc_internal.params.registered_country = vc_internal
                            .registered_country
                            .clone()
                            .or(existing_vc_internal.params.registered_country.clone());

                        existing_vc_internal.params.fund_size =
                            (vc_internal.fund_size * 100.0).round() / 100.0;
                        existing_vc_internal.params.assets_under_management =
                            vc_internal.assets_under_management.clone();

                        existing_vc_internal.params.category_of_investment =
                            vc_internal.category_of_investment.clone();

                        existing_vc_internal.params.logo = vc_internal.logo.clone();
                        existing_vc_internal.params.average_check_size =
                            (vc_internal.average_check_size * 100.0).round() / 100.0;
                        existing_vc_internal.params.existing_icp_investor =
                            vc_internal.existing_icp_investor;
                        existing_vc_internal.params.investor_type =
                            vc_internal.investor_type.clone();
                        existing_vc_internal.params.number_of_portfolio_companies =
                            vc_internal.number_of_portfolio_companies;
                        existing_vc_internal.params.portfolio_link =
                            vc_internal.portfolio_link.clone();
                        existing_vc_internal.params.reason_for_joining =
                            vc_internal.reason_for_joining.clone();
                        existing_vc_internal.params.name_of_fund = vc_internal.name_of_fund.clone();

                        existing_vc_internal.params.preferred_icp_hub =
                            vc_internal.preferred_icp_hub.clone();
                        existing_vc_internal.params.type_of_investment =
                            vc_internal.type_of_investment.clone();
                        existing_vc_internal.params.user_data = vc_internal.user_data.clone();
                        existing_vc_internal.params.linkedin_link =
                            vc_internal.linkedin_link.clone();
                        existing_vc_internal.params.website_link = vc_internal.website_link.clone();
                        existing_vc_internal.params.registered = vc_internal.registered.clone();
                    }
                });

                awaiters.remove(&requester);
                change_notification_status(requester, "vc".to_string(), "approved".to_string());
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
    VC_PROFILE_EDIT_AWAITS.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();

        if let Some(vc_internal) = awaiters.get(&requester) {
            if decline {
                DECLINED_VC_PROFILE_EDIT_REQUEST.with(|d_vc_registry| {
                    let mut d_vc = d_vc_registry.borrow_mut();
                    // Clone and insert the vc_internal into the declined registry
                    d_vc.insert(requester, vc_internal.clone());
                });

                // Remove the requester from the awaiters
                awaiters.remove(&requester);
                change_notification_status(requester, "vc".to_string(), "declined".to_string());

                // Return a success message for declining the request
                format!("Requester with principal id {} is declined", requester)
            } else {
                // Return a message indicating the request could not be declined (because decline is false)
                format!(
                    "Requester with principal id {} could not be declined",
                    requester
                )
            }
        } else {
            // Return a message indicating the requester has not registered
            format!(
                "Requester with principal id {} has not registered",
                requester
            )
        }
    })
}

#[update]

pub fn approve_mentor_profile_update(requester: Principal, approve: bool) -> String {
    MENTOR_PROFILE_EDIT_AWAITS.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();
        if let Some(updated_profile) = awaiters.get(&requester) {
            if approve {
                MENTOR_REGISTRY.with(|vc_registry| {
                    let mut mentor = vc_registry.borrow_mut();
                    if let Some(mentor_internal) = mentor.get_mut(&requester) {
                        // existing_vc_internal.params = vc_internal.clone();
                        mentor_internal.profile.preferred_icp_hub = updated_profile
                            .preferred_icp_hub
                            .clone()
                            .or(mentor_internal.profile.preferred_icp_hub.clone());

                        mentor_internal.profile.multichain = updated_profile
                            .multichain
                            .clone()
                            .or(mentor_internal.profile.multichain.clone());
                        mentor_internal.profile.existing_icp_project_porfolio = updated_profile
                            .existing_icp_project_porfolio
                            .clone()
                            .or(mentor_internal
                                .profile
                                .existing_icp_project_porfolio
                                .clone());

                        mentor_internal.profile.area_of_expertise =
                            updated_profile.area_of_expertise.clone();
                        mentor_internal.profile.category_of_mentoring_service =
                            updated_profile.category_of_mentoring_service.clone();

                        mentor_internal.profile.existing_icp_mentor =
                            updated_profile.existing_icp_mentor.clone();
                        mentor_internal.profile.icop_hub_or_spoke =
                            updated_profile.icop_hub_or_spoke;
                        mentor_internal.profile.linkedin_link =
                            updated_profile.linkedin_link.clone();
                        mentor_internal.profile.website = updated_profile.website.clone();
                        mentor_internal.profile.years_of_mentoring =
                            updated_profile.years_of_mentoring.clone();
                        mentor_internal.profile.reason_for_joining =
                            updated_profile.reason_for_joining.clone();
                        mentor_internal.profile.user_data = updated_profile.user_data.clone();
                        mentor_internal.profile.hub_owner = updated_profile
                            .hub_owner
                            .clone()
                            .or(mentor_internal.profile.hub_owner.clone());
                    }
                });

                awaiters.remove(&requester);
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
    MENTOR_PROFILE_EDIT_AWAITS.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();

        if let Some(vc_internal) = awaiters.get(&requester) {
            if decline {
                DECLINED_MENTOR_PROFILE_EDIT_REQUEST.with(|d_vc_registry| {
                    let mut d_vc = d_vc_registry.borrow_mut();
                    // Clone and insert the vc_internal into the declined registry
                    d_vc.insert(requester, vc_internal.clone());
                });

                // Remove the requester from the awaiters
                awaiters.remove(&requester);
                change_notification_status(requester, "mentor".to_string(), "declined".to_string());

                // Return a success message for declining the request
                format!("Requester with principal id {} is declined", requester)
            } else {
                // Return a message indicating the request could not be declined (because decline is false)
                format!(
                    "Requester with principal id {} could not be declined",
                    requester
                )
            }
        } else {
            // Return a message indicating the requester has not registered
            format!(
                "Requester with principal id {} has not registered",
                requester
            )
        }
    })
}

#[update]
pub fn approve_project_creation_request(requester: Principal) -> String {
    // let caller = caller();

    // let controllers = get_info().await.unwrap();
    // if is_controller(principal)

    PROJECT_AWAITS_RESPONSE.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();
        // let mentor_internal = awaiters.get_mut(&requester);
        if let Some(project_internal) = awaiters.get_mut(&requester) {
            project_internal.is_verified = true;

            match awaiters.get(&requester) {
                Some(res) => {
                    //register_mentor
                    APPLICATION_FORM.with(|m_registry| {
                        let mut project = m_registry.borrow_mut();
                        project.insert(requester, vec![res.clone()]);
                    });

                    //approve_project
                    ROLE_STATUS_ARRAY.with(|role_status| {
                        if let Some(user_role) = role_status
                            .borrow_mut()
                            .get_mut(&requester)
                            .expect("couldn't get requester's id")
                            .iter_mut()
                            .find(|r| r.name == "project")
                        {
                            user_role.status = "approved".to_string();
                            user_role.approved_on = Some(time());
                        }
                    });

                    awaiters.remove(&requester);
                    change_notification_status(
                        requester,
                        "project".to_string(),
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
    })
}

#[update]
pub fn decline_project_creation_request(requester: Principal) -> String {
    PROJECT_AWAITS_RESPONSE.with(|awaiters| {
        let mut awaiters = awaiters.borrow_mut();
        // let mentor_internal = awaiters.get_mut(&requester);
        if let Some(project_internal) = awaiters.get_mut(&requester) {
            project_internal.is_verified = false;

            match awaiters.get(&requester) {
                Some(res) => {
                    DECLINED_PROJECT_REQUESTS.with(|d_m_registry| {
                        let mut d_project = d_m_registry.borrow_mut();
                        d_project.insert(requester, res.clone())
                    });

                    ROLE_STATUS_ARRAY.with(|role_status| {
                        if let Some(user_role) = role_status
                            .borrow_mut()
                            .get_mut(&requester)
                            .expect("couldn't get requester's id")
                            .iter_mut()
                            .find(|r| r.name == "project")
                        {
                            user_role.status = "default".to_string();
                            user_role.rejected_on = Some(time());
                        }
                    });

                    awaiters.remove(&requester);
                    change_notification_status(
                        requester,
                        "project".to_string(),
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
    })
}
//todo:- change the function according to new struct
pub fn approve_project_update(requester: Principal, project_id: String, approve: bool) -> String {
    if let Some(project_update_request) =
        PENDING_PROJECT_UPDATES.with(|awaiters| awaiters.borrow_mut().remove(&project_id))
    {
        if approve {
            let updated = APPLICATION_FORM.with(|projects_registry| {
                let mut projects = projects_registry.borrow_mut();
                if let Some(project_list) = projects.get_mut(&requester) {
                    if let Some(project) = project_list.iter_mut().find(|p| p.uid == project_id) {
                        project.params.project_name =
                            project_update_request.updated_info.project_name;
                        project.params.project_logo =
                            project_update_request.updated_info.project_logo;
                        project.params.preferred_icp_hub =
                            project_update_request.updated_info.preferred_icp_hub;
                        project.params.live_on_icp_mainnet =
                            project_update_request.updated_info.live_on_icp_mainnet;
                        project.params.money_raised_till_now =
                            project_update_request.updated_info.money_raised_till_now;
                        project.params.supports_multichain =
                            project_update_request.updated_info.supports_multichain;
                        project.params.project_elevator_pitch =
                            project_update_request.updated_info.project_elevator_pitch;
                        project.params.project_area_of_focus =
                            project_update_request.updated_info.project_area_of_focus;
                        project.params.promotional_video =
                            project_update_request.updated_info.promotional_video;
                        project.params.github_link =
                            project_update_request.updated_info.github_link;
                        project.params.reason_to_join_incubator =
                            project_update_request.updated_info.reason_to_join_incubator;
                        project.params.project_description =
                            project_update_request.updated_info.project_description;
                        project.params.project_cover =
                            project_update_request.updated_info.project_cover;
                        project.params.project_team =
                            project_update_request.updated_info.project_team;
                        project.params.token_economics =
                            project_update_request.updated_info.token_economics;
                        project.params.technical_docs =
                            project_update_request.updated_info.technical_docs;
                        project.params.long_term_goals =
                            project_update_request.updated_info.long_term_goals;
                        project.params.target_market =
                            project_update_request.updated_info.target_market;
                        project.params.self_rating_of_project =
                            project_update_request.updated_info.self_rating_of_project;
                        project.params.user_data = project_update_request.updated_info.user_data;
                        project.params.mentors_assigned =
                            project_update_request.updated_info.mentors_assigned;
                        project.params.vc_assigned =
                            project_update_request.updated_info.vc_assigned;

                        true
                    } else {
                        false
                    }
                } else {
                    false
                }
            });

            if updated {
                change_notification_status(
                    requester,
                    "project".to_string(),
                    "approved".to_string(),
                );
                format!(
                    "Project update for ID {} has been approved and applied.",
                    project_id
                )
            } else {
                format!(
                    "Failed to apply update: Project ID {} not found under requester.",
                    project_id
                )
            }
        } else {
            change_notification_status(requester, "project".to_string(), "declined".to_string());
            // Optionally handle declined updates, such as logging or notifying the requester.
            format!("Project update for ID {} was declined.", project_id)
        }
    } else {
        format!("No pending update found for project ID {}.", project_id)
    }
}

#[update]
pub fn add_job_type(job_type: String) -> String {
    JOB_TYPE.with(|state| {
        let mut state = state.borrow_mut();
        state.push(job_type);
        format!("job type added")
    })
}

#[update]
pub async fn add_project_to_spotlight(project_id: String) -> Result<(), String> {
    let caller = caller();

    let admin_principals = match get_info().await {
        Ok(principals) => principals,
        Err(e) => return Err(format!("Failed to retrieve admin principals")),
    };

    if !admin_principals.contains(&caller) {
        return Err("Unauthorized: Caller is not an admin.".to_string());
    }

    let project_info = APPLICATION_FORM.with(|details| {
        details
            .borrow()
            .iter()
            .flat_map(|(_, projects)| projects.iter())
            .find(|project| project.uid == project_id)
            .cloned()
    });

    match project_info {
        Some(project_info) => {
            let spotlight_details = SpotlightDetails {
                added_by: caller,
                project_id: project_id,
                project_details: project_info.params,
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

pub fn pre_upgrade_admin() {
    ADMIN_NOTIFICATIONS.with(|notifications| {
        let serialized =
            bincode::serialize(&*notifications.borrow()).expect("Serialization failed");
        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
}

pub fn post_upgrade_admin() {
    let mut reader = StableReader::default();
    let mut data = Vec::new();
    reader
        .read_to_end(&mut data)
        .expect("Failed to read from stable storage");
    let upvotes: HashMap<Principal, Vec<Notification>> =
        bincode::deserialize(&data).expect("Deserialization failed of notification");
    ADMIN_NOTIFICATIONS.with(|notifications_ref| {
        *notifications_ref.borrow_mut() = upvotes;
    });
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
    ROLE_STATUS_ARRAY.with(|awaiters| {
        awaiters
            .borrow()
            .iter()
            .filter_map(|(principal, roles)| {
                let has_target_role = roles.iter().any(|role| {
                    role.name == role_name && role.status != "default" && role.status != "requested"
                });
                if has_target_role {
                    Some(principal.clone())
                } else {
                    None
                }
            })
            .collect()
    })
}

#[query]

fn get_total_approved_list_with_user_data() -> HashMap<Principal, ApprovedList> {
    let roles_to_check = vec!["user", "mentor", "vc", "project"]; // These are now just string literals

    let mut principals_roles: HashMap<Principal, Vec<String>> = HashMap::new();

    // Collect principals for each role
    for role_name in roles_to_check.iter() {
        let principals = get_principals_by_role(role_name); // Assuming this function exists and works as described before
        for principal in principals {
            principals_roles
                .entry(principal)
                .or_default()
                .push(role_name.to_string());
        }
    }

    // Fetch user data once for each unique principal and create ApprovedList
    principals_roles
        .iter()
        .filter_map(|(principal, roles)| {
            USER_STORAGE.with(|users| {
                // Directly extract UserInformation from UserInfoInternal
                users
                    .borrow()
                    .get(principal)
                    .cloned()
                    .map(|user_info_internal| {
                        let approved_list = ApprovedList {
                            approved_type: roles.clone(),                 // Roles are now strings
                            user_data: user_info_internal.params.clone(), // Directly use UserInformation
                        };
                        (principal.clone(), approved_list)
                    })
            })
        })
        .collect()
}
#[query]
pub fn get_total_count() -> Counts {
    let vc_count = VENTURECAPITALIST_STORAGE.with(|awaiters| awaiters.borrow().len());
    let mentor_count = MENTOR_REGISTRY.with(|awaiters| awaiters.borrow().len());
    let project_count = APPLICATION_FORM.with(|awaiters| awaiters.borrow().len());
    let user_count = USER_STORAGE.with(|awaiters| awaiters.borrow().len());
    let only_user_count = ROLE_STATUS_ARRAY.with(|awaiters| {
        awaiters
            .borrow()
            .iter()
            .filter(|(_, roles)| {
                let mut has_user_role = false;
                let mut other_roles_are_default_or_requested = true;

                for role in roles.iter() {
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
        vc_count,
        mentor_count,
        project_count,
        user_count,
        only_user_count,
    }
}

#[query]
fn get_total_pending_request() -> usize {
    let pending_requests = MENTOR_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().len())
        + VC_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().len())
        + PROJECT_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().len());
    pending_requests
}

// #[query]
// fn get_top()

#[update]
fn update_dapp_link(project_id: String, new_dapp_link: String) -> String {
    APPLICATION_FORM.with(|projects_registry| {
        let mut projects = projects_registry.borrow_mut();
        // Iterate through the entire HashMap
        for project_list in projects.values_mut() {
            // Iterate through each project in the list
            if let Some(project) = project_list.iter_mut().find(|p| p.uid == project_id) {
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

fn get_joined_on_(mentor_principal: &Principal, roletype: String) -> Option<u64> {
    ROLE_STATUS_ARRAY.with(|r| {
        r.borrow().get(mentor_principal).and_then(|roles| {
            roles
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

#[query]
fn get_top_5_projects() -> Vec<(String, TopData, usize)> {
    // Temporarily holding the projects to sort and filter
    let mut project_counts: Vec<(String, TopData, usize)> = Vec::new();

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
                let top_data = TopData {
                    full_name: project_info.user_data.full_name.clone(),
                    profile_picture: Some(project_info.project_logo.clone()),
                    area_of_interest: project_info.project_area_of_focus.clone(),
                    country: project_info.user_data.country.clone(),
                    joined_on: project_internal.creation_date.clone(),
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
