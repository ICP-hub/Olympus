use candid::{CandidType, Principal};
use ic_cdk::api::time;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use ic_cdk::api::caller;
use std::str::FromStr;
use std::fmt;

use crate::project_registration::APPLICATION_FORM;
use crate::rbac::{ROLES, UserRole};

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
    vc: Vec<f64>,
}

// #[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
// pub enum RatingType {
//     Peer,
//     Own,
//     Mentor,
// }


#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Rating {
    project_id: String,
    level_name: String,
    level_number: u32,
    sub_level: String,
    sub_level_number: u32,
    rating: f64,
    current_role: String
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MainLevelRatings {
    level: String,
    ratings: Vec<f64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct RatingAverages {
    pub mentor_average: Option<f64>,
    pub vc_average: Option<f64>,
    pub peer_average: Option<f64>,
    pub own_average: Option<f64>,
    pub overall_average: Option<f64>,
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
            vc: Vec::new(),
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


// impl FromStr for MainLevel {
//     type Err = ParseMainLevelError;

//     fn from_str(s: &str) -> Result<Self, Self::Err> {
//         match s {
//             "Team" => Ok(MainLevel::Team),
//             "ProblemAndVision" => Ok(MainLevel::ProblemAndVision),
//             "ValueProp" => Ok(MainLevel::ValueProp),
//             "Product" => Ok(MainLevel::Product),
//             "Market" => Ok(MainLevel::Market),
//             "BusinessModel" => Ok(MainLevel::BusinessModel),
//             "Scale" => Ok(MainLevel::Scale),
//             "Exit" => Ok(MainLevel::Exit),
//             _ => Err(ParseMainLevelError {}),
//         }
//     }
// }

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


fn is_owner(principal_id: &Principal, project_id: &str) -> bool {
    APPLICATION_FORM.with(|storage| {
        storage.borrow().iter().any(|(owner_principal, projects)| {
            owner_principal == principal_id && projects.iter().any(|project| project.uid == project_id)
        })
    })
}

// fn get_user_roles(principal_id: &Principal, project_id: &str) -> HashSet<UserRole> {
//     crate::rbac::get_role_from_principal()
// }


pub fn update_rating_api(ratings: Vec<Rating>) -> String {
    if ratings.is_empty() {
        ic_cdk::println!("Debug: No ratings provided.");
        return "No ratings provided, nothing updated.".to_string();
    }

    let principal_id = caller();
    ic_cdk::println!("Debug: Starting updates for Principal ID: {} with {} ratings.", principal_id, ratings.len());
    
    let current_active_role = crate::user_module::get_roles_for_principal(principal_id);

    let active_roles: Vec<String> = current_active_role.iter()
        .filter(|role| role.status == "approved") // Adjust this condition based on your criteria for an "active" role.
        .map(|role| role.name.clone())
        .collect();

    let mut updated = false; // Flag to track if any updates happen

    RATING_SYSTEM.with(|system| {
        let mut system = system.borrow_mut();

        for rating in ratings {
            // Only proceed if the rating's role matches one of the principal's active roles.
            if active_roles.contains(&rating.current_role) {
                ic_cdk::println!("Debug: Processing rating for project_id={}, level_name={}, sub_level={}, rating_value={}", rating.project_id, rating.level_name, rating.sub_level, rating.rating);
                
                let project_ratings = system.entry(rating.project_id.clone()).or_insert_with(HashMap::new);
                let user_ratings = project_ratings.entry(principal_id.clone()).or_insert_with(HashMap::new);

                let level = user_ratings.entry(rating.level_name.clone())
                    .or_insert_with(|| Level::new(&rating.level_name));
                let rating_types = level.sub_levels.entry(rating.sub_level.clone())
                    .or_insert_with(RatingTypes::new);

                match rating.current_role.as_str() {
                    "vc" => {
                        rating_types.vc.push(rating.sub_level_number.into());
                        updated = true;
                        ic_cdk::println!("Debug: Updated VC rating for project ID: {}", rating.project_id);
                    },
                    "mentor" => {
                        rating_types.mentor.push(rating.sub_level_number.into());
                        updated = true;
                        ic_cdk::println!("Debug: Updated Mentor rating for project ID: {}", rating.project_id);
                    },
                    "project" => {
                        rating_types.own.push(rating.sub_level_number.into());
                        updated = true;
                        ic_cdk::println!("Debug: Updated Owner rating for project ID: {}", rating.project_id);
                    },
                    _ => {
                        ic_cdk::println!("Debug: Encountered unknown or unsupported role: '{}'. No update made for project ID: {}, by principal ID: {}", rating.current_role, rating.project_id, principal_id);
                    },
                }
            } else {
                ic_cdk::println!("Debug: Principal ID: {} does not have an active role matching '{}', no update made for project ID: {}", principal_id, rating.current_role, rating.project_id);
            }
        }
    });

    if updated {
        ic_cdk::println!("Debug: Ratings updated successfully for Principal ID: {}", principal_id);
        "Ratings updated successfully".to_string()
    } else {
        ic_cdk::println!("Debug: No ratings were updated for Principal ID: {}", principal_id);
        "No ratings updated.".to_string()
    }
}


fn round_one_decimal(value: Option<f64>) -> Option<f64> {
    value.map(|v| format!("{:.1}", v).parse::<f64>().unwrap())
}


pub fn calculate_average_api(project_id: &str) -> RatingAverages {
    RATING_SYSTEM.with(|system| {
        let system = system.borrow();

        println!("Calculating averages for project ID: {}", project_id);

        if let Some(user_ratings) = system.get(project_id) {
            let mut mentor_sub_level_sum = 0;
            let mut mentor_count = 0;
            let mut vc_sub_level_sum = 0;
            let mut vc_count = 0;
            let mut own_sub_level_sum = 0;
            let mut own_count = 0;

            let total_levels = 8;

            for levels in user_ratings.values() {
                for level in levels.values() {
                    for rating_types in level.sub_levels.values() {
                        mentor_sub_level_sum += rating_types.mentor.iter().map(|&rating| rating as u32).sum::<u32>();
                        mentor_count += rating_types.mentor.len();

                        vc_sub_level_sum += rating_types.vc.iter().map(|&rating| rating as u32).sum::<u32>();
                        vc_count += rating_types.vc.len();

                        own_sub_level_sum += rating_types.own.iter().map(|&rating| rating as u32).sum::<u32>();
                        own_count += rating_types.own.len();
                    }
                }
            }

            let mentor_average = if mentor_count > 0 { mentor_sub_level_sum as f64 / total_levels as f64 } else { 0.0 };
            let vc_average = if vc_count > 0 { vc_sub_level_sum as f64 / total_levels as f64 } else { 0.0 };
            let own_average = if own_count > 0 { own_sub_level_sum as f64 / total_levels as f64 } else { 0.0 };

            let combined_vc_mentor_average = if vc_count + mentor_count > 0 {
                (vc_sub_level_sum + mentor_sub_level_sum) as f64 / (total_levels) as f64
            } else {
                0.0
            };

            let overall_average = (combined_vc_mentor_average * 0.6) + (own_average * 0.4);

            println!("Overall average: {}", overall_average);

            RatingAverages {
                mentor_average: round_one_decimal(Some(mentor_average)),
                vc_average: round_one_decimal(Some(vc_average)),
                peer_average: None, 
                own_average: round_one_decimal(Some(own_average)),
                overall_average: round_one_decimal(Some(overall_average)),
            }
        } else {
            println!("No ratings found for project ID: {}", project_id);
            RatingAverages {
                mentor_average: None,
                vc_average: None,
                peer_average: None,
                own_average: None,
                overall_average: None,
            }
        }
    })
}


pub fn get_ratings_by_project_id(project_id: &str) -> HashMap<String, MainLevelRatings> {
    let mut ratings_by_level: HashMap<String, MainLevelRatings> = HashMap::new();

    RATING_SYSTEM.with(|system| {
        let system = system.borrow();

        if let Some(project_ratings) = system.get(project_id) {
            for (user_id, user_ratings) in project_ratings {
                for (level_name, level) in user_ratings {
                    let main_level = match level_name.parse::<String>() {
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



#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct MainLevels {
    id: i32,
    name: String,
}

pub fn get_main_levels() -> Vec<MainLevels> {
    vec![
        MainLevels {
            id: 1,
            name: "Team".to_string(),
        },
        MainLevels {
            id: 2,
            name: "Problem And Vision".to_string(),
        },
        MainLevels {
            id: 3,
            name: "Value Prop".to_string(),
        },
        MainLevels {
            id: 4,
            name: "Product".to_string(),
        },
        MainLevels {
            id: 5,
            name: "Market".to_string(),
        },
        MainLevels {
            id: 6,
            name: "Business Model".to_string(),
        },
        MainLevels {
            id: 7,
            name: "Scale".to_string(),
        },
        MainLevels {
            id: 8,
            name: "Exit".to_string(),
        },
    ]
}


#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct SubLevels {
    id: i32,
    name: String,
}

pub fn get_sub_levels() -> Vec<SubLevels> {
    vec![
        SubLevels {
            id: 1,
            name: "Establishing The Founding Team".to_string(),
        },
        SubLevels {
            id: 2,
            name: "Setting The Vision".to_string(),
        },
        SubLevels {
            id: 3,
            name: "Solidifying The Value Proposition".to_string(),
        },
        SubLevels {
            id: 4,
            name: "Validating An Investable Market".to_string(),
        },
        SubLevels {
            id: 5,
            name: "Proving A Profitable Business Model".to_string(),
        },
        SubLevels {
            id: 6,
            name: "Moving Beyond Early Adopters".to_string(),
        },
        SubLevels {
            id: 7,
            name: "Hitiing Product Market Fit".to_string(),
        },
        SubLevels {
            id: 8,
            name: "Scaling Up".to_string(),
        },
        SubLevels {
            id: 8,
            name: "Exit In Sight".to_string(),
        },
    ]
}