use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, io::Write};
use ic_cdk::api::stable::{StableReader, StableWriter};
use std::cell::RefCell;
use bincode;
use ic_cdk::api::management_canister::main::raw_rand;
use sha2::{Digest, Sha256};
use ic_cdk_macros::{query, update};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VentureCapitalist {
    name_of_fund: Option<String>,
    email_address: Option<String>,
    telegram_id: Option<String>,
    location: Option<String>, 
    accredited_investor_status: Option<bool>,
    website_link: Option<String>,
    number_of_portfolio_companies: Option<i32>, 
    portfolio_link: Option<String>,
    investment_stage_preference: Option<String>,
    average_investment_ticket: Option<i32>, 
    assets_for_investment: Option<i32>,
    preferred_investment_sectors: Option<String>,
    revenue_range_preference: Option<String>,
    technological_focus: Option<String>,
    interest_in_board_positions: Option<bool>,
    size_of_managed_fund: Option<i32>,
    typical_decision_making_timeline_for_investments: Option<String>,
    referrer: Option<String>,
    investor_type: Option<String>,
    preferred_icp_hub: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VentureCapitalistInternal{
    pub params: VentureCapitalist,
    pub uid: String,
    pub is_active: bool,
}

pub type VentureCapitalistStorage = HashMap<Principal, VentureCapitalistInternal>;

thread_local! {
    pub static VENTURECAPITALIST_STORAGE: RefCell<VentureCapitalistStorage> = RefCell::new(VentureCapitalistStorage::new());
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
pub async fn register_venture_capitalist(params: VentureCapitalist)->std::string::String{
    let caller = caller();
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();
    let new_vc = VentureCapitalistInternal{params,uid:new_id.clone(), is_active: true };

    println!("Registering VC for caller: {:?}", caller);
    VENTURECAPITALIST_STORAGE.with(|storage| {

        let mut storage = storage.borrow_mut();
        if storage.contains_key(&caller) {
            panic!("VC with this Principal ID already exists");
        } else {
            storage.insert(caller, new_vc);
            println!("VC Registered {:?}", caller);
        }
    });
    format!("VC registered successfully with ID: {}", new_id)
}


#[query]
pub fn get_vc_info() -> Option<VentureCapitalist> {
    let caller = caller();
    println!("Fetching founder info for caller: {:?}", caller);
    VENTURECAPITALIST_STORAGE.with(|registry| 
        registry.borrow().get(&caller).map(|vc_internal| vc_internal.params.clone())
    )
}

#[query]
pub fn list_all_vcs() -> Vec<VentureCapitalist> {
    VENTURECAPITALIST_STORAGE.with(|storage| 
        storage
            .borrow()
            .values()
            .map(|vc_internal| vc_internal.params.clone()) 
            .collect() 
    )
}

#[update]
pub fn delete_venture_capitalist()->std::string::String {
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
pub fn update_venture_capitalist(params: VentureCapitalist){
    let caller = caller();

    let result = VENTURECAPITALIST_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(vc_internal) = storage.get_mut(&caller) {
            vc_internal.params.name_of_fund = params.name_of_fund.or(vc_internal.params.name_of_fund.clone());
            vc_internal.params.email_address = params.email_address.or(vc_internal.params.email_address.clone());
            vc_internal.params.telegram_id = params.telegram_id.or(vc_internal.params.telegram_id.clone());
            vc_internal.params.location = params.location.or(vc_internal.params.location.clone());
            vc_internal.params.accredited_investor_status = params.accredited_investor_status.or(vc_internal.params.accredited_investor_status);
            vc_internal.params.website_link = params.website_link.or(vc_internal.params.website_link.clone());
            vc_internal.params.number_of_portfolio_companies = params.number_of_portfolio_companies.or(vc_internal.params.number_of_portfolio_companies);
            vc_internal.params.portfolio_link = params.portfolio_link.or(vc_internal.params.portfolio_link.clone());
            vc_internal.params.investment_stage_preference = params.investment_stage_preference.or(vc_internal.params.investment_stage_preference.clone());
            vc_internal.params.average_investment_ticket = params.average_investment_ticket.or(vc_internal.params.average_investment_ticket);
            vc_internal.params.assets_for_investment = params.assets_for_investment.or(vc_internal.params.assets_for_investment.clone());
            vc_internal.params.preferred_investment_sectors = params.preferred_investment_sectors.or(vc_internal.params.preferred_investment_sectors.clone());
            vc_internal.params.revenue_range_preference = params.revenue_range_preference.or(vc_internal.params.revenue_range_preference.clone());
            vc_internal.params.technological_focus = params.technological_focus.or(vc_internal.params.technological_focus.clone());
            vc_internal.params.interest_in_board_positions = params.interest_in_board_positions.or(vc_internal.params.interest_in_board_positions);
            vc_internal.params.size_of_managed_fund = params.size_of_managed_fund.or(vc_internal.params.size_of_managed_fund.clone());
            vc_internal.params.typical_decision_making_timeline_for_investments = params.typical_decision_making_timeline_for_investments.or(vc_internal.params.typical_decision_making_timeline_for_investments.clone());
            vc_internal.params.referrer = params.referrer.or(vc_internal.params.referrer.clone());
            vc_internal.params.investor_type = params.investor_type.or(vc_internal.params.investor_type.clone());
            vc_internal.params.preferred_icp_hub = params.preferred_icp_hub.or(vc_internal.params.preferred_icp_hub.clone());

            "Venture Capitalist profile updated successfully.".to_string()
        } else {
            "Venture Capitalist profile not found.".to_string()
        }
    });
}
