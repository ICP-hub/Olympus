use std::collections::HashMap;
use crate::project_module::get_project::get_project_info_using_principal;
use crate::vc_module::get_vc::get_vc_info_using_principal;
use crate::{mentor_module::get_mentor::get_mentor_info_using_principal, state_handler::*};
use crate::announcements::ann_types::*;
use candid::Principal;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use sha2::{Digest, Sha256};
use crate::guard::*;


#[update(guard = "is_user_anonymous")]
pub async fn add_announcement(announcement_details: Announcements) -> String {
    let caller_id = caller();
    let current_time = time();

    ic_cdk::println!("Caller ID: {:?}", caller_id);
    ic_cdk::println!("Current Time: {}", current_time);

    let uids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uids));
    let announcement_id = uid;

    let project_info_get = get_project_info_using_principal(caller_id);
    let mentor_info_get = get_mentor_info_using_principal(caller_id);
    let vc_info_get = get_vc_info_using_principal(caller_id);

    let new_announcement = AnnouncementsInternal {
        announcement_data: announcement_details.clone(),
        project_info: project_info_get.map(|(proj, _)| proj),
        mentor_info: mentor_info_get.map(|(mentor, _)| mentor),
        vc_info: vc_info_get.map(|(vc, _)| vc.profile),
        timestamp: current_time,
        announcement_id: announcement_id,
    };

    ic_cdk::println!("New Announcement Details: {:?}", new_announcement);

    mutate_state(|state| {
        if let Some(mut candid_announcements) = state.announcement.get(&StoredPrincipal(caller_id)) {
            candid_announcements.0.push(new_announcement);
        } else {
            state.announcement.insert(
                StoredPrincipal(caller_id),
                Candid(vec![new_announcement]),
            );
        }
    });
    format!("Announcement added successfully at {}", current_time)
}

#[update(guard = "is_user_anonymous")]
pub async fn update_announcement_by_id(announcement_id: String, new_details: Announcements) -> String {
    mutate_state(|state| {
        if let Some(mut caller_announcements) = state.announcement.get(&StoredPrincipal(caller())) {
            let mut updated = false;

            for announcement in caller_announcements.0.iter_mut() {
                if announcement.announcement_id == announcement_id {
                    announcement.announcement_data = new_details;
                    updated = true;
                    break;
                }
            }

            if updated {
                "Announcement updated successfully.".to_string()
            } else {
                "No announcement found with the given ID.".to_string()
            }
        } else {
            "No announcement entry found for this caller.".to_string()
        }
    })
}


#[update(guard = "is_user_anonymous")]
pub fn delete_announcement_by_id(announcement_id: String) -> String {
    mutate_state(|state| {
        if let Some(mut caller_announcements) = state.announcement.get(&StoredPrincipal(caller())) {
            let initial_len = caller_announcements.0.len();
            caller_announcements.0.retain(|announcement| announcement.announcement_id != announcement_id);

            if caller_announcements.0.len() < initial_len {
                "Announcement deleted successfully.".to_string()
            } else {
                "No announcement found with the given ID.".to_string()
            }
        } else {
            "No announcement entry found for this caller.".to_string()
        }
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_announcements(page: usize, page_size: usize) -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    read_state(|state| {
        let mut hashmap = HashMap::new();
        for (stored_principal, announcements) in state.announcement.iter() {
            let principal = stored_principal.0.clone();
            let start_index = (page - 1) * page_size;

            let paginated_announcements = announcements.0
                .clone()
                .into_iter()
                .skip(start_index)
                .take(page_size)
                .collect::<Vec<_>>();

            hashmap.insert(principal, paginated_announcements);
        }
        hashmap
    })
}


#[query(guard = "is_user_anonymous")]
pub fn get_latest_announcements(page: usize, page_size: usize) -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    read_state(|state| {
        let mut hashmap = HashMap::new();
        for (stored_principal, announcement_internals) in state.announcement.iter() {
            let principal = stored_principal.0.clone();
            let mut sorted_announcements = announcement_internals.0.clone();

            sorted_announcements.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

            let start_index = (page - 1) * page_size;

            let paginated_announcements = sorted_announcements
                .into_iter()
                .skip(start_index)
                .take(page_size)
                .collect::<Vec<_>>();

            hashmap.insert(principal, paginated_announcements);
        }
        hashmap
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_announcements_by_announcement_id(announcement_id: String) -> Vec<AnnouncementsInternal> {
    read_state(|state| {
        state
            .announcement
            .iter()
            .flat_map(|(_, announcements)| {
                announcements
                    .0
                    .clone() 
                    .into_iter()
                    .filter(|announcement| announcement.announcement_id == announcement_id)
            })
            .collect()
    })
}

#[query]
pub fn get_announcements_by_principal(principal: Principal) -> Vec<AnnouncementsInternal> {
    read_state(|state| {
        state
            .announcement
            .get(&StoredPrincipal(principal))  
            .map_or_else(
                Vec::new, 
                |candid_announcements| candid_announcements.0.clone()  
            )
    })
}
