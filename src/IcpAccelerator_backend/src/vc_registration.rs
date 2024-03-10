use crate::admin::send_approval_request;
use bincode;
use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::stable::{StableReader, StableWriter};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::{collections::HashMap, io::Write};
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VentureCapitalist {
    name_of_fund: String,
    fund_size: f64,
    assets_under_management: String,
    logo: Vec<u8>,
    registered_under_any_hub: Option<String>,
    average_check_size: f64,
    existing_icp_investor: bool,
    money_invested: f64,
    existing_icp_portfolio: String,
    type_of_investment: String,
    project_on_multichain: Option<String>,
    category_of_investment: String,
    reason_for_joining: String,
    preferred_icp_hub: String,
    investor_type: String,
    number_of_portfolio_companies: u16,
    portfolio_link: String,
    announcement_details: String,
}

impl VentureCapitalist {
    //validation functions for Vc
    pub fn validate(&self) -> Result<(), String> {
        if self.fund_size == 0.0 || self.fund_size.is_nan() {
            return Err("Invalid input for funds size".into());
        }

        if self.money_invested == 0.0 || self.money_invested.is_nan() {
            return Err("Invalid input for funds size".into());
        }

        if self.average_check_size == 0.0 || self.average_check_size.is_nan() {
            return Err("Invalid input for funds size".into());
        }

        if self.logo.is_empty() {
            return Err("Add a logo".into());
        }

        if let Some(ref registered_under_any_hub) = self.registered_under_any_hub {
            if registered_under_any_hub.trim().is_empty() {
                return Err("Field cannot be empty".into());
            }
        }

        if let Some(ref project_on_multichain) = self.project_on_multichain {
            if project_on_multichain.trim().is_empty() {
                return Err("Field cannot be empty".into());
            }
        }

        if self.number_of_portfolio_companies <= u16::MIN
            || self.number_of_portfolio_companies > u16::MAX
        {
            return Err("Invalid Value".into());
        }

        Ok(())
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VentureCapitalistInternal {
    pub params: VentureCapitalist,
    pub uid: String,
    pub is_active: bool,
    pub approve: bool,
    pub decline: bool,
}

pub type VentureCapitalistStorage = HashMap<Principal, VentureCapitalistInternal>;

thread_local! {
    pub static VENTURECAPITALIST_STORAGE: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
    pub static VC_AWAITS_RESPONSE: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
    pub static DECLINED_VC_REQUESTS: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
}

pub fn pre_upgrade() {
    VENTURECAPITALIST_STORAGE.with(|registry| {
        let serialized = bincode::serialize(&*registry.borrow()).expect("Serialization failed");

        let mut writer = StableWriter::default();
        writer
            .write(&serialized)
            .expect("Failed to write to stable storage");
    });
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

    match params.validate() {
        Ok(_) => {
            println!("Validation passed!");
            let fund_size = (params.fund_size * 100.0).round() / 100.0;
            params.fund_size = fund_size;
            let average_check_size = (params.average_check_size * 100.0).round() / 100.0;
            params.average_check_size = average_check_size;
            let money_invested = (params.money_invested * 100.0).round() / 100.0;
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
                    await_ers.insert(caller, new_vc);
                },
            );

            let res = send_approval_request().await;

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
pub fn list_all_vcs() -> Vec<VentureCapitalist> {
    VENTURECAPITALIST_STORAGE.with(|storage| {
        storage
            .borrow()
            .values()
            .map(|vc_internal| vc_internal.params.clone())
            .collect()
    })
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
pub fn update_venture_capitalist(params: VentureCapitalist) -> String {
    let caller = caller();

    let result = VENTURECAPITALIST_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        // Attempt to get a mutable reference to the VentureCapitalistInternal object for the caller
        if let Some(vc_internal) = storage.get_mut(&caller) {
            // Update only the params field of the VentureCapitalistInternal object
            vc_internal.params.registered_under_any_hub = params
                .registered_under_any_hub
                .or(vc_internal.params.registered_under_any_hub.clone());

            vc_internal.params.project_on_multichain = params
                .project_on_multichain
                .or(vc_internal.params.project_on_multichain.clone());

            vc_internal.params.fund_size = (params.fund_size * 100.0).round() / 100.0;
            vc_internal.params.assets_under_management = params.assets_under_management;
            vc_internal.params.announcement_details = params.announcement_details;
            vc_internal.params.category_of_investment = params.category_of_investment;
            vc_internal.params.existing_icp_portfolio = params.existing_icp_portfolio;
            vc_internal.params.logo = params.logo;
            vc_internal.params.average_check_size =
                (params.average_check_size * 100.0).round() / 100.0;
            vc_internal.params.existing_icp_investor = params.existing_icp_investor;
            vc_internal.params.investor_type = params.investor_type;
            vc_internal.params.number_of_portfolio_companies = params.number_of_portfolio_companies;
            vc_internal.params.portfolio_link = params.portfolio_link;
            vc_internal.params.reason_for_joining = params.reason_for_joining;
            vc_internal.params.name_of_fund = params.name_of_fund;
            vc_internal.params.money_invested = params.money_invested;
            vc_internal.params.preferred_icp_hub = params.preferred_icp_hub;
            vc_internal.params.type_of_investment = params.type_of_investment;

            "Venture Capitalist profile updated successfully.".to_string()
        } else {
            "Venture Capitalist profile not found.".to_string()
        }
    });
    result
}
