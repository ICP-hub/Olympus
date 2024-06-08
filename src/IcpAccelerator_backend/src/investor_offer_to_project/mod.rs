use crate::state_handler::*;
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use crate::state_handler::StoredPrincipal;

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToProjectByInvestor {
    offer_id: String, // Added field
    project_id: String,
    project_image: Option<Vec<u8>>,
    project_name: String,
    offer_i_have_written: String,
    time_of_request: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    response: String,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct InvestorInfo {
    investor_id: Principal,
    investor_name: String,
    investor_description: String,
    investor_image: Vec<u8>,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToSendToProjectByInvestor {
    offer_id: String, // Added field
    investor_info: InvestorInfo,
    offer: String,
    sent_at: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    sender_principal: Principal,
    response: String,
}

pub fn store_request_sent_by_capitalist(offer: OfferToProjectByInvestor) {
    mutate_state(|store| {
        let mut store_request = store
            .offers_sent_by_investor
            .get(&StoredPrincipal(caller()))
            .map(|candid_res| candid_res.0)
            .unwrap_or_default();

        store_request.push(offer);
    });
}

#[query]
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
        state
            .project_alerts_of_investor
            .get(&project_id)
            .map(|candid_res| candid_res.0)
            .unwrap_or_else(Vec::new)
            .push(offer);
    })
}

#[query]
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

#[update]
pub async fn send_offer_to_project_by_investor(project_id: String, msg: String) -> String {
    let investor_id = caller();

    let investor_profile = crate::get_vc_info_by_principal(investor_id)
        .get(&investor_id)
        .expect("investor does not exist")
        .clone();

    let project = crate::get_project_using_id(project_id.clone()).expect("project not found");

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let offer_to_project = OfferToProjectByInvestor {
        offer_id: offer_id.clone(),
        project_id: project_id.clone(),
        project_image: Some(project.params.project_logo),
        project_name: project.params.project_name,
        offer_i_have_written: msg.clone(),
        time_of_request: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
    };

    store_request_sent_by_capitalist(offer_to_project);

    let investor_info = InvestorInfo {
        investor_id,
        investor_name: investor_profile.profile.params.user_data.full_name.clone(),
        investor_description: investor_profile
            .profile
            .params
            .category_of_investment
            .clone(),
        investor_image: investor_profile
            .profile
            .params
            .user_data
            .profile_picture
            .clone()
            .unwrap_or_else(Vec::new),
    };

    let offer_to_send_to_project = OfferToSendToProjectByInvestor {
        offer_id: offer_id.clone(),
        investor_info,
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        sender_principal: caller(),
        response: "".to_string(),
    };

    notify_project_with_offer(project_id.clone(), offer_to_send_to_project);
    format!("offer sent sucessfully to {}", project_id)
}

#[update]
pub fn accept_offer_of_investor(
    offer_id: String,
    response_message: String,
    project_id: String,
) -> String {
    let mut already_accepted = false;

    read_state(|state| {
        if let Some(offers) = state.project_alerts_of_investor.get(&project_id) {
            if offers
                .0
                .iter()
                .any(|o| o.offer_id == offer_id && o.request_status == "accepted")
            {
                already_accepted = true;
            }
        }
    });

    if already_accepted {
        return format!("Offer with id: {} has already been accepted.", offer_id);
    }

    mutate_state(|state| {
        if let Some(mut offers) = state.project_alerts_of_investor.get(&project_id) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();
                offer.accepted_at = ic_cdk::api::time();

                if let Some(mut sent_status_vector) = state.offers_sent_by_investor.get(&StoredPrincipal(offer.sender_principal)) {
                    if let Some(project_offer) = sent_status_vector.0.iter_mut().find(|offer| offer.offer_id == offer_id) {
                        project_offer.request_status = "accepted".to_string();
                        project_offer.response = response_message.clone();
                        project_offer.accepted_at = ic_cdk::api::time();

                        if let Some(capitalist) = state.vc_storage.get(&StoredPrincipal(offer.sender_principal)) {
                            if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(ic_cdk::api::caller())) {
                                if let Some(project) = projects.0.iter_mut().find(|project| project.uid == project_offer.project_id) {
                                    if project.params.vc_assigned.is_none() {
                                        project.params.vc_assigned = Some(Vec::new());
                                    }

                                    let vc_assigned = project.params.vc_assigned.as_mut().unwrap();

                                    if !vc_assigned.contains(&capitalist.0.params) {
                                        vc_assigned.push(capitalist.0.params.clone());
                                    }

                                    let mut projects = state.projects_associated_with_vc.get(&StoredPrincipal(offer.sender_principal)).map(|candid_res| candid_res.0.clone()).unwrap_or_else(Vec::new);
                                    if !projects.contains(&project) {
                                        projects.push(project.clone());
                                        state.projects_associated_with_vc.insert(StoredPrincipal(offer.sender_principal), Candid(projects));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    format!("you have accepted the offer with offer id: {}", offer_id)
}

#[update]
pub fn decline_offer_of_investor(
    offer_id: String,
    response_message: String,
    project_id: String,
) -> String {
    mutate_state(|state| {
        if let Some(mut offers) = state.project_alerts_of_investor.get(&project_id) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = time()
            }
        }
    });

    mutate_state(|sent_state| {
        for (_key, mut sent_status_vector) in sent_state.offers_sent_by_investor.iter() {
            if let Some(project_offer) = sent_status_vector
                .0
                .iter_mut()
                .find(|offer| offer.offer_id == offer_id)
            {
                project_offer.request_status = "declined".to_string();
                project_offer.response = response_message.clone();
                project_offer.declined_at = time()
            }
        }
    });
    format!("you have declined the offer with offer id: {}", offer_id)
}

#[query]
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
#[query]
pub fn get_all_offers_which_are_pending_for_investor() -> Vec<OfferToProjectByInvestor> {
    read_state(|sent_notifications| {
        sent_notifications
            .offers_sent_by_investor
            .get(&StoredPrincipal(caller()))
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

#[query]
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

#[query]
pub fn get_all_requests_which_got_accepted_for_investor() -> Vec<OfferToProjectByInvestor> {
    read_state(|notifications| {
        notifications
            .offers_sent_by_investor
            .get(&StoredPrincipal(caller()))
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

#[query]
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

#[query]
pub fn get_all_requests_which_got_declined_for_investor() -> Vec<OfferToProjectByInvestor> {
    read_state(|notifications| {
        notifications
            .offers_sent_by_investor
            .get(&StoredPrincipal(caller()))
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

#[update]
pub fn self_decline_request_for_investor(offer_id: String) -> String {
    let mut response = String::new();

    mutate_state(|sent_ones| {
        let my_offers = &mut sent_ones.offers_sent_by_investor;
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
        }
    });

    if response == "Request got self declined." {
        mutate_state(|mentors| {
            let mentor_offers = &mut mentors.project_alerts_of_investor;
            for mut offers in mentor_offers.iter() {
                if let Some(offer) = offers.1 .0.iter_mut().find(|off| off.offer_id == offer_id) {
                    offer.request_status = "self_declined".to_string();
                    offer.self_declined_at = time();
                }
            }
        });
    }

    response
}

#[query]
pub fn get_all_requests_which_got_self_declined_for_investor() -> Vec<OfferToProjectByInvestor> {
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

#[query]
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
