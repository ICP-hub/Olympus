use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Jobs {
    pub title: String,
    pub description: String,
    pub category: String,
    pub link: String,
    pub location: String,
    pub job_type: String,
}


#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct JobsInternal {
    pub job_id: String,
    pub job_data: Jobs,
    pub timestamp: u64,
    pub job_poster : Principal,
}