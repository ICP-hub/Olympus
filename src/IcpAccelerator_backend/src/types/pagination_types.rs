use crate::project_module::project_types::*;
use crate::user_modules::user_types::*;
use crate::types::individual_types::*;
use crate::cohort_module::cohort_types::*;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::state_handler::*;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParams {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Clone)]
pub struct ListAllProjects {
    pub principal: StoredPrincipal,
    pub params: ProjectInfoInternal,
    pub overall_average: Option<f64>,
}

#[derive(CandidType, Clone)]
pub struct PaginationReturnProjectData {
    pub data: Vec<ListAllProjects>,
    pub user_data: HashMap<Principal, UserInformation>,
    pub count: u64,
}

#[derive(CandidType, Clone,Deserialize)]
pub struct PaginationReturnVcData {
    pub data: HashMap<Principal, VcWithRoles>,
    pub user_data: HashMap<Principal, UserInformation>,
    pub count: u64,
}


#[derive(CandidType, Deserialize)]
pub struct PaginationUser {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParamMentor {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationReturnMentor {
    pub data: HashMap<Principal, MentorWithRoles>,
    pub user_data: HashMap<Principal, UserInformation>,
    pub count: u64,
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct Pagination {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Debug, Clone, Serialize, Deserialize)]
pub struct PaginationReturnCohort {
    pub data: Vec<CohortDetails>,
    pub total_count: usize,
}