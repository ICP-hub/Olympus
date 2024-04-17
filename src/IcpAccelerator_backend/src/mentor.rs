use candid::{CandidType, Principal};
use ic_cdk::api::{caller, management_canister::main::raw_rand};
use ic_cdk::storage::{self, stable_restore};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
extern crate serde_cbor;
use crate::admin::*;
use crate::trie::EXPERTISE_TRIE;
use crate::user_module::*;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use std::cell::RefCell;
use std::io::Read;
#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]

pub struct MentorProfile {
    pub preferred_icp_hub: Option<String>,
    pub user_data: UserInformation,
    pub existing_icp_mentor: bool,
    pub existing_icp_project_porfolio: Option<String>,
    pub icp_hub_or_spoke: bool,
    pub category_of_mentoring_service: String,
    pub linkedin_link: String,
    pub multichain: Option<String>,
    pub years_of_mentoring: String,
    pub website: Option<String>,
    pub area_of_expertise: String,
    pub reason_for_joining: Option<String>,
    pub hub_owner: Option<String>,
}
impl MentorProfile {
    pub fn validate(&self) -> Result<(), String> {
        if let Some(ref preferred_icp_hub) = self.preferred_icp_hub {
            if preferred_icp_hub.trim().is_empty() {
                return Err("Field cannot be empty".into());
            }
        }

        // if let Some(ref exisitng_icp_project_porfolio) = self.existing_icp_project_porfolio {
        //     if exisitng_icp_project_porfolio.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }
        
        // if let Some(ref multichain) = self.multichain {
        //     if multichain.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        Ok(())
    }
}

pub type MentorRegistry = HashMap<Principal, MentorInternal>;
pub type MentorParams = HashMap<Principal, MentorProfile>;

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorInternal {
    pub profile: MentorProfile,
    pub uid: String,
    pub active: bool,
    pub approve: bool,
    pub decline: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MAnnouncements {
    project_name: String,
    announcement_message: String,
    timestamp: u64,
}

pub type MentorAnnouncements = HashMap<Principal, Vec<MAnnouncements>>;

thread_local! {
    pub static MENTOR_REGISTRY: RefCell<MentorRegistry> = RefCell::new(MentorRegistry::new());
    pub static MENTOR_AWAITS_RESPONSE: RefCell<MentorRegistry> = RefCell::new(MentorRegistry::new());
    pub static DECLINED_MENTOR_REQUESTS: RefCell<MentorRegistry> = RefCell::new(MentorRegistry::new());
    pub static MENTOR_PROFILE_EDIT_AWAITS :RefCell<MentorParams> = RefCell::new(MentorParams::new());
    pub static DECLINED_MENTOR_PROFILE_EDIT_REQUEST :RefCell<MentorParams> = RefCell::new(MentorParams::new());
    pub static MENTOR_ANNOUNCEMENTS:RefCell<MentorAnnouncements> = RefCell::new(MentorAnnouncements::new());

}

#[query]
pub fn get_mentor_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    MENTOR_REGISTRY.with(|registry| registry.borrow().get(&caller).cloned())
}

#[query]
pub fn get_mentor_awaiting_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    MENTOR_AWAITS_RESPONSE.with(|registry| registry.borrow().get(&caller).cloned())
}

#[query]
pub fn get_mentor_declined_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    DECLINED_MENTOR_REQUESTS.with(|registry| registry.borrow().get(&caller).cloned())
}

pub async fn register_mentor(profile: MentorProfile) -> String {
    let caller = caller();

    DECLINED_MENTOR_REQUESTS.with(|d_mentors| {
        let exits = d_mentors.borrow().contains_key(&caller);
        if exits {
            panic!("You had got your request declined earlier");
        }
    });

    let already_registered =
        MENTOR_REGISTRY.with(|registry| registry.borrow().contains_key(&caller));

    if already_registered {
        ic_cdk::println!("This Principal is already registered");
        return "you are a mentor already".to_string();
    }

    ROLE_STATUS_ARRAY.with(|role_status| {
        let mut role_status = role_status.borrow_mut();

        for role in role_status
            .get_mut(&caller)
            .expect("couldn't get role status for this principal")
            .iter_mut()
        {
            if role.name == "mentor" {
                role.status = "requested".to_string();
                role.requested_on = Some(time());
            }
        }
    });

    let user_data_for_updation = profile.clone();
    crate::user_module::update_data_for_roles(caller, user_data_for_updation.user_data);

    match profile.validate() {
        Ok(_) => {
            let random_bytes = raw_rand().await.expect("Failed to generate random bytes").0;

            let uid = format!("{:x}", Sha256::digest(&random_bytes));

            let profile_for_pushing = profile.clone();

            let mentor_internal = MentorInternal {
                profile: profile_for_pushing.clone(),
                uid: uid.clone(),
                active: true,
                approve: false,
                decline: false,
            };

            MENTOR_AWAITS_RESPONSE.with(
                |awaiters: &RefCell<HashMap<Principal, MentorInternal>>| {
                    let mut await_ers: std::cell::RefMut<'_, HashMap<Principal, MentorInternal>> =
                        awaiters.borrow_mut();
                    await_ers.insert(caller, mentor_internal);
                },
            );

            let res = send_approval_request(
                profile_for_pushing
                    .user_data
                    .profile_picture
                    .unwrap_or_else(|| Vec::new()),
                profile_for_pushing.user_data.full_name,
                profile_for_pushing.user_data.country,
                profile_for_pushing.area_of_expertise,
                "mentor".to_string(),
                profile_for_pushing
                    .user_data
                    .bio
                    .unwrap_or("no bio".to_string()),
            )
            .await;

            format!("{}", res)
        }
        Err(e) => {
            format!("Validation error: {}", e)
        }
    }

    // MENTOR_REGISTRY.with(|registry| {
    //     registry.borrow_mut().insert(caller, mentor_internal);
    // });

    // if let Some(expertise) = profile.areas_of_expertise {
    //     let keyword = crate::trie::expertise_to_str(&expertise);
    //     EXPERTISE_TRIE.with(|trie| {
    //         trie.borrow_mut().insert(&keyword, caller);
    //     });
    // }
}

#[query]
pub fn get_mentor() -> Option<MentorProfile> {
    let caller = caller();
    MENTOR_REGISTRY.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|mentor_internal| mentor_internal.profile.clone())
    })
}

#[query]
pub fn get_mentor_by_principal(id: Principal) -> Option<MentorProfile> {
    MENTOR_REGISTRY.with(|registry| {
        registry
            .borrow()
            .get(&id)
            .map(|mentor_internal| mentor_internal.profile.clone())
    })
}

#[update]
pub async fn update_mentor(updated_profile: MentorProfile) -> String {
    let caller = caller();

    DECLINED_MENTOR_PROFILE_EDIT_REQUEST.with(|d_mentor| {
        let exits = d_mentor.borrow().contains_key(&caller);
        if exits {
            panic!("You had got your request declined earlier");
        }
    });
    let already_registered =
        MENTOR_REGISTRY.with(|registry| registry.borrow().contains_key(&caller));

    if !already_registered {
        ic_cdk::println!("This Principal is not registered");
        return "This Principal is not registered.".to_string();
    }

    let profile_edit_request_already_sent =
        MENTOR_PROFILE_EDIT_AWAITS.with(|registry| registry.borrow().contains_key(&caller));
    if profile_edit_request_already_sent {
        ic_cdk::println!("Wait for your previous request to get approved");
        return "Wait for your previous request to get approved. ".to_string();
    }

    MENTOR_PROFILE_EDIT_AWAITS.with(|awaiters: &RefCell<HashMap<Principal, MentorProfile>>| {
        let mut await_ers: std::cell::RefMut<'_, HashMap<Principal, MentorProfile>> =
            awaiters.borrow_mut();
        await_ers.insert(caller, updated_profile.clone());
    });

    let res = send_approval_request(
        updated_profile
            .user_data
            .profile_picture
            .unwrap_or_else(|| Vec::new()),
        updated_profile.user_data.full_name,
        updated_profile.user_data.country,
        updated_profile.area_of_expertise,
        "mentor".to_string(),
        updated_profile
            .user_data
            .bio
            .unwrap_or("no bio".to_string()),
    )
    .await;

    format!("{}", res)

    // let result = MENTOR_REGISTRY.with(|registry| {
    //     let mut registry = registry.borrow_mut();
    //     if let Some(mentor_internal) = registry.get_mut(&caller) {
    //         mentor_internal.profile.preferred_icp_hub = updated_profile
    //             .preferred_icp_hub
    //             .or(mentor_internal.profile.preferred_icp_hub.clone());

    //         mentor_internal.profile.multichain = updated_profile
    //             .multichain
    //             .or(mentor_internal.profile.multichain.clone());
    //         mentor_internal.profile.exisitng_icp_project_porfolio = updated_profile
    //             .exisitng_icp_project_porfolio
    //             .or(mentor_internal
    //                 .profile
    //                 .exisitng_icp_project_porfolio
    //                 .clone());

    //         mentor_internal.profile.area_of_expertise = updated_profile.area_of_expertise;
    //         mentor_internal.profile.category_of_mentoring_service =
    //             updated_profile.category_of_mentoring_service;

    //         mentor_internal.profile.existing_icp_mentor = updated_profile.existing_icp_mentor;
    //         mentor_internal.profile.icop_hub_or_spoke = updated_profile.icop_hub_or_spoke;
    //         mentor_internal.profile.social_link = updated_profile.social_link;
    //         mentor_internal.profile.website = updated_profile.website;
    //         mentor_internal.profile.years_of_mentoring = updated_profile.years_of_mentoring;
    //         mentor_internal.profile.reason_for_joining = updated_profile.reason_for_joining;
    //         mentor_internal.profile.user_data = updated_profile.user_data;

    //         "Mentor profile updated successfully.".to_string()
    //     } else {
    //         "Mentor profile not found.".to_string()
    //     }
    // });
}

pub fn delete_mentor() -> String {
    let caller = caller();
    let removed = MENTOR_REGISTRY.with(|registry| registry.borrow_mut().remove(&caller).is_some());

    if removed {
        "Mentor profile deleted successfully.".to_string()
    } else {
        "Mentor profile not found.".to_string()
    }
}

#[query]
pub fn get_all_mentors() -> HashMap<Principal, MentorWithRoles> {
    let mentor_awaiters = MENTOR_REGISTRY.with(|awaiters| awaiters.borrow().clone());

    let mut mentor_with_roles_map: HashMap<Principal, MentorWithRoles> = HashMap::new();

    for (principal, mentor_internal) in mentor_awaiters.iter() {
        let roles = get_roles_for_principal(*principal);
        let mentor_with_roles = MentorWithRoles {
            mentor_profile: mentor_internal.clone(),
            roles,
        };

        if mentor_internal.active == true{
            mentor_with_roles_map.insert(*principal, mentor_with_roles);
        }
    }

    mentor_with_roles_map
}


#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParam {
    pub page: usize,
    pub page_size: usize,
}

#[query]
pub fn get_all_mentors_with_pagination(pagination_params: PaginationParam) -> HashMap<Principal, MentorWithRoles> {
    let mentor_awaiters = MENTOR_REGISTRY.with(|awaiters| awaiters.borrow().clone());

    let mut mentor_list: Vec<(Principal, MentorWithRoles)> = Vec::new();

    for (principal, mentor_internal) in mentor_awaiters.iter() {
        if mentor_internal.active {
            let roles = get_roles_for_principal(*principal);
            let mentor_with_roles = MentorWithRoles {
                mentor_profile: mentor_internal.clone(),
                roles,
            };

            mentor_list.push((*principal, mentor_with_roles));
        }
    }

    // Sort the list to ensure consistent pagination
    mentor_list.sort_by_key(|(principal, _)| *principal);

    // Calculate start and end indices for pagination, ensuring they're within the bounds of the vector
    let start = std::cmp::min((pagination_params.page - 1) * pagination_params.page_size, mentor_list.len());
    let end = std::cmp::min(start + pagination_params.page_size, mentor_list.len());

    // If start is greater than or equal to mentor_list's length, it means the requested page is beyond the available data
    // In such cases, return an empty HashMap instead of attempting to slice the vector
    if start >= mentor_list.len() {
        return HashMap::new();
    }

    // Now safe to slice because we've ensured start is within bounds and end is either within bounds or equal to the length of the vector
    let paginated_mentor_list = mentor_list[start..end].to_vec();

    // Correctly initialize and assign the variable for the paginated HashMap
    let paginated_mentor_map: HashMap<Principal, MentorWithRoles> = paginated_mentor_list.into_iter().collect();

    paginated_mentor_map
}


pub fn make_active_inactive(p_id: Principal) -> String {
    let principal_id = caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        MENTOR_REGISTRY.with(|m_container| {
            let mut tutor_hashmap = m_container.borrow_mut();
            if let Some(mentor_internal) = tutor_hashmap.get_mut(&p_id) {
                if mentor_internal.active {
                    let active = false;
                    mentor_internal.active = active;

                    //ic_cdk::println!("mentor profile check status {:?}", mentor_internal);
                    return "made inactive".to_string();
                } else {
                    let active = true;
                    mentor_internal.active = active;
                    //ic_cdk::println!("mentor profile check status {:?}", mentor_internal);
                    return "made active".to_string();
                }
            } else {
                "profile seems not to be existed".to_string()
            }
        })
    } else {
        "you are not authorised to use this function".to_string()
    }
}

pub fn find_mentors_by_expertise(expertise_keyword: &str) -> Vec<MentorProfile> {
    let keyword = expertise_keyword;
    let mentor_principals = EXPERTISE_TRIE.with(|trie| trie.borrow().search(keyword));

    let mut mentor_profiles = Vec::new();
    MENTOR_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        for principal in mentor_principals {
            if let Some(mentor_internal) = registry.get(&principal) {
                mentor_profiles.push(mentor_internal.profile.clone());
            }
        }
    });

    mentor_profiles
}

#[update]
pub fn add_mentor_announcement(name: String, announcement_message: String) -> String {
    let caller_id = caller();

    let current_time = time();

    MENTOR_ANNOUNCEMENTS.with(|state| {
        let mut state = state.borrow_mut();
        let new_vc = MAnnouncements {
            project_name: name,
            announcement_message: announcement_message,
            timestamp: current_time,
        };

        state.entry(caller_id).or_insert_with(Vec::new).push(new_vc);
        format!("Announcement added successfully at {}", current_time)
    })
}

//for testing purpose
#[query]
pub fn get_mentor_announcements() -> HashMap<Principal, Vec<MAnnouncements>> {
    MENTOR_ANNOUNCEMENTS.with(|state| {
        let state = state.borrow();
        state.clone()
    })
}

pub fn pre_upgrade_mentor() {
    MENTOR_REGISTRY.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("MENTOR_REGISTRY saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save MENTOR_REGISTRY: {:?}", e),
        }
    });

    MENTOR_AWAITS_RESPONSE.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("MENTOR_AWAITS_RESPONSE saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save MENTOR_AWAITS_RESPONSE: {:?}", e),
        }
    });

    DECLINED_MENTOR_REQUESTS.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("DECLINED_MENTOR_REQUESTS saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save DECLINED_MENTOR_REQUESTS: {:?}", e),
        }
    });

    MENTOR_PROFILE_EDIT_AWAITS.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("MENTOR_PROFILE_EDIT_AWAITS saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save MENTOR_PROFILE_EDIT_AWAITS: {:?}", e),
        }
    });

    DECLINED_MENTOR_PROFILE_EDIT_REQUEST.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("DECLINED_MENTOR_PROFILE_EDIT_REQUEST saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save DECLINED_MENTOR_PROFILE_EDIT_REQUEST: {:?}", e),
        }
    });

    MENTOR_ANNOUNCEMENTS.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("MENTOR_ANNOUNCEMENTS saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save MENTOR_ANNOUNCEMENTS: {:?}", e),
        }
    });
}

pub fn post_upgrade_mentor() {
    match stable_restore::<(MentorRegistry, MentorRegistry, MentorRegistry, MentorParams, MentorParams, MentorAnnouncements)>() {
        Ok((restored_mentor_registry, restored_mentor_awaits_response, restored_declined_mentor_requests, restored_mentor_profile_edit_awaits, restored_declined_mentor_profile_edit_request, restored_mentor_announcements)) => {
            MENTOR_REGISTRY.with(|data| *data.borrow_mut() = restored_mentor_registry);
            MENTOR_AWAITS_RESPONSE.with(|data| *data.borrow_mut() = restored_mentor_awaits_response);
            DECLINED_MENTOR_REQUESTS.with(|data| *data.borrow_mut() = restored_declined_mentor_requests);
            MENTOR_PROFILE_EDIT_AWAITS.with(|data| *data.borrow_mut() = restored_mentor_profile_edit_awaits);
            DECLINED_MENTOR_PROFILE_EDIT_REQUEST.with(|data| *data.borrow_mut() = restored_declined_mentor_profile_edit_request);
            MENTOR_ANNOUNCEMENTS.with(|data| *data.borrow_mut() = restored_mentor_announcements);

            ic_cdk::println!("Mentor modules restored successfully.");
        },
        Err(e) => ic_cdk::println!("Failed to restore mentor modules: {:?}", e),
    }
}
