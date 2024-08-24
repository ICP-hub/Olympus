use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinksMentor {
    pub link: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorProfile {
    pub preferred_icp_hub: Option<String>,
    pub existing_icp_mentor: bool,
    pub existing_icp_project_porfolio: Option<String>,
    pub icp_hub_or_spoke: bool,
    pub category_of_mentoring_service: String,
    pub links: Option<Vec<SocialLinksMentor>>,
    pub multichain: Option<String>,
    pub years_of_mentoring: String,
    pub website: Option<String>,
    pub area_of_expertise: String,
    pub reason_for_joining: Option<String>,
    pub hub_owner: Option<String>,
}

impl MentorProfile {
    pub fn validate(&self) -> Result<(), String> {
        if let Some(ref preferred_icp_hub) = self.preferred_icp_hub {
            if preferred_icp_hub.trim().is_empty() {
                return Err("Field cannot be empty".into());
            }
        }
        if self.years_of_mentoring.is_empty() {
            return Err("Years Of Mentoring is a required field.".to_string());
        }
        if self.area_of_expertise.is_empty() {
            return Err("Area of expertise is a required field.".to_string());
        }
        Ok(())
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorUpdateRequest {
    pub original_info: Option<MentorProfile>,
    pub updated_info: Option<MentorProfile>,
    pub approved_at: u64,
    pub rejected_at: u64,
    pub sent_at: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorInternal {
    pub profile: MentorProfile,
    pub uid: String,
    pub active: bool,
    pub approve: bool,
    pub decline: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorFilterCriteria {
    pub country: Option<String>,
    pub area_of_expertise: Option<String>,
}
