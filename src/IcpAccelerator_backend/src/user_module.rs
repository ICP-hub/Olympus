use crate::default_images::*;
use crate::mentor::MENTOR_REGISTRY;
use crate::project_registration::APPLICATION_FORM;
use crate::vc_registration::VENTURECAPITALIST_STORAGE;
use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;
use std::io::Read;
// use ic_cdk::storage;
use ic_cdk::storage::{self, stable_restore, stable_save};

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

#[derive(CandidType, Clone, Serialize, Deserialize)]
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

    ROLE_STATUS_ARRAY.with(|roles_arr| {
        let mut arr = roles_arr.borrow_mut();
        if arr.contains_key(&caller) {
            //ic_cdk::println!("role status is already assigned")
        } else {
            arr.insert(caller, initial_roles);
            //ic_cdk::println!("default role are assigned")
        }
    })
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

    fn default_profile_picture() -> Vec<u8> {
        base64::decode(DEFAULT_USER_AVATAR_BASE64).expect("Failed to decode base64 image")
    }

    let mut info_with_default = info.clone();

    if info_with_default.profile_picture.is_none() {
        info_with_default.profile_picture = Some(default_profile_picture());
    }

    //convert_to_lowercase
    info_with_default.type_of_profile = info_with_default.type_of_profile.map(|s| s.to_lowercase());


    let user_info_internal = UserInfoInternal {
        uid: new_id.clone(),
        params: info_with_default,
        is_active: true,
        joining_date: time(),
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

async fn update_user_data(user_id: Principal, user_data: UserInformation) -> Result<(), String> {
    USER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();

        if let Some(user_info_internal) = storage.get_mut(&user_id) {
            user_info_internal.params = user_data;  
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
    ROLE_STATUS_ARRAY.with(|r| {
        let role_status_map = r.borrow();

        if let Some(role_status) = role_status_map.get(&principal_id) {
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
                // ic_cdk::println!("The role to switch is not approved or doesn't exist.");
            }
        } else {
            // ic_cdk::println!("Only roles with 'approved' status can be set to 'active'");
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

#[query]
pub fn get_member_id() -> String {
    let caller = caller();
    USER_STORAGE.with(|registry| {
        let members = registry.borrow();
        let members: &UserInfoInternal = members.get(&caller).expect("you are not a user");
        members.uid.clone()
    })
}

#[query]
pub fn get_users_with_all_info() -> UserInfoInternal {
    let caller = caller();
    USER_STORAGE.with(|registry| {
        let user_info_ref = registry.borrow();
        let user_all_info = user_info_ref
            .get(&caller)
            .expect("couldn't find user information");
        user_all_info.clone()
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


// pub fn pre_upgrade_user_modules() {
//     USER_STORAGE.with(|user_storage| {
//         ROLE_STATUS_ARRAY.with(|role_status_array| {
//             storage::stable_save((user_storage.borrow().clone(), role_status_array.borrow().clone()))
//                 .expect("Failed to save to stable storage");
//         });
//     });
// }

pub fn pre_upgrade_user_modules() {
    USER_STORAGE.with(|user_storage| {
        ROLE_STATUS_ARRAY.with(|role_status_array| {
            match stable_save((
                user_storage.borrow().clone(),
                role_status_array.borrow().clone(),
            )) {
                Ok(_) => ic_cdk::println!("User modules saved successfully."),
                Err(e) => ic_cdk::println!("{}", format!("Failed to save user modules: {:?}", e)),
            }
        });
    });
}

pub fn post_upgrade_user_modules() {
    match stable_restore() {
        Ok((restored_user_storage, restored_role_status_array)) => {
            USER_STORAGE.with(|user_storage_ref| {
                *user_storage_ref.borrow_mut() = restored_user_storage;
            });
            ROLE_STATUS_ARRAY.with(|role_status_array_ref| {
                *role_status_array_ref.borrow_mut() = restored_role_status_array;
            });
            ic_cdk::println!("User modules restored successfully.");
        }
        Err(e) => ic_cdk::println!("{}", format!("Failed to restore user modules: {:?}", e)),
    }
}

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
    USER_STORAGE.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|user_internal| user_internal.params.clone())
            .ok_or("User not Found")
    })
}

#[query]
pub fn get_user_info_using_principal(caller: Principal) -> Option<UserInfoInternal> {
    USER_STORAGE.with(|registry| registry.borrow().get(&caller).cloned())
}

#[update]
fn add_testimonial(message: String) -> String {
    let principal_id = caller();
    let userData = get_user_info();
    let userData = userData.clone().unwrap();
    USER_TESTIMONIAL.with(|registry| {
        let testimony = Testimonial {
            name: userData.full_name,
            profile_pic: userData.profile_picture.expect("not found"),
            timestamp: time(),
            message,
        };

        let mut registry = registry.borrow_mut();
        registry
            .entry(principal_id)
            .or_insert_with(Vec::new)
            .push(testimony);
        format!("testimony added")
    })
}

#[query]
fn get_testimonials(principal_id: Principal) -> Result<Vec<Testimonial>, &'static str> {
    USER_TESTIMONIAL.with(|registry| {
        let registry = registry.borrow();
        if let Some(testimonials) = registry.get(&principal_id) {
            Ok(testimonials.clone()) // Return a clone of the testimonials vector
        } else {
            Err("No testimonials found for the given user.")
        }
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
    USER_TESTIMONIAL.with(|registry| {
        let registry = registry.borrow();
        registry.values().cloned().flatten().collect()
    })
}

#[query]
fn get_review(principal_id: Principal) -> Result<Vec<Review>, &'static str> {
    USER_RATING.with(|registry| {
        let registry = registry.borrow();
        if let Some(rating) = registry.get(&principal_id) {
            Ok(rating.clone())
        } else {
            Err("No rating found for the given user.")
        }
    })
}

#[update]
fn add_review(rating: f32, message: String) -> String {
    let principal_id = caller();
    let userData = get_user_info();

    let userData = userData.clone().unwrap();
    USER_RATING.with(|registry| {
        match Review::new(
            userData.full_name,
            userData.profile_picture.expect("not found"),
            message,
            rating,
        ) {
            Ok(review) => {
                let mut registry = registry.borrow_mut();
                registry
                    .entry(principal_id)
                    .or_insert_with(Vec::new)
                    .push(review);
                format!("rating added")
            }
            Err(e) => format!("Error creating review: {}", e),
        }
    })
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
