use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk_macros::{init, query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct UserInformation{
    pub full_name: String,
    pub profile_picture: Option<Vec<u8>>,
    pub email: Option<String>,
    pub country: String,
    pub telegram_id: Option<String>,
    pub bio: Option<String>,
    pub area_of_intrest: String,
    pub twitter_id: Option<String>,
    pub role: String,
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
}

#[derive(CandidType, Clone)]
pub struct RegisterResponse {
    id: String,
    roles_array_status: Vec<Role>,
}

pub type UserInfoStorage = HashMap<Principal, UserInfoInternal>;

thread_local! {
    pub static USER_STORAGE: RefCell<UserInfoStorage> = RefCell::new(UserInfoStorage::new());
}

#[update]
pub async fn register_user_role(info: UserInformation)->std::string::String{
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

        for role in role_status.iter_mut() {
            if role.name == "user" {
                role.status = "active".to_string();
                break;
            }
        }
    });

    //let roles_array_status = ROLE_STATUS_ARRAY.with(|r| r.borrow().clone());

    format!("User registered successfully with ID: {}", new_id)
    // RegisterResponse {
    //     id: new_id,
    //     roles_array_status,
    // }
}

#[query]
pub fn get_user_info() -> Result<UserInformation, &'static str>  {
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
pub fn list_all_users() -> Vec<UserInformation> {
    USER_STORAGE.with(|storage| {
        storage
            .borrow()
            .values()
            .map(|user_internal| user_internal.params.clone())
            .collect()
    })
}

#[update]
pub fn delete_user()->std::string::String {
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

