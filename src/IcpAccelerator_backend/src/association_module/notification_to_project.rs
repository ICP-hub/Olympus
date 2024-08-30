use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use crate::{state_handler::*, UserInformation};
use crate::guard::*;

#[derive(Clone, CandidType, Deserialize, Serialize, Debug)]
pub struct OfferToProject {
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

#[derive(Clone, CandidType, Deserialize, Serialize, Debug)]
pub struct MentorInfo {
    mentor_id: Principal,
    mentor_name: String,
    mentor_description: String,
    mentor_image: Vec<u8>,
    user_data: UserInformation,
}

#[derive(Clone, CandidType, Deserialize, Serialize, Debug)]
pub struct OfferToSendToProject {
    offer_id: String, // Added field
    mentor_info: MentorInfo,
    offer: String,
    sent_at: u64,
    accepted_at: u64,
    declined_at: u64,
    self_declined_at: u64,
    request_status: String,
    sender_principal: Principal,
    response: String,
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
) -> String {
    ic_cdk::println!("MENTIR PRINCIPAL {}", mentor_id.to_string());
    let mentor = crate::mentor_module::get_mentor::get_mentor_info_using_principal(mentor_id).expect("mentor doesn't exist");

    let project = crate::project_module::get_project::get_project_using_id(project_id.clone()).expect("project not found");

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let offer_id = uid.clone().to_string();

    let mut offer_exists = false;  // Flag to check if an offer exists

    let _ = read_state(|state| {
        if let Some(offers) = state.project_alerts.get(&project_id) {
            if !offers.0.is_empty() {
                ic_cdk::println!("An offer already exists for project {}. No more offers can be sent.", project_id);
                offer_exists = true;  // Set flag if an offer exists
            }
        }
    });

    if offer_exists {
        return "An offer already exists. No more offers can be sent.".to_string();
    }

    let offer_to_project = OfferToProject {
        offer_id: offer_id.clone(),
        project_id: project_id.clone(),
        project_image: project.params.project_logo,
        project_name: project.params.project_name,
        offer_i_have_written: msg.clone(),
        time_of_request: time(),
        accepted_at: 0,
        declined_at: 0,
        self_declined_at: 0,
        request_status: "pending".to_string(),
        response: "".to_string(),
    };

    store_request_sent_by_mentor(offer_to_project, mentor_id);

    //let project_info = find_project_by_id(&project_id).expect("project does not exist");
    let mut cached_user_data = None;
    let user_data = crate::user_modules::get_user::get_user_info_with_cache(mentor_id, &mut cached_user_data);

    let mentor_image = user_data
        .profile_picture
        .clone()
        .unwrap_or_else(|| Vec::new());

    let mentor_info = MentorInfo {
        mentor_id: mentor_id,
        mentor_name: user_data.full_name.clone(),
        mentor_description: mentor.0.profile.category_of_mentoring_service,
        mentor_image,
        user_data,
    };

    let offer_to_send_to_project = OfferToSendToProject {
        offer_id: offer_id.clone(),
        mentor_info: mentor_info,
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

// #[update(guard = "combined_guard")]
// pub fn accept_offer_of_mentor(offer_id: String, response_message: String, project_id : String) -> String{
//     //let project_id = caller();

//     PROJECT_ALERTS.with(|state| {
//         //let state = state.borrow_mut().get(&mentor_id).cloned().unwrap_or_else(Vec::new);
//         if let Some(offers) = state.borrow_mut().get_mut(&project_id) {
//             if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
//                 offer.request_status = "accepted".to_string();
//                 offer.response = response_message.clone();
//                 offer.accepted_at = time();

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
//                             project_offer.accepted_at = time();

//                             MENTOR_REGISTRY.with(|storage|{
//                                 let mentor_profile = storage.borrow().get(&offer.sender_principal).expect("couldn't get mentor profile").clone();

//                                 APPLICATION_FORM.with(|projects| {

//                                     let mut project = projects.borrow_mut();

//                                    if let Some(project) =  project.get_mut(&offer.sender_principal){
//                                     if let Some(project) = project.iter_mut().find(|project|{project.uid == project_offer.project_id}){

//                                         if project.params.mentors_assigned.is_none() {
//                                             project.params.mentors_assigned = Some(Vec::new());
//                                         }

//                                         project.params.mentors_assigned.as_mut().unwrap().push(mentor_profile.profile.clone());

//                                         //get_assigned_projects_to_mentor
//                             PROJECTS_ASSOCIATED_WITH_MENTOR.with(|storage|{
//                                 let mut associate_project = storage.borrow_mut();
//                                 associate_project.entry(offer.sender_principal).or_insert_with(Vec::new).push(project.params.clone())
//                             })

//                                     }

//                                    }

//                                 })
//                             });

//                         }
//                     }
//                 });

//             }
//         }
//     });

//     format!("you have accepted the offer with offer id: {}", offer_id)
// }

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
                    if let Some(mut projects) = state.project_storage.get(&StoredPrincipal(caller_principal)) {
                        if let Some(proj_index) = projects.0.iter_mut().position(|p| p.uid == project_id) {
                            let project = &mut projects.0[proj_index];
                            if project.params.mentors_assigned.is_none() {
                                project.params.mentors_assigned = Some(Vec::new());
                            }

                            let mentors_assigned = project.params.mentors_assigned.as_mut().unwrap();
                            if !mentors_assigned.contains(&mentor_profile.0.profile) {
                                mentors_assigned.push(mentor_profile.0.profile.clone());
                                ic_cdk::println!("Mentor added to project's assigned mentor list");
                            }

                            state.project_storage.insert(StoredPrincipal(caller_principal), projects.clone());
                        } else {
                            // ic_cdk::println!("No project found with ID '{}' to update", project_id);
                        }
                    }
                } else {
                    // ic_cdk::println!("No mentor profile found for principal: {}", offer.sender_principal);
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
        }
    });

    if response == "Request got self declined." {
        mutate_state(|mentors| {
            let mentor_offers = &mut mentors.project_alerts;
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