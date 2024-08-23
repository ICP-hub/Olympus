use crate::project_module::post_project::find_project_owner_principal;
use crate::{state_handler::*, UserInformation};
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToMentor {
    offer_id: String, // Added field
    mentor_id: Principal,
    mentor_image: Option<Vec<u8>>,
    mentor_name: String,
    offer_i_have_written: String,
    time_of_request: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    response: String,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct ProjectInfoo {
    project_id: String,
    project_name: String,
    project_description: Option<String>,
    project_logo: Option<Vec<u8>>,
    user_data: UserInformation
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToSendToMentor {
    offer_id: String, // Added field
    project_info: ProjectInfoo,
    offer: String,
    sent_at: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    sender_principal: Principal,
    response: String,
}

pub fn store_request_sent_by_project(offer: OfferToMentor) {
    mutate_state(|store| {
        store
            .my_sent_notifications
            .get(&StoredPrincipal(caller()))
            .map_or_else(Vec::new, |offer_res| offer_res.0)
            .push(offer);
    });
}

#[query]
pub fn get_all_sent_request() -> Vec<OfferToMentor> {
    read_state(|state| {
        state
            .my_sent_notifications
            .get(&StoredPrincipal(caller()))
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_else(Vec::new)
    })
}

pub fn notify_mentor_with_offer(mentor_id: Principal, offer: OfferToSendToMentor) {
    mutate_state(|state| {
        if let Some(offers) = state.mentor_alerts.get(&StoredPrincipal(mentor_id)) {
            let mut new_offers = offers.0.clone();
            new_offers.push(offer);
            state.mentor_alerts.insert(StoredPrincipal(mentor_id), Candid(new_offers));
        } else {
            state.mentor_alerts.insert(StoredPrincipal(mentor_id), Candid(vec![offer]));
        }
        ic_cdk::println!("Offer added for mentor {}: current count {}", mentor_id, state.mentor_alerts.get(&StoredPrincipal(mentor_id)).map_or(0, |o| o.0.len()));
    });
}

#[query]
pub fn get_all_mentor_notification(id: Principal) -> Vec<OfferToSendToMentor> {
    read_state(|state| {
        state.mentor_alerts.get(&StoredPrincipal(id))
            .map(|candid_res| candid_res.0.clone())
            .unwrap_or_else(Vec::new)
    })
}

#[update]
pub async fn send_offer_to_mentor_from_project(mentor_id: Principal, msg: String, project_id: String) -> String {
    //let _mentor = get_mentor_using_principal(mentor_id).expect("mentor doesn't exist");

    let mut offer_exists = false;  // Flag to check if an offer exists

    let _ = read_state(|state| {
        if let Some(offers) = state.mentor_alerts.get(&StoredPrincipal(mentor_id)) {
            if !offers.0.is_empty() {
                offer_exists = true;  // Set flag if an offer exists
            }
        }
    });

    if offer_exists {
        return "An offer already exists. No more offers can be sent.".to_string();
    }

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let mut cached_user_data = None;

    let user_data = crate::user_modules::get_user::get_user_info_with_cache(mentor_id, &mut cached_user_data);

    let offer_to_mentor = OfferToMentor {
        offer_id: offer_id.clone(),
        mentor_id: mentor_id,
        mentor_image: user_data.profile_picture,
        mentor_name: user_data.full_name,
        offer_i_have_written: msg.clone(),
        time_of_request: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
    };

    store_request_sent_by_project(offer_to_mentor);

    let project_info = crate::project_module::get_project::get_project_using_id(project_id.clone()).expect("project does not exist");

    let project_principal = find_project_owner_principal(&project_id.clone())
    .expect("Project principal not found");

    let mut cached_user_data = None;
    let user_data_project = crate::user_modules::get_user::get_user_info_with_cache(project_principal, &mut cached_user_data);

    let project_info = ProjectInfoo {
        project_id,
        project_name: project_info.params.project_name,
        project_description: project_info.params.project_description,
        project_logo: project_info.params.project_logo,
        user_data: user_data_project
    };

    let offer_to_send_to_mentor = OfferToSendToMentor {
        offer_id: offer_id.clone(),
        project_info: project_info,
        offer: msg.clone(),
        sent_at: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        sender_principal: caller(),
        response: "".to_string(),
    };

    notify_mentor_with_offer(mentor_id, offer_to_send_to_mentor);
    format!("offer sent sucessfully to {}", mentor_id)
}

// #[update]
// pub fn accept_offer_of_project(offer_id: String, response_message: String) -> String{
//     let mentor_id = caller();

//     MENTOR_ALERTS.with(|state: &RefCell<HashMap<Principal, Vec<OfferToSendToMentor>>>| {
//         //let state = state.borrow_mut().get(&mentor_id).cloned().unwrap_or_else(Vec::new);
//         if let Some(offers) = state.borrow_mut().get_mut(&mentor_id) {
//             if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
//                 offer.request_status = "accepted".to_string();
//                 offer.response = response_message.clone();
//                 offer.accepted_at = time();

//                 MENTOR_REGISTRY.with(|storage|{
//                     let mentor_profile = storage.borrow().get(&mentor_id).expect("couldn't get mentor profile").clone();

//                     APPLICATION_FORM.with(|projects| {

//                     let mut project = projects.borrow_mut();

//                        if let Some(project) =  project.get_mut(&offer.sender_principal){
//                         if let Some(project) = project.iter_mut().find(|project|{project.uid == offer.project_info.project_id}){

//                             if project.params.mentors_assigned.is_none() {
//                                 project.params.mentors_assigned = Some(Vec::new());
//                             }
//                             project.params.mentors_assigned.as_mut().unwrap().push(mentor_profile.profile.clone());

//                             //get_assigned_projects_to_mentor
//                             PROJECTS_ASSOCIATED_WITH_MENTOR.with(|storage|{
//                                 let mut associate_project = storage.borrow_mut();
//                                 associate_project.entry(mentor_id).or_insert_with(Vec::new).push(project.params.clone())
//                             })
//                         }
//                        }

//                     })
//                 });

//                 MY_SENT_NOTIFICATIONS.with(|sent_state| {
//                     if let Some(sent_status_vector) =
//                         sent_state.borrow_mut().get_mut(&offer.sender_principal)
//                     {
//                         if let Some(project_offer) = sent_status_vector
//                             .iter_mut()
//                             .find(|offer| offer.offer_id == offer_id)
//                         {
//                             project_offer.request_status = "accepted".to_string();
//                             project_offer.response = response_message.clone();
//                             project_offer.accepted_at = time()
//                         }
//                     }
//                 });
//             }
//         }
//     });

//     format!("you have accepted the offer with offer id: {}", offer_id)
// }

#[update]
pub fn accept_offer_from_project_to_mentor(offer_id: String, response_message: String) -> String {
    let mentor_id = ic_cdk::api::caller();

    let mut already_accepted = false;

    // Check if the offer has already been accepted
    read_state(|state| {
        if let Some(offers) = state.mentor_alerts.get(&StoredPrincipal(mentor_id)) {
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
        if let Some(mut offers) = state.mentor_alerts.get(&StoredPrincipal(mentor_id)) {
            let offer_index = offers.0.iter().position(|o| o.offer_id == offer_id);
            if let Some(index) = offer_index {

                let sender_principal = offers.0[index].sender_principal;
                let project_id = offers.0[index].project_info.project_id.clone();

                if offers.0[index].request_status != "accepted" {
                    offers.0[index].request_status = "accepted".to_string();
                    offers.0[index].response = response_message.clone();
                    offers.0[index].accepted_at = ic_cdk::api::time();

                    state.mentor_alerts.insert(StoredPrincipal(mentor_id), offers.clone());

                    if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(sender_principal)) {
                        if let Some(proj_index) = projects.0.iter_mut().position(|p| p.uid == project_id) {
                            let project = &mut projects.0[proj_index];
                            if project.params.mentors_assigned.is_none() {
                                project.params.mentors_assigned = Some(Vec::new());
                            }

                            if let Some(mentor_profile) = state.mentor_storage.get(&StoredPrincipal(mentor_id)) {
                                let mentors_assigned = project.params.mentors_assigned.as_mut().unwrap();
                                if !mentors_assigned.contains(&mentor_profile.0.profile) {
                                    mentors_assigned.push(mentor_profile.0.profile.clone());
                                }
                                ic_cdk::println!("Menrtor Assigned now is {:?}", mentors_assigned);
                            }

                            // Associated projects update
                            let mut associated_projects = state.projects_associated_with_mentor
                                .get(&StoredPrincipal(mentor_id))
                                .map(|candid_res| candid_res.0.clone())
                                .unwrap_or_else(Vec::new);
                            if !associated_projects.contains(project) {
                                associated_projects.push(project.clone());
                                state.projects_associated_with_mentor.insert(StoredPrincipal(mentor_id), Candid(associated_projects));
                            }
                        }

                        // Reinsert the modified projects back into state after all changes are done
                        state.project_storage.insert(StoredPrincipal(sender_principal), projects.clone());
                    }

                    if let Some(mut sent_status_vector) = state.my_sent_notifications.get(&StoredPrincipal(sender_principal)) {
                        if let Some(notif_index) = sent_status_vector.0.iter_mut().position(|o| o.offer_id == offer_id) {
                            sent_status_vector.0[notif_index].request_status = "accepted".to_string();
                            sent_status_vector.0[notif_index].response = response_message.clone();
                            sent_status_vector.0[notif_index].accepted_at = ic_cdk::api::time();
                            // Insert notifications back after modifications
                            state.my_sent_notifications.insert(StoredPrincipal(sender_principal), sent_status_vector.clone());
                        }
                    }
                }
            }
            // Insert the offers back after all modifications are completed within the block
            state.mentor_alerts.insert(StoredPrincipal(mentor_id), offers.clone());
        }
    });

    format!("You have accepted the offer with offer id: {}", offer_id)
}


#[update]
pub fn decline_offer_from_project_to_mentor(offer_id: String, response_message: String) -> String {
    let mentor_id = caller();

    mutate_state(|state| {
        // Update offers related to the mentor
        if let Some(mut offers) = state.mentor_alerts.get(&StoredPrincipal(mentor_id)) {
            if let Some(offer) = offers.0.iter_mut().find(|o| o.offer_id == offer_id) {
                offer.request_status = "declined".to_string();
                offer.response = response_message.clone();
                offer.declined_at = time();

                // Save the changes immediately back to the state
                state.mentor_alerts.insert(StoredPrincipal(mentor_id), offers.clone());
            }
        }

        // Update sent notifications
        for (_, mut sent_status_vector) in state.my_sent_notifications.iter() {
            if let Some(project_offer) = sent_status_vector
                .0
                .iter_mut()
                .find(|offer| offer.offer_id == offer_id)
            {
                project_offer.request_status = "declined".to_string();
                project_offer.response = response_message.clone();
                project_offer.declined_at = time();

                // Since `sent_status_vector` is already a mutable reference from iter_mut(), we do not need to re-insert it
            }
        }
    });

    format!("You have declined the offer with offer id: {}", offer_id)
}


#[query]
pub fn get_pending_request_from_project_to_mentor_via_project(mentor_id: Principal) -> Vec<OfferToSendToMentor> {
    read_state(|pending_alerts| {
        pending_alerts
            .mentor_alerts
            .get(&StoredPrincipal(mentor_id))
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
pub fn get_pending_request_from_mentor_to_project_via_project() -> Vec<OfferToMentor> {
    read_state(|pending_alerts| {
        pending_alerts
            .my_sent_notifications
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
pub fn get_approved_request_from_mentor_to_project_via_project(mentor_id: Principal) -> Vec<OfferToSendToMentor> {
    read_state(|pending_alerts| {
        pending_alerts
            .mentor_alerts
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

#[query]
pub fn get_approved_request_from_project_to_mentor_via_project() -> Vec<OfferToMentor> {
    read_state(|pending_alerts| {
        pending_alerts
            .my_sent_notifications
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
pub fn get_declined_request_from_mentor_to_project_via_project(mentor_id: Principal) -> Vec<OfferToSendToMentor> {
    read_state(|pending_alerts| {
        pending_alerts
            .mentor_alerts
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

#[query]
pub fn get_declined_request_from_project_to_mentor_via_project() -> Vec<OfferToMentor> {
    read_state(|pending_alerts| {
        pending_alerts
            .my_sent_notifications
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
pub fn self_decline_request_from_project_to_mentor(offer_id: String) -> String {
    let mut response: String = String::new();

    mutate_state(|sent_ones| {
        let my_offers = &mut sent_ones.my_sent_notifications;
        let caller_offers = my_offers.get(&StoredPrincipal(caller()));

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
            let mentor_offers = &mut mentors.mentor_alerts;
            for (_, mut offers) in mentor_offers.iter() {
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
pub fn get_self_declined_requests_for_project() -> Vec<OfferToMentor> {
    read_state(|offers| {
        let offers = &offers.my_sent_notifications;
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
pub fn get_self_declined_requests_for_mentor() -> Vec<OfferToSendToMentor> {
    read_state(|offers| {
        let offers = &offers.mentor_alerts;
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