use candid::{CandidType, Principal};
use ic_cdk::api::time;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::api::caller;
use std::str::FromStr;
use std::fmt;

use crate::project_registration::APPLICATION_FORM;
use crate::rbac::ROLES;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Level {
    name: String,
    sub_levels: HashMap<String, RatingTypes>,
    timestamp: u64,
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

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
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
    //timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MainLevelRatings {
    level: MainLevel,
    ratings: Vec<f64>,
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
            timestamp: time(),
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

#[derive(Debug, Clone)]
pub struct ParseMainLevelError {}

impl fmt::Display for ParseMainLevelError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "invalid MainLevel")
    }
}

impl FromStr for MainLevel {
    type Err = ParseMainLevelError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Level1" => Ok(MainLevel::Level1),
            "Level2" => Ok(MainLevel::Level2),
            "Level3" => Ok(MainLevel::Level3),
            "Level4" => Ok(MainLevel::Level4),
            "Level5" => Ok(MainLevel::Level5),
            "Level6" => Ok(MainLevel::Level6),
            "Level7" => Ok(MainLevel::Level7),
            "Level8" => Ok(MainLevel::Level8),
            "Level9" => Ok(MainLevel::Level9),
            _ => Err(ParseMainLevelError {}),
        }
    }
}

fn is_own_project(principal_id: &Principal, project_id: &str) -> bool {
    APPLICATION_FORM.with(|storage| {
        for (creator_principal, projects) in storage.borrow().iter() {
            for project in projects.iter() {
                if project.uid == project_id {
                    return creator_principal == principal_id;
                }
            }
        }
        false
    })
}

fn is_peer(principal_id: &Principal, project_id_being_rated: &str) -> bool {
    APPLICATION_FORM.with(|storage| {
        let storage_borrowed = storage.borrow();
        if let Some(projects) = storage_borrowed.get(principal_id) {
            for project in projects.iter() {
                if project.uid != project_id_being_rated {
                    return true; 
                }
            }
        }
        false
    })
}



pub fn update_rating(ratings: Vec<Rating>) {
    let principal_id = caller();

    RATING_SYSTEM.with(|system| {
        let mut system = system.borrow_mut();

        for rating in ratings {
            let project_ratings = system.entry(rating.project_id.clone()).or_insert_with(HashMap::new);
            let user_ratings = project_ratings.entry(principal_id.clone()).or_insert_with(HashMap::new);

            let level = user_ratings.entry(format!("{:?}", rating.level_name))
                .or_insert_with(|| Level::new(&format!("{:?}", rating.level_name)));
            let rating_types = level.sub_levels.entry(format!("{:?}", rating.sub_level))
                .or_insert_with(RatingTypes::new);

            let rating_category = if is_peer(&principal_id, &rating.project_id) {
                &mut rating_types.peer
            } else if is_own_project(&principal_id, &rating.project_id) {
                &mut rating_types.own
            } else {
                &mut rating_types.mentor
            };

            match rating.rating_type {
                RatingType::Peer => rating_types.peer.push(rating.rating),
                RatingType::Own => rating_types.own.push(rating.rating),
                RatingType::Mentor => rating_types.mentor.push(rating.rating),
            };
        }
    });
}



// Function to calculate average rating

pub fn calculate_average(project_id: &str) -> Option<f64> {
    RATING_SYSTEM.with(|system| {
        let system = system.borrow();

        if let Some(project_ratings) = system.get(project_id) {
            let mut total_rating = 0.0;
            let mut rating_count = 0;

            for user_ratings in project_ratings.values() {
                for level in user_ratings.values() {
                    for rating_types in level.sub_levels.values() {
                        let sum_ratings = rating_types.peer.iter().sum::<f64>()
                                         + rating_types.own.iter().sum::<f64>()
                                         + rating_types.mentor.iter().sum::<f64>();
                        let count_ratings = rating_types.peer.len() + rating_types.own.len() + rating_types.mentor.len();

                        total_rating += sum_ratings;
                        rating_count += count_ratings;
                    }
                }
            }

            if rating_count > 0 {
                Some(total_rating / rating_count as f64)
            } else {
                None
            }
        } else {
            None
        }
    })
}

pub fn get_ratings_by_project_id(project_id: &str) -> HashMap<MainLevel, MainLevelRatings> {
    let mut ratings_by_level: HashMap<MainLevel, MainLevelRatings> = HashMap::new();

    RATING_SYSTEM.with(|system| {
        let system = system.borrow();

        if let Some(project_ratings) = system.get(project_id) {
            for (user_id, user_ratings) in project_ratings {
                for (level_name, level) in user_ratings {
                    let main_level = match level_name.parse::<MainLevel>() {
                        Ok(lvl) => lvl,
                        Err(_) => continue, // Skip if the level name does not match any MainLevel enum
                    };

                    let main_level_ratings = ratings_by_level.entry(main_level.clone()).or_insert_with(|| MainLevelRatings {
                        level: main_level,
                        ratings: Vec::new(),
                    });

                    for rating_types in level.sub_levels.values() {
                        main_level_ratings.ratings.extend_from_slice(&rating_types.peer);
                        main_level_ratings.ratings.extend_from_slice(&rating_types.own);
                        main_level_ratings.ratings.extend_from_slice(&rating_types.mentor);
                    }
                }
            }
        }
    });

    ratings_by_level
}