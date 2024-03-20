use crate::{find_project_by_id, get_mentor_by_principal, mentor};
use candid::{CandidType, Principal};
use ic_cdk::api::call;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::Deserialize;
use sha2::{Digest, Sha256};
use std::{cell::RefCell, collections::HashMap, fmt::format, ptr::null};

#[derive(Clone, CandidType, Deserialize)]
pub struct OfferToMentor {
    offer_id: String, // Added field
    mentor_id: Principal,
    mentor_image: Option<Vec<u8>>,
    mentor_name: String,
    offer_i_have_written: String,
    time_of_request: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at : u64,
    request_status: String,
    response: String,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct ProjectInfo {
    project_id: String,
    project_name: String,
    project_description: String,
    project_logo: Vec<u8>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct OfferToSendToMentor {
    offer_id: String, // Added field
    project_info: ProjectInfo,
    offer: String,
    sent_at: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at : u64,
    request_status: String,
    sender_principal: Principal,
    response: String,
}

thread_local! {
    pub static MY_SENT_NOTIFICATIONS : RefCell<HashMap<Principal, Vec<OfferToMentor>>> = RefCell::new(HashMap::new());
    pub static MENTOR_ALERTS : RefCell<HashMap<Principal, Vec<OfferToSendToMentor>>> = RefCell::new(HashMap::new());
}

pub fn store_request_sent_by_project(offer: OfferToMentor) {
    MY_SENT_NOTIFICATIONS.with(|store| {
        store
            .borrow_mut()
            .entry(caller())
            .or_insert_with(Vec::new)
            .push(offer);
    });
}

#[query]
pub fn get_all_sent_request() -> Vec<OfferToMentor> {
    MY_SENT_NOTIFICATIONS.with(|state| {
        state
            .borrow()
            .get(&caller())
            .cloned()
            .unwrap_or_else(Vec::new)
    })
}

pub fn notify_mentor_with_offer(mentor_id: Principal, offer: OfferToSendToMentor) {
    MENTOR_ALERTS.with(|state| {
        state
            .borrow_mut()
            .entry(mentor_id)
            .or_insert_with(Vec::new)
            .push(offer);
    })
}

#[query]
pub fn get_all_mentor_notification(id: Principal) -> Vec<OfferToSendToMentor> {
    MENTOR_ALERTS.with(|state| state.borrow().get(&id).cloned().unwrap_or_else(Vec::new))
}

#[update]
pub async fn send_offer_to_mentor(mentor_id: Principal, msg: String, project_id: String) -> String{
    let mentor = get_mentor_by_principal(mentor_id).expect("mentor doesn't exist");

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:?}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let offer_to_mentor = OfferToMentor {
        offer_id: offer_id.clone(),
        mentor_id: mentor_id,
        mentor_image: mentor.user_data.profile_picture,
        mentor_name: mentor.user_data.full_name,
        offer_i_have_written: msg.clone(),
        time_of_request: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
    };

    store_request_sent_by_project(offer_to_mentor);

    let project_info = find_project_by_id(&project_id).expect("project does not exist");

    let project_info = ProjectInfo {
        project_id: project_id,
        project_name: project_info.params.project_name,
        project_description: project_info.params.project_description,
        project_logo: project_info.params.project_logo,
    };

    let offer_to_send_to_mentor = OfferToSendToMentor {
        offer_id: offer_id.clone(),
        project_info: project_info,
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at : 0,
        request_status: "pending".to_string(),
        sender_principal: caller(),
        response: "".to_string(),
    };

    notify_mentor_with_offer(mentor_id, offer_to_send_to_mentor);
    format!("offer sent sucessfully to {}", mentor_id)
}

#[update]
pub fn accept_offer_of_project(offer_id: String, response_message: String) -> String{
    let mentor_id = caller();

    MENTOR_ALERTS.with(|state| {
        //let state = state.borrow_mut().get(&mentor_id).cloned().unwrap_or_else(Vec::new);
        if let Some(offers) = state.borrow_mut().get_mut(&mentor_id) {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();
                offer.accepted_at = time();

                MY_SENT_NOTIFICATIONS.with(|sent_state| {
                    if let Some(sent_status_vector) =
                        sent_state.borrow_mut().get_mut(&offer.sender_principal)
                    {
                        if let Some(project_offer) = sent_status_vector
                            .iter_mut()
                            .find(|offer| offer.offer_id == offer_id)
                        {
                            project_offer.request_status = "accepted".to_string();
                            project_offer.response = response_message.clone();
                            project_offer.accepted_at = time()
                        }
                    }
                });
            }
        }
    });

    format!("you have accepted the offer with offer id: {}", offer_id)
}

#[update]
pub fn decline_offer_of_project(offer_id: String, response_message: String) -> String{
    let mentor_id = caller();

    MENTOR_ALERTS.with(|state| {
        if let Some(offers) = state.borrow_mut().get_mut(&mentor_id) {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = time()
            }
        }
    });

    MY_SENT_NOTIFICATIONS.with(|sent_state| {
        for sent_status_vector in sent_state.borrow_mut().values_mut() {
            if let Some(project_offer) = sent_status_vector
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
pub fn get_pending_request_for_mentor(mentor_id: Principal) -> Vec<OfferToSendToMentor> {
    MENTOR_ALERTS.with(|pending_alerts| {
        pending_alerts
            .borrow()
            .get(&mentor_id)
            .map_or_else(Vec::new, |offers| {
                offers
                    .iter()
                    .filter(|offer| offer.request_status == "pending")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_project_pending_offers() -> Vec<OfferToMentor> {
    MY_SENT_NOTIFICATIONS.with(|sent_notifications| {
        sent_notifications
            .borrow()
            .get(&caller())
            .map_or_else(Vec::new, |offers| {
                offers
                    .iter()
                    .filter(|offer| offer.request_status == "pending")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_accepted_request_for_mentor(mentor_id: Principal) -> Vec<OfferToSendToMentor> {
    MENTOR_ALERTS.with(|alerts| {
        alerts
            .borrow()
            .get(&mentor_id)
            .map_or_else(Vec::new, |offers| {
                offers
                    .iter()
                    .filter(|offer| offer.request_status == "accepted")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_accepted_request_for_project() -> Vec<OfferToMentor> {
    MY_SENT_NOTIFICATIONS.with(|notifications| {
        notifications
            .borrow()
            .get(&caller())
            .map_or_else(Vec::new, |offers| {
                offers
                    .iter()
                    .filter(|offer| offer.request_status == "accepted")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_declined_request_for_mentor(mentor_id: Principal) -> Vec<OfferToSendToMentor> {
    MENTOR_ALERTS.with(|alerts| {
        alerts
            .borrow()
            .get(&mentor_id)
            .map_or_else(Vec::new, |offers| {
                offers
                    .iter()
                    .filter(|offer| offer.request_status == "declined")
                    .cloned()
                    .collect()
            })
    })
}

#[query]
pub fn get_declined_request_for_project() -> Vec<OfferToMentor> {
    MY_SENT_NOTIFICATIONS.with(|notifications| {
        notifications
            .borrow()
            .get(&caller())
            .map_or_else(Vec::new, |offers| {
                offers
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
pub fn self_decline_request(offer_id: String) -> String {
    let mut response = String::new();

    MY_SENT_NOTIFICATIONS.with(|sent_ones| {
        let mut my_offers = sent_ones.borrow_mut();
        let caller_offers = my_offers.get_mut(&caller());
        
        if let Some(offers) = caller_offers {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                match offer.request_status.as_str() {
                    "accepted" => response = "Your request has been approved.".to_string(),
                    "declined" => response = "Your request has been declined.".to_string(),
                    _ => {
                        offer.request_status = "self_declined".to_string();
                        offer.self_declined_at = time();
                        response = "Request got self declined.".to_string();
                    },
                }
            }
        }
    });

    if response == "Request got self declined." {
        MENTOR_ALERTS.with(|mentors| {
            let mut mentor_offers = mentors.borrow_mut();
            for offers in mentor_offers.values_mut() {
                if let Some(offer) = offers.iter_mut().find(|off| off.offer_id == offer_id) {
                    offer.request_status = "self_declined".to_string();
                    offer.self_declined_at = time();
                }
            }
        });
    }

    response

}

#[query]
pub fn get_self_declined_requests_for_project() -> Vec<OfferToMentor>{
    MY_SENT_NOTIFICATIONS.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&caller());
        offers.map_or_else(Vec::new, |offers|{
            offers.iter().filter(|offer|{ offer.request_status == "self_declined"}).cloned().collect()
        })
    })
}

#[query]
pub fn get_self_declined_requests_for_mentor() -> Vec<OfferToSendToMentor>{
    MENTOR_ALERTS.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&caller());
        offers.map_or_else(Vec::new, |offers|{
            offers.iter().filter(|offer|{ offer.request_status == "self_declined"}).cloned().collect()
        })
    })
}