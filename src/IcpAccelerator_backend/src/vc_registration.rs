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
    id: Option<String>,
    name_of_fund: Option<String>,
    email_address: Option<String>,
    telegram_id: Option<String>,
    location: Option<String>, // Assuming "City, Country" format
    accredited_investor_status: Option<bool>,
    website_link: Option<String>,
    number_of_portfolio_companies: Option<u32>, // Assuming 'number' refers to an unsigned integer
    portfolio_link: Option<String>,
    investment_stage_preference: Option<String>,
    average_investment_ticket: Option<u64>, // Assuming 'number' refers to an unsigned integer for Amount in $
    assets_for_investment: Option<String>,
    preferred_investment_sectors: Option<String>,
    revenue_range_preference: Option<String>,
    technological_focus: Option<String>,
    interest_in_board_positions: Option<bool>,
    size_of_managed_fund: Option<String>,
    typical_decision_making_timeline_for_investments: Option<String>,
    referrer: Option<String>,
    investor_type: Option<String>,
    is_active: Option<bool>,
    preferred_icp_hub: Option<String>,
}

pub type VentureCapitalistStorage = HashMap<Principal, VentureCapitalist>;

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
    let mut new_vc = VentureCapitalist{
        id: Some(new_id.clone()),
        name_of_fund: params.name_of_fund,
        email_address: params.email_address,
        telegram_id: params.telegram_id,
        location: params.location, // Assuming "City, Country" format
        accredited_investor_status: params.accredited_investor_status,
        website_link: params.website_link,
        number_of_portfolio_companies: params.number_of_portfolio_companies, // Assuming 'number' refers to an unsigned integer
        portfolio_link: params.portfolio_link,
        investment_stage_preference: params.investment_stage_preference,
        average_investment_ticket: params.average_investment_ticket, // Assuming 'number' refers to an unsigned integer for Amount in $
        assets_for_investment: params.assets_for_investment,
        preferred_investment_sectors: params.preferred_investment_sectors,
        // Optional fields
        revenue_range_preference: params.revenue_range_preference,
        technological_focus: params.technological_focus,
        interest_in_board_positions: params.interest_in_board_positions,
        size_of_managed_fund: params.size_of_managed_fund,
        typical_decision_making_timeline_for_investments: params.typical_decision_making_timeline_for_investments,
        referrer: params.referrer,
        investor_type: params.investor_type,
        is_active: Some(true),
        preferred_icp_hub: params.preferred_icp_hub,
    };

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
    VENTURECAPITALIST_STORAGE.with(|registry| registry.borrow().get(&caller).cloned())
}

#[query]
pub fn list_all_vcs() -> Vec<VentureCapitalist> {
    VENTURECAPITALIST_STORAGE.with(|storage| storage.borrow().values().cloned().collect())
}

#[update]
pub fn delete_venture_capitalist()->std::string::String {
    let caller = caller();
    println!("Attempting to deactivate founder for caller: {:?}", caller);

    VENTURECAPITALIST_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(vc) = storage.get_mut(&caller) {
            vc.is_active = Some(false); // Mark the founder as inactive instead of deleting
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

    VENTURECAPITALIST_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(vc) = storage.get_mut(&caller) {
            vc.name_of_fund = params.name_of_fund.or(vc.name_of_fund.clone());
            vc.email_address = params.email_address.or(vc.email_address.clone());
            vc.telegram_id = params.telegram_id.or(vc.telegram_id.clone());
            vc.location = params.location.or(vc.location.clone());
            vc.accredited_investor_status = params.accredited_investor_status.or(vc.accredited_investor_status);
            vc.website_link = params.website_link.or(vc.website_link.clone());
            vc.number_of_portfolio_companies = params.number_of_portfolio_companies.or(vc.number_of_portfolio_companies);
            vc.portfolio_link = params.portfolio_link.or(vc.portfolio_link.clone());
            vc.investment_stage_preference = params.investment_stage_preference.or(vc.investment_stage_preference.clone());
            vc.average_investment_ticket = params.average_investment_ticket.or(vc.average_investment_ticket);
            vc.assets_for_investment = params.assets_for_investment.or(vc.assets_for_investment.clone());
            vc.preferred_investment_sectors = params.preferred_investment_sectors.or(vc.preferred_investment_sectors.clone());
            vc.revenue_range_preference = params.revenue_range_preference.or(vc.revenue_range_preference.clone());
            vc.technological_focus = params.technological_focus.or(vc.technological_focus.clone());
            vc.interest_in_board_positions = params.interest_in_board_positions.or(vc.interest_in_board_positions);
            vc.size_of_managed_fund = params.size_of_managed_fund.or(vc.size_of_managed_fund.clone());
            vc.typical_decision_making_timeline_for_investments = params.typical_decision_making_timeline_for_investments.or(vc.typical_decision_making_timeline_for_investments.clone());
            vc.referrer = params.referrer.or(vc.referrer.clone());
            vc.investor_type = params.investor_type.or(vc.investor_type.clone());
            vc.preferred_icp_hub = params.preferred_icp_hub.or(vc.preferred_icp_hub.clone());
            println!("Founder profile updated for caller: {:?}", caller);
        } else {
            // Optionally handle the case where a founder does not exist
            println!("Founder profile not found for caller: {:?}", caller);
        }
    });
}