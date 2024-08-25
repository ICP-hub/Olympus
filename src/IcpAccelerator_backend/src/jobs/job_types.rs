use candid::CandidType;
use serde::{Deserialize, Serialize};
use crate::user_modules::user_types::*;

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
    pub job_poster : Option<UserInformation>,
}