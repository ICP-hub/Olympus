use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct UserInformation {
    pub full_name: String,
    pub profile_picture: Option<Vec<u8>>,
    pub email: Option<String>,
    pub country: String,
    pub social_links: Option<Vec<SocialLinks>>,
    pub bio: Option<String>,
    pub area_of_interest: String,
    pub openchat_username: Option<String>,
    pub type_of_profile: Option<String>,
    pub reason_to_join: Option<Vec<String>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct SocialLinks {
    pub link: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct UserInfoInternal {
    pub uid: String,
    pub params: UserInformation,
    pub is_active: bool,
    pub joining_date: u64,
    pub profile_completion: u8,
}

#[derive(CandidType, Clone, Serialize, Deserialize, Debug,PartialEq)]
pub struct Role {
    pub name: String,
    pub status: String,
    pub requested_on: Option<u64>,
    pub approved_on: Option<u64>,
    pub rejected_on: Option<u64>,
    pub approval_status: Option<String>,
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct Testimonial {
    pub name: String,
    pub profile_pic: Vec<u8>,
    pub message: String,
    pub timestamp: u64,
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct Review {
    pub name: String,
    pub profile_pic: Vec<u8>,
    pub message: String,
    pub timestamp: u64,
    pub tag: String,
    pub rating: f32,
    pub reviewer_principal: Principal
}

impl Review {
    pub fn new(
        name: String,
        profile_pic: Vec<u8>,
        message: String,
        rating: f32,
    ) -> Result<Review, &'static str> {
        if !(0.0..=5.0).contains(&rating) {
            return Err("Rating must be between 0.0 and 5.0");
        }

        let rating_int = (rating * 10.0) as i32;

        let tag = match rating_int {
            0..=10 => "Needs Improvement",
            11..=20 => "Fair",
            21..=30 => "Good",
            31..=40 => "Very Good",
            41..=50 => "Excellent",
            _ => "Unknown",
        }
        .to_string();

        Ok(Review {
            name,
            profile_pic,
            message,
            timestamp: ic_cdk::api::time(),
            tag,
            rating,
            reviewer_principal: ic_cdk::caller(),
        })
    }
}

impl UserInformation {
    pub fn validate(&self) -> Result<(), String> {
        if let Some(bio) = &self.bio {
            if crate::guard::contains_html_tags(bio) {
                return Err("Bio contains HTML tags, which are not allowed.".into());
            }
        }
        Ok(())
    }
}

impl UserInfoInternal {
    pub fn calculate_completion_percentage(&self) -> u8 {
        let mut total_fields = 4; 
        let mut filled_fields = 3; 

        filled_fields += self.params.profile_picture.is_some() as usize;
        filled_fields += self.params.email.is_some() as usize;
        filled_fields += self.params.social_links.as_ref().map_or(0, |v| (!v.is_empty()) as usize);
        filled_fields += self.params.bio.is_some() as usize;
        filled_fields += self.params.openchat_username.is_some() as usize;
        filled_fields += self.params.type_of_profile.is_some() as usize;
        filled_fields += self.params.reason_to_join.as_ref().map_or(0, |v| (!v.is_empty()) as usize);

        total_fields += 7; 

        ((filled_fields as f64 / total_fields as f64) * 100.0).round() as u8
    }

    pub fn update_completion_percentage(&mut self) {
        self.profile_completion = self.calculate_completion_percentage();
    }
}