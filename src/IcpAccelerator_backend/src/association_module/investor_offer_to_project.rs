use crate::cohort_module::get_cohort::{check_cohort_mebership, get_cohort};
use crate::project_module::get_project::get_project_info_using_principal;
use crate::project_module::post_project::find_project_owner_principal;
use crate::vc_module::get_vc::get_vc_info;
use crate::{add_notification, state_handler::*, AssociationNotification, AssociationNotificationInvestorToProject, CohortDetails, NotificationInternal, ProjectInfoInternal, UserInfoInternal, VentureCapitalist};
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use crate::state_handler::StoredPrincipal;
use crate::guard::*;

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToProjectByInvestor {
    pub offer_id: String, // Added field
    pub reciever_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub sender_data: Option<(VentureCapitalist, UserInfoInternal)>,
    pub offer: String,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub declined_at: u64,
    pub self_declined_at: u64,
    pub request_status: String,
    pub receiever_principal: Principal,
    pub sender_principal: Principal,
    pub response: String,
    pub is_cohort_association: bool,
    pub cohort_data: Option<CohortDetails>,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToSendToProjectByInvestor {
    pub offer_id: String, // Added field
    pub reciever_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub sender_data: Option<(VentureCapitalist, UserInfoInternal)>,
    pub offer: String,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub declined_at: u64,
    pub self_declined_at: u64,
    pub request_status: String,
    pub receiever_principal: Principal,
    pub sender_principal: Principal,
    pub response: String,
    pub is_cohort_association: bool,
    pub cohort_data: Option<CohortDetails>,
}

pub fn store_request_sent_by_capitalist(offer: OfferToProjectByInvestor) {
    mutate_state(|store| {
        let caller_principal = StoredPrincipal(caller());
        if let Some(mut store_request) = store.offers_sent_by_investor.get(&caller_principal) {
            store_request.0.push(offer);
        } else {
            store.offers_sent_by_investor.insert(caller_principal, Candid(vec![offer]));
        }
    });
}


#[query(guard = "combined_guard")]
pub fn get_all_sent_request_from_investor_to_project() -> Vec<OfferToProjectByInvestor> {
    read_state(|state| {
        state
            .offers_sent_by_investor
            .get(&StoredPrincipal(caller()))
            .map(|candid_res| candid_res.0)
            .unwrap_or_else(Vec::new)
    })
}

pub fn notify_project_with_offer(project_id: String, offer: OfferToSendToProjectByInvestor) {
    mutate_state(|state| {
        if let Some(offers) = state.project_alerts_of_investor.get(&project_id) {
            let mut new_offers = offers.0.clone();
            new_offers.push(offer);
            state.project_alerts_of_investor.insert(project_id, Candid(new_offers));
        } else {
            state.project_alerts_of_investor.insert(project_id, Candid(vec![offer]));
        }
    });
}

#[query(guard = "combined_guard")]
pub fn get_all_project_notification_sent_by_investor(
    id: String,
) -> Vec<OfferToSendToProjectByInvestor> {
    read_state(|state| {
        state
            .project_alerts_of_investor
            .get(&id)
            .map(|candid_res| candid_res.0)
            .unwrap_or_else(Vec::new)
    })
}

#[update(guard = "combined_guard")]
pub async fn send_offer_to_project_by_investor(project_id: String, msg: String, is_cohort_association: bool, cohort_id: Option<String>) -> String {
    let investor_id = caller();

    let mut offer_exists = false;  
    let mut existing_status = String::new();  

    let _ = read_state(|state| {
        if let Some(offers) = state.project_alerts_of_investor.get(&project_id) {
            if let Some(offer) = offers.0.iter().find(|o| o.sender_principal == investor_id) {
                offer_exists = true;  
                existing_status = offer.request_status.clone(); 
            }
        }
    });

    if offer_exists && (existing_status == "accepted" || existing_status == "declined") {
        return format!("An offer already exists with status '{}'. No more offers can be sent.", existing_status);
    }

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let project_principal = find_project_owner_principal(&project_id)
    .expect("Project principal must exist for the given project_id");

    let project_info = get_project_info_using_principal(project_principal);
    let vc_data = get_vc_info(investor_id);

    if is_cohort_association {
        if let Some(cohort) = &cohort_id {
            let investor_cohort = check_cohort_mebership(investor_id, cohort.to_string());
            let project_cohort = check_cohort_mebership(project_principal, cohort.to_string());
            
            if !investor_cohort || !project_cohort {
                return "Both parties must be in the same cohort to make a cohort-associated offer.".to_string();
            }
        } else {
            return "Cohort ID must be provided for cohort-associated offers.".to_string();
        }
    }
    let cohort_data_for_association = cohort_id.as_ref().map(|id| get_cohort(id.to_string()));

    let offer_to_project = OfferToProjectByInvestor {
        offer_id: offer_id.clone(),
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
        reciever_data: project_info.clone(),
        sender_data: vc_data.clone(),
        receiever_principal: project_principal,
        sender_principal: investor_id,
        is_cohort_association: is_cohort_association,
        cohort_data: cohort_data_for_association.clone()
    };

    store_request_sent_by_capitalist(offer_to_project);

    let offer_to_send_to_project = OfferToSendToProjectByInvestor {
        offer_id: offer_id.clone(),
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        sender_principal: caller(),
        response: "".to_string(),
        reciever_data: project_info.clone(),
        sender_data: vc_data.clone(),
        receiever_principal: project_principal,
        is_cohort_association: is_cohort_association,
        cohort_data: cohort_data_for_association.clone()
    };

    let association_noti_to_project = AssociationNotificationInvestorToProject{
        sender_data: vc_data.clone(),
        reciever_data: project_info.clone(),
        offer: msg.clone(),
        sent_at: time()
    };

    let assciation_noti_internal = AssociationNotification{
        project_to_investor_noti: None,
        project_to_mentor_noti: None,
        investor_to_project_noti: Some(association_noti_to_project),
        mentor_to_project_noti: None,
    };

    let noti_to_send = NotificationInternal{
        cohort_noti: None,
        docs_noti: None,
        money_noti: None,
        association_noti: Some(assciation_noti_internal),
    };

    let _ = add_notification(investor_id, project_principal, noti_to_send);

    notify_project_with_offer(project_id.clone(), offer_to_send_to_project);
    format!("offer sent sucessfully to {}", project_id)
}

#[update(guard = "combined_guard")]
pub fn accept_offer_from_investor_to_project(
    offer_id: String,
    response_message: String,
    project_id: String,
) -> String {
    let mut already_accepted = false;

    // Check if the offer has already been accepted
    read_state(|state| {
        if let Some(offers) = state.project_alerts_of_investor.get(&project_id) {
            already_accepted = offers.0.iter().any(|o| o.offer_id == offer_id && o.request_status == "accepted");
        }
    });

    if already_accepted {
        return format!("Offer with id: {} has already been accepted.", offer_id);
    }

    mutate_state(|state| {
        if let Some(mut offers) = state.project_alerts_of_investor.get(&project_id) {
            if let Some(index) = offers.0.iter().position(|o| o.offer_id == offer_id) {
                let offer = &mut offers.0[index];
                
                if offer.request_status != "accepted" {
                    offer.request_status = "accepted".to_string();
                    offer.response = response_message.clone();
                    offer.accepted_at = ic_cdk::api::time();

                    let sender_principal = offer.sender_principal;

                    // Immediate commit to state after modification
                    state.project_alerts_of_investor.insert(project_id.clone(), offers.clone());

                    // Handling updates in sent notifications
                    if let Some(mut sent_status_vector) = state.offers_sent_by_investor.get(&StoredPrincipal(sender_principal)) {
                        if let Some(pos) = sent_status_vector.0.iter().position(|offer| offer.offer_id == offer_id) {
                            let project_offer = &mut sent_status_vector.0[pos];
                            project_offer.request_status = "accepted".to_string();
                            project_offer.response = response_message.clone();
                            project_offer.accepted_at = ic_cdk::api::time();

                            // Immediate commit to state
                            state.offers_sent_by_investor.insert(StoredPrincipal(sender_principal), sent_status_vector.clone());
                        }
                    }

                    // Handling project and VC association updates
                    if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(caller())) {
                        if let Some(proj_index) = projects.0.iter().position(|p| p.uid == project_id) {
                            let project = &mut projects.0[proj_index];
                            if project.params.vc_assigned.is_none() {
                                project.params.vc_assigned = Some(Vec::new());
                            }
                            
                            if let Some(capitalist) = state.vc_storage.get(&StoredPrincipal(sender_principal)) {
                                if let Some(user_info) = state.user_storage.get(&StoredPrincipal(sender_principal)) {
                                    let vc_assigned = project.params.vc_assigned.as_mut().unwrap();
                                    let vc_tuple = (capitalist.0.params.clone(), user_info.0.clone());
                                    if !vc_assigned.iter().any(|item| item.0 == vc_tuple.0 && item.1 == vc_tuple.1) {
                                        vc_assigned.push(vc_tuple);
                                    }
                                    state.project_storage.insert(StoredPrincipal(caller()), projects.clone());
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    format!("You have accepted the offer with offer id: {}", offer_id)
}



#[update(guard = "combined_guard")]
pub fn decline_offer_from_investor_to_project(
    offer_id: String,
    response_message: String,
    project_id: String,
) -> String {
    mutate_state(|state| {
        // Decline the offer in project alerts of investor
        if let Some(mut offers) = state.project_alerts_of_investor.get(&project_id) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = ic_cdk::api::time();

                // Commit the changes to project alerts of investor
                state.project_alerts_of_investor.insert(project_id.clone(), offers.clone());
            }
        }

        // Decline the offer in offers sent by investor
        for (_key, mut sent_status_vector) in state.offers_sent_by_investor.iter() {
            if let Some(project_offer) = sent_status_vector
                .0
                .iter_mut()
                .find(|offer| offer.offer_id == offer_id)
            {
                project_offer.request_status = "declined".to_string();
                project_offer.response = response_message.clone();
                project_offer.declined_at = ic_cdk::api::time();
            }
        }
    });

    format!("You have declined the offer with offer id: {}", offer_id)
}


#[query(guard = "combined_guard")]
pub fn get_all_offers_which_are_pending_for_project_from_investor(
    project_id: String,
) -> Vec<OfferToSendToProjectByInvestor> {
    read_state(|pending_alerts| {
        pending_alerts
            .project_alerts_of_investor
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
pub fn get_all_offers_which_are_pending_for_investor(investor_id: Principal) -> Vec<OfferToProjectByInvestor> {
    read_state(|sent_notifications| {
        sent_notifications
            .offers_sent_by_investor
            .get(&StoredPrincipal(investor_id))
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

#[query(guard = "combined_guard")]
pub fn get_all_requests_which_got_accepted_by_project_of_investor(
    project_id: String,
) -> Vec<OfferToSendToProjectByInvestor> {
    read_state(|alerts| {
        alerts
            .project_alerts_of_investor
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
pub fn get_all_requests_which_got_accepted_for_investor(investor_id: Principal) -> Vec<OfferToProjectByInvestor> {
    read_state(|notifications| {
        notifications
            .offers_sent_by_investor
            .get(&StoredPrincipal(investor_id))
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
pub fn get_all_requests_which_got_declined_by_project_of_investor(
    project_id: String,
) -> Vec<OfferToSendToProjectByInvestor> {
    read_state(|alerts| {
        alerts
            .project_alerts_of_investor
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
pub fn get_all_requests_which_got_declined_for_investor(investor_id: Principal) -> Vec<OfferToProjectByInvestor> {
    read_state(|notifications| {
        notifications
            .offers_sent_by_investor
            .get(&StoredPrincipal(investor_id))
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
pub fn self_decline_request_from_investor_to_project(offer_id: String) -> String {
    let mut response = String::new();

    mutate_state(|sent_ones| {
        if let Some(mut my_offers) = sent_ones.offers_sent_by_investor.get(&StoredPrincipal(caller())) {
            if let Some(offer) = my_offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                match offer.request_status.as_str() {
                    "accepted" => response = "Your request has been approved.".to_string(),
                    "declined" => response = "Your request has been declined.".to_string(),
                    "pending" => {
                        offer.request_status = "self_declined".to_string();
                        offer.self_declined_at = time();
                        response = "Request got self declined.".to_string();
                    }
                    _ => {
                        response = "Invalid request status.".to_string();
                    }
                }
            } else {
                response = "Offer not found.".to_string();
            }
            sent_ones.offers_sent_by_investor.insert(StoredPrincipal(caller()), my_offers.clone());
        } else {
            response = "No offers found for the caller.".to_string();
        }
    });

    if response == "Request got self declined." {
        mutate_state(|mentors| {
            let mentor_offers = &mut mentors.project_alerts_of_investor;
            let mut keys_to_update = Vec::new();
            for (key, offers) in mentor_offers.iter() {
                if let Some(_offer) = offers.0.iter().find(|off| off.offer_id == offer_id) {
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
pub fn get_all_requests_which_got_self_declined_by_project() -> Vec<OfferToProjectByInvestor> {
    read_state(|offers| {
        let offers = &offers.offers_sent_by_investor;
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
pub fn get_all_requests_which_got_self_declined_by_investor(
    project_id: String,
) -> Vec<OfferToSendToProjectByInvestor> {
    read_state(|offers| {
        let offers = &offers.project_alerts_of_investor;
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
