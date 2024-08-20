use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use ic_cdk::api::call::call;
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};
use std::collections::HashMap;
extern crate serde_cbor;
use crate::admin::*;
use crate::is_user_anonymous;
use crate::state_handler::{mutate_state, read_state, Candid, StoredPrincipal};
use crate::user_module::*;
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinksMentor{
    pub link: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]

pub struct MentorProfile {
    pub preferred_icp_hub: Option<String>,
    pub existing_icp_mentor: bool,
    pub existing_icp_project_porfolio: Option<String>,
    pub icp_hub_or_spoke: bool,
    pub category_of_mentoring_service: String,
    pub links: Option<Vec<SocialLinksMentor>>,
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

#[query(guard = "is_user_anonymous")]
pub fn get_mentor_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    let stored_principal = StoredPrincipal(caller);
    read_state(|state| {
        state
            .mentor_storage
            .get(&stored_principal)
            .map(|candid| candid.0.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_mentor_awaiting_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    let stored_principal = StoredPrincipal(caller);
    read_state(|state| {
        state
            .mentor_awaits_response
            .get(&stored_principal)
            .map(|candid| candid.0.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_mentor_declined_info_using_principal(caller: Principal) -> Option<MentorInternal> {
    let stored_principal = StoredPrincipal(caller);
    read_state(|state| {
        state
            .mentor_declined_request
            .get(&stored_principal)
            .map(|candid| candid.0.clone())
    })
}

pub async fn register_mentor(profile: MentorProfile) -> String {
    let caller = caller();

    let has_project_role = read_state(|state| {
        state.role_status.get(&StoredPrincipal(caller)).map_or(false, |roles| {
            roles.0.iter().any(|role| role.name == "project" && (role.status == "approved" || role.status == "active"))
        })
    });

    if has_project_role {
        return "You are not allowed to get this role because you already have the Project role.".to_string();
    }

    let role_count = get_approved_role_count_for_principal(caller);
    if role_count >= 2 {
        return "You are not eligible for this role because you have 2 or more roles".to_string();
    }

    let request_declined = read_state(|state| {
        state
            .mentor_declined_request
            .contains_key(&StoredPrincipal(caller))
    });
    if request_declined {
        return "You had got your request declined earlier".to_string();
    }

    let already_registered =
        read_state(|state| state.mentor_storage.contains_key(&StoredPrincipal(caller)));
    if already_registered {
        ic_cdk::println!("This Principal is already registered");
        return "you are a mentor already".to_string();
    }

    let mut user_data = get_user_information_internal(caller);

    let temp_image = user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    
    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        user_data.profile_picture = Some((full_url).as_bytes().to_vec());
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

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset, )).await.unwrap();

        let (_result,): ((),) = call(canister_id, "store", (arg, )).await.unwrap();

        user_data.profile_picture = Some((canister_id.to_string()+&key).as_bytes().to_vec());
    }

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
                // Update various parts of the state
                state
                    .mentor_storage
                    .insert(StoredPrincipal(caller), Candid(mentor_internal.clone()));
                let role_status = &mut state.role_status;

                if let Some(role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(caller))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "mentor" {
                            role.status = "approved".to_string();
                            role.approval_status = Some("approved".to_string());
                            role.approved_on = Some(time());
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(caller), Candid(role_status_vec));
                }
            });

            format!("Mentor Profile Created With UID {}", mentor_internal.uid)
        }
        Err(e) => {
            format!("Validation error: {}", e)
        }
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_mentor() -> Option<MentorProfile> {
    let caller = ic_cdk::caller();
    read_state(|state| {
        state
            .mentor_storage
            .get(&StoredPrincipal(caller))
            .map(|mentor_internal| mentor_internal.0.profile.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_mentor_by_principal(id: Principal) -> Option<MentorProfile> {
    read_state(|state| {
        state
            .mentor_storage
            .get(&StoredPrincipal(id))
            .map(|mentor_internal| mentor_internal.0.profile.clone())
    })
}

#[update(guard = "is_user_anonymous")]
pub async fn update_mentor(updated_profile: MentorProfile) -> String {
    let caller = ic_cdk::caller();

    let already_registered =
        read_state(|state| state.mentor_storage.contains_key(&StoredPrincipal(caller)));

    if !already_registered {
        ic_cdk::println!("This Principal is not registered");
        return "This Principal is not registered.".to_string();
    }

    let mut user_data = get_user_information_internal(caller);

    let temp_image = user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    
    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        user_data.profile_picture = Some((full_url).as_bytes().to_vec());
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

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset, )).await.unwrap();

        let (_result,): ((),) = call(canister_id, "store", (arg, )).await.unwrap();

        user_data.profile_picture = Some((canister_id.to_string()+&key).as_bytes().to_vec());
    }

    let update_result = mutate_state(|state| {
        if let Some(mut mentor_internal) = state.mentor_storage.get(&StoredPrincipal(caller)) {
                mentor_internal.0.profile.preferred_icp_hub = updated_profile.preferred_icp_hub.clone()
                    .or(mentor_internal.0.profile.preferred_icp_hub.clone());
                mentor_internal.0.profile.multichain = updated_profile.multichain.clone()
                    .or(mentor_internal.0.profile.multichain.clone());
                mentor_internal.0.profile.existing_icp_project_porfolio = updated_profile.existing_icp_project_porfolio.clone()
                    .or(mentor_internal.0.profile.existing_icp_project_porfolio.clone());
                mentor_internal.0.profile.area_of_expertise = updated_profile.area_of_expertise.clone();
                mentor_internal.0.profile.category_of_mentoring_service = updated_profile.category_of_mentoring_service.clone();
                mentor_internal.0.profile.existing_icp_mentor = updated_profile.existing_icp_mentor;
                mentor_internal.0.profile.icp_hub_or_spoke = updated_profile.icp_hub_or_spoke;
                mentor_internal.0.profile.links = updated_profile.links.clone();
                mentor_internal.0.profile.website = updated_profile.website.clone();
                mentor_internal.0.profile.years_of_mentoring = updated_profile.years_of_mentoring.clone();
                mentor_internal.0.profile.reason_for_joining = updated_profile.reason_for_joining.clone();
                mentor_internal.0.profile.hub_owner = updated_profile.hub_owner.clone()
                    .or(mentor_internal.0.profile.hub_owner.clone());

            state.mentor_storage.insert(StoredPrincipal(caller), mentor_internal);
            Ok("Mentor profile for has been approved and updated.")
        } else {
            Err("Mentor profile not found in storage.")
        }
    });

    match update_result {
        Ok(message) => {
            message.to_string()
        },
        Err(error) => format!("Error processing request: {}", error),
    }
}

pub fn delete_mentor() -> String {
    let caller = ic_cdk::caller();

    let removed = mutate_state(|state| {
        state
            .mentor_storage
            .remove(&StoredPrincipal(caller))
            .is_some()
    });

    if removed {
        "Mentor profile deleted successfully.".to_string()
    } else {
        "Mentor profile not found.".to_string()
    }
}

#[query(guard = "is_user_anonymous")]
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

#[derive(CandidType, Clone)]
pub struct ListAllMentors {
    principal: StoredPrincipal,
    params: MentorInternal,
}

#[query]
pub fn get_top_three_mentors() -> Vec<ListAllMentors> {
    let mentor_snapshot = read_state(|state| {
        state.mentor_storage.iter().map(|(principal, vc_info)| {
            (principal, vc_info.0.clone())
        }).collect::<Vec<_>>()
    });

    let mut list_all_mentor: Vec<ListAllMentors> = Vec::new();

    for (stored_principal, mentor_info) in mentor_snapshot {
        if mentor_info.active {
            let vc_info_struct = ListAllMentors {
                principal: stored_principal,
                params: mentor_info, 
            };
            list_all_mentor.push(vc_info_struct);
        }
    }
    // Return only the top 3 venture capitalists
    list_all_mentor.into_iter().take(3).collect()
}



#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParamMentor {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationReturnMentor {
    pub data: HashMap<Principal, MentorWithRoles>,
    pub user_data: HashMap<Principal, UserInformation>,
    pub count: u64,
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_mentors_with_pagination(
    pagination_params: PaginationParamMentor,
) -> PaginationReturnMentor {
    let (mentor_keys, paginated_mentor_map, total_count) = read_state(|state| {
        let start = (pagination_params.page - 1) * pagination_params.page_size;

        let mentors_snapshot: Vec<Principal> = state.mentor_storage.iter()
            .filter(|(_, mentor_info)| mentor_info.0.active)
            .skip(start)
            .take(pagination_params.page_size)
            .map(|(stored_principal, _)| stored_principal.0.clone())
            .collect();

        let paginated_mentor_map: HashMap<Principal, MentorWithRoles> = mentors_snapshot.iter()
            .map(|principal| {
                let roles = get_roles_for_principal(*principal);
                let mentor_info = state.mentor_storage.get(&StoredPrincipal(*principal)).unwrap().0.clone();
                (*principal, MentorWithRoles {
                    mentor_profile: mentor_info,
                    roles,
                })
            })
            .collect();

        let total_count = state.mentor_storage.len() as u64;

        (mentors_snapshot, paginated_mentor_map, total_count)
    });

    let user_data: HashMap<Principal, UserInformation> = mentor_keys.iter()
        .map(|principal| {
            let user_info = get_user_information_internal(*principal);
            (*principal, user_info)
        })
        .collect();

    PaginationReturnMentor {
        data: paginated_mentor_map,
        user_data,
        count: total_count,
    }
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

//for testing purpose
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

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorFilterCriteria {
    pub country: Option<String>,
    pub area_of_expertise: Option<String>,
}

#[query(guard = "is_user_anonymous")]
pub fn filter_mentors(criteria: MentorFilterCriteria) -> Vec<MentorProfile> {
    read_state(|state| {
        state
            .mentor_storage
            .iter()
            .filter(|(_, mentor_internal)| {
                // let country_match = match &criteria.country {
                //     Some(c) => &mentor_internal.0.profile.user_data.country == c,
                //     None => true,
                // };

                let expertise_match = criteria.area_of_expertise.as_ref().map_or(true, |exp| {
                    &mentor_internal.0.profile.area_of_expertise == exp
                });

                mentor_internal.0.active
                    && mentor_internal.0.approve
                    && !mentor_internal.0.decline
                    && expertise_match
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
