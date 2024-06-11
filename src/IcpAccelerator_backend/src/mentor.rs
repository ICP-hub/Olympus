use candid::{CandidType, Principal};
use ic_cdk::api::{caller, management_canister::main::raw_rand};
use ic_cdk::storage::{self, stable_restore};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use ic_cdk::api::call::call;
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};
use std::collections::HashMap;
extern crate serde_cbor;
use crate::admin::*;
use crate::state_handler::{StoredPrincipal, read_state, mutate_state, Candid};
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

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorUpdateRequest {
    pub original_info: Option<MentorProfile>,
    pub updated_info: Option<MentorProfile>,
    pub approved_at: u64,
    pub rejected_at: u64,
    pub sent_at: u64,
}

pub type MentorRegistry = HashMap<Principal, MentorInternal>;
pub type MentorParams = HashMap<Principal, MentorProfile>;
pub type MentorUpdateParams = HashMap<Principal, MentorUpdateRequest>;

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
    pub static MENTOR_PROFILE_EDIT_AWAITS :RefCell<MentorUpdateParams> = RefCell::new(MentorUpdateParams::new());
    pub static DECLINED_MENTOR_PROFILE_EDIT_REQUEST :RefCell<MentorUpdateParams> = RefCell::new(MentorUpdateParams::new());
    pub static MENTOR_ANNOUNCEMENTS:RefCell<MentorAnnouncements> = RefCell::new(MentorAnnouncements::new());

}

#[query]
pub fn get_mentor_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    let stored_principal = StoredPrincipal(caller);
    read_state(|state| {
        state.mentor_storage.get(&stored_principal).map(|candid| candid.0.clone())
    })
}

#[query]
pub fn get_mentor_awaiting_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    let stored_principal = StoredPrincipal(caller);
    read_state(|state| {
        state.mentor_awaits_response.get(&stored_principal).map(|candid| candid.0.clone())
    })
}

#[query]
pub fn get_mentor_declined_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    let stored_principal = StoredPrincipal(caller);
    read_state(|state| {
        state.mentor_declined_request.get(&stored_principal).map(|candid| candid.0.clone())
    })
}

pub async fn register_mentor(mut profile: MentorProfile) -> String {
    let caller = caller();

    let request_declined = read_state(|state| state.mentor_declined_request.contains_key(&StoredPrincipal(caller)));
    if request_declined {
        return "You had got your request declined earlier".to_string();
    }

    let already_registered = read_state(|state| state.mentor_storage.contains_key(&StoredPrincipal(caller)));
    if already_registered {
        ic_cdk::println!("This Principal is already registered");
        return "you are a mentor already".to_string();
    }

    mutate_state(|state| {
        let role_status = &mut state.role_status;

        if let Some(mut role_status_vec_candid) = role_status.get(&StoredPrincipal(caller)) {
            let mut role_status_vec = role_status_vec_candid.0;
            for role in role_status_vec.iter_mut() {
                if role.name == "mentor" {
                    role.status = "requested".to_string();
                    break;
                }
            }
            role_status.insert(StoredPrincipal(caller), Candid(role_status_vec));
        } else {
            // If the role_status doesn't exist for the caller, insert the initial roles
            let initial_roles = vec![
                Role {
                    name: "user".to_string(),
                    status: "active".to_string(),
                    requested_on: None,
                    approved_on: Some(time()),
                    rejected_on: None,
                },
                Role {
                    name: "project".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                },
                Role {
                    name: "mentor".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                },
                Role {
                    name: "vc".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                },
            ];
            role_status.insert(StoredPrincipal(caller), Candid(initial_roles));
        }
    });

    let temp_image = profile.user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    
    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        profile.user_data.profile_picture = Some((full_url).as_bytes().to_vec());
    }
    else if temp_image.clone().unwrap().len() < 300 {
        ic_cdk::println!("Profile image is already uploaded");
    }else{
        
        let key = "/uploads/".to_owned()+&caller.to_string()+"_user.jpeg";
        
        let arg = StoreArg{
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(temp_image.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset {
            key: key.clone()
        };

        let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset, )).await.unwrap();

        let (result,): ((),) = call(canister_id, "store", (arg, )).await.unwrap();

        profile.user_data.profile_picture = Some((canister_id.to_string()+&key).as_bytes().to_vec());
    }

    let user_data_for_updation = profile.clone();
    crate::user_module::update_data_for_roles(caller, user_data_for_updation.user_data);

    match profile.validate() {
        Ok(_) => {
            let random_bytes = ic_cdk::api::management_canister::main::raw_rand()
                .await
                .expect("Failed to generate random bytes")
                .0;

            let uid = format!("{:x}", Sha256::digest(&random_bytes));

            let mentor_internal = MentorInternal {
                profile: profile.clone(),
                uid,
                active: true,
                approve: false,
                decline: false,
            };

            mutate_state(|state| {
                state.mentor_awaits_response.insert(StoredPrincipal(caller), Candid(mentor_internal));
            });

            let res = send_approval_request(
                profile.user_data.profile_picture.unwrap_or_else(|| Vec::new()),
                profile.user_data.full_name,
                profile.user_data.country,
                profile.area_of_expertise,
                "mentor".to_string(),
                profile.user_data.bio.unwrap_or("no bio".to_string()),
            )
            .await;

            format!("{}", res)
        }
        Err(e) => {
            format!("Validation error: {}", e)
        }
    }
}

#[query]
pub fn get_mentor() -> Option<MentorProfile> {
    let caller = ic_cdk::caller();
    read_state(|state| {
        state.mentor_storage
            .get(&StoredPrincipal(caller))
            .map(|mentor_internal| mentor_internal.0.profile.clone())
    })
}

#[query]
pub fn get_mentor_by_principal(id: Principal) -> Option<MentorProfile> {
    read_state(|state| {
        state.mentor_storage
            .get(&StoredPrincipal(id))
            .map(|mentor_internal| mentor_internal.0.profile.clone())
    })
}

#[update]
pub async fn update_mentor(mut updated_profile: MentorProfile) -> String {
    let caller = ic_cdk::caller();

    read_state(|state| {
        if state.mentor_profile_edit_declined.contains_key(&StoredPrincipal(caller)) {
            panic!("You had got your request declined earlier");
        }
    });

    let already_registered = read_state(|state| {
        state.mentor_storage.contains_key(&StoredPrincipal(caller))
    });

    if !already_registered {
        ic_cdk::println!("This Principal is not registered");
        return "This Principal is not registered.".to_string();
    }

    let profile_edit_request_already_sent = read_state(|state| {
        state.mentor_profile_edit_awaits.contains_key(&StoredPrincipal(caller))
    });

    if profile_edit_request_already_sent {
        ic_cdk::println!("Wait for your previous request to get approved");
        return "Wait for your previous request to get approved.".to_string();
    }

    let previous_profile = read_state(|state| {
        state
            .mentor_storage
            .get(&StoredPrincipal(caller))
            .map(|mentor_internal| mentor_internal.0.profile.clone())
    });

    let mut approved_timestamp = 0;
    let mut rejected_timestamp = 0;

    mutate_state(|state| {
        if let Some(mut roles) = state.role_status.get(&StoredPrincipal(caller)) {
            for role in roles.0.iter_mut() {
                if role.name == "mentor" {
                    if role.status == "approved" {
                        approved_timestamp = ic_cdk::api::time();
                        role.approved_on = Some(approved_timestamp);
                    } else if role.status == "rejected" {
                        rejected_timestamp = ic_cdk::api::time();
                        role.rejected_on = Some(rejected_timestamp);
                    }
                }
            }
        }
    });

    let temp_image = updated_profile.user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    
    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        updated_profile.user_data.profile_picture = Some((full_url).as_bytes().to_vec());
    }
    else if temp_image.clone().unwrap().len() < 300 {
        ic_cdk::println!("Profile image is already uploaded");
    }else{
        
        let key = "/uploads/".to_owned()+&caller.to_string()+"_user.jpeg";
        
        let arg = StoreArg{
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(temp_image.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset {
            key: key.clone()
        };

        let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset, )).await.unwrap();

        let (result,): ((),) = call(canister_id, "store", (arg, )).await.unwrap();

        updated_profile.user_data.profile_picture = Some((canister_id.to_string()+&key).as_bytes().to_vec());
    }

    mutate_state(|state| {
        let update_data_tp_store = MentorUpdateRequest {
            original_info: previous_profile,
            updated_info: Some(updated_profile.clone()),
            approved_at: approved_timestamp,
            rejected_at: rejected_timestamp,
            sent_at: ic_cdk::api::time(),
        };
        state
            .mentor_profile_edit_awaits
            .insert(StoredPrincipal(caller), Candid(update_data_tp_store));
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
}

pub fn delete_mentor() -> String {
    let caller = ic_cdk::caller();

    let removed = mutate_state(|state| {
        state.mentor_storage.remove(&StoredPrincipal(caller)).is_some()
    });

    if removed {
        "Mentor profile deleted successfully.".to_string()
    } else {
        "Mentor profile not found.".to_string()
    }
}

#[query]
pub fn get_all_mentors() -> HashMap<Principal, MentorWithRoles> {
    read_state(|state| {
        let mentor_registry = state.mentor_storage.iter().collect::<Vec<_>>();

        let mut mentor_with_roles_map: HashMap<Principal, MentorWithRoles> = HashMap::new();

        for (stored_principal, candid_mentor_internal) in mentor_registry.iter() {
            let mentor_internal = candid_mentor_internal.0.clone(); // Get the inner MentorInternal
            let principal = stored_principal.0; // Get the inner Principal
            let roles = get_roles_for_principal(principal);
            let mentor_with_roles = MentorWithRoles {
                mentor_profile: mentor_internal.clone(),
                roles,
            };

            if mentor_internal.active {
                mentor_with_roles_map.insert(principal, mentor_with_roles);
            }
        }

        mentor_with_roles_map
    })
}


#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParamMentor {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationReturnMentor{
    pub data: HashMap<Principal, MentorWithRoles>,
    pub count: usize,
}

#[query]
pub fn get_all_mentors_with_pagination(pagination_params: PaginationParamMentor) -> PaginationReturnMentor {
    read_state(|state| {
        let mentor_registry = state.mentor_storage.iter().collect::<Vec<_>>();

        let mut mentor_list: Vec<(Principal, MentorWithRoles)> = Vec::new();

        for (stored_principal, candid_mentor_internal) in mentor_registry.iter() {
            let mentor_internal = candid_mentor_internal.0.clone(); // Get the inner MentorInternal
            let principal = stored_principal.0; // Get the inner Principal

            if mentor_internal.active {
                let roles = get_roles_for_principal(principal);
                let mentor_with_roles = MentorWithRoles {
                    mentor_profile: mentor_internal,
                    roles,
                };

                mentor_list.push((principal, mentor_with_roles));
            }
        }

        // Sort the list to ensure consistent pagination
        mentor_list.sort_by_key(|(principal, _)| *principal);

        // Calculate start and end indices for pagination, ensuring they're within the bounds of the vector
        let start = std::cmp::min(pagination_params.page.saturating_sub(1) * pagination_params.page_size, mentor_list.len());
        let end = std::cmp::min(start + pagination_params.page_size, mentor_list.len());

        // Convert the slice of mentor data to a HashMap for the output
        let paginated_mentor_map: HashMap<Principal, MentorWithRoles> = mentor_list[start..end]
            .iter()
            .cloned()
            .collect();

        PaginationReturnMentor {
            data: paginated_mentor_map,
            count: mentor_list.len(),  // Return the total count of active mentors
        }
    })
}


pub fn make_active_inactive(p_id: Principal) -> String {
    let principal_id = ic_cdk::caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        mutate_state(|state| {
            if let Some(mut mentor_internal) = state.mentor_storage.get(&StoredPrincipal(p_id)) {
                if mentor_internal.0.active {
                    mentor_internal.0.active = false;
                    "made inactive".to_string()
                } else {
                    mentor_internal.0.active = true;
                    "made active".to_string()
                }
            } else {
                "profile seems not to be existed".to_string()
            }
        })
    } else {
        "you are not authorised to use this function".to_string()
    }
}


#[update]
pub fn add_mentor_announcement(name: String, announcement_message: String) -> String {
    let caller_id = ic_cdk::caller();

    let current_time = ic_cdk::api::time();

    mutate_state(|state| {
        let mut announcements = state.mentor_announcement
            .get(&StoredPrincipal(caller_id))
            .unwrap_or_else(|| {
                state.mentor_announcement.insert(
                    StoredPrincipal(caller_id),
                    Candid(Vec::new())
                );
                state.mentor_announcement.get(&StoredPrincipal(caller_id)).unwrap()
            });

        announcements.0.push(MAnnouncements {
            project_name: name,
            announcement_message,
            timestamp: current_time,
        });

        format!("Announcement added successfully at {}", current_time)
    })
}

//for testing purpose
#[query]
pub fn get_mentor_announcements() -> HashMap<Principal, Vec<MAnnouncements>> {
    read_state(|state| {
        state.mentor_announcement
            .iter()
            .map(|(principal, announcements)| {
                (principal.0, announcements.0.clone())
            })
            .collect()
    })
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorFilterCriteria {
    pub country: Option<String>,
    pub area_of_expertise: Option<String>,
}

#[query]
pub fn filter_mentors(criteria: MentorFilterCriteria) -> Vec<MentorProfile> {
    read_state(|state| {
        state.mentor_storage
            .iter()
            .filter(|(_, mentor_internal)| {
                let country_match = match &criteria.country {
                    Some(c) => &mentor_internal.0.profile.user_data.country == c,
                    None => true, 
                };

                let expertise_match = criteria.area_of_expertise.as_ref().map_or(true, |exp| {
                    &mentor_internal.0.profile.area_of_expertise == exp
                });

                mentor_internal.0.active && mentor_internal.0.approve && !mentor_internal.0.decline
                    && country_match && expertise_match
            })
            .map(|(_, mentor_internal)| mentor_internal.0.profile.clone())
            .collect()
    })
}



// pub fn pre_upgrade_mentor() {
//     MENTOR_REGISTRY.with(|data| {
//         match storage::stable_save((data.borrow().clone(),)) {
//             Ok(_) => ic_cdk::println!("MENTOR_REGISTRY saved successfully."),
//             Err(e) => ic_cdk::println!("Failed to save MENTOR_REGISTRY: {:?}", e),
//         }
//     });

//     MENTOR_AWAITS_RESPONSE.with(|data| {
//         match storage::stable_save((data.borrow().clone(),)) {
//             Ok(_) => ic_cdk::println!("MENTOR_AWAITS_RESPONSE saved successfully."),
//             Err(e) => ic_cdk::println!("Failed to save MENTOR_AWAITS_RESPONSE: {:?}", e),
//         }
//     });

//     DECLINED_MENTOR_REQUESTS.with(|data| {
//         match storage::stable_save((data.borrow().clone(),)) {
//             Ok(_) => ic_cdk::println!("DECLINED_MENTOR_REQUESTS saved successfully."),
//             Err(e) => ic_cdk::println!("Failed to save DECLINED_MENTOR_REQUESTS: {:?}", e),
//         }
//     });

//     MENTOR_PROFILE_EDIT_AWAITS.with(|data| {
//         match storage::stable_save((data.borrow().clone(),)) {
//             Ok(_) => ic_cdk::println!("MENTOR_PROFILE_EDIT_AWAITS saved successfully."),
//             Err(e) => ic_cdk::println!("Failed to save MENTOR_PROFILE_EDIT_AWAITS: {:?}", e),
//         }
//     });

//     DECLINED_MENTOR_PROFILE_EDIT_REQUEST.with(|data| {
//         match storage::stable_save((data.borrow().clone(),)) {
//             Ok(_) => ic_cdk::println!("DECLINED_MENTOR_PROFILE_EDIT_REQUEST saved successfully."),
//             Err(e) => ic_cdk::println!("Failed to save DECLINED_MENTOR_PROFILE_EDIT_REQUEST: {:?}", e),
//         }
//     });

//     MENTOR_ANNOUNCEMENTS.with(|data| {
//         match storage::stable_save((data.borrow().clone(),)) {
//             Ok(_) => ic_cdk::println!("MENTOR_ANNOUNCEMENTS saved successfully."),
//             Err(e) => ic_cdk::println!("Failed to save MENTOR_ANNOUNCEMENTS: {:?}", e),
//         }
//     });
// }

// pub fn post_upgrade_mentor() {
//     match stable_restore::<(MentorRegistry, MentorRegistry, MentorRegistry, MentorUpdateParams, MentorUpdateParams, MentorAnnouncements)>() {
//         Ok((restored_mentor_registry, restored_mentor_awaits_response, restored_declined_mentor_requests, restored_mentor_profile_edit_awaits, restored_declined_mentor_profile_edit_request, restored_mentor_announcements)) => {
//             MENTOR_REGISTRY.with(|data| *data.borrow_mut() = restored_mentor_registry);
//             MENTOR_AWAITS_RESPONSE.with(|data| *data.borrow_mut() = restored_mentor_awaits_response);
//             DECLINED_MENTOR_REQUESTS.with(|data| *data.borrow_mut() = restored_declined_mentor_requests);
//             MENTOR_PROFILE_EDIT_AWAITS.with(|data| *data.borrow_mut() = restored_mentor_profile_edit_awaits);
//             DECLINED_MENTOR_PROFILE_EDIT_REQUEST.with(|data| *data.borrow_mut() = restored_declined_mentor_profile_edit_request);
//             MENTOR_ANNOUNCEMENTS.with(|data| *data.borrow_mut() = restored_mentor_announcements);

//             ic_cdk::println!("Mentor modules restored successfully.");
//         },
//         Err(e) => ic_cdk::println!("Failed to restore mentor modules: {:?}", e),
//     }
// }