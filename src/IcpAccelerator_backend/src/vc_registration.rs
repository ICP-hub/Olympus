use crate::admin::*;
use crate::state_handler::{mutate_state, read_state, Candid, StoredPrincipal};
use crate::user_module::*;
use crate::is_user_anonymous;
use crate::PaginationParams;
use candid::{CandidType, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::time;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinks{
    pub link: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct VentureCapitalist {
    pub name_of_fund: String,
    pub fund_size: Option<f64>,
    pub assets_under_management: Option<String>,
    pub logo: Option<Vec<u8>>,
    pub registered_under_any_hub: Option<bool>,
    pub average_check_size: f64,
    pub existing_icp_investor: bool,
    pub money_invested: Option<f64>,
    pub existing_icp_portfolio: Option<String>,
    pub type_of_investment: String,
    pub project_on_multichain: Option<String>,
    pub category_of_investment: String,
    pub reason_for_joining: Option<String>,
    pub preferred_icp_hub: String,
    pub investor_type: Option<String>,
    pub number_of_portfolio_companies: u16,
    pub portfolio_link: String,
    pub announcement_details: Option<String>,
    pub website_link: Option<String>,
    pub links: Option<Vec<SocialLinks>>,
    pub registered: bool,
    pub registered_country: Option<String>,
    pub stage: Option<String>,
    pub range_of_check_size: Option<String>,
}

#[derive(Clone, CandidType)]
pub struct VentureCapitalistAll {
    pub principal: Principal,
    pub profile: VentureCapitalistInternal,
}

impl VentureCapitalist {
    //validation functions for Vc
    pub fn validate(&self) -> Result<(), String> {
        // if self.fund_size == 0.0 || self.fund_size.is_nan() {
        //     return Err("Invalid input for funds size".into());
        // }

        // if let Some(money_invested) = self.money_invested {
        //     if money_invested == 0.0 || money_invested.is_nan() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if self.average_check_size == 0.0 || self.average_check_size.is_nan() {
        //     return Err("Invalid input for funds size".into());
        // }

        // if self.logo.is_empty() {
        //     return Err("Add a logo".into());
        // }

        // if let Some(ref registered_under_any_hub) = self.registered_under_any_hub {
        //     if registered_under_any_hub.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if let Some(ref project_on_multichain) = self.project_on_multichain {
        //     if project_on_multichain.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if self.number_of_portfolio_companies <= u16::MIN
        //     || self.number_of_portfolio_companies > u16::MAX
        // {
        //     return Err("Invalid Value".into());
        // }

        Ok(())
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct VentureCapitalistInternal {
    pub params: VentureCapitalist,
    pub uid: String,
    pub is_active: bool,
    pub approve: bool,
    pub decline: bool,
}
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Announcements {
    project_name: String,
    announcement_message: String,
    timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateInfoStruct {
    pub original_info: Option<VentureCapitalist>,
    pub updated_info: Option<VentureCapitalist>,
    pub approved_at: u64,
    pub rejected_at: u64,
    pub sent_at: u64,
}


#[update(guard = "is_user_anonymous")]
pub async fn register_venture_capitalist(params: VentureCapitalist) -> std::string::String {
    let caller = caller();

    let has_project_role = read_state(|state| {
        state.role_status.get(&StoredPrincipal(caller)).map_or(false, |roles| {
            roles.0.iter().any(|role| role.name == "project" && (role.status == "approved" || role.status == "active"))
        })
    });

    if has_project_role {
        return "You are not allowed to get this role because you already have the Project role.".to_string();
    }

    let role_count = get_approved_role_count_for_principal(caller);
    if role_count >= 2 {
        return "You are not eligible for this role because you have 2 or more roles".to_string();
    }

    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();

    // Check if the request was declined earlier
    let request_declined = read_state(|state| {
        state
            .vc_declined_request
            .contains_key(&StoredPrincipal(caller))
    });
    if request_declined {
        return "You had got your request declined earlier".to_string();
    }

    // Check if the VC is already registered
    let already_registered =
        read_state(|state| state.vc_storage.contains_key(&StoredPrincipal(caller)));
    if already_registered {
        ic_cdk::println!("This Principal is already registered");
        return "This Principal is already registered.".to_string();
    }

    let mut user_data = get_user_information_internal(caller);

    let temp_image = user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();

    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        user_data.profile_picture = Some((full_url).as_bytes().to_vec());
    } else if temp_image.clone().unwrap().len() < 300 {
        ic_cdk::println!("Profile image is already uploaded");
    } else {
        let key = "/uploads/".to_owned() + &caller.to_string() + "_user.jpeg";

        let arg = StoreArg {
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(temp_image.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset { key: key.clone() };

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (_result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

        user_data.profile_picture =
            Some((canister_id.to_string() + &key).as_bytes().to_vec());
    }

    match params.validate() {
        Ok(_) => {
            println!("Validation passed!");
            let profile_for_pushing = params.clone();

            let new_vc = VentureCapitalistInternal {
                params: profile_for_pushing,
                uid: new_id.clone(),
                is_active: true,
                approve: false,
                decline: false,
            };

            // Add the new VC to the awaiting response list
            mutate_state(|state| {
                // Updating vc_storage to reflect approval status
                state
                    .vc_storage
                    .insert(StoredPrincipal(caller), Candid(new_vc.clone()));

                let role_status = &mut state.role_status;

                if let Some(role_status_vec_candid) =
                    role_status.get(&StoredPrincipal(caller))
                {
                    let mut role_status_vec = role_status_vec_candid.0;
                    for role in role_status_vec.iter_mut() {
                        if role.name == "vc" {
                            role.status = "approved".to_string();
                            role.approval_status = Some("approved".to_string());
                            role.approved_on = Some(time());
                            break;
                        }
                    }
                    role_status.insert(StoredPrincipal(caller), Candid(role_status_vec));
                }
            });
            format!("Venture Capitalist Created With UID {}", new_vc.uid)
        }
        Err(e) => format!("Validation error: {}", e),
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_vc_info() -> Option<VentureCapitalist> {
    let caller = ic_cdk::caller();
    println!("Fetching venture capitalist info for caller: {:?}", caller);

    read_state(|state| {
        state
            .vc_storage
            .get(&StoredPrincipal(caller))
            .map(|vc_internal| vc_internal.0.params.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_vc_info_by_principal(caller: Principal) -> HashMap<Principal, VentureCapitalistAll> {
    read_state(|state| {
        let profile = state
            .vc_storage
            .get(&StoredPrincipal(caller))
            .expect("couldn't get venture capitalist")
            .0
            .clone();

        let mut vc_all_info: HashMap<Principal, VentureCapitalistAll> = HashMap::new();

        let all_capitalist_info = VentureCapitalistAll {
            principal: caller,
            profile,
        };

        vc_all_info.insert(caller, all_capitalist_info);
        vc_all_info
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_vc_info_using_principal(caller: Principal) -> Option<VentureCapitalistInternal> {
    read_state(|state| {
        state
            .vc_storage
            .get(&StoredPrincipal(caller))
            .map(|vc| vc.0.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_vc_awaiting_info_using_principal(
    caller: Principal,
) -> Option<VentureCapitalistInternal> {
    read_state(|state| {
        state
            .vc_awaits_response
            .get(&StoredPrincipal(caller))
            .map(|vc| vc.0.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn get_vc_declined_info_using_principal(
    caller: Principal,
) -> Option<VentureCapitalistInternal> {
    read_state(|state| {
        state
            .vc_declined_request
            .get(&StoredPrincipal(caller))
            .map(|vc| vc.0.clone())
    })
}

#[query(guard = "is_user_anonymous")]
pub fn list_all_vcs() -> HashMap<Principal, VcWithRoles> {
    read_state(|state| {
        let mut vc_with_roles_map: HashMap<Principal, VcWithRoles> = HashMap::new();

        for (principal, vc_internal) in state.vc_storage.iter() {
            let roles = get_roles_for_principal(principal.0);
            let vc_with_roles = VcWithRoles {
                vc_profile: vc_internal.0.clone(),
                roles,
            };

            if vc_internal.0.is_active {
                vc_with_roles_map.insert(principal.0, vc_with_roles);
            }
        }

        vc_with_roles_map
    })
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnVcData {
    pub data: HashMap<Principal, VcWithRoles>,
    pub count: usize,
}

#[query(guard = "is_user_anonymous")]
pub fn list_all_vcs_with_pagination(pagination_params: PaginationParams) -> PaginationReturnVcData {
    read_state(|state| {
        let total_active_vcs = state.vc_storage.iter().filter(|(_, vc)| vc.0.is_active).count();

        let start = (pagination_params.page - 1) * pagination_params.page_size;
        let end = std::cmp::min(start + pagination_params.page_size, total_active_vcs);

        let vc_list: Vec<(Principal, VcWithRoles)> = state.vc_storage.iter()
            .filter(|(_, vc)| vc.0.is_active)
            .map(|(stored_principal, candid_vc_internal)| {
                let principal = stored_principal.0;
                let roles = get_roles_for_principal(principal);
                let vc_with_roles = VcWithRoles {
                    vc_profile: candid_vc_internal.0.clone(),
                    roles,
                };
                (principal, vc_with_roles)
            })
            .skip(start)  
            .take(end - start)  
            .collect();

        let paginated_vc_map: HashMap<Principal, VcWithRoles> = vc_list.into_iter().collect();

        PaginationReturnVcData {
            data: paginated_vc_map,
            count: total_active_vcs,  
        }
    })
}


#[derive(CandidType, Clone)]
pub struct ListAllVC {
    principal: StoredPrincipal,
    params: VentureCapitalistInternal,
}

#[query]
pub fn get_top_three_vc() -> Vec<ListAllVC> {
    let vcs_snapshot = read_state(|state| {
        state.vc_storage.iter().map(|(principal, vc_info)| {
            (principal, vc_info.0.clone())
        }).collect::<Vec<_>>()
    });

    let mut list_all_vc: Vec<ListAllVC> = Vec::new();

    for (stored_principal, vc_info) in vcs_snapshot {
        if vc_info.is_active {
            let vc_info_struct = ListAllVC {
                principal: stored_principal,
                params: vc_info, 
            };
            list_all_vc.push(vc_info_struct);
        }
    }
    // Return only the top 3 venture capitalists
    list_all_vc.into_iter().take(3).collect()
}

#[update(guard = "is_user_anonymous")]
pub fn delete_venture_capitalist() -> std::string::String {
    let caller = ic_cdk::caller();
    println!("Attempting to deactivate founder for caller: {:?}", caller);

    mutate_state(|state| {
        if let Some(mut vc_internal) = state.vc_storage.get(&StoredPrincipal(caller)) {
            vc_internal.0.is_active = false;
            println!("Founder deactivated for caller: {:?}", caller);
        } else {
            println!("Founder not found for caller: {:?}", caller);
        }
    });

    format!("Venture Capitalist Account Has Been DeActivated")
}

#[update]
pub async fn update_venture_capitalist(params: VentureCapitalist) -> String {
    let caller = ic_cdk::caller();

    let already_registered =
        read_state(|state| state.vc_storage.contains_key(&StoredPrincipal(caller)));
    if !already_registered {
        ic_cdk::println!("This Principal is not registered");
        return "This Principal is not registered.".to_string();
    }

    let mut user_data = get_user_information_internal(caller);

    let temp_image = user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();

    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        user_data.profile_picture = Some((full_url).as_bytes().to_vec());
    } else if temp_image.clone().unwrap().len() < 300 {
        ic_cdk::println!("Profile image is already uploaded");
    } else {
        let key = "/uploads/".to_owned() + &caller.to_string() + "_user.jpeg";

        let arg = StoreArg {
            key: key.clone(),
            content_type: "image/*".to_string(),
            content_encoding: "identity".to_string(),
            content: ByteBuf::from(temp_image.unwrap()),
            sha256: None,
        };

        let delete_asset = DeleteAsset { key: key.clone() };

        let (_deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (_result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

        user_data.profile_picture =
            Some((canister_id.to_string() + &key).as_bytes().to_vec());
    }

    let update_result = mutate_state(|state| {
                if let Some(mut existing_vc_internal) = state.vc_storage.get(&StoredPrincipal(caller)) {
                        existing_vc_internal.0.params.registered_under_any_hub = params.registered_under_any_hub.clone()
                            .or(existing_vc_internal.0.params.registered_under_any_hub.clone());
                        existing_vc_internal.0.params.project_on_multichain = params.project_on_multichain.clone()
                            .or(existing_vc_internal.0.params.project_on_multichain.clone());
                        existing_vc_internal.0.params.money_invested = params.money_invested.clone()
                            .or(existing_vc_internal.0.params.money_invested.clone());
                        existing_vc_internal.0.params.existing_icp_portfolio = params.existing_icp_portfolio.clone()
                            .or(existing_vc_internal.0.params.existing_icp_portfolio.clone());
                        existing_vc_internal.0.params.announcement_details = params.announcement_details.clone()
                            .or(existing_vc_internal.0.params.announcement_details.clone());
                        existing_vc_internal.0.params.registered_country = params.registered_country.clone()
                            .or(existing_vc_internal.0.params.registered_country.clone());
                        existing_vc_internal.0.params.fund_size = Some(params.fund_size.unwrap_or(0.0));
                        existing_vc_internal.0.params.assets_under_management = params.assets_under_management.clone();
                        existing_vc_internal.0.params.category_of_investment = params.category_of_investment.clone();
                        existing_vc_internal.0.params.logo = params.logo.clone();
                        existing_vc_internal.0.params.average_check_size = params.average_check_size;
                        existing_vc_internal.0.params.existing_icp_investor = params.existing_icp_investor;
                        existing_vc_internal.0.params.investor_type = params.investor_type.clone();
                        existing_vc_internal.0.params.number_of_portfolio_companies =params.number_of_portfolio_companies;
                        existing_vc_internal.0.params.portfolio_link = params.portfolio_link.clone();
                        existing_vc_internal.0.params.reason_for_joining = params.reason_for_joining.clone();
                        existing_vc_internal.0.params.name_of_fund = params.name_of_fund.clone();
                        existing_vc_internal.0.params.preferred_icp_hub = params.preferred_icp_hub.clone();
                        existing_vc_internal.0.params.type_of_investment = params.type_of_investment.clone();
                        existing_vc_internal.0.params.links = params.links.clone();
                        existing_vc_internal.0.params.website_link = params.website_link.clone();
                        existing_vc_internal.0.params.registered = params.registered.clone();

                        state.vc_storage.insert(StoredPrincipal(caller), existing_vc_internal);
                        return Ok("Profile updated successfully");
                }
                return Err("No existing VC profile found to update.");
    });

    match update_result {
        Ok(message) => {
            message.to_string()
        },
        Err(error) => format!("Error processing request: {}", error),
    }
}

#[query(guard = "is_user_anonymous")]
pub fn get_multichain_list() -> Vec<String> {
    let chains = vec![
        "Ethereum".to_string(),
        "Polygon".to_string(),
        "Arbitrum".to_string(),
        "Optimism".to_string(),
        "Base".to_string(),
        "zkSync".to_string(),
        "Avalanche".to_string(),
        "Gnosis".to_string(),
        "BNB".to_string(),
        "Scroll".to_string(),
        "Moonbeam".to_string(),
        "Aurora".to_string(),
        "Linea".to_string(),
        "Fantom".to_string(),
        "Mantle".to_string(),
        "Axelar".to_string(),
        "Zora Network".to_string(),
        "Solana".to_string(),
        "Celo".to_string(),
        "Boba".to_string(),
        "Metis".to_string(),
        "Harmony".to_string(),
        "Kava".to_string(),
        "Klaytn".to_string(),
        "Polkadot".to_string(),
        "Skale".to_string(),
        "Shardeum Sphinx".to_string(),
        "Filecoin".to_string(),
        "Cronos".to_string(),
        "Telos".to_string(),
        "Reef".to_string(),
        "Celestia".to_string(),
        "Zeta".to_string(),
        "Evmos".to_string(),
        "Osmosis".to_string(),
        "Nordek".to_string(),
    ];
    chains
}

#[update(guard = "is_user_anonymous")]
pub fn add_vc_announcement(name: String, announcement_message: String) -> String {
    let caller_id = ic_cdk::caller();
    let current_time = ic_cdk::api::time();

    mutate_state(|state| {
        let stored_principal = StoredPrincipal(caller_id);
        let new_vc = Announcements {
            project_name: name,
            announcement_message: announcement_message,
            timestamp: current_time,
        };

        let mut announcements = state
            .vc_announcement
            .get(&stored_principal)
            .map(|candid_vec| candid_vec.0.clone())
            .unwrap_or_else(Vec::new);

        announcements.push(new_vc);
        state
            .vc_announcement
            .insert(stored_principal, Candid(announcements));

        format!("Announcement added successfully at {}", current_time)
    })
}

//for testing purpose
#[query(guard = "is_user_anonymous")]
pub fn get_vc_announcements() -> HashMap<Principal, Vec<Announcements>> {
    read_state(|state| {
        let announcements_map = &state.vc_announcement;
        let mut result_map: HashMap<Principal, Vec<Announcements>> = HashMap::new();

        for (principal, announcements) in announcements_map.iter() {
            let principal = principal.0; // Extract Principal from StoredPrincipal
            let announcements = announcements.0.clone(); // Extract Vec<Announcements> from Candid<Vec<Announcements>>

            result_map.insert(principal, announcements);
        }

        result_map
    })
}

#[update(guard = "is_user_anonymous")]
pub fn make_vc_active_inactive(p_id: Principal) -> String {
    let principal_id = caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        mutate_state(|m_container| {
            let tutor_hashmap = &m_container.vc_storage;
            if let Some(mut vc_internal) = tutor_hashmap.get(&StoredPrincipal(p_id)) {
                if vc_internal.0.is_active {
                    let active = false;
                    vc_internal.0.is_active = active;

                    //ic_cdk::println!("mentor profile check status {:?}", vc_internal);
                    return "made inactive".to_string();
                } else {
                    let active = true;
                    vc_internal.0.is_active = active;
                    //ic_cdk::println!("mentor profile check status {:?}", vc_internal);
                    return "made active".to_string();
                }
            } else {
                "profile seems not to be existed".to_string()
            }
        })
    } else {
        "you are not authorised to run this function".to_string()
    }
}

//backside_additions

#[query(guard = "is_user_anonymous")]
pub fn get_investment_stage() -> Vec<String> {
    vec![
        "Pre-MVP".to_string(),
        "MVP to initial traction".to_string(),
        "Growing traction".to_string(),
        "We do NOT currently invest".to_string(),
    ]
}

#[query(guard = "is_user_anonymous")]
pub fn get_range_of_check_size() -> Vec<String> {
    vec![
        "<$500k".to_string(),
        "$500k-$2M".to_string(),
        "$2-5M".to_string(),
        "$5-10M".to_string(),
        "Above $10M".to_string(),
    ]
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct VcFilterCriteria {
    pub country: Option<String>,
    pub category_of_investment: Option<String>,
    pub money_invested_range: Option<(f64, f64)>, // Minimum and maximum investment range
}

#[query(guard = "is_user_anonymous")]
pub fn filter_venture_capitalists(criteria: VcFilterCriteria) -> Vec<VentureCapitalist> {
    read_state(|state| {
        state
            .vc_storage
            .iter()
            .filter(|(_, vc_internal)| {
                // let country_match = match &criteria.country {
                //     Some(c) => &vc_internal.0.params.user_data.country == c,
                //     None => true,
                // };

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

                // Only include active and approved VCs
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
