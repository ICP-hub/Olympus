use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::api::caller;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Level {
    name: String,
    sub_levels: HashMap<String, RatingTypes>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RatingTypes {
    peer: Vec<f64>,
    own: Vec<f64>,
    mentor: Vec<f64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum RatingType {
    Peer,
    Own,
    Mentor,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum MainLevel {
    Level1,
    Level2,
    Level3,
    Level4,
    Level5,
    Level6,
    Level7,
    Level8,
    Level9,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum SubLevel {
    SubLevel0,
    SubLevel1,
    SubLevel2,
    SubLevel3,
    SubLevel4,
    SubLevel5,
    SubLevel6,
    SubLevel7,
    SubLevel8,
    SubLevel9,
    All,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Rating {
    project_id: String,
    level_name: MainLevel,
    sub_level: SubLevel,
    rating_type: RatingType,
    rating: f64,
}

pub type ProjectRatings = HashMap<Principal, HashMap<String, Level>>;

pub type RatingSystem = HashMap<String, ProjectRatings>;

thread_local! {
    pub static RATING_SYSTEM: RefCell<RatingSystem> = RefCell::new(RatingSystem::new());
}

impl Level {
    fn new(name: &str) -> Self {
        Level {
            name: name.to_string(),
            sub_levels: HashMap::new(),
        }
    }
}

impl RatingTypes {
    fn new() -> Self {
        RatingTypes {
            peer: Vec::new(),
            own: Vec::new(),
            mentor: Vec::new(),
        }
    }
}

// Function to update rating
pub fn update_rating(rating: Rating) {
    let principal_id = caller(); // Still using Principal for individual raters.

    RATING_SYSTEM.with(|system| {
        let mut system = system.borrow_mut();

        // Access or create the ratings for the given project ID.
        let project_ratings = system.entry(rating.project_id.clone()).or_insert_with(HashMap::new);
        
        // Then, within this project, access or create the ratings for the current principal.
        let user_ratings = project_ratings.entry(principal_id).or_insert_with(HashMap::new);

        let level_name = format!("{:?}", rating.level_name);
        let level = user_ratings
            .entry(level_name.clone())
            .or_insert_with(|| Level::new(&level_name));
        
        let sub_level_name = format!("{:?}", rating.sub_level);
        let rating_types = level.sub_levels
            .entry(sub_level_name)
            .or_insert_with(RatingTypes::new);

        // Update the rating based on the rating type.
        match rating.rating_type {
            RatingType::Peer => rating_types.peer.push(rating.rating),
            RatingType::Own => rating_types.own.push(rating.rating),
            RatingType::Mentor => rating_types.mentor.push(rating.rating),
        };
    });
}



// Function to calculate average rating

pub fn calculate_average(project_id: &str) -> Option<f64> {
    RATING_SYSTEM.with(|system| {
        let system = system.borrow();

        // Attempt to retrieve the ratings for the specified project ID.
        if let Some(project_ratings) = system.get(project_id) {
            let mut total_rating = 0.0;
            let mut rating_count = 0;

            // Iterate over all principals and their ratings for this project.
            for user_ratings in project_ratings.values() {
                for level in user_ratings.values() {
                    for rating_types in level.sub_levels.values() {
                        // Aggregate ratings from all three types: Peer, Own, Mentor.
                        let sum_ratings = rating_types.peer.iter().sum::<f64>()
                                         + rating_types.own.iter().sum::<f64>()
                                         + rating_types.mentor.iter().sum::<f64>();
                        let count_ratings = rating_types.peer.len() + rating_types.own.len() + rating_types.mentor.len();

                        total_rating += sum_ratings;
                        rating_count += count_ratings;
                    }
                }
            }

            // Calculate and return the average rating for this project, if there are ratings.
            if rating_count > 0 {
                Some(total_rating / rating_count as f64)
            } else {
                // Return None if there are no ratings to calculate an average from.
                None
            }
        } else {
            // If the project ID does not exist in the ratings system, return None.
            None
        }
    })
}