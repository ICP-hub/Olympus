use std::cell::RefCell;
use std::collections::HashMap;
use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use ic_cdk::api::time;
use ic_cdk_macros::{update,query};

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct Rating {
    pub value: f64,
    pub comment: Option<String>,
}

#[derive(Clone, CandidType, Deserialize, Debug, Serialize)]
pub struct TimestampedRating {
    pub rating: Rating,
    pub timestamp: u64,
}

pub type IndividualRatings = HashMap<Principal, Vec<TimestampedRating>>;
pub type AverageRatingStorage = HashMap<Principal, f64>; 

thread_local! {
    pub static MENTOR_RATING_SYSTEM: RefCell<IndividualRatings> = RefCell::new(HashMap::new());
    pub static VC_RATING_SYSTEM: RefCell<IndividualRatings> = RefCell::new(HashMap::new());
    pub static MENTOR_AVERAGE_RATINGS: RefCell<AverageRatingStorage> = RefCell::new(HashMap::new());
    pub static VC_AVERAGE_RATINGS: RefCell<AverageRatingStorage> = RefCell::new(HashMap::new());
}


#[update]
pub fn update_mentor_ratings(principal_id: Principal, new_rating: Rating) {
    let current_timestamp = time();
    MENTOR_RATING_SYSTEM.with(|sys| {
        let mut sys = sys.borrow_mut();
        sys.entry(principal_id).or_default().push(TimestampedRating {
            rating: new_rating,
            timestamp: current_timestamp,
        });
    });
}

#[update]
pub fn update_vc_ratings(principal_id: Principal, new_rating: Rating) {
    let current_timestamp = time();
    VC_RATING_SYSTEM.with(|sys| {
        let mut sys = sys.borrow_mut();
        sys.entry(principal_id).or_default().push(TimestampedRating {
            rating: new_rating,
            timestamp: current_timestamp,
        });
    });
}

#[query]
pub fn calculate_mentor_average_rating(principal_id: Principal) -> Result<f64, String> {
    calculate_and_store_average_rating_mentor(principal_id)
}

#[query]
pub fn calculate_vc_average_rating(principal_id: Principal) -> Result<f64, String> {
    calculate_and_store_average_rating_investor(principal_id)
}

fn calculate_and_store_average_rating_mentor(principal_id: Principal) -> Result<f64, String> {
    MENTOR_RATING_SYSTEM.with(|sys| {
        let sys = sys.borrow();
        if let Some(ratings) = sys.get(&principal_id) {
            let total_ratings = ratings.iter().map(|r| r.rating.value).collect::<Vec<_>>();
            if total_ratings.is_empty() {
                return Err("No ratings available.".to_string());
            }

            let sum: f64 = total_ratings.iter().sum();
            let average = sum / total_ratings.len() as f64;

            MENTOR_AVERAGE_RATINGS.with(|avg| {
                let mut avg = avg.borrow_mut();
                avg.insert(principal_id.clone(), average);
            });

            Ok(average)
        } else {
            Err("No ratings found.".to_string())
        }
    })
}

fn calculate_and_store_average_rating_investor(principal_id: Principal) -> Result<f64, String> {
    VC_RATING_SYSTEM.with(|sys| {
        let sys = sys.borrow();
        if let Some(ratings) = sys.get(&principal_id) {
            let total_ratings = ratings.iter().map(|r| r.rating.value).collect::<Vec<_>>();
            if total_ratings.is_empty() {
                return Err("No ratings available.".to_string());
            }

            let sum: f64 = total_ratings.iter().sum();
            let average = sum / total_ratings.len() as f64;

            VC_AVERAGE_RATINGS.with(|avg| {
                let mut avg = avg.borrow_mut();
                avg.insert(principal_id.clone(), average);
            });

            Ok(average)
        } else {
            Err("No ratings found.".to_string())
        }
    })
}
