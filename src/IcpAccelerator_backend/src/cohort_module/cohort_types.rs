use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

use crate::mentor_module::mentor_types::*; 
use crate::project_module::project_types::*; 
use crate::vc_module::vc_types::*;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinks {
    pub link: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct Eligibility {
    pub level_on_rubric: f64,
    pub eligibility: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct Cohort {
    pub title: String,
    pub description: String,
    pub tags: String,
    pub criteria: Eligibility,
    pub no_of_seats: u64,
    pub country: String,
    pub funding_amount: String,
    pub funding_type: String,
    pub start_date: String,
    pub deadline: String,
    pub cohort_launch_date: String,
    pub cohort_end_date: String,
    pub cohort_banner: Option<Vec<u8>>,
    pub host_name: Option<String>,
    pub contact_links: Option<Vec<SocialLinks>>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct CohortDetails {
    pub cohort_id: String,
    pub cohort: Cohort,
    pub cohort_created_at: u64,
    pub cohort_creator: Principal,
    pub cohort_creator_role: Vec<String>,
    pub cohort_creator_principal: Principal,
    pub projects_applied: Option<Vec<ProjectInfoInternal>>,
    pub mentors_applied: Option<Vec<MentorInternal>>,
    pub vcs_applied: Option<Vec<VentureCapitalistInternal>>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct CohortRequest {
    pub cohort_details: CohortDetails,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub rejected_at: u64,
    pub request_status: String,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct EnrollerDataInternal {
    pub project_data: Option<ProjectInfoInternal>,
    pub mentor_data: Option<MentorInternal>,
    pub vc_data: Option<VentureCapitalistInternal>,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct CohortEnrollmentRequest {
    pub cohort_details: CohortDetails,
    pub sent_at: u64,
    pub accepted_at: u64,
    pub rejected_at: u64,
    pub request_status: String,
    pub enroller_data: EnrollerDataInternal,
    pub enroller_principal: Principal,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct InviteRequest {
    pub cohort_id: String,
    pub sender_principal: Principal,
    pub mentor_data: MentorInternal,
    pub invite_message: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct CohortFilterCriteria {
    pub tags: Option<String>,
    pub level_on_rubric: Option<f64>,
    pub no_of_seats_range: Option<(u64, u64)>,
}