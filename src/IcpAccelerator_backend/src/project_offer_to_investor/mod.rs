use crate::get_vc_info_by_principal;
use crate::mentor::MentorProfile;
use crate::{
    find_project_by_id, get_mentor_by_principal, mentor, APPLICATION_FORM, MENTOR_REGISTRY,
    VENTURECAPITALIST_STORAGE,
};
use candid::{CandidType, Principal};
use ic_cdk::api::call;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::io::Read;
use std::{cell::RefCell, collections::HashMap, fmt::format, ptr::null};
use ic_cdk::api::stable::{StableReader, StableWriter};
use crate::PROJECTS_ASSOCIATED_WITH_INVESTOR;

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToInvestor {
    offer_id: String, // Added field
    investor_id: Principal,
    investor_image: Option<Vec<u8>>,
    investor_name: String,
    offer_i_have_written: String,
    time_of_request: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    response: String,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct ProjectInfo {
    project_id: String,
    project_name: String,
    project_description: String,
    project_logo: Vec<u8>,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToSendToInvestor {
    offer_id: String, // Added field
    project_info: ProjectInfo,
    offer: String,
    sent_at: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    sender_principal: Principal,
    response: String,
}

thread_local! {
    pub static OFFERS_OFFERED_BY_ME : RefCell<HashMap<String, Vec<OfferToInvestor>>> = RefCell::new(HashMap::new());
    pub static INVESTOR_ALERTS : RefCell<HashMap<Principal, Vec<OfferToSendToInvestor>>> = RefCell::new(HashMap::new());
}

pub fn pre_upgrade() {
    // Serialize and write data to stable storage
    OFFERS_OFFERED_BY_ME.with(|registry| {
        let serialized = bincode::serialize(&*registry.borrow()).expect("Serialization failed");

        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
    INVESTOR_ALERTS.with(|registry| {
        let serialized = bincode::serialize(&*registry.borrow()).expect("Serialization failed");

        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
}

pub fn post_upgrade_vc() {
    let mut reader = StableReader::default();
    let mut data = Vec::new();
    reader
        .read_to_end(&mut data)
        .expect("Failed to read from stable storage");
    let offertoproject: HashMap<String, Vec<OfferToInvestor>> =
        bincode::deserialize(&data).expect("Deserialization failed of notification");
    OFFERS_OFFERED_BY_ME.with(|notifications_ref| {
        *notifications_ref.borrow_mut() = offertoproject;
    });
    let offers: HashMap<Principal, Vec<OfferToSendToInvestor>> =
        bincode::deserialize(&data).expect("Deserialization failed of notification");
    INVESTOR_ALERTS.with(|notifications_ref| {
        *notifications_ref.borrow_mut() = offers;
    });
}

pub fn store_request_sent_by_project_to_investor(project_id : String, offer: OfferToInvestor) {
    OFFERS_OFFERED_BY_ME.with(|store| {
        store
            .borrow_mut()
            .entry(project_id)
            .or_insert_with(Vec::new)
            .push(offer);
    });
}

// #[query]
// pub fn get_all_sent_request() -> Vec<OfferToInvestor> {
//     OFFERS_OFFERED_BY_ME.with(|state| {
//         state
//             .borrow()
//             .get(&caller())
//             .cloned()
//             .unwrap_or_else(Vec::new)
//     })
// }

pub fn notify_investor_with_offer(mentor_id: Principal, offer: OfferToSendToInvestor) {
    INVESTOR_ALERTS.with(|state| {
        state
            .borrow_mut()
            .entry(mentor_id)
            .or_insert_with(Vec::new)
            .push(offer);
    })
}

// #[query]
// pub fn get_all_investor_notification(id: Principal) -> Vec<OfferToSendToInvestor> {
//     INVESTOR_ALERTS.with(|state| state.borrow().get(&id).cloned().unwrap_or_else(Vec::new))
// }

#[update]
pub async fn send_offer_to_investor(
    investor_id: Principal,
    msg: String,
    project_id: String,
) -> String {
    //let mentor = get_mentor_by_principal(mentor_id).expect("mentor doesn't exist");
    let venture_capitalist = get_vc_info_by_principal(investor_id)
        .get(&investor_id)
        .expect("investor doesn't exist")
        .clone();

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let offer_to_investor = OfferToInvestor {
        offer_id: offer_id.clone(),
        investor_id,
        investor_image: venture_capitalist.profile.params.user_data.profile_picture,
        investor_name: venture_capitalist.profile.params.user_data.full_name,
        offer_i_have_written: msg.clone(),
        time_of_request: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
    };

    store_request_sent_by_project_to_investor(project_id.clone(), offer_to_investor);

    let project_info = find_project_by_id(&project_id)
        .expect("project does not exist")
        .clone();

    let project_info = ProjectInfo {
        project_id,
        project_name: project_info.params.project_name,
        project_description: project_info.params.project_description,
        project_logo: project_info.params.project_logo,
    };

    let offer_to_send_to_investor = OfferToSendToInvestor {
        offer_id: offer_id.clone(),
        project_info,
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        sender_principal: caller(),
        response: "".to_string(),
    };

    notify_investor_with_offer(investor_id, offer_to_send_to_investor);
    format!("offer sent sucessfully to {}", investor_id)
}

#[update]
pub fn accept_offer_of_project_by_investor(offer_id: String, response_message: String) -> String {
    let investor_id = caller();

    INVESTOR_ALERTS.with(
        |state: &RefCell<HashMap<Principal, Vec<OfferToSendToInvestor>>>| {
            //let state = state.borrow_mut().get(&mentor_id).cloned().unwrap_or_else(Vec::new);
            if let Some(offers) = state.borrow_mut().get_mut(&investor_id) {
                if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                    offer.request_status = "accepted".to_string();
                    offer.response = response_message.clone();
                    offer.accepted_at = time();

                    VENTURECAPITALIST_STORAGE.with(|storage| {
                        let investor_profile = storage
                            .borrow()
                            .get(&investor_id)
                            .expect("couldn't get investor profile")
                            .clone();

                        APPLICATION_FORM.with(|projects| {
                            let mut project = projects.borrow_mut();

                            if let Some(project) = project.get_mut(&offer.sender_principal) {
                                if let Some(project) = project
                                    .iter_mut()
                                    .find(|project| project.uid == offer.project_info.project_id)
                                {
        

                                    if project.params.vc_assigned.is_none() {
                                        project.params.vc_assigned = Some(Vec::new());
                                    }

                                    project
                                        .params
                                        .vc_assigned
                                        .as_mut()
                                        .unwrap()
                                        .push(investor_profile.params.clone());

                                        PROJECTS_ASSOCIATED_WITH_INVESTOR.with(|storage|{
                                            let mut associate_project = storage.borrow_mut();
                                            associate_project.entry(offer.sender_principal).or_insert_with(Vec::new).push(project.params.clone())
                                        })
                                }
                            }
                        })
                    });

                    OFFERS_OFFERED_BY_ME.with(|sent_state| {
                        if let Some(sent_status_vector) =
                            sent_state.borrow_mut().get_mut(&offer.project_info.project_id)
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
        },
    );

    format!("you have accepted the offer with offer id: {}", offer_id)
}

#[update]
pub fn decline_offer_of_project_by_investor(offer_id: String, response_message: String) -> String {
    let investor_id = caller();

    INVESTOR_ALERTS.with(|state| {
        if let Some(offers) = state.borrow_mut().get_mut(&investor_id) {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = time()
            }
        }
    });

    OFFERS_OFFERED_BY_ME.with(|sent_state| {
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
pub fn get_pending_request_sent_by_investor() -> Vec<OfferToSendToInvestor> {
    let investor_id = caller();
    INVESTOR_ALERTS.with(|pending_alerts| {
        pending_alerts
            .borrow()
            .get(&investor_id)
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
pub fn get_pending_offers_received_from_investor(project_id : String) -> Vec<OfferToInvestor> {
    OFFERS_OFFERED_BY_ME.with(|sent_notifications| {
        sent_notifications
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

#[query]
pub fn get_accepted_request_for_investor() -> Vec<OfferToSendToInvestor> {
    let investor_id = caller();
    INVESTOR_ALERTS.with(|alerts| {
        alerts
            .borrow()
            .get(&investor_id)
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
pub fn get_accepted_request_of_project_by_investor(project_id : String) -> Vec<OfferToInvestor> {
    OFFERS_OFFERED_BY_ME.with(|notifications| {
        notifications
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
pub fn get_declined_request_for_investor() -> Vec<OfferToSendToInvestor> {
    INVESTOR_ALERTS.with(|alerts| {
        alerts
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

#[query]
pub fn get_declined_request_of_project_by_investor(project_id : String) -> Vec<OfferToInvestor> {
    OFFERS_OFFERED_BY_ME.with(|notifications| {
        notifications
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

#[update]
pub fn self_decline_request_for_project(offer_id: String, project_id : String) -> String {
    let mut response: String = String::new();

    OFFERS_OFFERED_BY_ME.with(|sent_ones| {
        let mut my_offers = sent_ones.borrow_mut();
        let caller_offers = my_offers.get_mut(&project_id);

        if let Some(offers) = caller_offers {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
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
        }
    });

    if response == "Request got self declined." {
        INVESTOR_ALERTS.with(|mentors| {
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
pub fn get_self_declined_requests_of_project(project_id : String) -> Vec<OfferToInvestor> {
    OFFERS_OFFERED_BY_ME.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&project_id);
        offers.map_or_else(Vec::new, |offers| {
            offers
                .iter()
                .filter(|offer| offer.request_status == "self_declined")
                .cloned()
                .collect()
        })
    })
}

#[query]
pub fn get_self_declined_requests_for_investor() -> Vec<OfferToSendToInvestor> {
    INVESTOR_ALERTS.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&caller());
        offers.map_or_else(Vec::new, |offers| {
            offers
                .iter()
                .filter(|offer| offer.request_status == "self_declined")
                .cloned()
                .collect()
        })
    })
}
