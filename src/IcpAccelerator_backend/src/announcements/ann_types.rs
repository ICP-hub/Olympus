use candid::CandidType;
use serde::{Deserialize, Serialize};

use crate::{MentorInternal, ProjectInfoInternal, VentureCapitalistInternal};

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
    pub timestamp: u64,
    pub announcement_id: String,
}
