use crate::state_handler::*;
use crate::mentor_module::mentor_types::*;
use candid::Principal;
use ic_cdk::api::caller;
use ic_cdk::api::time;
use ic_cdk_macros::update;
use sha2::{Digest, Sha256};
use crate::guard::*;
use crate::user_modules::get_user::*;

#[update(guard = "combined_guard")]
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

    let already_registered =
        read_state(|state| state.mentor_storage.contains_key(&StoredPrincipal(caller)));
    if already_registered {
        ic_cdk::println!("This Principal is already registered");
        return "You are a Mentor Already".to_string();
    }

    match profile.validate() {
        Ok(_) => {
            let random_bytes = ic_cdk::api::management_canister::main::raw_rand()
                .await
                .expect("Failed to generate random bytes")
                .0;

            let uid = format!("{:x}", Sha256::digest(&random_bytes));

            let mut mentor_internal = MentorInternal {
                profile: profile.clone(),
                uid,
                active: true,
                approve: false,
                decline: false,
                profile_completion: 0
            };
            mentor_internal.update_completion_percentage();

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

#[update(guard = "combined_guard")]
pub async fn update_mentor(updated_profile: MentorProfile) -> String {
    let caller = ic_cdk::caller();

    let already_registered =
        read_state(|state| state.mentor_storage.contains_key(&StoredPrincipal(caller)));

    if !already_registered {
        ic_cdk::println!("This Principal is not registered");
        return "This Principal is not registered.".to_string();
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

#[update(guard = "combined_guard")]
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

#[update(guard = "combined_guard")]
pub fn make_active_inactive_mentor(p_id: Principal) -> String {
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

