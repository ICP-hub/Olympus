use crate::project_module::project_types::*;
use crate::user_modules::user_types::*;
use crate::types::individual_types::*;
use crate::cohort_module::cohort_types::*;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationParams {
    pub page: usize,
    pub page_size: usize,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ListAllProjects {
    pub params: ProjectInfoInternal,
    pub overall_average: Option<f64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationReturnProjectData {
    pub data: Vec<(Principal, ListAllProjects, UserInformation)>,
    pub count: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaginationReturnVcData {
    pub data: Vec<(Principal, VcWithRoles, UserInformation)>,
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
    pub data: Vec<(Principal, MentorWithRoles, UserInformation)>,
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
    pub upoming_cohorts: Vec<CohortDetails>,
    pub present_cohorts: Vec<CohortDetails>,
    pub past_cohorts: Vec<CohortDetails>,
    pub total_count: usize,
}