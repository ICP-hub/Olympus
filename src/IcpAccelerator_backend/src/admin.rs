use serde::{Serialize, Deserialize};
use crate::mentor::*;
use crate::project_registration::*;
use crate::user_module::*;
use crate::vc_registration::*;

use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{canister_info, CanisterInfoRequest};
use ic_cdk::api::time;
use ic_cdk::api::{caller, id};
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, CandidType)]
struct ApprovalRequest {
    sender: Principal,
    receiver: Principal,
    photo: Vec<u8>,
    name: String,
    country: String,
    tag_used: String,
    requested_for: String,
}

#[derive(Clone, CandidType)]
enum NotificationType {
    ApprovalRequest(ApprovalRequest),
}

#[derive(Clone, CandidType)]
pub struct Notification {
    notification_type: NotificationType,
}

#[derive(Debug)]
enum MyError {
    CanisterInfoError(String),
}

thread_local! {
    static ADMIN_NOTIFICATIONS : RefCell<HashMap<Principal, Vec<Notification>>> = RefCell::new(HashMap::new())
}

pub async fn send_approval_request(
    photo: Vec<u8>,
    name: String,
    country: String,
    tag_used: String,
    requested_for: String,
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
                };

                let notification_to_send = Notification {
                    notification_type: NotificationType::ApprovalRequest(approval_request),
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
        let alerts = alerts.borrow();
        alerts.get(&caller).cloned().unwrap_or_default()
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


// #[query]
// fn mentors_awaiting_approval() -> HashMap<Principal, MentorWithRoles> {
//     let mentor_awaiters = MENTOR_AWAITS_RESPONSE.with(|awaiters| {
//         awaiters.borrow().clone()
//     });

//     let mut mentor_with_roles_map: HashMap<Principal, MentorWithRoles> = HashMap::new();

    
//     for (principal, mentor_internal) in mentor_awaiters.iter() {
//         let roles = get_roles_for_principal(*principal); 
//         let mentor_with_roles = MentorWithRoles {
//             mentor_profile: mentor_internal.clone(),
//             roles,
//         };

//         mentor_with_roles_map.insert(*principal, mentor_with_roles);
//     }

//     mentor_with_roles_map   
// }



#[query]
fn mentors_awaiting_approval() -> HashMap<Principal, MentorInternal> {
    MENTOR_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().clone())
}

#[query]
fn vc_awaiting_approval() -> HashMap<Principal, VentureCapitalistInternal> {
    VC_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().clone())
}

#[query]
fn project_awaiting_approval() -> HashMap<Principal, ProjectInfoInternal> {
    PROJECT_AWAITS_RESPONSE.with(|awaiters| awaiters.borrow().clone())
}

#[query]
fn vc_declined() -> HashMap<Principal, VentureCapitalistInternal> {
    DECLINED_VC_REQUESTS.with(|awaiters| awaiters.borrow().clone())
}

#[query]
fn project_declined() -> HashMap<Principal, ProjectInfoInternal> {
    DECLINED_PROJECT_REQUESTS.with(|awaiters| awaiters.borrow().clone())
}

#[query]
fn mentor_declined() -> HashMap<Principal, MentorInternal> {
    DECLINED_MENTOR_REQUESTS.with(|awaiters| awaiters.borrow().clone())
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
                    }
                });

                awaiters.remove(&requester);
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
            // Optionally handle declined updates, such as logging or notifying the requester.
            format!("Project update for ID {} was declined.", project_id)
        }
    } else {
        format!("No pending update found for project ID {}.", project_id)
    }
}
