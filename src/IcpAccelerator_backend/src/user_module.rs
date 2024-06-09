use crate::default_images::*;
use crate::mentor::MENTOR_REGISTRY;
use crate::project_registration::APPLICATION_FORM;
use crate::state_handler::{mutate_state, StoredPrincipal, Candid, read_state};
use crate::vc_registration::VENTURECAPITALIST_STORAGE;
use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use ic_cdk::api::call::call;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::Read;
// use ic_cdk::storage;
use ic_cdk::storage::{self, stable_restore, stable_save};
use ic_certified_assets::{types::Key};
use serde_bytes::ByteBuf;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct UserInformation {
    pub full_name: String,
    pub profile_picture: Option<Vec<u8>>,
    pub email: Option<String>,
    pub country: String,
    pub telegram_id: Option<String>,
    pub bio: Option<String>,
    pub area_of_interest: String,
    pub twitter_id: Option<String>,
    pub openchat_username: Option<String>,
    pub type_of_profile: Option<String>,
    pub reason_to_join : Option<Vec<String>>
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

#[derive(CandidType, Clone, Serialize, Deserialize, Debug)]
pub struct Role {
    pub name: String,
    pub status: String,
    pub requested_on: Option<u64>,
    pub approved_on: Option<u64>,
    pub rejected_on: Option<u64>,
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

pub type UserInfoStorage = HashMap<Principal, UserInfoInternal>;

pub type UserTestimonial = HashMap<Principal, Vec<Testimonial>>;
pub type UserRating = HashMap<Principal, Vec<Review>>;

thread_local! {
    pub static USER_STORAGE: RefCell<UserInfoStorage> = RefCell::new(UserInfoStorage::new());
    pub static ROLE_STATUS_ARRAY : RefCell<HashMap<Principal, Vec<Role>>> = RefCell::new(HashMap::new());
    pub static USER_TESTIMONIAL : RefCell<UserTestimonial> = RefCell::new(UserTestimonial::new());
    pub static USER_RATING : RefCell<UserRating> = RefCell::new(UserRating::new());
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

pub async fn register_user_role(info: UserInformation) -> std::string::String {
    initialize_roles();

    // if info.full_name.trim().is_empty()
    //     || info
    //         .email
    //         .as_ref()
    //         .map_or(true, |email| email.trim().is_empty())
    // {
    //     return "Please provide input for required fields: full_name and email.".to_string();
    // }

    

    let caller = caller();
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let canister_id = crate::asset_manager::get_asset_canister();
    let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
    let key = "/uploads/".to_owned()+&caller.to_string()+"_user.jpeg";

    fn default_profile_picture(full_url: &str) -> Vec<u8> {
        // base64::decode(DEFAULT_USER_AVATAR_BASE64).expect("Failed to decode base64 image")
        full_url.as_bytes().to_vec()
    }

    let mut info_with_default = info.clone();

    if info_with_default.profile_picture.is_none() {
        info_with_default.profile_picture = Some(default_profile_picture(&full_url));
    }else{
        let arg = StoreArg{
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(info_with_default.profile_picture.clone().unwrap()),
            sha256: None,
        };
        let (result,): ((),) = call(canister_id, "store", (arg, )).await.unwrap();
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

        if let Some(mut role_status_vec_candid) = role_status.get(&StoredPrincipal(caller)) {
            let mut role_status_vec = role_status_vec_candid.0;
            for role in role_status_vec.iter_mut() {
                if role.name == "user" {
                    role.status = "active".to_string();
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
    format!("User registered successfully with ID: {}", new_id)
}

// #[query]
// pub fn get_role_status() -> Vec<Role> {
//     ROLE_STATUS_ARRAY.with(|r| r.borrow().get(&caller()).expect("couldn't get role status array").clone())
// }

// #[query]
// pub fn get_role_status() -> Vec<Role> {
//     ROLE_STATUS_ARRAY.with(|r|{

//         if !r.contains_key(&caller()){
//             return vec![Role]
//         }else{
//             r.borrow().get(&caller()).expect("couldn't get role status array").clone();
//         }

//     }

//  )
// }

pub async fn update_data_for_roles(principal_id: Principal, user_data: UserInformation) -> Result<(), String> {
    let roles = get_roles_for_principal(principal_id);
    for role in roles {
        match role.name.as_str() {
            "user" => update_user_data(principal_id, user_data.clone()).await?,
            "project" => update_project_data(principal_id, user_data.clone()).await?,
            "mentor" => update_mentor_data(principal_id, user_data.clone()).await?,
            "vc" => update_vc_data(principal_id, user_data.clone()).await?,
            _ => (),
        }
    }
    Ok(())
}
#[update]
async fn update_user_data(user_id: Principal, user_data: UserInformation) -> Result<(), String> {
    mutate_state(|state| {
        if let Some(Candid(mut user_info_internal)) = state.user_storage.get(&StoredPrincipal(user_id)) {
            user_info_internal.params = user_data;
            state.user_storage.insert(StoredPrincipal(user_id), Candid(user_info_internal));
            Ok(())
        } else {
            Err("User not found. Please register before updating.".to_string())
        }
    })
}

async fn update_project_data(principal: Principal, user_data: UserInformation) -> Result<(), String> {
    APPLICATION_FORM.with(|app_form| {
        let mut app_form = app_form.borrow_mut();
        if let Some(projects) = app_form.get_mut(&principal) {
            for project in projects.iter_mut() {
                project.params.user_data = user_data.clone();
            }
            Ok(())
        } else {
            Err("No project found for the specified project ID.".to_string())
        }
    })
}

async fn update_mentor_data(user_id: Principal, user_data: UserInformation) -> Result<(), String> {
    MENTOR_REGISTRY.with(|registry| {
        let mut registry = registry.borrow_mut();
        if let Some(mentor) = registry.get_mut(&user_id) {
            mentor.profile.user_data = user_data;
            Ok(())
        } else {
            Err("No mentor found for the specified ID.".to_string())
        }
    })
}

async fn update_vc_data(user_id: Principal, user_data: UserInformation) -> Result<(), String> {
    VENTURECAPITALIST_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(vc) = storage.get_mut(&user_id) {
            vc.params.user_data = user_data;
            Ok(())
        } else {
            Err("No venture capitalist found for the specified ID.".to_string())
        }
    })
}

#[query]
pub fn get_roles_for_principal(principal_id: Principal) -> Vec<Role> {
    read_state(|state| {
        if let Some(Candid(role_status)) = state.role_status.get(&StoredPrincipal(principal_id)) {
            role_status.clone()
        } else {
            vec![
                Role {
                    name: "user".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
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
            ]
        }
    })
}

#[query]
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
            ]
        }
    })
}

// #[update]
// pub fn switch_role(role : String, status: String){
//     ROLE_STATUS_ARRAY.with(|status_arr|{
//         let mut status_arr = status_arr.borrow_mut();
//         let status_vec = status_arr.get(&caller()).expect("unable to get a role status for this principal");

//         if status == "active" {
//             for
//         }

//     });
// }

#[update]
pub fn switch_role(role_to_switch: String, new_status: String) {
    mutate_state(|state| {
        let caller_id = StoredPrincipal(caller());
        let roles_opt = state.role_status.get(&caller_id);

        if let Some(mut roles) = roles_opt {
            if new_status == "active" {
                let mut active_role_index = None;
                let mut approved_role_index = None;

                // Find indices of the active role and the role to be switched if approved
                for (index, role) in roles.0.iter().enumerate() {
                    if role.status == "active" {
                        active_role_index = Some(index);
                    }
                    if role.name == role_to_switch && role.status == "approved" {
                        approved_role_index = Some(index);
                    }
                }

                if let Some(approved_index) = approved_role_index {
                    // Set the approved role to active
                    roles.0[approved_index].status = "active".to_string();

                    if let Some(active_index) = active_role_index {
                        // Change the previously active role to approved
                        roles.0[active_index].status = "approved".to_string();
                    }
                } else {
                    ic_cdk::println!("The role to switch is not approved or doesn't exist.");
                }
            } else {
                ic_cdk::println!("Only roles with 'approved' status can be set to 'active'");
            }
        } else {
            // Insert default roles if the user does not have any roles
            state.role_status.insert(caller_id.clone(), Candid(vec![
                Role {
                    name: "user".to_string(),
                    status: "default".to_string(),
                    requested_on: None,
                    approved_on: None,
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
            ]));
        }
    });
}

// pub fn switch_role(role: String, new_status: String) {
//     ROLE_STATUS_ARRAY.with(|status_arr| {
//         let mut status_arr = status_arr.borrow_mut();
//         let status_vec = status_arr.get_mut(&caller()).expect("unable to get a role status for this principal");

//         // Only proceed if the new status is "active"
//         if new_status == "active" {
//             // Check if the specified role is currently "approved"
//             if let Some(role_to_update) = status_vec.iter_mut().find(|r| r.name == role && r.status == "approved") {
//                 // First, set any currently "active" roles to "approved"
//                 for role_status in status_vec.iter_mut() {
//                     if role_status.status == "active" {
//                         role_status.status = "approved".to_string();
//                     }
//                 }

//                 // Then, set the specified "approved" role to "active"
//                 // This is done in a separate loop to avoid borrowing issues
//                 for role_status in status_vec.iter_mut() {
//                     if role_status.name == role_to_update.name {
//                         role_status.status = "active".to_string();
//                         break; // Break after updating the status to avoid unnecessary iterations
//                     }
//                 }
//             }
//         } else {
//             // For statuses other than "active", directly update the role's status without the "approved" precondition
//             // if let Some(role_to_update) = status_vec.iter_mut().find(|r| r.name == role) {
//             //     role_to_update.status = new_status;
//             // }
//         }
//     });
// }

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

#[query]
pub fn get_user_info_struct() -> Option<UserInformation> {
    let caller = StoredPrincipal(caller());

    read_state(|state| {
        state
            .user_storage
            .get(&caller)
            .map(|user_internal| user_internal.0.params.clone())
    })
}

#[query]
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

#[query]
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

#[derive(CandidType, Deserialize)]
pub struct PaginationUser {
    page: usize,
    page_size: usize,
}

#[query]
pub fn list_all_users(pagination: PaginationUser) -> Vec<UserInformation> {
    read_state(|state| {
        let user_storage = &state.user_storage;
        let users_info: Vec<_> = user_storage
            .iter()
            .map(|(_, candid_user_internal)| candid_user_internal.0.params.clone())
            .collect();

        // Calculate the range to slice the vector for pagination
        let start = pagination.page.saturating_sub(1) * pagination.page_size;
        let end = std::cmp::min(start + pagination.page_size, users_info.len());

        // Return the slice of users for the current page
        users_info[start..end].to_vec()
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

pub async fn update_user(info: UserInformation) -> std::string::String {
    let caller = caller();

    if info.full_name.trim().is_empty()
        || info
            .email
            .as_ref()
            .map_or(true, |email| email.trim().is_empty())
    {
        return "Please provide input for required fields: full_name and email.".to_string();
    }

    let mut result = "User not found. Please register before updating.".to_string();

    mutate_state(|state| {
        if let Some(mut user_info_internal) = state.user_storage.get(&StoredPrincipal(caller)) {
            user_info_internal.0.params = info;
            result = "User information updated successfully.".to_string();
        }
    });

    result
}


// pub fn pre_upgrade_user_modules() {
//     USER_STORAGE.with(|user_storage| {
//         ROLE_STATUS_ARRAY.with(|role_status_array| {
//             storage::stable_save((user_storage.borrow().clone(), role_status_array.borrow().clone()))
//                 .expect("Failed to save to stable storage");
//         });
//     });
// }

// pub fn pre_upgrade_user_modules() {
//     USER_STORAGE.with(|user_storage| {
//         ROLE_STATUS_ARRAY.with(|role_status_array| {
//             match stable_save((
//                 user_storage.borrow().clone(),
//                 role_status_array.borrow().clone(),
//             )) {
//                 Ok(_) => ic_cdk::println!("User modules saved successfully."),
//                 Err(e) => ic_cdk::println!("{}", format!("Failed to save user modules: {:?}", e)),
//             }
//         });
//     });
// }

// pub fn post_upgrade_user_modules() {
//     match stable_restore() {
//         Ok((restored_user_storage, restored_role_status_array)) => {
//             USER_STORAGE.with(|user_storage_ref| {
//                 *user_storage_ref.borrow_mut() = restored_user_storage;
//             });
//             ROLE_STATUS_ARRAY.with(|role_status_array_ref| {
//                 *role_status_array_ref.borrow_mut() = restored_role_status_array;
//             });
//             ic_cdk::println!("User modules restored successfully.");
//         }
//         Err(e) => ic_cdk::println!("{}", format!("Failed to restore user modules: {:?}", e)),
//     }
// }

// pub fn post_upgrade_user_modules() {
//     let (restored_user_storage, restored_role_status_array):
//         (HashMap<Principal, UserInfoInternal>, HashMap<Principal, Vec<Role>>) =
//         storage::stable_restore().expect("Failed to restore from stable storage");

//     USER_STORAGE.with(|user_storage_ref| {
//         *user_storage_ref.borrow_mut() = restored_user_storage;
//     });
//     ROLE_STATUS_ARRAY.with(|role_status_array_ref| {
//         *role_status_array_ref.borrow_mut() = restored_role_status_array;
//     });
// }

pub fn get_user_info_by_principal(caller: Principal) -> Result<UserInformation, &'static str> {
    read_state(|state| {
        state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|user_internal| user_internal.0.params.clone())
            .ok_or("User not Found")
    })
}

#[query]
pub fn get_user_info_using_principal(caller: Principal) -> Option<UserInfoInternal> {
    read_state(|state| {
        state.user_storage.get(&StoredPrincipal(caller)).map(|candid| candid.0.clone())
    })
}

#[update]
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
                    state.user_testimonial.insert(StoredPrincipal(principal_id), Candid(Vec::new()));
                    state.user_testimonial.get(&StoredPrincipal(principal_id)).unwrap()
                });
            testimonial_list.0.push(testimony);
        });

        "Testimony added".to_string()
    } else {
        "User not found".to_string()
    }
}


#[query]
fn get_testimonials(principal_id: Principal) -> Result<Vec<Testimonial>, &'static str> {
    read_state(|state| {
        state
            .user_testimonial
            .get(&StoredPrincipal(principal_id))
            .map(|testimonials| testimonials.0.clone())
            .ok_or("No testimonials found for the given user.")
    })
}

// #[query]
// fn get_latest_testimonials(principal_id: Principal) -> Result<Vec<Testimonial>, &'static str>{
//     USER_TESTIMONIAL.with(|registry| {
//         let registry = registry.borrow();
//         if let Some(testimonials) = registry.get(&principal_id) {
//             let mut sorted_testimonials = testimonials.clone();
//             sorted_testimonials.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
//             Ok(sorted_testimonials)
//         } else {
//             Err("No testimonials found for the given user.")
//         }
//     })
// }

#[query]
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

#[query]
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

#[update]
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
                state.user_rating.insert(principal_id_stored, Candid(vec![review]));
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

#[query]
pub fn type_of_user_profile() -> Vec<UserType> {

    vec![UserType {
        id: 1,
        role_type: "Individual".to_string(),
    },UserType{
        id :2,
        role_type : "DAO".to_string()
    },UserType{
        id :2,
        role_type : "Company".to_string()
    }
    ]
}
