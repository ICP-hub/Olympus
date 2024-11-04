use crate::project_module::get_project::get_project_info_using_principal;
use crate::project_module::post_project::find_project_owner_principal;
use crate::cohort_module::get_cohort::{check_cohort_mebership, get_cohort};
use crate::vc_module::get_vc::get_vc_info;
use crate::{add_notification, state_handler::*, AssociationNotification, AssociationNotificationProjectToInvestor, CohortDetails, NotificationInternal, ProjectInfoInternal, UserInfoInternal, VentureCapitalist};
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use crate::guard::*;

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToInvestor {
    pub offer_id: String, 
    pub sender_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub reciever_data: Option<(VentureCapitalist, UserInfoInternal)> ,
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

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToSendToInvestor {
    pub offer_id: String, 
    pub sender_data: Option<(ProjectInfoInternal, UserInfoInternal)>,
    pub reciever_data: Option<(VentureCapitalist, UserInfoInternal)> ,
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

pub fn store_request_sent_by_project_to_investor(project_id: String, offer: OfferToInvestor) {
    mutate_state(|store| {
        let project_id = project_id.clone(); 
        if let Some(mut store_request) = store.offers_offered_by_me.get(&project_id) {
            store_request.0.push(offer);
        } else {
            store.offers_offered_by_me.insert(project_id, Candid(vec![offer]));
        }
    });
}

pub fn notify_investor_with_offer(mentor_id: Principal, offer: OfferToSendToInvestor) {
    mutate_state(|state| {
        if let Some(offers) = state.investor_alerts.get(&StoredPrincipal(mentor_id)) {
            let mut new_offers = offers.0.clone();
            new_offers.push(offer);
            state.investor_alerts.insert(StoredPrincipal(mentor_id), Candid(new_offers));
        } else {
            state.investor_alerts.insert(StoredPrincipal(mentor_id), Candid(vec![offer]));
        }
    });
}


#[update(guard = "combined_guard")]
pub async fn send_offer_to_investor_by_project(
    investor_id: Principal,
    msg: String,
    project_id: String,
    is_cohort_association: bool, 
    cohort_id: Option<String>
) -> String {
    let mut offer_exists = false; 
    let mut existing_status = String::new(); 

    let _ = read_state(|state| {
        if let Some(offers) = state.project_alerts_of_investor.get(&project_id) {
            if let Some(offer) = offers.0.iter().find(|o| o.receiever_principal == investor_id) {
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

    let offer_to_investor = OfferToInvestor {
        offer_id: offer_id.clone(),
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
        sender_data: project_info.clone(),
        reciever_data: vc_data.clone(),
        sender_principal: project_principal,
        receiever_principal: investor_id,
        is_cohort_association: is_cohort_association,
        cohort_data: cohort_data_for_association.clone()
    };

    store_request_sent_by_project_to_investor(project_id.clone(), offer_to_investor);

    let offer_to_send_to_investor = OfferToSendToInvestor {
        offer_id: offer_id.clone(),
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
        sender_data: project_info.clone(),
        reciever_data: vc_data.clone(),
        sender_principal: project_principal,
        receiever_principal: investor_id,
        is_cohort_association: is_cohort_association,
        cohort_data: cohort_data_for_association.clone()
    };

    let association_noti_to_investor = AssociationNotificationProjectToInvestor{
        sender_data: project_info.clone(),
        reciever_data: vc_data.clone(),
        offer: msg.clone(),
        sent_at: time()
    };

    let assciation_noti_internal = AssociationNotification{
        project_to_investor_noti: Some(association_noti_to_investor),
        project_to_mentor_noti: None,
        investor_to_project_noti: None,
        mentor_to_project_noti: None,
    };

    let noti_to_send = NotificationInternal{
        cohort_noti: None,
        docs_noti: None,
        money_noti: None,
        association_noti: Some(assciation_noti_internal),
    };

    let _ = add_notification(project_principal, investor_id, noti_to_send);

    notify_investor_with_offer(investor_id, offer_to_send_to_investor);
    format!("offer sent sucessfully to {}", investor_id)
}

#[update(guard = "combined_guard")]
pub fn accept_offer_from_project_to_investor(offer_id: String, response_message: String) -> String {
    let investor_id = ic_cdk::api::caller();
    let mut already_accepted = false;

    // First, check if the offer has already been accepted
    read_state(|state| {
        if let Some(offers) = state.investor_alerts.get(&StoredPrincipal(investor_id)) {
            already_accepted = offers.0.iter().any(|o| o.offer_id == offer_id && o.request_status == "accepted");
        }
    });

    if already_accepted {
        return "Offer has already been accepted.".to_string();
    }

    // Perform state mutations if the offer has not been accepted yet
    mutate_state(|state| {
        if let Some(mut offers) = state.investor_alerts.get(&StoredPrincipal(investor_id)) {
            if let Some(index) = offers.0.iter_mut().position(|o| o.offer_id == offer_id) {
                let offer = &mut offers.0[index];
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();
                offer.accepted_at = ic_cdk::api::time();

                // Additional logic for updating project storage and notifications
                let sender_principal = offer.sender_principal;
                let project_id = offer.sender_data.as_ref().map(|(project_info, _)| project_info.uid.clone()).unwrap_or_else(|| {panic!("Project data must be present");});

                if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(sender_principal)) {
                    if let Some(project) = projects.0.iter_mut().find(|p| p.uid == project_id) {
                        if project.params.vc_assigned.is_none() {
                            project.params.vc_assigned = Some(Vec::new());
                        }

                        if let Some(investor_profile) = state.vc_storage.get(&StoredPrincipal(investor_id)) {
                            if let Some(user_info) = state.user_storage.get(&StoredPrincipal(investor_id)) {
                                let vc_assigned = project.params.vc_assigned.as_mut().unwrap();
                                let vc_tuple = (investor_profile.0.params.clone(), user_info.0.clone());

                                if !vc_assigned.iter().any(|item| item.0 == vc_tuple.0 && item.1 == vc_tuple.1) {
                                    vc_assigned.push(vc_tuple);
                                }
                            } else {
                                ic_cdk::println!("No user information found for VC with principal: {}", investor_id);
                            }
                        } else {
                            ic_cdk::println!("No VC profile found for investor with principal: {}", investor_id);
                        }
                        state.project_storage.insert(StoredPrincipal(sender_principal), projects.clone());
                    }
                }


                if let Some(mut sent_status_vector) = state.offers_offered_by_me.get(&project_id) {
                    if let Some(pos) = sent_status_vector.0.iter_mut().position(|o| o.offer_id == offer_id) {
                        let project_offer = &mut sent_status_vector.0[pos];
                        project_offer.request_status = "accepted".to_string();
                        project_offer.response = response_message.clone();
                        project_offer.accepted_at = ic_cdk::api::time();
                    }
                    // Commit changes to the offers offered by me
                    state.offers_offered_by_me.insert(project_id, sent_status_vector.clone());
                }
                
                // Finally, update the investor alerts
                state.investor_alerts.insert(StoredPrincipal(investor_id), offers.clone());
            }
        }
    });

    format!("You have accepted the offer with offer id: {}", offer_id)
}



#[update(guard = "combined_guard")]
pub fn decline_offer_from_project_to_investor(offer_id: String, response_message: String) -> String {
    let investor_id = caller();

    mutate_state(|state| {
        // Decline the offer in investor alerts
        if let Some(mut offers) = state.investor_alerts.get(&StoredPrincipal(investor_id)) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = time();

                // Reinsert the updated offers back to state
                state.investor_alerts.insert(StoredPrincipal(investor_id), offers.clone());
            }
        }

        // Decline the offer in sent notifications
        for (_, mut sent_status_vector) in state.offers_offered_by_me.iter() {
            if let Some(project_offer) = sent_status_vector
                .0
                .iter_mut()
                .find(|offer| offer.offer_id == offer_id)
            {
                project_offer.request_status = "declined".to_string();
                project_offer.response = response_message.clone();
                project_offer.declined_at = time();
            }
        }
    });

    format!("You have declined the offer with offer id: {}", offer_id)
}


#[query(guard = "combined_guard")]
pub fn get_pending_request_for_investor_sent_by_project(investor_id: Principal) -> Vec<OfferToSendToInvestor> {
    read_state(|pending_alerts| {
        pending_alerts
            .investor_alerts
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

//for project to see what request are sent to investor
#[query(guard = "combined_guard")]
pub fn get_pending_offers_for_project_received_from_investor(project_id: String) -> Vec<OfferToInvestor> {
    read_state(|pending_alerts| {
        pending_alerts
            .offers_offered_by_me
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

#[query(guard = "combined_guard")]
pub fn get_accepted_request_for_investor(investor_id: Principal) -> Vec<OfferToSendToInvestor> {
    read_state(|pending_alerts| {
        pending_alerts
            .investor_alerts
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
pub fn get_accepted_request_of_project_by_investor(project_id: String) -> Vec<OfferToInvestor> {
    read_state(|pending_alerts| {
        pending_alerts
            .offers_offered_by_me
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
pub fn get_declined_request_for_investor(investor_id: Principal) -> Vec<OfferToSendToInvestor> {
    read_state(|pending_alerts| {
        pending_alerts
            .investor_alerts
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

#[query(guard = "combined_guard")]
pub fn get_declined_request_of_project_by_investor(project_id: String) -> Vec<OfferToInvestor> {
    read_state(|pending_alerts| {
        pending_alerts
            .offers_offered_by_me
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

#[update(guard = "combined_guard")]
pub fn self_decline_request_from_project_to_investor(offer_id: String, project_id: String) -> String {
    let mut response: String = String::new();

    mutate_state(|sent_ones| {
        let my_offers = &mut sent_ones.offers_offered_by_me;
        let caller_offers = my_offers.get(&project_id);

        if let Some(mut offers) = caller_offers {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                match offer.request_status.as_str() {
                    "accepted" => response = "Your request has been approved already".to_string(),
                    "declined" => response = "Your request has been declined already".to_string(),
                    _ => {
                        offer.request_status = "self_declined".to_string();
                        offer.self_declined_at = time();
                        response = "Request got self declined.".to_string();
                    }
                }
            }
            my_offers.insert(project_id.clone(), offers.clone());
        }
    });

    if response == "Request got self declined." {
        mutate_state(|mentors| {
            let mentor_offers = &mut mentors.investor_alerts;
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
pub fn get_self_declined_requests_of_project(project_id: String) -> Vec<OfferToInvestor> {
    read_state(|offers| {
        let offers = &offers.offers_offered_by_me;
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

#[query(guard = "combined_guard")]
pub fn get_self_declined_requests_for_investor() -> Vec<OfferToSendToInvestor> {
    read_state(|offers| {
        let offers = &offers.investor_alerts;
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