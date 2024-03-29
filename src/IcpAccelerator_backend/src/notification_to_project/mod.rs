use crate::{get_mentor_by_principal, MentorRegistry};
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{api::time, caller};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::io::Read;
use std::{cell::RefCell, collections::HashMap, fmt::format, ptr::null};
use ic_cdk::api::stable::{StableReader, StableWriter};
use crate::MENTOR_REGISTRY;
use crate::APPLICATION_FORM;
use crate::PROJECTS_ASSOCIATED_WITH_MENTOR;
use crate::ApplicationDetails;
use std::cell::RefMut;
#[derive(Clone, CandidType, Deserialize, Serialize)]
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

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct MentorInfo {
    mentor_id: Principal,
    mentor_name: String,
    mentor_description: String,
    mentor_image: Vec<u8>,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct OfferToSendToProject {
    offer_id: String, // Added field
    mentor_info: MentorInfo,
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
    pub static MY_SENT_NOTIFICATIONS : RefCell<HashMap<Principal, Vec<OfferToProject>>> = RefCell::new(HashMap::new());
    pub static PROJECT_ALERTS : RefCell<HashMap<String, Vec<OfferToSendToProject>>> = RefCell::new(HashMap::new());
}

pub fn pre_upgrade() {
    // Serialize and write data to stable storage
    MY_SENT_NOTIFICATIONS.with(|registry| {
        let serialized = bincode::serialize(&*registry.borrow()).expect("Serialization failed");

        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
    PROJECT_ALERTS.with(|registry| {
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
    let offertoproject: HashMap<Principal, Vec<OfferToProject>> =
        bincode::deserialize(&data).expect("Deserialization failed of notification");
    MY_SENT_NOTIFICATIONS.with(|notifications_ref| {
        *notifications_ref.borrow_mut() = offertoproject;
    });
    let offers: HashMap<String, Vec<OfferToSendToProject>> =
        bincode::deserialize(&data).expect("Deserialization failed of notification");
    PROJECT_ALERTS.with(|notifications_ref| {
        *notifications_ref.borrow_mut() = offers;
    });
}

pub fn store_request_sent_by_mentor(offer: OfferToProject) {
    MY_SENT_NOTIFICATIONS.with(|store| {
        store
            .borrow_mut()
            .entry(caller())
            .or_insert_with(Vec::new)
            .push(offer);
    });
}

#[query]
pub fn get_all_sent_request_for_mentor() -> Vec<OfferToProject> {
    MY_SENT_NOTIFICATIONS.with(|state| {
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
pub fn get_all_project_notification(id: String) -> Vec<OfferToSendToProject> {
    PROJECT_ALERTS.with(|state| state.borrow().get(&id).cloned().unwrap_or_else(Vec::new))
}

#[update]
pub async fn send_offer_to_project(project_id: String, msg: String, mentor_id: Principal) -> String{
    let mentor = get_mentor_by_principal(mentor_id).expect("mentor doesn't exist");

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

    store_request_sent_by_mentor(offer_to_project);

    //let project_info = find_project_by_id(&project_id).expect("project does not exist");

    let mentor_info =  MentorInfo{
        mentor_id: mentor_id,
        mentor_name: mentor.user_data.full_name,
        mentor_description: mentor.area_of_expertise,
        mentor_image: mentor.user_data.profile_picture.unwrap_or_else(Vec::new)
    }; 

    let offer_to_send_to_project = OfferToSendToProject {
        offer_id: offer_id.clone(),
        mentor_info: mentor_info,
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


// #[update]
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



#[update]
pub fn accept_offer_of_mentor(offer_id: String, response_message: String, project_id: String) -> String {
    let mut already_accepted = false;

    // Check if the offer has already been accepted
    PROJECT_ALERTS.with(|state| {
        if let Some(offers) = state.borrow().get(&project_id) {
            if offers.iter().any(|o| o.offer_id == offer_id && o.request_status == "accepted") {
                already_accepted = true; // The offer has already been accepted
            }
        }
    });

    if already_accepted {
        return "Offer has already been accepted.".to_string();
    }

    PROJECT_ALERTS.with(|state| {
        if let Some(offers) = state.borrow_mut().get_mut(&project_id) {
            if let Some(offer) = offers.iter_mut().find(|o| o.offer_id == offer_id) {
                // Mark the offer as accepted
                offer.request_status = "accepted".to_string();
                offer.response = response_message.clone();
                offer.accepted_at = time();

                MY_SENT_NOTIFICATIONS.with(|sent_state| {
                    if let Some(sent_status_vector) = sent_state.borrow_mut().get_mut(&offer.sender_principal) {
                        if let Some(project_offer) = sent_status_vector.iter_mut().find(|o| o.offer_id == offer_id) {
                            project_offer.request_status = "accepted".to_string();
                            project_offer.response = response_message.clone();
                            project_offer.accepted_at = time();

                            MENTOR_REGISTRY.with(|storage| {
                                let mentor_profile = storage.borrow().get(&offer.sender_principal).expect("Mentor profile not found").clone();

                                APPLICATION_FORM.with(|projects| {
                                    let mut projects = projects.borrow_mut();
                                    if let Some(project) = projects.get_mut(&offer.sender_principal) {
                                        if let Some(project) = project.iter_mut().find(|p| p.uid == project_offer.project_id) {
                                            if project.params.mentors_assigned.is_none() {
                                                project.params.mentors_assigned = Some(Vec::new());
                                            }
                                            let mentors_assigned = project.params.mentors_assigned.as_mut().unwrap();
                                            if !mentors_assigned.contains(&mentor_profile.profile) {
                                                mentors_assigned.push(mentor_profile.profile.clone());
                                            }

                                            PROJECTS_ASSOCIATED_WITH_MENTOR.with(|storage| {
                                                let mut associate_project = storage.borrow_mut();
                                                let projects = associate_project.entry(offer.sender_principal).or_insert_with(Vec::new);
                                                if !projects.contains(&project.params) {
                                                    projects.push(project.params.clone());
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
    });

    format!("You have accepted the offer with offer id: {}", offer_id)
}


#[update]
pub fn decline_offer_of_mentor(offer_id: String, response_message: String, project_id: String) -> String{

    PROJECT_ALERTS.with(|state| {
        if let Some(offers) = state.borrow_mut().get_mut(&project_id) {
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
pub fn get_all_offers_which_are_pending_for_project(project_id: String) -> Vec<OfferToSendToProject> {
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
pub fn get_all_offers_which_are_pending_for_mentor() -> Vec<OfferToProject> {
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
pub fn get_all_requests_which_got_accepted_for_project(project_id: String) -> Vec<OfferToSendToProject> {
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
pub fn get_all_requests_which_got_accepted_for_mentor() -> Vec<OfferToProject> {
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
pub fn get_all_requests_which_got_declined_for_project(project_id: String) -> Vec<OfferToSendToProject> {
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
pub fn get_all_requests_which_got_declined_for_mentor() -> Vec<OfferToProject> {
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
pub fn self_decline_request_for_mentor(offer_id: String) -> String {
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
pub fn get_all_requests_which_got_self_declined_for_mentor() -> Vec<OfferToProject>{
    MY_SENT_NOTIFICATIONS.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&caller());
        offers.map_or_else(Vec::new, |offers|{
            offers.iter().filter(|offer|{ offer.request_status == "self_declined"}).cloned().collect()
        })
    })
}

#[query]
pub fn get_all_requests_which_got_self_declined_for_project(project_id: String) -> Vec<OfferToSendToProject>{
    PROJECT_ALERTS.with(|offers| {
        let offers = offers.borrow();
        let offers = offers.get(&project_id);
        offers.map_or_else(Vec::new, |offers|{
            offers.iter().filter(|offer|{ offer.request_status == "self_declined"}).cloned().collect()
        })
    })
}