use crate::get_mentor_by_principal;
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::Deserialize;
use sha2::{Digest, Sha256};
use std::{cell::RefCell, collections::HashMap, fmt::format, ptr::null};

#[derive(Clone, CandidType, Deserialize)]
pub struct OfferToProject {
    offer_id: String, // Added field
    project_id: String,
    project_image: Option<Vec<u8>>,
    project_name: String,
    offer_i_have_written: String,
    time_of_request: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at : u64,
    request_status: String,
    response: String,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct InvestorInfo {
    investor_id: Principal,
    investor_name: String,
    investor_description: String,
    investor_image: Vec<u8>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct OfferToSendToProject {
    offer_id: String, // Added field
    investor_info: InvestorInfo,
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
    pub static OFFERS_SENT_BY_INVESTOR : RefCell<HashMap<Principal, Vec<OfferToProject>>> = RefCell::new(HashMap::new());
    pub static PROJECT_ALERTS : RefCell<HashMap<String, Vec<OfferToSendToProject>>> = RefCell::new(HashMap::new());
}

pub fn store_request_sent_by_capitalist(offer: OfferToProject) {
    OFFERS_SENT_BY_INVESTOR.with(|store| {
        store
            .borrow_mut()
            .entry(caller())
            .or_insert_with(Vec::new)
            .push(offer);
    });
}

#[query]
pub fn get_all_sent_request_from_investor_to_project() -> Vec<OfferToProject> {
    OFFERS_SENT_BY_INVESTOR.with(|state| {
        state
            .borrow()
            .get(&caller())
            .cloned()
            .unwrap_or_else(Vec::new)
    })
}

pub fn notify_project_with_offer(project_id: String, offer: OfferToSendToProject) {
    PROJECT_ALERTS.with(|state| {
        state
            .borrow_mut()
            .entry(project_id)
            .or_insert_with(Vec::new)
            .push(offer);
    })
}

#[query]
pub fn get_all_project_notification_sent_by_investor(id: String) -> Vec<OfferToSendToProject> {
    PROJECT_ALERTS.with(|state| state.borrow().get(&id).cloned().unwrap_or_else(Vec::new))
}




#[update]
pub async fn send_offer_to_project_by_investor(project_id: String, msg: String) -> String{
    let investor_id = caller();

    let investor_profile = crate::get_vc_info_by_principal(investor_id).get(&investor_id).expect("investor does not exist").clone();

    let project = crate::get_project_using_id(project_id.clone()).expect("project not found");

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let offer_to_project = OfferToProject {
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

    let investor_info =  InvestorInfo{
        investor_id: investor_id,
        investor_name: investor_profile.profile.params.user_data.full_name.clone(),
        investor_description: investor_profile.profile.params.category_of_investment.clone(),
        investor_image: investor_profile.profile.params.user_data.profile_picture.clone().unwrap_or_else(Vec::new)
    }; 

    let offer_to_send_to_project = OfferToSendToProject {
        offer_id: offer_id.clone(),
        investor_info: investor_info,
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at : 0,
        request_status: "pending".to_string(),
        sender_principal: caller(),
        response: "".to_string(),
    };

    notify_project_with_offer(project_id.clone(), offer_to_send_to_project);
    format!("offer sent sucessfully to {}", project_id)
}


#[update]
pub fn accept_offer_of_investor(offer_id: String, response_message: String, project_id : String) -> String{
    //let project_id = caller();

    PROJECT_ALERTS.with(|state| {
        //let state = state.borrow_mut().get(&mentor_id).cloned().unwrap_or_else(Vec::new);
        if let Some(offers) = state.borrow_mut().get_mut(&project_id) {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();
                offer.accepted_at = time();

                OFFERS_SENT_BY_INVESTOR.with(|sent_state| {
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
pub fn decline_offer_of_investor(offer_id: String, response_message: String, project_id: String) -> String{

    PROJECT_ALERTS.with(|state| {
        if let Some(offers) = state.borrow_mut().get_mut(&project_id) {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = time()
            }
        }
    });

    OFFERS_SENT_BY_INVESTOR.with(|sent_state| {
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
pub fn get_all_offers_which_are_pending_for_project_from_investor(project_id: String) -> Vec<OfferToSendToProject> {
    PROJECT_ALERTS.with(|pending_alerts| {
        pending_alerts
            .borrow()
            .get(&project_id)
            .map_or_else(Vec::new, |offers| {
                offers
                    .iter()
                    .filter(|offer| offer.request_status == "pending")
                    .cloned()
                    .collect()
            })
    })
}

//mentor will call
#[query]
pub fn get_all_offers_which_are_pending_for_investor() -> Vec<OfferToProject> {
    OFFERS_SENT_BY_INVESTOR.with(|sent_notifications| {
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
pub fn get_all_requests_which_got_accepted_by_project_of_investor(project_id: String) -> Vec<OfferToSendToProject> {
    PROJECT_ALERTS.with(|alerts| {
        alerts
            .borrow()
            .get(&project_id)
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
pub fn get_all_requests_which_got_accepted_for_investor() -> Vec<OfferToProject> {
    OFFERS_SENT_BY_INVESTOR.with(|notifications| {
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
pub fn get_all_requests_which_got_declined_by_project_of_investor(project_id: String) -> Vec<OfferToSendToProject> {
    PROJECT_ALERTS.with(|alerts| {
        alerts
            .borrow()
            .get(&project_id)
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
pub fn get_all_requests_which_got_declined_for_investor() -> Vec<OfferToProject> {
    OFFERS_SENT_BY_INVESTOR.with(|notifications| {
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
pub fn self_decline_request_for_investor(offer_id: String) -> String {
    let mut response = String::new();

    OFFERS_SENT_BY_INVESTOR.with(|sent_ones| {
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
        PROJECT_ALERTS.with(|mentors| {
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
pub fn get_all_requests_which_got_self_declined_for_investor() -> Vec<OfferToProject>{
    OFFERS_SENT_BY_INVESTOR.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&caller());
        offers.map_or_else(Vec::new, |offers|{
            offers.iter().filter(|offer|{ offer.request_status == "self_declined"}).cloned().collect()
        })
    })
}

#[query]
pub fn get_all_requests_which_got_self_declined_by_investor(project_id: String) -> Vec<OfferToSendToProject>{
    PROJECT_ALERTS.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&project_id);
        offers.map_or_else(Vec::new, |offers|{
            offers.iter().filter(|offer|{ offer.request_status == "self_declined"}).cloned().collect()
        })
    })
}