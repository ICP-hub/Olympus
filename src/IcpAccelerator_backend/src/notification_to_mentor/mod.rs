use crate::{find_project_by_id, get_mentor_by_principal, mentor};
use candid::{CandidType, Principal};
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
pub async fn send_offer_to_mentor(mentor_id: Principal, msg: String, project_id: String) {
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
        request_status: "pending".to_string(),
        sender_principal: caller(),
        response: "".to_string(),
    };

    notify_mentor_with_offer(mentor_id, offer_to_send_to_mentor);
}

pub fn accept_offer(offer_id: String, response_message: String) {
    let mentor_id = caller();

    MENTOR_ALERTS.with(|state| {
        //let state = state.borrow_mut().get(&mentor_id).cloned().unwrap_or_else(Vec::new);
        if let Some(offers) = state.borrow_mut().get_mut(&mentor_id) {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();

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
                        }
                    }
                });
            }
        }
    });
}

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
        sent_notifications.borrow()
            .get(&caller())
            .map_or_else(Vec::new, |offers| {
                offers.iter()
                    .filter(|offer| offer.request_status == "pending")
                    .cloned()
                    .collect()
            })
    })
}

