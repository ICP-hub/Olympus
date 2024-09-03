use crate::vc_module::vc_types::*;
use crate::user_modules::user_types::*;
use crate::mentor_module::mentor_types::*;
use crate::types::ratings_types::RatingAverages;
use candid::{CandidType, Principal};
use ic_cdk::api::time;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct TeamMember {
    pub member_uid: String,
    pub member_data: UserInformation,
    pub member_principal: Principal
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinksProject{
    pub link: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfo {
    pub project_name: String,
    pub project_logo: Option<Vec<u8>>,
    pub preferred_icp_hub: Option<String>,
    pub live_on_icp_mainnet: Option<bool>,
    pub money_raised_till_now: Option<bool>,
    pub supports_multichain: Option<String>,
    pub project_elevator_pitch: Option<String>,
    pub project_area_of_focus: String,
    pub promotional_video: Option<String>,
    pub reason_to_join_incubator: String,
    pub project_description: Option<String>, //
    pub project_cover: Option<Vec<u8>>,
    pub project_team: Option<Vec<TeamMember>>,
    pub token_economics: Option<String>,
    pub technical_docs: Option<String>,
    pub long_term_goals: Option<String>,
    pub target_market: Option<String>, //
    pub self_rating_of_project: f64,
    pub mentors_assigned: Option<Vec<(MentorProfile, UserInfoInternal)>>,
    pub vc_assigned: Option<Vec<(VentureCapitalist, UserInfoInternal)>>,
    pub project_website: Option<String>,
    pub links: Option<Vec<SocialLinksProject>>,
    pub money_raised: Option<MoneyRaised>,
    pub upload_private_documents: Option<bool>,
    pub private_docs: Option<Vec<Docs>>,
    pub public_docs: Option<Vec<Docs>>,
    pub dapp_link: Option<String>,
    pub weekly_active_users: Option<u64>,
    pub revenue: Option<u64>,
    pub is_your_project_registered: Option<bool>,
    pub type_of_registration: Option<String>,
    pub country_of_registration: Option<String>,
}

impl ProjectInfo {
    pub fn validate(&self) -> Result<(), String> {
        if self.project_name.is_empty() {
            return Err("Project name is a required field.".to_string());
        }
        if self.project_area_of_focus.is_empty() {
            return Err("Project area of focus is a required field.".to_string());
        }
        if self.reason_to_join_incubator.is_empty() {
            return Err("Reason to join incubator is a required field.".to_string());
        }
        // if let Some(project_description) = &self.project_description {
        //     if crate::guard::contains_html_tags(project_description) {
        //         return Err("Bio contains HTML tags, which are not allowed.".into());
        //     }
        // }
        Ok(())
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectPublicInfo {
    pub project_id: String,
    pub project_name: String,
    pub project_logo: Option<Vec<u8>>,
    pub preferred_icp_hub: Option<String>,
    pub live_on_icp_mainnet: Option<bool>,
    pub money_raised_till_now: Option<bool>,
    pub supports_multichain: Option<String>,
    pub project_elevator_pitch: Option<String>,
    pub project_area_of_focus: String,
    pub promotional_video: Option<String>,
    pub reason_to_join_incubator: String,
    pub project_description: Option<String>,
    pub project_cover: Option<Vec<u8>>,
    pub project_team: Option<Vec<TeamMember>>,
    pub token_economics: Option<String>,
    pub technical_docs: Option<String>,
    pub long_term_goals: Option<String>,
    pub target_market: Option<String>,
    pub self_rating_of_project: f64,
    pub project_website: Option<String>,
    pub links: Option<Vec<SocialLinksProject>>,
    pub upload_private_documents: Option<bool>,
    pub public_docs: Option<Vec<Docs>>,
    pub dapp_link: Option<String>,
}

#[derive(Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectPublicInfoInternal {
    pub params: ProjectPublicInfo,
    pub uid: String,
    pub is_active: bool,
    pub is_verified: bool,
    pub creation_date: u64,
}

impl ProjectInfo {}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Docs {
    title: String,
    link: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct MoneyRaised {
    pub target_amount: f64,
    pub icp_grants: String,
    pub investors: String,
    pub sns: String,
    pub raised_from_other_ecosystem: String,
}



#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoForUser {
    pub project_name: Option<String>,
    pub project_logo: Option<Vec<u8>>,
    pub project_description: Option<String>,
    pub community_rating: Option<RatingAverages>,
    pub project_cover: Option<Vec<u8>>,
    pub project_website: Option<String>,
    pub promotional_video: Option<String>,
    pub links: Option<Vec<SocialLinksProject>>,
    pub project_team: Option<Vec<TeamMember>>,
    pub dapp_link: Option<String>,
    pub weekly_active_users: Option<u64>,
    pub date_of_joining: Option<u64>,
    pub team_member_info: Option<Vec<TeamMember>>,
    pub live_link_of_project: Option<String>,
    pub area_of_focus: Option<String>,
    pub country_of_project: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoForUserInternal {
    pub params: ProjectInfoForUser,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct ProjectInfoInternal {
    pub params: ProjectInfo,
    pub uid: String,
    pub is_active: bool,
    pub is_verified: bool,
    pub creation_date: u64,
    pub profile_completion: u8,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationProject {
    pub notifiation_id: String,
    pub project_id: String,
    pub message: String,
    pub notification_sender: NotificationSender,
    pub notification_verifier: NotificationVerifier,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationSender {
    pub name: String,
    pub image: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationVerifier {
    pub name: String,
    pub image: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct NotificationForOwner {
    pub sender_name: String,
    pub sender_image: Vec<u8>,
    pub message: String,
    pub project_id: String,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Blog {
    pub blog_url: String,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct FilterCriteria {
    pub country: Option<String>,
    pub rating_range: Option<(f64, f64)>,
    pub area_of_focus: Option<String>,
    pub money_raised_range: Option<(f64, f64)>,
    pub mentor_name: Option<String>,
    pub vc_name: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
pub struct ProjectVecWithRoles {
    pub project_profile: Vec<ProjectInfoInternal>,
    pub roles: Vec<Role>,
}


#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct SpotlightDetails {
    pub added_by: Principal,
    pub project_id: String,
    pub project_details: ProjectInfoInternal,
    pub approval_time: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AccessRequest {
    pub sender: Principal,
    pub name: String,
    pub image: Vec<u8>,
    pub project_id: String,
    pub request_type: String,
    pub status: String,
}
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ProjectNotificationType {
    AccessRequest(AccessRequest),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProjectNotification {
    pub notification_type: ProjectNotificationType,
    pub timestamp: u64,
}

#[derive(CandidType, Clone, Serialize, Deserialize, Debug)]
pub struct ProjectReview {
    pub name: String,
    pub profile_pic: Vec<u8>,
    pub message: String,
    pub timestamp: u64,
    pub tag: String,
    pub rating: u32,
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct ProjectRatingStruct {
    pub rating: u32,
    pub message: String,
    pub project_id: String,
}

impl ProjectReview {
    pub fn new(
        name: String,
        profile_pic: Vec<u8>,
        message: String,
        rating: u32,
    ) -> Result<ProjectReview, &'static str> {
        if rating > 5 {
            return Err("Rating must be between 0.0 and 5.0");
        }

        let rating_int = (rating * 10) as i32;

        let tag = match rating_int {
            0..=10 => "Needs Improvement",
            11..=20 => "Fair",
            21..=30 => "Good",
            31..=40 => "Very Good",
            41..=50 => "Excellent",
            _ => "Unknown",
        }
        .to_string();

        Ok(ProjectReview {
            name,
            profile_pic,
            message,
            timestamp: time(),
            tag,
            rating,
        })
    }
}

impl ProjectInfoInternal {
    pub fn calculate_completion_percentage(&self) -> u8 {
        let mut total_fields = 6;  
        let mut filled_fields = total_fields; 

        filled_fields += self.params.project_logo.is_some() as usize;
        filled_fields += self.params.preferred_icp_hub.is_some() as usize;
        filled_fields += self.params.live_on_icp_mainnet.is_some() as usize;
        filled_fields += self.params.money_raised_till_now.is_some() as usize;
        filled_fields += self.params.supports_multichain.is_some() as usize;
        filled_fields += self.params.project_elevator_pitch.is_some() as usize;
        filled_fields += self.params.promotional_video.is_some() as usize;
        filled_fields += self.params.project_description.is_some() as usize;
        filled_fields += self.params.project_cover.is_some() as usize;
        filled_fields += self.params.project_team.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.params.token_economics.is_some() as usize;
        filled_fields += self.params.technical_docs.is_some() as usize;
        filled_fields += self.params.long_term_goals.is_some() as usize;
        filled_fields += self.params.target_market.is_some() as usize;
        filled_fields += self.params.mentors_assigned.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.params.vc_assigned.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.params.project_website.is_some() as usize;
        filled_fields += self.params.links.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.params.money_raised.is_some() as usize;
        filled_fields += self.params.upload_private_documents.is_some() as usize;
        filled_fields += self.params.private_docs.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.params.public_docs.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.params.dapp_link.is_some() as usize;
        filled_fields += self.params.weekly_active_users.is_some() as usize;
        filled_fields += self.params.revenue.is_some() as usize;
        filled_fields += self.params.is_your_project_registered.is_some() as usize;
        filled_fields += self.params.type_of_registration.is_some() as usize;
        filled_fields += self.params.country_of_registration.is_some() as usize;

        total_fields += 24; 

        ((filled_fields as f64 / total_fields as f64) * 100.0).round() as u8
    }

    pub fn update_completion_percentage(&mut self) {
        self.profile_completion = self.calculate_completion_percentage();
    }
}