use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk_macros::{query, update};
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

pub type UserInfoStorage = HashMap<Principal, UserInfoInternal>;

thread_local! {
    pub static USER_STORAGE: RefCell<UserInfoStorage> = RefCell::new(UserInfoStorage::new());
}

pub async fn register_user_role(info: UserInformation) -> std::string::String {
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
    format!("User registered successfully with ID: {}", new_id)
}

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
