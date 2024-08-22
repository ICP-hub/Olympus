use std::collections::HashMap;

use candid::{CandidType, Principal};
use ic_stable_structures::StableBTreeMap;
use serde::{Deserialize, Serialize};

use crate::state_handler::{Candid, VMem};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RatingTypes {
    pub peer: Vec<TimestampedRating>,
    pub own: Vec<TimestampedRating>,
    pub mentor: Vec<TimestampedRating>,
    pub vc: Vec<TimestampedRating>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Rating {
    pub level_name: String,
    pub level_number: f64,
    pub sub_level: String,
    pub sub_level_number: f64,
    pub rating: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RatingInternal {
    pub params: Vec<Rating>,
    pub timestamp: u64,
    pub current_role: String,
    pub project_id: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TimestampedRating {
    pub rating: Rating,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Default)]
pub struct RatingAverages {
    pub mentor_average: Vec<f64>,
    pub vc_average: Vec<f64>,
    pub peer_average: Vec<f64>,
    pub own_average: Vec<f64>,
    pub overall_average: Vec<f64>,
}

impl RatingAverages {
    pub fn _new() -> Self {
        RatingAverages {
            mentor_average: Vec::new(),
            vc_average: Vec::new(),
            peer_average: Vec::new(),
            own_average: Vec::new(),
            overall_average: Vec::new(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, CandidType)]
pub struct RatingView {
    pub level_name: String,
    pub sub_level_name: String,
    pub rating: u32,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct MainLevels {
    pub id: i32,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct SubLevels {
    pub id: i32,
    pub name: String,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct PeerRatingUpdate {
    pub cohort_id: String,
    pub project_id: String,
    pub ratings: Vec<Rating>,
}

pub type ProjectRatings = HashMap<Principal, Vec<(String, TimestampedRating)>>;
pub type CohortProjectRatings = HashMap<String, ProjectRatings>;

pub type RatingAverageStorage = StableBTreeMap<String, Candid<RatingAverages>, VMem>;
pub type RatingSystem = StableBTreeMap<String, Candid<HashMap<Principal, Vec<(String, TimestampedRating)>>>, VMem>;
pub type LastRatingTimestamps = StableBTreeMap<String, Candid<HashMap<Principal, u64>>, VMem>;
