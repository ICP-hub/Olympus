use candid::CandidType;
use serde::{Deserialize, Serialize};

use crate::{MentorInternal, ProjectInfoInternal, UserInfoInternal, VentureCapitalistInternal};

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Announcements {
    pub announcement_title: String,
    pub announcement_description: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct AnnouncementsInternal {
    pub announcement_data: Announcements,
    pub project_info: Option<ProjectInfoInternal>,
    pub mentor_info: Option<MentorInternal>,
    pub vc_info: Option<VentureCapitalistInternal>,
    pub user_data: Option<UserInfoInternal>,
    pub timestamp: u64,
    pub announcement_id: String,
}
