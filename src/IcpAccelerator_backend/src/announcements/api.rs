use std::collections::HashMap;
use crate::state_handler::*;
use crate::announcements::ann_types::*;
use crate::project_module::get_project::*;
use candid::Principal;
use ic_cdk::api::caller;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use crate::guard::*;

#[update(guard = "is_user_anonymous")]
pub fn add_mentor_announcement(name: String, announcement_message: String) -> String {
    let caller_id = ic_cdk::caller();

    let current_time = ic_cdk::api::time();

    mutate_state(|state| {
        let mut announcements = state
            .mentor_announcement
            .get(&StoredPrincipal(caller_id))
            .unwrap_or_else(|| {
                state
                    .mentor_announcement
                    .insert(StoredPrincipal(caller_id), Candid(Vec::new()));
                state
                    .mentor_announcement
                    .get(&StoredPrincipal(caller_id))
                    .unwrap()
            });

        announcements.0.push(MAnnouncements {
            project_name: name,
            announcement_message,
            timestamp: current_time,
        });

        format!("Announcement added successfully at {}", current_time)
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_mentor_announcements() -> HashMap<Principal, Vec<MAnnouncements>> {
    read_state(|state| {
        state
            .mentor_announcement
            .iter()
            .map(|(principal, announcements)| (principal.0, announcements.0.clone()))
            .collect()
    })
}

#[update(guard = "is_user_anonymous")]
pub fn add_vc_announcement(announcement_title: String, announcement_description: String) -> String {
    let caller_id = ic_cdk::caller();
    let current_time = ic_cdk::api::time();

    mutate_state(|state| {
        let stored_principal = StoredPrincipal(caller_id);
        let new_vc = VAnnouncements {
            vc_name: "name".to_string(),
            announcement_title: announcement_title,
            announcement_description: announcement_description,
        };

        let mut announcements = state
            .vc_announcement
            .get(&stored_principal)
            .map(|candid_vec| candid_vec.0.clone())
            .unwrap_or_else(Vec::new);

        announcements.push(new_vc);
        state
            .vc_announcement
            .insert(stored_principal, Candid(announcements));

        format!("Announcement added successfully at {}", current_time)
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_vc_announcements() -> HashMap<Principal, Vec<VAnnouncements>> {
    read_state(|state| {
        let announcements_map = &state.vc_announcement;
        let mut result_map: HashMap<Principal, Vec<VAnnouncements>> = HashMap::new();

        for (principal, announcements) in announcements_map.iter() {
            let principal = principal.0;
            let announcements = announcements.0.clone();

            result_map.insert(principal, announcements);
        }

        result_map
    })
}

#[update(guard = "is_user_anonymous")]
pub fn add_project_announcement(announcement_details: Announcements) -> String {
    let caller_id = caller();
    let current_time = time();

    ic_cdk::println!("Caller ID: {:?}", caller_id);
    ic_cdk::println!("Current Time: {}", current_time);

    let project_info_internal = match get_project_using_id(announcement_details.project_id.clone()){
        Some(info) => {
            ic_cdk::println!("Project info fetched successfully: {:?}", info);
            info
        }
        None => {
            return "Project ID does not exist in application forms.".to_string();
        }
    };

    let new_announcement = AnnouncementsInternal {
        announcement_data: announcement_details.clone(),
        timestamp: current_time,
        project_name: project_info_internal.params.project_name.clone(),
        project_desc: project_info_internal.params.project_description.clone(),
        project_logo: project_info_internal.params.project_logo.clone(),
    };

    ic_cdk::println!("New Announcement Details: {:?}", new_announcement);

    let result = mutate_state(|state| {
        let announcement_storage = &mut state.project_announcement;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller_id)) {
            ic_cdk::println!("Existing announcement entry found.");
            ic_cdk::println!("State before addition: {:?}", caller_announcements.0);
            let mut caller_announcements = caller_announcements.clone(); // Clone to mutate
            caller_announcements.0.push(new_announcement);
            ic_cdk::println!("State after addition: {:?}", caller_announcements.0);
            announcement_storage.insert(StoredPrincipal(caller_id), caller_announcements);
            format!("Announcement added successfully at {}", current_time)
        } else {
            ic_cdk::println!("No announcement entry found for this caller.");
            ic_cdk::println!("State before addition: None"); 
            announcement_storage.insert(StoredPrincipal(caller_id), Candid(vec![new_announcement]));
            
            format!("Announcement added successfully at {}", current_time)
        }
    });

    result
}

#[update(guard = "is_user_anonymous")]
pub async fn update_project_announcement_by_id(
    timestamp: u64,
    new_details: Announcements,
) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.project_announcement;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);
            for announcement in caller_announcements.0.iter_mut() {
                if announcement.timestamp == timestamp {
                    ic_cdk::println!("announcement before update: {:?}", announcement);
                    // Update announcement details
                    announcement.announcement_data = new_details;
                    ic_cdk::println!("State after update: {:?}", announcement);
                    announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);

                    return format!("Announcement updated successfully for {}", timestamp);
                }
            }

            format!("No announcement found with timestamp {}", timestamp)
        } else {
            ic_cdk::println!("No announcement entry found for this caller.");
            format!("No announcement entry found for this caller.")
        }
    })
}

#[query(guard = "is_user_anonymous")]
pub async fn delete_project_announcement_by_id(timestamp: u64) -> String {
    mutate_state(|state| {
        let announcement_storage = &mut state.project_announcement;
        if let Some(caller_announcements) = announcement_storage.get(&StoredPrincipal(caller()))
        {
            let mut caller_announcements = caller_announcements.clone();
            ic_cdk::println!("state before update {:?}", caller_announcements.0);

            let original_len = caller_announcements.0.len();
            caller_announcements
                .0
                .retain(|announcement| announcement.timestamp != timestamp);

            if caller_announcements.0.len() < original_len {
                announcement_storage.insert(StoredPrincipal(caller()), caller_announcements);
                ic_cdk::println!("Announcement deleted successfully for {}", timestamp);
                format!("Announcement deleted successfully for {}", timestamp)
            } else {
                ic_cdk::println!("No announcement found with timestamp {}", timestamp);
                format!("No announcement found with timestamp {}", timestamp)
            }
        } else {
            ic_cdk::println!("No announcement entry found for this caller.");
            format!("No announcement entry found for this caller.")
        }
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_project_announcements() -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    read_state(|state| {
        let mut hashmap = HashMap::new();
        for (stored_principal, announcements) in state.project_announcement.iter() {
            let principal = stored_principal.0.clone();
            hashmap.insert(principal, announcements.0.clone());
        }
        hashmap
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_latest_project_announcements() -> HashMap<Principal, Vec<AnnouncementsInternal>> {
    read_state(|state| {
        let mut hashmap = HashMap::new();
        for (stored_principal, announcement_internals) in state.project_announcement.iter() {
            let principal = stored_principal.0.clone();
            let mut sorted_announcements = announcement_internals.0.clone();
            sorted_announcements.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
            hashmap.insert(principal, sorted_announcements);
        }
        hashmap
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_announcements_by_project_id(project_id: String) -> Vec<AnnouncementsInternal> {
    read_state(|state| {
        state
            .project_announcement
            .iter()
            .flat_map(|(_, announcements)| {
                announcements
                    .0
                    .clone() // Clone the entire Vec<AnnouncementsInternal>
                    .into_iter()
                    .filter(|announcement| announcement.announcement_data.project_id == project_id)
            })
            .collect() // Collect the filtered announcements into a vector
    })
}
