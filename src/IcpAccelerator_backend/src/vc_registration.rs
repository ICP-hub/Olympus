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

// #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
// pub enum RegisteredUnderAnyHub{
//     Yes(String),
//     No,
// }

// #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
// enum MultiChainProjects {
//     None,
//     Single(String),
//     Multiple(Vec<String>),
// }


#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VentureCapitalist {
    name_of_fund:String,
    fund_size: f64,
    assets_under_management:String, 
    logo:Vec<u8>,
    registered_under_any_hub:Option<String>,
    average_check_size:f64,
    existing_icp_investor:bool,
    money_invested:f64,
    existing_icp_portfolio:String,
    type_of_investment:String,
    project_on_multichain:Option<String>,
    category_of_investment:String,
    reason_for_joining:String,
    preferred_icp_hub:String,
    investor_type:String,
    number_of_portfolio_companies:u16,
    portfolio_link:String,
    announcement_details:String


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


pub async fn register_venture_capitalist(mut params: VentureCapitalist)-> String{
    let caller = caller();
    let uuids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&uuids));
    let new_id = uid.clone().to_string();
    let fund_size = (params.fund_size * 100.0).round() / 100.0;
    params.fund_size = fund_size;
    let average_check_size = (params.average_check_size * 100.0).round() / 100.0;
    params.average_check_size = average_check_size;
    let money_invested = (params.money_invested * 100.0).round() / 100.0;
    params.money_invested = money_invested;



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


pub fn get_vc_info() -> Option<VentureCapitalist> {
    let caller = caller();
    println!("Fetching founder info for caller: {:?}", caller);
    VENTURECAPITALIST_STORAGE.with(|registry| 
        registry.borrow().get(&caller).map(|vc_internal| vc_internal.params.clone())
    )
}


pub fn list_all_vcs() -> Vec<VentureCapitalist> {
    VENTURECAPITALIST_STORAGE.with(|storage| 
        storage
            .borrow()
            .values()
            .map(|vc_internal| vc_internal.params.clone()) 
            .collect() 
    )
}


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


pub fn update_venture_capitalist(params: VentureCapitalist) {
    let caller = caller();

    let result = VENTURECAPITALIST_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        // Attempt to get a mutable reference to the VentureCapitalistInternal object for the caller
        if let Some(vc_internal) = storage.get_mut(&caller) {
            // Update only the params field of the VentureCapitalistInternal object
            vc_internal.params = params;

            "Venture Capitalist profile updated successfully.".to_string()
        } else {
            "Venture Capitalist profile not found.".to_string()
        }
    });
}
