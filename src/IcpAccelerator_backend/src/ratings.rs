use candid::{CandidType, Principal};
use once_cell::sync::Lazy;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};
use std::sync::{Mutex, Arc};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct RatingSystem {
    users_ratings: HashMap<Principal, HashMap<String, Level>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct Level {
    name: String,
    sub_levels: HashMap<String, f64>, // Using HashMap for sub-levels
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct Rating {
    principal_id: Principal,
    level_name: String,
    sub_level_name: String,
    rating: f64,
}

impl RatingSystem {
    // Initialize the rating system with default values
    fn new() -> Self {
        RatingSystem {
            users_ratings: HashMap::new(),
        }
    }

    // Calculate the average rating for a specific level and user
    fn calculate_average(&self, principal_id: &Principal, level_name: &str) -> Option<f64> {
        self.users_ratings.get(principal_id)
            .and_then(|user_ratings| user_ratings.get(level_name))
            .map(|level| {
                let sum: f64 = level.sub_levels.values().sum();
                sum / level.sub_levels.len() as f64
            })
    }
}

impl Level {
    // Initialize a level with default values
    fn new(name: &str) -> Self {
        Level {
            name: name.to_string(),
            sub_levels: HashMap::new(),
        }
    }
}

// Static variable to mimic global state (for simulation purposes)
static RATING_SYSTEM: Lazy<Arc<Mutex<RatingSystem>>> = Lazy::new(|| {
    Arc::new(Mutex::new(RatingSystem::new()))
});

#[ic_cdk::query]
fn get_average_rating(principal_id: Principal, level_name: String) -> Option<f64> {
    let rating_system = RATING_SYSTEM.lock().expect("Failed to lock mutex");
    rating_system.calculate_average(&principal_id, &level_name)
}

#[ic_cdk::update]
fn update_rating(rating: Rating) -> Result<(), String> {
    let mut rating_system = RATING_SYSTEM.lock().map_err(|_| "Failed to lock mutex for update")?;

    let user_ratings = rating_system
        .users_ratings
        .entry(rating.principal_id.clone())
        .or_default();

    let level = user_ratings
        .entry(rating.level_name.clone())
        .or_insert_with(|| Level::new(&rating.level_name));

    level.sub_levels.insert(rating.sub_level_name.clone(), rating.rating);

    Ok(())
}


