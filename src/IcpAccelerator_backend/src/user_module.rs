use crate::state_handler::{mutate_state, read_state, Candid, StoredPrincipal};
use candid::{CandidType, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use crate::is_user_anonymous;
use ic_certified_assets::types::Key;
use serde_bytes::ByteBuf;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct UserInformation {
    pub full_name: String,
    pub profile_picture: Option<Vec<u8>>,
    pub email: Option<String>,
    pub country: String,
    pub social_links: Option<Vec<SocialLinks>>,
    pub bio: Option<String>,
    pub area_of_interest: String,
    pub openchat_username: Option<String>,
    pub type_of_profile: Option<String>,
    pub reason_to_join: Option<Vec<String>>,
}
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinks{
    pub link: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct UserInfoInternal {
    pub uid: String,
    pub params: UserInformation,
    pub is_active: bool,
    pub joining_date: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct StoreArg {
    pub key: Key,
    pub content_type: String,
    pub content_encoding: String,
    pub content: ByteBuf,
    pub sha256: Option<ByteBuf>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct DeleteAsset {
    pub key: Key
}

#[derive(CandidType, Clone, Serialize, Deserialize, Debug)]
pub struct Role {
    pub name: String,
    pub status: String,
    pub requested_on: Option<u64>,
    pub approved_on: Option<u64>,
    pub rejected_on: Option<u64>,
    pub approval_status: Option<String>,
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct Testimonial {
    name: String,
    profile_pic: Vec<u8>,
    message: String,
    timestamp: u64,
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct Review {
    name: String,
    profile_pic: Vec<u8>,
    message: String,
    timestamp: u64,
    tag: String,
    rating: f32,
}

impl Review {
    pub fn new(
        name: String,
        profile_pic: Vec<u8>,
        message: String,
        rating: f32,
    ) -> Result<Review, &'static str> {
        if rating < 0.0 || rating > 5.0 {
            return Err("Rating must be between 0.0 and 5.0");
        }

        let rating_int = (rating * 10.0) as i32;

        let tag = match rating_int {
            0..=10 => "Needs Improvement",
            11..=20 => "Fair",
            21..=30 => "Good",
            31..=40 => "Very Good",
            41..=50 => "Excellent",
            _ => "Unknown",
        }
        .to_string();

        Ok(Review {
            name,
            profile_pic,
            message,
            timestamp: time(),
            tag,
            rating,
        })
    }
}

#[derive(CandidType, Clone)]
pub struct RegisterResponse {
    id: String,
    roles_array_status: Vec<Role>,
}

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

fn record_measurement(start:u64, end:u64)->u64{
    start-end
}

pub async fn register_user_role(info: UserInformation) -> std::string::String {
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

    let user_info_internal = UserInfoInternal {
        uid: new_id.clone(),
        params: info_with_default,
        is_active: true,
        joining_date: time(),
    };

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
        return "User with this Principal ID already exists".to_string();
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
    let _result = record_measurement(start,end);
    format!("User registered successfully with ID: {}", new_id)
}


#[update]
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


#[query(guard = "is_user_anonymous")]
pub fn get_roles_for_principal(principal_id: Principal) -> Vec<Role> {
    read_state(|state| {
        if let Some(roles_candid) = state.role_status.get(&StoredPrincipal(principal_id)) {
            println!("Retrieving roles for principal {}: {:?}", principal_id, roles_candid.0);
            roles_candid.0.clone()
        } else {
            vec![
                Role {
                    name: "user".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
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
            ]
        }
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_role_status() -> Vec<Role> {
    read_state(|state| {
        if let Some(Candid(role_status)) = state.role_status.get(&StoredPrincipal(caller())) {
            role_status.clone()
        } else {
            vec![
                Role {
                    name: "user".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
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
            ]
        }
    })
}

#[query]
pub fn get_approved_role_count_for_principal(principal_id: Principal) -> usize {
    get_roles_for_principal(principal_id)
        .into_iter()
        .filter(|role| {
            role.approval_status.as_deref() == Some("approved") && role.name != "user"
        })
        .count()
}

#[update(guard = "is_user_anonymous")]
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


pub fn get_user_info() -> Result<UserInformation, &'static str> {
    let caller = StoredPrincipal(caller());

    read_state(|state| {
        state
            .user_storage
            .get(&caller)
            .map(|user_internal| user_internal.0.params.clone())
            .ok_or("You have to Register Yourself First.")
    })
}

pub fn get_user_info_for_testimonial() -> Option<UserInformation> {
    let caller = StoredPrincipal(caller());

    read_state(|state| {
        state
            .user_storage
            .get(&caller)
            .map(|user_internal| user_internal.0.params.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_user_info_struct() -> Option<UserInformation> {
    let caller = StoredPrincipal(caller());

    read_state(|state| {
        state
            .user_storage
            .get(&caller)
            .map(|user_internal| user_internal.0.params.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_member_id() -> String {
    let caller = StoredPrincipal(caller());

    read_state(|state| {
        state
            .user_storage
            .get(&caller)
            .map(|user_internal| user_internal.0.uid.clone())
            .expect("you are not a user")
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_users_with_all_info() -> UserInfoInternal {
    let caller = StoredPrincipal(caller());

    read_state(|state| {
        state
            .user_storage
            .get(&caller)
            .map(|candid_user_info| candid_user_info.0.clone())
            .expect("couldn't find user information")
    })
}

pub fn get_user_information_internal(caller: Principal) -> UserInformation {
    read_state(|state| {
        state
            .user_storage
            .get(&StoredPrincipal(caller))
            .expect("User not found")
            .0
            .params
            .clone()
    })
}

#[derive(CandidType, Deserialize)]
pub struct PaginationUser {
    page: usize,
    page_size: usize,
}

#[query(guard = "is_user_anonymous")]
pub fn list_all_users(pagination: PaginationUser) -> Vec<UserInformation> {
    read_state(|state| {
        let user_storage = &state.user_storage;
        
        let total_users = user_storage.len();

        let start = pagination.page.saturating_sub(1) * pagination.page_size;
        let end = std::cmp::min(start + pagination.page_size, total_users.try_into().unwrap());

        let users_info: Vec<UserInformation> = user_storage
            .iter()
            .skip(start)  
            .take(end - start)  
            .map(|(_, candid_user_internal)| candid_user_internal.0.params.clone())
            .collect();

        users_info
    })
}


pub fn delete_user() -> std::string::String {
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

pub async fn get_user_info_by_id(uid: String) -> Result<UserInformation, &'static str> {
    let mut user_info = None;

    read_state(|state| {
        for (_, user_info_internal) in state.user_storage.iter() {
            if user_info_internal.0.uid == uid {
                user_info = Some(user_info_internal.0.params.clone());
                break;
            }
        }
    });

    match user_info {
        Some(info) => Ok(info),
        None => Err("No user found with the given ID."),
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_user_info_using_principal(caller: Principal) -> Option<UserInfoInternal> {
    read_state(|state| {
        state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|candid| candid.0.clone())
    })
}

#[update(guard = "is_user_anonymous")]
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

#[query(guard = "is_user_anonymous")]
fn get_testimonials(principal_id: Principal) -> Result<Vec<Testimonial>, &'static str> {
    read_state(|state| {
        state
            .user_testimonial
            .get(&StoredPrincipal(principal_id))
            .map(|testimonials| testimonials.0.clone())
            .ok_or("No testimonials found for the given user.")
    })
}


#[query(guard = "is_user_anonymous")]
fn get_latest_testimonials() -> Vec<Testimonial> {
    read_state(|state| {
        let mut testimonials = Vec::new();
        for (_, candid_testimonials) in state.user_testimonial.iter() {
            let testimonials_vec: Vec<Testimonial> = candid_testimonials.0.clone();
            testimonials.extend(testimonials_vec);
        }
        testimonials
    })
}

#[query(guard = "is_user_anonymous")]
fn get_review(principal_id: Principal) -> Result<Vec<Review>, &'static str> {
    let principal_id_stored = StoredPrincipal(principal_id);
    read_state(|state| {
        if let Some(rating) = state.user_rating.get(&principal_id_stored) {
            Ok(rating.0.clone())
        } else {
            Err("No rating found for the given user.")
        }
    })
}

#[update(guard = "is_user_anonymous")]
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

//new_additions

#[derive(CandidType)]
pub struct UserType {
    pub id: i32,
    pub role_type: String,
}

#[query(guard = "is_user_anonymous")]
pub fn type_of_user_profile() -> Vec<UserType> {
    vec![
        UserType {
            id: 1,
            role_type: "Individual".to_string(),
        },
        UserType {
            id: 2,
            role_type: "DAO".to_string(),
        },
        UserType {
            id: 2,
            role_type: "Company".to_string(),
        },
    ]
}
