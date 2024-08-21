use crate::state_handler::*;
use crate::mentor_module::mentor_types::*;
use crate::user_modules::user_types::*;
use crate::user_modules::get_user::*;
use crate::types::pagination_types::*;
use crate::types::individual_types::*;
use crate::guard::*;
use candid::Principal;
use ic_cdk_macros::query;
use std::collections::HashMap;

#[query(guard = "is_user_anonymous")]
pub fn get_mentor_info_using_principal(id: Principal) -> Option<(MentorInternal, UserInfoInternal)> {
    let mentor_profile = read_state(|state| {
        state
            .mentor_storage
            .get(&StoredPrincipal(id))
            .map(|mentor_internal| mentor_internal.0.clone())
    });

    let user_info = read_state(|state| {
        state
            .user_storage
            .get(&StoredPrincipal(id))
            .map(|candid_user_info| candid_user_info.0.clone())
    });

    match (mentor_profile, user_info) {
        (Some(mentor), Some(user)) => Some((mentor, user)),
        _ => None,
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_mentor() -> Option<(MentorProfile, UserInfoInternal)> {
    let caller = ic_cdk::caller();

    let mentor_profile = read_state(|state| {
        state
            .mentor_storage
            .get(&StoredPrincipal(caller))
            .map(|mentor_internal| mentor_internal.0.profile.clone())
    });

    let user_info = read_state(|state| {
        state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|candid_user_info| candid_user_info.0.clone())
    });

    match (mentor_profile, user_info) {
        (Some(mentor), Some(user)) => Some((mentor, user)),
        _ => None,
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_all_mentors() -> HashMap<Principal, (MentorInternal, UserInfoInternal, Vec<Role>)> {
    let mentor_registry = read_state(|state| {
        state.mentor_storage.iter().collect::<Vec<_>>()
    });

    let mut mentor_with_info_map: HashMap<Principal, (MentorInternal, UserInfoInternal, Vec<Role>)> = HashMap::new();

    for (stored_principal, candid_mentor_internal) in mentor_registry.iter() {
        let mentor_internal = candid_mentor_internal.0.clone();
        let principal = stored_principal.0; 

        if mentor_internal.active {
            let roles = get_roles_for_principal(principal);

            if let Some(user_info) = read_state(|state| {
                state.user_storage.get(&StoredPrincipal(principal)).map(|candid_user_info| candid_user_info.0.clone())
            }) {
                mentor_with_info_map.insert(principal, (mentor_internal, user_info, roles));
            }
        }
    }

    mentor_with_info_map
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