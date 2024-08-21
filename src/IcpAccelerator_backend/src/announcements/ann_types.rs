use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MAnnouncements {
    pub project_name: String,
    pub announcement_message: String,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct Announcements {
    pub project_id: String,
    pub announcement_title: String,
    pub announcement_description: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct AnnouncementsInternal {
    pub announcement_data: Announcements,
    pub timestamp: u64,
    pub project_name: String,
    pub project_desc: Option<String>,
    pub project_logo: Option<Vec<u8>>,
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct VAnnouncements {
    pub vc_name: String,
    pub announcement_title: String,
    pub announcement_description: String,
}