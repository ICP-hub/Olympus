use crate::state_handler::*;
use crate::user_modules::user_types::*;
use crate::guard::*;
use ic_cdk_macros::*;
use crate::types::pagination_types::*;
use ic_cdk::api::caller;
use candid::Principal;

#[query(guard = "is_user_anonymous")]
pub fn get_roles_for_principal(principal_id: Principal) -> Vec<Role> {
    read_state(|state| {
        if let Some(roles_candid) = state.role_status.get(&StoredPrincipal(principal_id)) {
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

#[query(guard = "is_user_anonymous")]
pub fn get_approved_role_count_for_principal(principal_id: Principal) -> usize {
    get_roles_for_principal(principal_id)
        .into_iter()
        .filter(|role| {
            role.approval_status.as_deref() == Some("approved") && role.name != "user"
        })
        .count()
}


#[query(guard = "is_user_anonymous")]
pub fn get_user_information() -> Result<UserInformation, &'static str> {
    let caller = StoredPrincipal(caller());

    read_state(|state| {
        state
            .user_storage
            .get(&caller)
            .map(|user_internal| user_internal.0.params.clone())
            .ok_or("You have to Register Yourself First.")
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
pub async fn get_user_information_using_uid(uid: String) -> Result<UserInformation, &'static str> {
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
pub fn get_user_info_using_principal(caller: Principal) -> Option<UserInfoInternal> {
    read_state(|state| {
        state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|candid| candid.0.clone())
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

pub(crate) fn get_user_info_with_cache(caller: Principal, cache: &mut Option<UserInformation>) -> UserInformation {
    if let Some(cached_data) = cache {
        ic_cdk::println!("RETRUNING DATA FROM CACHE");
        return cached_data.clone();
    }
    ic_cdk::println!("RETRUNING DATA FROM STATE");
    let user_info = get_user_information_internal(caller);
    *cache = Some(user_info.clone());
    user_info
}