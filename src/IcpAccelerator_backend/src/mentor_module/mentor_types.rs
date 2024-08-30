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
    pub multichain: Option<Vec<String>>,
    pub years_of_mentoring: String,
    pub website: Option<String>,
    pub area_of_expertise: Vec<String>,
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
    pub profile_completion: u8,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default, PartialEq)]
pub struct MentorFilterCriteria {
    pub country: Option<String>,
    pub area_of_expertise: Option<String>,
}

impl MentorInternal {
    pub fn calculate_completion_percentage(&self) -> u8 {
        let mut total_fields = 7; 
        let mut filled_fields = total_fields; 

        filled_fields += self.profile.preferred_icp_hub.is_some() as usize;
        filled_fields += self.profile.existing_icp_project_porfolio.is_some() as usize;
        filled_fields += self.profile.links.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.profile.multichain.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.profile.website.is_some() as usize;
        filled_fields += self.profile.reason_for_joining.is_some() as usize;
        filled_fields += self.profile.hub_owner.is_some() as usize;

        total_fields += 7; 

        ((filled_fields as f64 / total_fields as f64) * 100.0).round() as u8
    }

    pub fn update_completion_percentage(&mut self) {
        self.profile_completion = self.calculate_completion_percentage();
    }
}

