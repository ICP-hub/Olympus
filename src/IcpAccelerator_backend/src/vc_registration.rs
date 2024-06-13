use crate::admin::*;
use crate::state_handler::{mutate_state, read_state, Candid, StoredPrincipal};
use crate::user_module::*;

use crate::is_user_anonymous;
use crate::PaginationParams;
use bincode;
use candid::{CandidType, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use ic_cdk::storage;
use ic_cdk::storage::stable_restore;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use sha2::{Digest, Sha256};
use std::borrow::BorrowMut;
use std::cell::RefCell;
use std::io::Read;
use std::{collections::HashMap, io::Write};
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
    pub user_data: UserInformation,
    pub website_link: Option<String>,
    pub linkedin_link: String,
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

// pub type VcAnnouncements = HashMap<Principal, Vec<Announcements>>;

// // pub type VentureCapitalistStorage = HashMap<Principal, VentureCapitalistInternal>;
// pub type VentureCapitalistParams = HashMap<Principal, VentureCapitalist>;
// pub type VentureCapitalistEditParams = HashMap<Principal, UpdateInfoStruct>;

// thread_local! {
//     pub static VENTURECAPITALIST_STORAGE: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
//     pub static VC_AWAITS_RESPONSE: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
//     pub static DECLINED_VC_REQUESTS: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
//     pub static VC_PROFILE_EDIT_AWAITS :RefCell<VentureCapitalistEditParams> = RefCell::new(VentureCapitalistEditParams::new());
//     pub static DECLINED_VC_PROFILE_EDIT_REQUEST :RefCell<VentureCapitalistEditParams> = RefCell::new(VentureCapitalistEditParams::new());
//     pub static VC_ANNOUNCEMENTS:RefCell<VcAnnouncements> = RefCell::new(VcAnnouncements::new());
// }

#[update(guard = "is_user_anonymous")]
pub async fn register_venture_capitalist(mut params: VentureCapitalist) -> std::string::String {
    let caller = caller();
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

    mutate_state(|state| {
        let role_status = &mut state.role_status;

        if let Some(mut role_status_vec_candid) = role_status.get(&StoredPrincipal(caller)) {
            let mut role_status_vec = role_status_vec_candid.0;
            for role in role_status_vec.iter_mut() {
                if role.name == "vc" {
                    role.status = "requested".to_string();
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

    let temp_image = params.user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();

    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        params.user_data.profile_picture = Some((full_url).as_bytes().to_vec());
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

        let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

        params.user_data.profile_picture =
            Some((canister_id.to_string() + &key).as_bytes().to_vec());
    }

    let user_data_for_updation = params.clone();
    crate::user_module::update_data_for_roles(caller, user_data_for_updation.user_data);

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
                state
                    .vc_awaits_response
                    .insert(StoredPrincipal(caller), Candid(new_vc.clone()));
            });

            let res = send_approval_request(
                params
                    .user_data
                    .profile_picture
                    .unwrap_or_else(|| Vec::new()),
                params.user_data.full_name,
                params.user_data.country,
                params.category_of_investment,
                "vc".to_string(),
                params.user_data.bio.unwrap_or_else(|| "no bio".to_string()),
            )
            .await;

            format!("{}", res)
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
            (principal.clone(), vc_info.0.clone())
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
pub async fn update_venture_capitalist(mut params: VentureCapitalist) -> String {
    let caller = ic_cdk::caller();

    let declined_request_exists = read_state(|state| {
        state
            .vc_profile_edit_declined
            .contains_key(&StoredPrincipal(caller))
    });
    if declined_request_exists {
        panic!("You had got your request declined earlier");
    }

    let already_registered =
        read_state(|state| state.vc_storage.contains_key(&StoredPrincipal(caller)));
    if !already_registered {
        ic_cdk::println!("This Principal is not registered");
        return "This Principal is not registered.".to_string();
    }

    let profile_edit_request_already_sent = read_state(|state| {
        state
            .vc_profile_edit_awaits
            .contains_key(&StoredPrincipal(caller))
    });
    if profile_edit_request_already_sent {
        ic_cdk::println!("Wait for your previous request to get approved");
        return "Wait for your previous request to get approved.".to_string();
    }

    let previous_profile = read_state(|state| {
        state
            .vc_storage
            .get(&StoredPrincipal(caller))
            .map(|vc_internal| vc_internal.0.params.clone())
    });

    let mut approved_timestamp = 0;
    let mut rejected_timestamp = 0;

    let temp_image = params.user_data.profile_picture.clone();
    let canister_id = crate::asset_manager::get_asset_canister();

    if temp_image.is_none() {
        let full_url = canister_id.to_string() + "/uploads/default_user.jpeg";
        params.user_data.profile_picture = Some((full_url).as_bytes().to_vec());
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

        let (deleted_result,): ((),) = call(canister_id, "delete_asset", (delete_asset,))
            .await
            .unwrap();

        let (result,): ((),) = call(canister_id, "store", (arg,)).await.unwrap();

        params.user_data.profile_picture =
            Some((canister_id.to_string() + &key).as_bytes().to_vec());
    }

    mutate_state(|state| {
        if let Some(mut roles) = state.role_status.get(&StoredPrincipal(caller)) {
            if let Some(role) = roles.0.iter_mut().find(|r| r.name == "mentor") {
                if role.status == "approved" {
                    approved_timestamp = ic_cdk::api::time();
                    role.approved_on = Some(approved_timestamp);
                } else if role.status == "rejected" {
                    rejected_timestamp = ic_cdk::api::time();
                    role.rejected_on = Some(rejected_timestamp);
                }
            }
        }

        let update_data_to_store = UpdateInfoStruct {
            original_info: previous_profile,
            updated_info: Some(params.clone()),
            approved_at: approved_timestamp,
            rejected_at: rejected_timestamp,
            sent_at: ic_cdk::api::time(),
        };

        state.vc_profile_edit_awaits.insert(
            StoredPrincipal(caller),
            Candid(update_data_to_store.clone()),
        );
    });

    let res = send_approval_request(
        params
            .user_data
            .profile_picture
            .unwrap_or_else(|| Vec::new()),
        params.user_data.full_name,
        params.user_data.country,
        params.category_of_investment,
        "vc".to_string(),
        params.user_data.bio.unwrap_or("no bio".to_string()),
    )
    .await;

    format!("{}", res)
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
            let mut tutor_hashmap = &m_container.vc_storage;
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
                let country_match = match &criteria.country {
                    Some(c) => &vc_internal.0.params.user_data.country == c,
                    None => true,
                };

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
                    && country_match
                    && category_match
                    && money_invested_match
            })
            .map(|(_, vc_internal)| vc_internal.0.params.clone())
            .collect()
    })
}
