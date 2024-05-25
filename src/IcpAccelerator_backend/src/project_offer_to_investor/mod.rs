use crate::mentor::MentorProfile;
use crate::state_handler::*;
use crate::vc_registration::VentureCapitalist;
use crate::{
    find_project_by_id, get_mentor_by_principal, mentor, mutate_state, ApplicationDetails,
    APPLICATION_FORM, MENTOR_REGISTRY, VENTURECAPITALIST_STORAGE,
};
use crate::{
    get_vc_info_by_principal, MentorRegistry, VentureCapitalistInternal, VentureCapitalistStorage,
};
use candid::{CandidType, Principal};
use ic_cdk::api::call;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefMut;
use std::io::Read;
use std::{cell::RefCell, collections::HashMap, fmt::format, ptr::null};

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
pub struct ProjectInf {
    project_id: String,
    project_name: String,
    project_description: Option<String>,
    project_logo: Vec<u8>,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToSendToInvestor {
    offer_id: String, // Added field
    project_info: ProjectInf,
    offer: String,
    sent_at: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    sender_principal: Principal,
    response: String,
}

pub fn store_request_sent_by_project_to_investor(project_id: String, offer: OfferToInvestor) {
    mutate_state(|store| {
        store
            .offers_offered_by_me
            .get(&project_id)
            .map_or_else(Vec::new, |candid_res| candid_res.0)
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
    mutate_state(|state| {
        state
            .investor_alerts
            .get(&StoredPrincipal(mentor_id))
            .map_or_else(Vec::new, |candid_res| candid_res.0)
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

    let project_info = ProjectInf {
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

    let mut already_accepted = false;

    read_state(|state| {
        if let Some(offers) = state.investor_alerts.get(&StoredPrincipal(investor_id)) {
            if let Some(offer) = offers
                .0
                .iter()
                .find(|o| o.offer_id == offer_id && o.request_status == "accepted")
            {
                already_accepted = true;
                return;
            }
        }
    });

    if already_accepted {
        return "Offer has already been accepted.".to_string();
    }

    mutate_state(|state| {
        //let state = state.borrow_mut().get(&mentor_id).cloned().unwrap_or_else(Vec::new);
        if let Some(mut offers) = state.investor_alerts.get(&StoredPrincipal(investor_id)) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();
                offer.accepted_at = time();

                VENTURECAPITALIST_STORAGE.with(|storage: &RefCell<VentureCapitalistStorage>| {
                    let investor_profile = storage
                        .borrow()
                        .get(&investor_id)
                        .expect("couldn't get investor profile")
                        .clone();

                    APPLICATION_FORM.with(|projects| {
                        let mut project: RefMut<ApplicationDetails> = projects.borrow_mut();

                        if let Some(project) = project.get_mut(&offer.sender_principal) {
                            if let Some(project) = project
                                .iter_mut()
                                .find(|project| project.uid == offer.project_info.project_id)
                            {
                                // if project.params.vc_assigned.is_none() {
                                //     project.params.vc_assigned = Some(Vec::new());
                                // }

                                // project
                                //     .params
                                //     .vc_assigned
                                //     .as_mut()
                                //     .unwrap()
                                //     .push(investor_profile.params.clone());

                                if project.params.vc_assigned.is_none() {
                                    project.params.vc_assigned = Some(Vec::new());
                                }

                                let vc_assigned = project.params.vc_assigned.as_mut().unwrap();

                                if !vc_assigned.contains(&investor_profile.params) {
                                    vc_assigned.push(investor_profile.params.clone());
                                }

                                mutate_state(|storage| {
                                    let associate_project = &storage.projects_associated_with_vc;

                                    // let projects = associate_project
                                    //     .entry(offer.sender_principal)
                                    //     .or_insert_with(Vec::new);

                                    let mut projects = associate_project
                                        .get(&crate::StoredPrincipal(investor_id))
                                        .map(|candid_res| candid_res.0)
                                        .unwrap_or_else(|| Vec::new());

                                    if !projects.contains(&project) {
                                        projects.push(project.clone());
                                    }
                                })
                            }
                        }
                    })
                });

                mutate_state(|sent_state| {
                    if let Some(mut sent_status_vector) = sent_state
                        .offers_offered_by_me
                        .get(&offer.project_info.project_id)
                    {
                        if let Some(project_offer) = sent_status_vector
                            .0
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
pub fn decline_offer_of_project_by_investor(offer_id: String, response_message: String) -> String {
    let investor_id = caller();

    mutate_state(|state| {
        if let Some(mut offers) = state.investor_alerts.get(&StoredPrincipal(investor_id)) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = time()
            }
        }
    });

    mutate_state(|sent_state| {
        for (key, mut sent_status_vector) in sent_state.offers_offered_by_me.iter() {
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
pub fn get_pending_request_sent_by_investor() -> Vec<OfferToSendToInvestor> {
    let investor_id = caller();
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
#[query]
pub fn get_pending_offers_received_from_investor(project_id: String) -> Vec<OfferToInvestor> {
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

#[query]
pub fn get_accepted_request_for_investor() -> Vec<OfferToSendToInvestor> {
    let investor_id = caller();

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

#[query]
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

#[query]
pub fn get_declined_request_for_investor() -> Vec<OfferToSendToInvestor> {
    let investor_id = caller();
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

#[query]
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

#[update]
pub fn self_decline_request_for_project(offer_id: String, project_id: String) -> String {
    let mut response: String = String::new();

    mutate_state(|sent_ones| {
        let mut my_offers = &mut sent_ones.offers_offered_by_me;
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
        }
    });

    if response == "Request got self declined." {
        mutate_state(|mentors| {
            let mut mentor_offers = &mut mentors.investor_alerts;
            for (key, mut offers) in mentor_offers.iter() {
                if let Some(offer) = offers.0.iter_mut().find(|off| off.offer_id == offer_id) {
                    offer.request_status = "self_declined".to_string();
                    offer.self_declined_at = time();
                }
            }
        });
    }

    response
}

#[query]
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

#[query]
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
