use candid::{CandidType, Principal};
use ic_cdk::api::{management_canister::main::raw_rand, time};
use ic_cdk::caller;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk_macros::{query, update};
use serde::Deserialize;
use crate::MENTOR_REGISTRY;

#[derive(Clone, CandidType, Deserialize)]
pub struct Eligibility {
    level_on_rubric: f64,
    eligibility: Option<String>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Cohort {
    title: String,
    description: String,
    tags: String,
    criteria: Eligibility,
    no_of_seats: u8,
    deadline: String,
    cohort_launch_date: String,
    cohort_end_date: String,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct CohortDetails {
    uid: String,
    cohort: Cohort,
    created_at: u64,
}

pub type CohortInfo = HashMap<Principal, Vec<CohortDetails>>;

thread_local! {
    pub static COHORT : RefCell<CohortInfo> = RefCell::new(CohortInfo::new());
}

#[update]
pub async fn create_cohort(params: Cohort) -> String{
    
    let is_he_mentor = MENTOR_REGISTRY.with(|storage|{  
        let storage = storage.borrow();
        storage.contains_key(&caller())
    });

    if !is_he_mentor{
        return format!("you are not a mentor");
    }
    
    let u_ids = raw_rand().await.unwrap().0;
    let uid = format!("{:x}", Sha256::digest(&u_ids));

    let cohort_details = CohortDetails {
        uid,
        cohort : params.clone(),
        created_at: time(),
    };

    COHORT.with(|storage|{
        let mut storage = storage.borrow_mut();
        storage.entry(caller()).or_insert_with(Vec::new).push(cohort_details);
    });

    format!("accelerator is successfully created by {}", caller())

}

#[query]
pub fn get_cohort() -> Vec<CohortDetails>{
    COHORT.with(|storage|{
        let res = storage.borrow().get(&caller()).expect("you have not crerated a cohort").clone();
        res
    })
}

#[query]
pub fn get_all_cohorts() -> Vec<CohortDetails> {
    COHORT.with(|storage| {
        storage
            .borrow()
            .values()
            .flat_map(|v| v.iter().cloned()) 
            .collect()
    })
}