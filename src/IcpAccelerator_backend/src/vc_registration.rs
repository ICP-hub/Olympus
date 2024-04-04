use crate::admin::*;
use crate::user_module::*;

use bincode;
use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk::api::time;
use ic_cdk::storage;
use ic_cdk::storage::stable_restore;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::io::Read;
use std::{collections::HashMap, io::Write};
use crate::PaginationParam;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct VentureCapitalist {
    pub name_of_fund: String,
    pub fund_size: f64,
    pub assets_under_management: String,
    pub logo: Option<Vec<u8>>,
    pub registered_under_any_hub: Option<bool>,
    pub average_check_size: f64,
    pub existing_icp_investor: bool,
    pub money_invested: Option<f64>,
    pub existing_icp_portfolio: Option<String>,
    pub type_of_investment: String,
    pub project_on_multichain: Option<String>,
    pub category_of_investment: String,
    pub reason_for_joining: String,
    pub preferred_icp_hub: String,
    pub investor_type: String,
    pub number_of_portfolio_companies: u16,
    pub portfolio_link: String,
    pub announcement_details: Option<String>,
    pub user_data: UserInformation,
    pub website_link: String,
    pub linkedin_link: String,
    pub registered: bool,
    pub registered_country: Option<String>,
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

pub type VcAnnouncements = HashMap<Principal, Vec<Announcements>>;

pub type VentureCapitalistStorage = HashMap<Principal, VentureCapitalistInternal>;
pub type VentureCapitalistParams = HashMap<Principal, VentureCapitalist>;

thread_local! {
    pub static VENTURECAPITALIST_STORAGE: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
    pub static VC_AWAITS_RESPONSE: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
    pub static DECLINED_VC_REQUESTS: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
    pub static VC_PROFILE_EDIT_AWAITS :RefCell<VentureCapitalistParams> = RefCell::new(VentureCapitalistParams::new());
    pub static DECLINED_VC_PROFILE_EDIT_REQUEST :RefCell<VentureCapitalistParams> = RefCell::new(VentureCapitalistParams::new());
    pub static VC_ANNOUNCEMENTS:RefCell<VcAnnouncements> = RefCell::new(VcAnnouncements::new());
}

pub fn pre_upgrade_venture_capitalist() {
    VENTURECAPITALIST_STORAGE.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("VENTURECAPITALIST_STORAGE saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save VENTURECAPITALIST_STORAGE: {:?}", e),
        }
    });

    VC_AWAITS_RESPONSE.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("VC_AWAITS_RESPONSE saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save VC_AWAITS_RESPONSE: {:?}", e),
        }
    });

    DECLINED_VC_REQUESTS.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("DECLINED_VC_REQUESTS saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save DECLINED_VC_REQUESTS: {:?}", e),
        }
    });

    VC_PROFILE_EDIT_AWAITS.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("VC_PROFILE_EDIT_AWAITS saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save VC_PROFILE_EDIT_AWAITS: {:?}", e),
        }
    });

    DECLINED_VC_PROFILE_EDIT_REQUEST.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("DECLINED_VC_PROFILE_EDIT_REQUEST saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save DECLINED_VC_PROFILE_EDIT_REQUEST: {:?}", e),
        }
    });

    VC_ANNOUNCEMENTS.with(|data| {
        match storage::stable_save((data.borrow().clone(),)) {
            Ok(_) => ic_cdk::println!("VC_ANNOUNCEMENTS saved successfully."),
            Err(e) => ic_cdk::println!("Failed to save VC_ANNOUNCEMENTS: {:?}", e),
        }
    });
}


pub fn post_upgrade_venture_capitalist() {
    match stable_restore::<(VentureCapitalistStorage, VentureCapitalistStorage, VentureCapitalistStorage, VentureCapitalistParams, VentureCapitalistParams, VcAnnouncements)>() {
        Ok((restored_vc_storage, restored_vc_awaits_response, restored_declined_vc_requests, restored_vc_profile_edit_awaits, restored_declined_vc_profile_edit_request, restored_vc_announcements)) => {
            VENTURECAPITALIST_STORAGE.with(|data| *data.borrow_mut() = restored_vc_storage);
            VC_AWAITS_RESPONSE.with(|data| *data.borrow_mut() = restored_vc_awaits_response);
            DECLINED_VC_REQUESTS.with(|data| *data.borrow_mut() = restored_declined_vc_requests);
            VC_PROFILE_EDIT_AWAITS.with(|data| *data.borrow_mut() = restored_vc_profile_edit_awaits);
            DECLINED_VC_PROFILE_EDIT_REQUEST.with(|data| *data.borrow_mut() = restored_declined_vc_profile_edit_request);
            VC_ANNOUNCEMENTS.with(|data| *data.borrow_mut() = restored_vc_announcements);

            ic_cdk::println!("VC modules restored successfully.");
        },
        Err(e) => ic_cdk::println!("Failed to restore VC modules: {:?}", e),
    }
}

#[update]
pub async fn register_venture_capitalist(mut params: VentureCapitalist) -> std::string::String {
    let caller = caller();
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();
    DECLINED_VC_REQUESTS.with(|d_vc| {
        let exits = d_vc.borrow().contains_key(&caller);
        if exits {
            panic!("You had got your request declined earlier");
        }
    });

    let already_registered =
        VENTURECAPITALIST_STORAGE.with(|registry| registry.borrow().contains_key(&caller));

    if already_registered {
        ic_cdk::println!("This Principal is already registered");
        return "This Principal is already registered.".to_string();
    }

    ROLE_STATUS_ARRAY.with(|role_status| {
        let mut role_status = role_status.borrow_mut();

        for role in role_status
            .get_mut(&caller)
            .expect("you are not a user! be a user first!")
            .iter_mut()
        {
            if role.name == "vc" {
                role.status = "requested".to_string();
                role.requested_on = Some(time());
            }
        }
    });

    match params.validate() {
        Ok(_) => {
            println!("Validation passed!");
            let fund_size = (params.fund_size * 100.0).round() / 100.0;
            params.fund_size = fund_size;
            let average_check_size = (params.average_check_size * 100.0).round() / 100.0;
            params.average_check_size = average_check_size;
            let money_invested = params
                .money_invested
                .map(|money| (money * 100.0).round() / 100.0);

            params.money_invested = money_invested;
            let profile_for_pushing = params.clone();

            let new_vc = VentureCapitalistInternal {
                params: profile_for_pushing,
                uid: new_id.clone(),
                is_active: true,
                approve: false,
                decline: false,
            };
            VC_AWAITS_RESPONSE.with(
                |awaiters: &RefCell<HashMap<Principal, VentureCapitalistInternal>>| {
                    let mut await_ers: std::cell::RefMut<
                        '_,
                        HashMap<Principal, VentureCapitalistInternal>,
                    > = awaiters.borrow_mut();
                    await_ers.insert(caller, new_vc.clone());
                },
            );

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

            // println!("Registering VC for caller: {:?}", caller);
            // VENTURECAPITALIST_STORAGE.with(|storage| {
            //     let mut storage = storage.borrow_mut();
            //     if storage.contains_key(&caller) {
            //         panic!("VC with this Principal ID already exists");
            //     }
            //     storage.insert(caller, new_vc);
            //     println!("VC Registered {:?}", caller);
            // });
            // format!("VC registered successfully with ID: {}", new_id)
        }
        Err(e) => {
            format!("Validation error: {}", e)
        }
    }
}

#[query]
pub fn get_vc_info() -> Option<VentureCapitalist> {
    let caller = caller();
    println!("Fetching founder info for caller: {:?}", caller);
    VENTURECAPITALIST_STORAGE.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|vc_internal| vc_internal.params.clone())
    })
}

#[query]
pub fn get_vc_info_by_principal(caller: Principal) -> HashMap<Principal, VentureCapitalistAll> {
    VENTURECAPITALIST_STORAGE.with(|registry| {
        let profile = registry
            .borrow()
            .get(&caller)
            .expect("couldn't get venture capital")
            .clone();

        let mut vc_all_info: HashMap<Principal, VentureCapitalistAll> = HashMap::new();

        let all_capitalist_info = VentureCapitalistAll {
            principal: caller,
            profile: profile,
        };

        vc_all_info.insert(caller, all_capitalist_info);
        vc_all_info
    })
}

#[query]
pub fn get_vc_info_using_principal(caller: Principal) -> Option<VentureCapitalistInternal> {
    VENTURECAPITALIST_STORAGE.with(|registry| registry.borrow().get(&caller).cloned())
}

#[query]
pub fn get_vc_awaiting_info_using_principal(
    caller: Principal,
) -> Option<VentureCapitalistInternal> {
    VC_AWAITS_RESPONSE.with(|registry| registry.borrow().get(&caller).cloned())
}

#[query]
pub fn get_vc_declined_info_using_principal(
    caller: Principal,
) -> Option<VentureCapitalistInternal> {
    DECLINED_VC_REQUESTS.with(|registry| registry.borrow().get(&caller).cloned())
}

#[query]
pub fn list_all_vcs() -> HashMap<Principal, VcWithRoles> {
    let vc_awaiters = VENTURECAPITALIST_STORAGE.with(|awaiters : &RefCell<VentureCapitalistStorage> | awaiters.borrow().clone());

    let mut vc_with_roles_map: HashMap<Principal, VcWithRoles> = HashMap::new();

    for (principal, vc_internal) in vc_awaiters.iter() {
        let roles = get_roles_for_principal(*principal);
        let vc_with_roles = VcWithRoles {
            vc_profile: vc_internal.clone(),
            roles,
        };

        if vc_internal.is_active == true{
            vc_with_roles_map.insert(*principal, vc_with_roles);
        }
        
    }

    vc_with_roles_map
}
#[query]
pub fn list_all_vcs_with_pagination(pagination_params: PaginationParam) -> HashMap<Principal, VcWithRoles> {
    let vc_awaiters = VENTURECAPITALIST_STORAGE.with(|awaiters: &RefCell<VentureCapitalistStorage>| awaiters.borrow().clone());

    let mut vc_list: Vec<(Principal, VcWithRoles)> = Vec::new();

    for (principal, vc_internal) in vc_awaiters.iter() {
        if vc_internal.is_active {
            let roles = get_roles_for_principal(*principal);
            let vc_with_roles = VcWithRoles {
                vc_profile: vc_internal.clone(),
                roles,
            };

            vc_list.push((*principal, vc_with_roles));
        }
    }

    // Ensure the list is sorted for consistent pagination
    vc_list.sort_by_key(|(principal, _)| *principal);

    // Calculate the start and end indices for the pagination, ensuring the indices are within the bounds of the list
    let start = (pagination_params.page - 1) * pagination_params.page_size;
    let end = std::cmp::min(start + pagination_params.page_size, vc_list.len());

    // Guard against cases where the pagination request exceeds the list bounds
    if start >= vc_list.len() {
        return HashMap::new();
    }

    // Convert the appropriately sliced list segment to a HashMap
    let paginated_vc_list = vc_list[start..end].to_vec();
    let paginated_vc_map: HashMap<Principal, VcWithRoles> = paginated_vc_list.into_iter().collect();

    paginated_vc_map
}


#[update]
pub fn delete_venture_capitalist() -> std::string::String {
    let caller = caller();
    println!("Attempting to deactivate founder for caller: {:?}", caller);

    VENTURECAPITALIST_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(vc) = storage.get_mut(&caller) {
            vc.is_active = false;
            println!("Founder deactivated for caller: {:?}", caller);
        } else {
            println!("Founder not found for caller: {:?}", caller);
        }
    });
    format!("Venture Capitalist Account Has Been DeActivated")
}

#[update]
pub async fn update_venture_capitalist(params: VentureCapitalist) -> String {
    let caller = caller();

    DECLINED_VC_PROFILE_EDIT_REQUEST.with(|d_vc| {
        let exits = d_vc.borrow().contains_key(&caller);
        if exits {
            panic!("You had got your request declined earlier");
        }
    });
    let already_registered =
        VENTURECAPITALIST_STORAGE.with(|registry| registry.borrow().contains_key(&caller));

    if !already_registered {
        ic_cdk::println!("This Principal is not registered");
        return "This Principal is not registered.".to_string();
    }

    let profile_edit_request_already_sent =
        VC_PROFILE_EDIT_AWAITS.with(|registry| registry.borrow().contains_key(&caller));
    if profile_edit_request_already_sent {
        ic_cdk::println!("Wait for your previous request to get approved");
        return "Wait for your previous request to get approved. ".to_string();
    }
    VC_PROFILE_EDIT_AWAITS.with(
        |awaiters: &RefCell<HashMap<Principal, VentureCapitalist>>| {
            let mut await_ers: std::cell::RefMut<'_, HashMap<Principal, VentureCapitalist>> =
                awaiters.borrow_mut();
            await_ers.insert(caller, params.clone());
        },
    );

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

#[query]
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

#[update]
pub fn add_vc_announcement(name: String, announcement_message: String) -> String {
    let caller_id = caller();

    let current_time = time();

    VC_ANNOUNCEMENTS.with(|state| {
        let mut state = state.borrow_mut();
        let new_vc = Announcements {
            project_name: name,
            announcement_message: announcement_message,
            timestamp: current_time,
        };

        state.entry(caller_id).or_insert_with(Vec::new).push(new_vc);
        format!("Announcement added successfully at {}", current_time)
    })
}

//for testing purpose
#[query]
pub fn get_vc_announcements() -> HashMap<Principal, Vec<Announcements>> {
    VC_ANNOUNCEMENTS.with(|state| {
        let state = state.borrow();
        state.clone()
    })
}

#[update]
pub fn make_vc_active_inactive(p_id: Principal) -> String {
    let principal_id = caller();
    if p_id == principal_id || ic_cdk::api::is_controller(&principal_id) {
        VENTURECAPITALIST_STORAGE.with(|m_container| {
            let mut tutor_hashmap = m_container.borrow_mut();
            if let Some(vc_internal) = tutor_hashmap.get_mut(&p_id) {
                if vc_internal.is_active {
                    let active = false;
                    vc_internal.is_active = active;

                    //ic_cdk::println!("mentor profile check status {:?}", vc_internal);
                    return "made inactive".to_string();
                } else {
                    let active = true;
                    vc_internal.is_active = active;
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
