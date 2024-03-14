use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct UserInformation {
    pub full_name: String,
    pub profile_picture: Option<Vec<u8>>,
    pub email: Option<String>,
    pub country: String,
    pub telegram_id: Option<String>,
    pub bio: Option<String>,
    pub area_of_intrest: String,
    pub twitter_id: Option<String>,
    pub openchat_username: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct UserInfoInternal {
    pub uid: String,
    pub params: UserInformation,
    pub is_active: bool,
}

#[derive(CandidType, Clone)]
pub struct Role {
    pub name: String,
    pub status: String,
    pub requested_on: Option<u64>,
    pub approved_on: Option<u64>,
    pub rejected_on: Option<u64>,
}

#[derive(CandidType, Clone)]
pub struct RegisterResponse {
    id: String,
    roles_array_status: Vec<Role>,
}

pub type UserInfoStorage = HashMap<Principal, UserInfoInternal>;

thread_local! {
    pub static USER_STORAGE: RefCell<UserInfoStorage> = RefCell::new(UserInfoStorage::new());
    pub static ROLE_STATUS_ARRAY : RefCell<HashMap<Principal, Vec<Role>>> = RefCell::new(HashMap::new());
}

pub fn initialize_roles() {
    let caller = caller();

    ic_cdk::println!("inside initialize func ");

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

    ROLE_STATUS_ARRAY.with(|roles_arr| {
        let mut arr = roles_arr.borrow_mut();
        if arr.contains_key(&caller) {
            ic_cdk::println!("role status is already assigned")
        } else {
            arr.insert(caller, initial_roles);
            ic_cdk::println!("default role are assigned")
        }
    })
}

pub async fn register_user_role(info: UserInformation) -> std::string::String {
    initialize_roles();

    if info.full_name.trim().is_empty()
        || info
            .email
            .as_ref()
            .map_or(true, |email| email.trim().is_empty())
    {
        return "Please provide input for required fields: full_name and email.".to_string();
    }

    let caller = caller();
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    let user_info_internal = UserInfoInternal {
        uid: new_id.clone(),
        params: info,
        is_active: true,
    };

    USER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if storage.contains_key(&caller) {
            format!("User with this Principal ID already exists");
        } else {
            storage.insert(caller, user_info_internal);
        }
    });

    ROLE_STATUS_ARRAY.with(|role_status| {
        let mut role_status = role_status.borrow_mut();

        let role_status_opt_vec = role_status.get_mut(&caller);

        let role_status_vec = role_status_opt_vec.expect("couldn't get role_status_vector");

        for role in role_status_vec.iter_mut() {
            if role.name == "user" {
                role.status = "active".to_string();
                break;
            }
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

#[query]
pub fn get_role_status() -> Vec<Role> {
    ROLE_STATUS_ARRAY.with(|r| {
        let role_status_map = r.borrow();

        if let Some(role_status) = role_status_map.get(&caller()) {
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
    ROLE_STATUS_ARRAY.with(|status_arr| {
        let mut status_arr = status_arr.borrow_mut();
        let caller_id = caller();
        let roles = status_arr.entry(caller_id).or_insert_with(Vec::new);

        if new_status == "active" {
            let mut active_role_index = None;
            let mut approved_role_index = None;

            // Find indices of the active role and the role to be switched if approved
            for (index, role) in roles.iter().enumerate() {
                if role.status == "active" {
                    active_role_index = Some(index);
                }
                if role.name == role_to_switch && role.status == "approved" {
                    approved_role_index = Some(index);
                }
            }

            if let Some(approved_index) = approved_role_index {
                // Set the approved role to active
                roles[approved_index].status = "active".to_string();

                if let Some(active_index) = active_role_index {
                    // Change the previously active role to approved
                    roles[active_index].status = "approved".to_string();
                }
            } else {
                ic_cdk::println!("The role to switch is not approved or doesn't exist.");
            }
        } else {
            ic_cdk::println!("Only roles with 'approved' status can be set to 'active'");
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
    let caller = caller();

    USER_STORAGE.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|user_internal| user_internal.params.clone())
            .ok_or("You have to Register Yourself First.")
    })
}

#[query]
pub fn get_user_info_struct() -> Option<UserInformation> {
    let caller = caller();
    USER_STORAGE.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|user_internal| user_internal.params.clone())
    })
}

pub fn list_all_users() -> Vec<UserInformation> {
    USER_STORAGE.with(|storage| {
        storage
            .borrow()
            .values()
            .map(|user_internal| user_internal.params.clone())
            .collect()
    })
}

pub fn delete_user() -> std::string::String {
    let caller = caller();
    USER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(founder) = storage.get_mut(&caller) {
            founder.is_active = false;
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
    USER_STORAGE.with(|storage| {
        for user_info_internal in storage.borrow().values() {
            if user_info_internal.uid == uid {
                return Ok(user_info_internal.params.clone());
            }
        }
        Err("No user found with the given ID.")
    })
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

    USER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();

        if let Some(user_info_internal) = storage.get_mut(&caller) {
            user_info_internal.params = info;
            "User information updated successfully.".to_string()
        } else {
            "User not found. Please register before updating.".to_string()
        }
    })
}
