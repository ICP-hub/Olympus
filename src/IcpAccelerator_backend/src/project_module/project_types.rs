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
    pub mentors_assigned: Option<Vec<MentorProfile>>,
    pub vc_assigned: Option<Vec<VentureCapitalist>>,
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
        if let Some(ref preferred_icp_hub) = self.preferred_icp_hub {
            if preferred_icp_hub.trim().is_empty() {
                return Err("Field cannot be empty".into());
            }
        }

        // if let Some(ref exisitng_icp_project_porfolio) = self.existing_icp_project_porfolio {
        //     if exisitng_icp_project_porfolio.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
        //     }
        // }

        // if let Some(ref multichain) = self.multichain {
        //     if multichain.trim().is_empty() {
        //         return Err("Field cannot be empty".into());
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
    pub mentors_assigned: Option<Vec<MentorProfile>>,
    pub vc_assigned: Option<Vec<VentureCapitalist>>,
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
    pub target_amount: Option<f64>,
    pub icp_grants: Option<String>,
    pub investors: Option<String>,
    pub sns: Option<String>,
    pub raised_from_other_ecosystem: Option<String>,
}

impl MoneyRaised {
    // Calculates the total amount raised from various sources.
    // Assumes all Option<String> fields represent valid f64 values or None.
    pub fn _total_amount(&self) -> f64 {
        let mut total: f64 = 0.0;

        if let Some(icp_grants) = &self.icp_grants {
            total += icp_grants.parse::<f64>().unwrap_or(0.0);
        }
        if let Some(investors) = &self.investors {
            total += investors.parse::<f64>().unwrap_or(0.0);
        }
        if let Some(sns) = &self.sns {
            total += sns.parse::<f64>().unwrap_or(0.0);
        }
        if let Some(raised_from_other_ecosystem) = &self.raised_from_other_ecosystem {
            total += raised_from_other_ecosystem.parse::<f64>().unwrap_or(0.0);
        }

        total
    }
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
    pub mentor_associated: Option<Vec<MentorProfile>>,
    pub vc_associated: Option<Vec<VentureCapitalist>>,
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