use crate::state_handler::*;
use crate::user_modules::user_types::*;
use crate::types::individual_types::*;
use crate::user_modules::get_user::*;
use crate::guard::*;
use ic_cdk_macros::*;
use candid::Principal;
use ic_cdk::api::call::call;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::time;
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};

pub fn initialize_roles() {
    let caller = caller();

    //ic_cdk::println!("inside initialize func ");

    let initial_roles = vec![
        Role {
            name: "user".to_string(),
            status: "default".to_string(),
            requested_on: None,
            approved_on: Some(time()),
            rejected_on: None,
            approval_status: Some("default".to_string()),
        },
        Role {
            name: "project".to_string(),
            status: "default".to_string(),
            requested_on: None,
            approved_on: None,
            rejected_on: None,
            approval_status: Some("default".to_string()),
        },
        Role {
            name: "mentor".to_string(),
            status: "default".to_string(),
            requested_on: None,
            approved_on: None,
            rejected_on: None,
            approval_status: Some("default".to_string()),
        },
        Role {
            name: "vc".to_string(),
            status: "default".to_string(),
            requested_on: None,
            approved_on: None,
            rejected_on: None,
            approval_status: Some("default".to_string()),
        },
    ];

    mutate_state(|state| {
        let stored_principal = StoredPrincipal(caller);
        let role_status = &mut state.role_status;

        if role_status.contains_key(&stored_principal) {
            // Role status is already assigned, do nothing
            ic_cdk::println!("Role status is already assigned for the caller.");
        } else {
            role_status.insert(stored_principal, Candid(initial_roles));
            ic_cdk::println!("Default roles are assigned to the caller.");
        }
    });
}

fn record_measurement(measurement: u64) {
    ic_cdk::println!("Instructions used: {}", measurement);
}

#[update(guard = "is_user_anonymous")]
pub async fn register_user(captcha_id: String, captcha_input: String, info: UserInformation) -> Result<std::string::String, std::string::String> {
    if !verify_captcha(captcha_id, captcha_input) {
        return Err::<std::string::String, std::string::String>("CAPTCHA verification failed.".to_string());
    }
    let start = ic_cdk::api::instruction_counter();
    initialize_roles();

    let caller = caller();
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let canister_id = crate::asset_manager::get_asset_canister();
    let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
    let key = "/uploads/".to_owned() + &caller.to_string() + "_user.jpeg";

    fn default_profile_picture(full_url: &str) -> Vec<u8> {
        // base64::decode(DEFAULT_USER_AVATAR_BASE64).expect("Failed to decode base64 image")
        full_url.as_bytes().to_vec()
    }

    let mut info_with_default = info.clone();

    if info_with_default.profile_picture.is_none() {
        info_with_default.profile_picture = Some(default_profile_picture(&full_url));
    } else {
        let arg = StoreArg {
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(info_with_default.profile_picture.clone().unwrap()),
            sha256: None,
        };
        let delete_asset = DeleteAsset {
            key: key.clone()
        };
        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset, )).await.unwrap();
        let (_result,): ((),) = call(canister_id, "store", (arg, )).await.unwrap();
        info_with_default.profile_picture = Some((canister_id.to_string()+&key).as_bytes().to_vec());
    }

    //convert_to_lowercase
    info_with_default.type_of_profile = info_with_default.type_of_profile.map(|s| s.to_lowercase());

    let mut user_info_internal = UserInfoInternal {
        uid: new_id.clone(),
        params: info_with_default,
        is_active: true,
        joining_date: time(),
        profile_completion: 0, 
    };
    user_info_internal.update_completion_percentage();

    let user_added = mutate_state(|state| {
        let user_storage = &mut state.user_storage;
        if user_storage.contains_key(&StoredPrincipal(caller)) {
            false
        } else {
            user_storage.insert(StoredPrincipal(caller), Candid(user_info_internal));
            true
        }
    });

    if !user_added {
        return Err("User with this Principal ID already exists".to_string());
    }

    mutate_state(|state| {
        let role_status = &mut state.role_status;

        if let Some(role_status_vec_candid) = role_status.get(&StoredPrincipal(caller)) {
            let mut role_status_vec = role_status_vec_candid.0;
            for role in role_status_vec.iter_mut() {
                if role.name == "user" {
                    role.status = "active".to_string();
                    role.approval_status = Some("approved".to_string());
                    role.requested_on = Some(time());
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
                    approval_status: Some("default".to_string()),
                },
                Role {
                    name: "project".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                    approval_status: Some("default".to_string()),
                },
                Role {
                    name: "mentor".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                    approval_status: Some("default".to_string()),
                },
                Role {
                    name: "vc".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
                    rejected_on: None,
                    approval_status: Some("default".to_string()),
                },
            ];
            role_status.insert(StoredPrincipal(caller), Candid(initial_roles));
        }
    });
    let end = ic_cdk::api::instruction_counter();  
    record_measurement(end - start);  
    Ok(format!("User registered successfully with ID: {}", new_id))
}

#[update(guard = "combined_guard")]
async fn update_user_data(user_id: Principal, mut user_data: UserInformation) -> Result<(), String> {
    let temp_image = user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();
    
    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        user_data.profile_picture = Some((full_url).as_bytes().to_vec());
    }
    else if temp_image.clone().unwrap().len() < 300 {
        ic_cdk::println!("Profile image is already uploaded");
    }else{
        
        let key = "/uploads/".to_owned()+&user_id.to_string()+"_user.jpeg";
        
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
    mutate_state(|state| {
        if let Some(Candid(mut user_info_internal)) =
            state.user_storage.get(&StoredPrincipal(user_id))
        {
            user_info_internal.params = user_data;
            state
                .user_storage
                .insert(StoredPrincipal(user_id), Candid(user_info_internal));
            Ok(())
        } else {
            Err("User not found. Please register before updating.".to_string())
        }
    })
}

#[update(guard = "combined_guard")]
pub fn switch_role(role_to_switch: String, new_status: String){
    let caller_id = StoredPrincipal(caller());

    mutate_state(|state| {
        if let Some(mut roles_candid) = state.role_status.get(&caller_id) {
            let mut active_role_index = None;
            let mut role_to_update_index = None;

            // Find the indices of the roles to update
            for (index, role) in roles_candid.0.iter().enumerate() {
                if role.status == "active" {
                    active_role_index = Some(index);
                }
                if role.name == role_to_switch {
                    role_to_update_index = Some(index);
                }
            }

            // Update the statuses
            if let Some(index) = active_role_index {
                roles_candid.0[index].status = "approved".to_string();
            }
            if let Some(index) = role_to_update_index {
                roles_candid.0[index].status = new_status.clone();
            }

            state.role_status.insert(caller_id.clone(), roles_candid.clone());

        } else {
            println!("Principal not found: {}", caller_id.0);
        }
    });
}

#[update(guard = "combined_guard")]
pub fn make_user_inactive() -> std::string::String {
    let caller = caller();

    mutate_state(|state| {
        let user_storage = &mut state.user_storage;
        if let Some(mut founder) = user_storage.get(&StoredPrincipal(caller)) {
            founder.0.is_active = false;
            format!("User deactivated for caller: {:?}", caller.to_string())
        } else {
            format!(
                "User is not Registered For This Principal: {:?}",
                caller.to_string()
            )
        }
    })
}

#[update(guard = "combined_guard")]
fn add_testimonial(message: String) -> String {
    let principal_id = caller();

    if let Some(user_info) = get_user_info_for_testimonial() {
        let testimony = Testimonial {
            name: user_info.full_name,
            profile_pic: user_info.profile_picture.unwrap_or_else(Vec::new),
            timestamp: time(),
            message,
        };

        mutate_state(|state| {
            let mut testimonial_list = state
                .user_testimonial
                .get(&StoredPrincipal(principal_id))
                .unwrap_or_else(|| {
                    state
                        .user_testimonial
                        .insert(StoredPrincipal(principal_id), Candid(Vec::new()));
                    state
                        .user_testimonial
                        .get(&StoredPrincipal(principal_id))
                        .unwrap()
                });
            testimonial_list.0.push(testimony);
        });

        "Testimony added".to_string()
    } else {
        "User not found".to_string()
    }
}

#[update(guard = "combined_guard")]
fn add_review(rating: f32, message: String) -> String {
    let principal_id = ic_cdk::caller();
    let principal_id_stored = StoredPrincipal(principal_id);

    let user_data = match read_state(|state| state.user_storage.get(&principal_id_stored)) {
        Some(user_info) => user_info.0,
        None => return "User not found".to_string(),
    };

    let profile_picture = match user_data.params.profile_picture {
        Some(picture) => picture,
        None => return "Profile picture not found".to_string(),
    };

    let review = match Review::new(user_data.params.full_name, profile_picture, message, rating) {
        Ok(review) => review,
        Err(e) => return format!("Error creating review: {}", e),
    };

    mutate_state(|state| {
        let user_ratings = state.user_rating.get(&principal_id_stored);
        match user_ratings {
            Some(mut ratings) => ratings.0.push(review),
            None => {
                state
                    .user_rating
                    .insert(principal_id_stored, Candid(vec![review]));
            }
        }
    });

    "Rating added".to_string()
}
