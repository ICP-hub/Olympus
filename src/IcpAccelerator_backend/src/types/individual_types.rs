use crate::mentor_module::mentor_types::*;
use crate::user_modules::user_types::*;
use crate::vc_module::vc_types::*;
use crate::project_module::project_types::*;
use ic_certified_assets::types::Key;
use serde::{Deserialize, Serialize};
use candid::{CandidType, Nat};
use serde_bytes::ByteBuf;


// ---> LEADERBOARD
#[derive(Debug, Clone, PartialEq, CandidType)]
pub struct LeaderboardEntryForUpvote {
    pub project_id: Option<String>,
    pub upvote_count: Option<Nat>,
}

#[derive(Debug, Clone, PartialEq, CandidType)]
pub struct LeaderboardEntryForLikes {
    pub project_id: Option<String>,
    pub like_count: Option<Nat>,
}

#[derive(Debug, Clone, PartialEq, CandidType)]
pub struct LeaderboardEntryForRatings {
    pub project_id: Option<String>,
    pub average_rating: Option<f64>,
}


// --> MENTOR INVESTOR RATINGS
#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct RatingMentorInvestor {
    pub value: f64,
    pub comment: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct TimestampedRatingMentorInvestor {
    pub rating: RatingMentorInvestor,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
pub struct MentorWithRoles {
    pub mentor_profile: MentorInternal,
    pub roles: Vec<Role>,
}
#[derive(Debug, Serialize, Deserialize, Clone, CandidType,PartialEq)]
pub struct VcWithRoles {
    pub vc_profile: VentureCapitalistInternal,
    pub roles: Vec<Role>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
pub struct ProjectWithRoles {
    pub project_profile: ProjectInfoInternal,
    pub roles: Vec<Role>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct StoreArg {
    pub key: Key,
    pub content_type: String,
    pub content_encoding: String,
    pub content: ByteBuf,
    pub sha256: Option<ByteBuf>,
}
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct DeleteAsset {
    pub key: Key
}

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, PartialEq)]
pub struct CustomError {
    pub message: String,
    pub is_owner: bool,
}