use crate::state_handler::*;
use crate::vc_module::vc_types::*;
use crate::user_modules::user_types::*;
use crate::user_modules::get_user::*;
use crate::types::pagination_types::*;
use crate::types::individual_types::*;
use ic_cdk_macros::*;
use candid::Principal;
use std::collections::HashMap;
use crate::guard::*;

#[query(guard = "is_user_anonymous")]
pub fn get_vc_info() -> Option<(VentureCapitalist, UserInfoInternal)> {
    let caller = ic_cdk::caller();
    println!("Fetching venture capitalist info for caller: {:?}", caller);

    read_state(|state| {
        let vc_info = state
            .vc_storage
            .get(&StoredPrincipal(caller))
            .map(|vc_internal| vc_internal.0.params.clone());

        let user_info = state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|candid_user_info| candid_user_info.0.clone());

        match (vc_info, user_info) {
            (Some(vc), Some(user)) => Some((vc, user)),
            _ => None,
        }
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_vc_info_using_principal(caller: Principal) -> Option<(VentureCapitalistAll, UserInfoInternal)> {
    read_state(|state| {
        let profile = state
            .vc_storage
            .get(&StoredPrincipal(caller))
            .map(|vc_internal| vc_internal.0.clone());

        let user_info = state
            .user_storage
            .get(&StoredPrincipal(caller))
            .map(|candid_user_info| candid_user_info.0.clone());

        match (profile, user_info) {
            (Some(profile), Some(user)) => {
                let all_capitalist_info = VentureCapitalistAll {
                    principal: caller,
                    profile,
                };
                Some((all_capitalist_info, user))
            }
            _ => None,
        }
    })
}

#[query(guard = "is_user_anonymous")]
pub fn list_all_vcs() -> HashMap<Principal, (VentureCapitalistInternal, UserInfoInternal, Vec<Role>)> {
    let projects_snapshot = read_state(|state| {
        state
            .vc_storage
            .iter()
            .map(|(principal, vc_internal)| (principal.0, vc_internal.0.clone()))
            .collect::<Vec<_>>()
    });

    let mut vc_with_info_map: HashMap<Principal, (VentureCapitalistInternal, UserInfoInternal, Vec<Role>)> = HashMap::new();

    for (principal, vc_internal) in projects_snapshot {
        if vc_internal.is_active {
            let roles = get_roles_for_principal(principal);

            if let Some(user_info) = read_state(|state| {
                state.user_storage.get(&StoredPrincipal(principal)).map(|candid_user_info| candid_user_info.0.clone())
            }) {
                vc_with_info_map.insert(principal, (vc_internal, user_info, roles));
            }
        }
    }

    vc_with_info_map
}

#[query(guard = "is_user_anonymous")]
pub fn filter_venture_capitalists(criteria: VcFilterCriteria) -> Vec<VentureCapitalist> {
    read_state(|state| {
        state
            .vc_storage
            .iter()
            .filter(|(_, vc_internal)| {
                let category_match = criteria
                    .category_of_investment
                    .as_ref()
                    .map_or(true, |category| {
                        &vc_internal.0.params.category_of_investment == category
                    });

                let money_invested_match =
                    criteria.money_invested_range.map_or(true, |(min, max)| {
                        vc_internal.0.params.range_of_check_size.as_ref().map_or(
                            false,
                            |range_str| {
                                let parts = range_str
                                    .trim_start_matches('$')
                                    .split('-')
                                    .collect::<Vec<_>>();
                                if parts.len() == 2 {
                                    let min_range = parts[0]
                                        .trim_end_matches('m')
                                        .parse::<f64>()
                                        .unwrap_or(0.0);
                                    let max_range = parts[1]
                                        .trim_start_matches('$')
                                        .trim_end_matches('m')
                                        .parse::<f64>()
                                        .unwrap_or(0.0);
                                    min <= max_range && max >= min_range
                                } else {
                                    false
                                }
                            },
                        )
                    });

                vc_internal.0.is_active
                    && vc_internal.0.approve
                    && !vc_internal.0.decline
                    && category_match
                    && money_invested_match
            })
            .map(|(_, vc_internal)| vc_internal.0.params.clone())
            .collect()
    })
}


#[query(guard = "is_user_anonymous")]
pub fn list_all_vcs_with_pagination(pagination_params: PaginationParams) -> PaginationReturnVcData {
    let (vc_keys, paginated_vc_map, total_count) = read_state(|state| {
        let start = (pagination_params.page - 1) * pagination_params.page_size;

        let mut vc_keys: Vec<Principal> = Vec::new();
        let mut paginated_vc_map: HashMap<Principal, VcWithRoles> = HashMap::new();

        let _vcs_snapshot = state.vc_storage.iter()
            .filter(|(_, vc)| vc.0.is_active)
            .skip(start)
            .take(pagination_params.page_size)
            .map(|(stored_principal, candid_vc_internal)| {
                let principal = stored_principal.0;
                vc_keys.push(principal);

                let roles = get_roles_for_principal(principal);
                let vc_with_roles = VcWithRoles {
                    vc_profile: candid_vc_internal.0.clone(),
                    roles,
                };
                paginated_vc_map.insert(principal, vc_with_roles);
            })
            .count(); 

        let total_count = state.vc_storage.iter().filter(|(_, vc)| vc.0.is_active).count() as u64;

        (vc_keys, paginated_vc_map, total_count)
    });

    let user_data: HashMap<Principal, UserInformation> = vc_keys.iter()
        .map(|principal| {
            let user_info = get_user_information_internal(*principal);
            (*principal, user_info)
        })
        .collect();

    PaginationReturnVcData {
        data: paginated_vc_map,
        user_data,
        count: total_count,
    }
}
