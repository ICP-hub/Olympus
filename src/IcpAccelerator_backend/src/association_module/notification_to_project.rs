use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use crate::cohort_module::get_cohort::{check_cohort_mebership, get_cohort};
use crate::mentor_module::get_mentor::get_mentor_info_using_principal;
use crate::project_module::get_project::get_project_info_using_principal;
use crate::project_module::post_project::find_project_owner_principal;
use crate::{add_notification, state_handler::*, AssociationNotification, AssociationNotificationMentorToProject, CohortDetails, MentorInternal, NotificationInternal, ProjectInfoInternal, UserInfoInternal};
use crate::guard::*;

#[derive(Clone, CandidType, Deserialize, Serialize, Debug)]
pub struct OfferToProject {
    pub offer_id: String, 
    pub reciever_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub sender_data: Option<(MentorInternal, UserInfoInternal)> ,
    pub offer: String,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub declined_at: u64,
    pub self_declined_at: u64,
    pub request_status: String,
    pub sender_principal: Principal,
    pub receiever_principal: Principal,
    pub response: String,
    pub is_cohort_association: bool,
    pub cohort_data: Option<CohortDetails>,
}

#[derive(Clone, CandidType, Deserialize, Serialize, Debug)]
pub struct OfferToSendToProject {
    pub offer_id: String, 
    pub reciever_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub sender_data: Option<(MentorInternal, UserInfoInternal)> ,
    pub offer: String,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub declined_at: u64,
    pub self_declined_at: u64,
    pub request_status: String,
    pub sender_principal: Principal,
    pub receiever_principal: Principal,
    pub response: String,
    pub is_cohort_association: bool,
    pub cohort_data: Option<CohortDetails>,
}

pub fn store_request_sent_by_mentor(offer: OfferToProject, mentor_id: Principal) {
    mutate_state(|store| {
        if let Some(mut offers) = store.my_sent_notifications_project.get(&StoredPrincipal(mentor_id)) {
            offers.0.push(offer);
        } else {
            store.my_sent_notifications_project.insert(StoredPrincipal(mentor_id), Candid(vec![offer]));
        }
    });
}

#[query(guard = "combined_guard")]
pub fn get_all_sent_request_for_mentor() -> Vec<OfferToProject> {
    read_state(|state| {
        state
            .my_sent_notifications_project
            .get(&StoredPrincipal(caller()))
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_else(Vec::new)
    })
}

pub fn notify_project_with_offer(project_id: String, offer: OfferToSendToProject) {
    mutate_state(|state| {
        if let Some(offers) = state.project_alerts.get(&project_id) {
            let mut new_offers = offers.0.clone();
            new_offers.push(offer);
            state.project_alerts.insert(project_id, Candid(new_offers));
        } else {
            state.project_alerts.insert(project_id, Candid(vec![offer]));
        }
    });
}

#[query(guard = "combined_guard")]
pub fn get_all_project_notification(id: String) -> Vec<OfferToSendToProject> {
    read_state(|state| {
        state
            .project_alerts
            .get(&id)
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_else(Vec::new)
    })
}

#[update(guard = "combined_guard")]
pub async fn send_offer_to_project_by_mentor(
    project_id: String,
    msg: String,
    mentor_id: Principal,
    is_cohort_association: bool, 
    cohort_id: Option<String>
) -> String {
    ic_cdk::println!("MENTIR PRINCIPAL {}", mentor_id.to_string());

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let mut offer_exists = false; 
    let mut existing_status = String::new(); 

    let _ = read_state(|state| {
        if let Some(offers) = state.project_alerts.get(&project_id) {
            if let Some(offer) = offers.0.iter().find(|o| o.sender_principal == mentor_id) {
                offer_exists = true; 
                existing_status = offer.request_status.clone();  
                ic_cdk::println!("An offer with status '{}' already exists for project {}.", existing_status, project_id);
            }
        }
    });

    if offer_exists && (existing_status == "accepted" || existing_status == "declined") {
        return format!("An offer already exists with status '{}'. No more offers can be sent.", existing_status);
    }

    let project_principal = find_project_owner_principal(&project_id)
    .expect("Project principal must exist for the given project_id");

    let project_info = get_project_info_using_principal(project_principal);
    let mentor_data = get_mentor_info_using_principal(mentor_id);

    if is_cohort_association {
        if let Some(cohort) = &cohort_id {
            let investor_cohort = check_cohort_mebership(mentor_id, cohort.to_string());
            let project_cohort = check_cohort_mebership(project_principal, cohort.to_string());
            
            if !investor_cohort || !project_cohort {
                return "Both parties must be in the same cohort to make a cohort-associated offer.".to_string();
            }
        } else {
            return "Cohort ID must be provided for cohort-associated offers.".to_string();
        }
    }
    let cohort_data_for_association = cohort_id.as_ref().map(|id| get_cohort(id.to_string()));

    let offer_to_project = OfferToProject {
        offer_id: offer_id.clone(),
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
        sender_data: mentor_data.clone(),
        reciever_data: project_info.clone(),
        sender_principal: mentor_id,
        receiever_principal: project_principal,
        is_cohort_association: is_cohort_association,
        cohort_data: cohort_data_for_association.clone()
    };

    store_request_sent_by_mentor(offer_to_project, mentor_id);

    let offer_to_send_to_project = OfferToSendToProject {
        offer_id: offer_id.clone(),
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
        sender_data: mentor_data.clone(),
        reciever_data: project_info.clone(),
        sender_principal: mentor_id,
        receiever_principal: project_principal,
        is_cohort_association: is_cohort_association,
        cohort_data: cohort_data_for_association.clone()
    };

    let association_noti_to_project = AssociationNotificationMentorToProject{
        sender_data: mentor_data.clone(),
        reciever_data: project_info.clone(),
        offer: msg.clone(),
        sent_at: time()
    };

    let assciation_noti_internal = AssociationNotification{
        project_to_investor_noti: None,
        project_to_mentor_noti: None,
        investor_to_project_noti: None,
        mentor_to_project_noti: Some(association_noti_to_project),
    };

    let noti_to_send = NotificationInternal {
        cohort_noti: Some(Vec::new()),  
        docs_noti: Some(Vec::new()),    
        money_noti: Some(Vec::new()),   
        association_noti: vec![assciation_noti_internal].into(),
    };

    let _ = add_notification(mentor_id, project_principal, noti_to_send, crate::NotificationApprovalStatus::Pending);

    notify_project_with_offer(project_id.clone(), offer_to_send_to_project);
    format!("offer sent sucessfully to {}", project_id)
}


#[update(guard = "combined_guard")]
pub fn accept_offer_from_mentor_to_project(offer_id: String, response_message: String, project_id: String) -> String {
    let caller_principal = ic_cdk::api::caller();
    ic_cdk::println!("Caller Principal: {:?}", caller_principal);

    // Check if the offer has already been accepted
    let mut already_accepted = false;
    read_state(|state| {
        ic_cdk::println!("Reading state to check if offer with ID '{}' has already been accepted for project '{}'", offer_id, project_id);
        if let Some(offers) = state.project_alerts.get(&project_id) {
            already_accepted = offers.0.iter().any(|o| o.offer_id == offer_id && o.request_status == "accepted");
            ic_cdk::println!("Offer already accepted: {}", already_accepted);
        } else {
            ic_cdk::println!("No offers found for project ID: {}", project_id);
        }
    });

    if already_accepted {
        ic_cdk::println!("Exiting because offer is already accepted");
        return "Offer has already been accepted.".to_string();
    }

    mutate_state(|state| {
        ic_cdk::println!("Mutating state to accept offer with ID '{}' for project '{}'", offer_id, project_id);
        if let Some(mut offers) = state.project_alerts.get(&project_id) {
            if let Some(index) = offers.0.iter().position(|o| o.offer_id == offer_id) {
                let offer = &mut offers.0[index];
                ic_cdk::println!("Found offer, updating status to accepted");
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();
                offer.accepted_at = ic_cdk::api::time();

                // state.project_alerts.insert(project_id.clone(), offers.clone());

                if let Some(mut sent_status_vector) = state.my_sent_notifications_project.get(&StoredPrincipal(offer.sender_principal)) {
                    if let Some(pos) = sent_status_vector.0.iter_mut().position(|o| o.offer_id == offer_id) {
                        let project_offer = &mut sent_status_vector.0[pos];
                        project_offer.request_status = "accepted".to_string();
                        project_offer.response = response_message.clone();
                        project_offer.accepted_at = ic_cdk::api::time();

                        state.my_sent_notifications_project.insert(StoredPrincipal(offer.sender_principal), sent_status_vector.clone());
                    }
                }

                if let Some(mentor_profile) = state.mentor_storage.get(&StoredPrincipal(offer.sender_principal)) {
                    if let Some(user_info) = state.user_storage.get(&StoredPrincipal(offer.sender_principal)) {
                        if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(caller_principal)) {
                            if let Some(proj_index) = projects.0.iter_mut().position(|p| p.uid == project_id) {
                                let project = &mut projects.0[proj_index];
                                if project.params.mentors_assigned.is_none() {
                                    project.params.mentors_assigned = Some(Vec::new());
                                }

                                let mentors_assigned = project.params.mentors_assigned.as_mut().unwrap();
                                let mentor_tuple = (mentor_profile.0.profile.clone(), user_info.0.clone());

                                if !mentors_assigned.iter().any(|item| item.0 == mentor_tuple.0 && item.1 == mentor_tuple.1) {
                                    mentors_assigned.push(mentor_tuple);
                                    ic_cdk::println!("Mentor added to project's assigned mentor list with user info");
                                }

                                state.project_storage.insert(StoredPrincipal(caller_principal), projects.clone());
                            } else {
                                ic_cdk::println!("No project found with ID '{}' to update", project_id);
                            }
                        }
                    } else {
                        ic_cdk::println!("No user information found for mentor with principal: {}", offer.sender_principal);
                    }
                } else {
                    ic_cdk::println!("No mentor profile found for mentor with principal: {}", offer.sender_principal);
                }
            } else {
                // ic_cdk::println!("Offer with ID '{}' not found in offers list for project '{}'", offer_id, project_id);
            }
            state.project_alerts.insert(project_id.clone(), offers.clone());
        } else {
            // ic_cdk::println!("No offers list found for project ID: {}", project_id);
        }
        
    });
    "You have accepted the offer with offer id: {}".to_string().replace("{}", &offer_id)
}



#[update(guard = "combined_guard")]
pub fn decline_offer_from_mentor_to_project(
    offer_id: String,
    response_message: String,
    project_id: String,
) -> String {
    mutate_state(|state| {
        // Decline the offer in project alerts
        if let Some(mut offers) = state.project_alerts.get(&project_id) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = ic_cdk::api::time();

                // Commit the changes to project alerts immediately
                state.project_alerts.insert(project_id.clone(), offers.clone());
            }
        }

        // Decline the offer in sent notifications
        let sender_principal = if let Some(offers) = state.project_alerts.get(&project_id) {
            offers.0.iter().find(|o| o.offer_id == offer_id).map(|o| o.sender_principal)
        } else {
            None
        };

        if let Some(principal) = sender_principal {
            if let Some(mut sent_status_vector) = state.my_sent_notifications_project.get(&StoredPrincipal(principal)) {
                if let Some(pos) = sent_status_vector.0.iter_mut().position(|o| o.offer_id == offer_id) {
                    let project_offer = &mut sent_status_vector.0[pos];
                    project_offer.request_status = "declined".to_string();
                    project_offer.response = response_message.clone();
                    project_offer.declined_at = ic_cdk::api::time();
                }
            }
        }
    });

    format!("You have declined the offer with offer id: {}", offer_id)
}


#[query(guard = "combined_guard")]
pub fn get_all_offers_which_are_pending_for_project_from_mentor(
    project_id: String,
) -> Vec<OfferToSendToProject> {
    read_state(|pending_alerts| {
        pending_alerts
            .project_alerts
            .get(&project_id)
            .map_or_else(Vec::new, |offers| {
                offers
                    .0
                    .iter()
                    .filter(|offer| offer.request_status == "pending")
                    .cloned()
                    .collect()
            })
    })
}

//mentor will call
#[query(guard = "combined_guard")]
pub fn get_all_offers_which_are_pending_for_mentor_via_mentor(mentor_id: Principal) -> Vec<OfferToProject> {
    ic_cdk::println!("Fetching pending offers for mentor ID: {:?}", mentor_id);

    read_state(|pending_alerts| {
        let offers = pending_alerts.my_sent_notifications_project.get(&StoredPrincipal(mentor_id));
        ic_cdk::println!("Offers found: {:?}", offers);

        offers.map_or_else(Vec::new, |offers| {
            let pending_offers: Vec<OfferToProject> = offers
                .0
                .iter()
                .filter(|offer| {
                    let is_pending = offer.request_status == "pending";
                    ic_cdk::println!("Offer ID: {}, Status: {}, Is Pending: {}", offer.offer_id, offer.request_status, is_pending);
                    is_pending
                })
                .cloned()
                .collect();
            ic_cdk::println!("Pending offers: {:?}", pending_offers);
            pending_offers
        })
    })
}

#[query(guard = "combined_guard")]
pub fn get_all_requests_which_got_accepted_for_project_from_mentor(
    project_id: String,
) -> Vec<OfferToSendToProject> {
    read_state(|pending_alerts| {
        pending_alerts
            .project_alerts
            .get(&project_id)
            .map_or_else(Vec::new, |offers| {
                offers
                    .0
                    .iter()
                    .filter(|offer| offer.request_status == "accepted")
                    .cloned()
                    .collect()
            })
    })
}

#[query(guard = "combined_guard")]
pub fn get_all_requests_which_got_accepted_for_mentor_via_mentor(mentor_id: Principal) -> Vec<OfferToProject> {
    read_state(|pending_alerts| {
        pending_alerts
            .my_sent_notifications_project
            .get(&StoredPrincipal(mentor_id))
            .map_or_else(Vec::new, |offers| {
                offers
                    .0
                    .iter()
                    .filter(|offer| offer.request_status == "accepted")
                    .cloned()
                    .collect()
            })
    })
}

#[query(guard = "combined_guard")]
pub fn get_all_requests_which_got_declined_for_project_from_mentor(
    project_id: String,
) -> Vec<OfferToSendToProject> {
    read_state(|pending_alerts| {
        pending_alerts
            .project_alerts
            .get(&project_id)
            .map_or_else(Vec::new, |offers| {
                offers
                    .0
                    .iter()
                    .filter(|offer| offer.request_status == "declined")
                    .cloned()
                    .collect()
            })
    })
}

#[query(guard = "combined_guard")]
pub fn get_all_requests_which_got_declined_for_mentor_via_mentor(mentor_id: Principal) -> Vec<OfferToProject> {
    read_state(|pending_alerts| {
        pending_alerts
            .my_sent_notifications_project
            .get(&StoredPrincipal(mentor_id))
            .map_or_else(Vec::new, |offers| {
                offers
                    .0
                    .iter()
                    .filter(|offer| offer.request_status == "declined")
                    .cloned()
                    .collect()
            })
    })
}

//self decline the send

//for project

#[update(guard = "combined_guard")]
pub fn self_decline_request_from_mentor_project(offer_id: String) -> String {
    let mut response = String::new();

    // Mutate state for my_sent_notifications_project
    mutate_state(|sent_ones| {
        let my_offers = &mut sent_ones.my_sent_notifications_project;
        let caller_offers = my_offers.get(&StoredPrincipal(caller()));

        if let Some(mut offers) = caller_offers {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                match offer.request_status.as_str() {
                    "accepted" => response = "Your request has been approved.".to_string(),
                    "declined" => response = "Your request has been declined.".to_string(),
                    _ => {
                        offer.request_status = "self_declined".to_string();
                        offer.self_declined_at = time();
                        response = "Request got self declined.".to_string();
                    }
                }
            }
            my_offers.insert(StoredPrincipal(caller()), offers.clone());
        }
    });

    if response == "Request got self declined." {
        mutate_state(|mentors| {
            let mentor_offers = &mut mentors.project_alerts;
            let mut keys_to_update = Vec::new();

            for (key, offers) in mentor_offers.iter() {
                if offers.0.iter().any(|off| off.offer_id == offer_id) {
                    keys_to_update.push(key.clone());
                }
            }

            for key in keys_to_update {
                if let Some(mut offers) = mentor_offers.get(&key) {
                    if let Some(offer) = offers.0.iter_mut().find(|off| off.offer_id == offer_id) {
                        offer.request_status = "self_declined".to_string();
                        offer.self_declined_at = time();
                    }
                    mentor_offers.insert(key.clone(), offers.clone());
                }
            }
        });
    }

    response
}


#[query(guard = "combined_guard")]
pub fn get_all_requests_which_got_self_declined_for_mentor_via_mentor() -> Vec<OfferToProject> {
    read_state(|offers| {
        let offers = &offers.my_sent_notifications_project;
        let offers = offers.get(&StoredPrincipal(caller()));
        offers.map_or_else(Vec::new, |offers| {
            offers
                .0
                .iter()
                .filter(|offer| offer.request_status == "self_declined")
                .cloned()
                .collect()
        })
    })
}

#[query(guard = "combined_guard")]
pub fn get_all_requests_which_got_self_declined_for_project(
    project_id: String,
) -> Vec<OfferToSendToProject> {
    read_state(|offers| {
        let offers = &offers.project_alerts;
        let offers = offers.get(&project_id);
        offers.map_or_else(Vec::new, |offers| {
            offers
                .0
                .iter()
                .filter(|offer| offer.request_status == "self_declined")
                .cloned()
                .collect()
        })
    })
}