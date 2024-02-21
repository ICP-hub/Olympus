use candid::CandidType;
use ic_cdk::api::{caller, management_canister::main::raw_rand};
use ic_cdk::export::Principal;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
extern crate serde_cbor;
use std::cell::RefCell;


#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct MentorProfile {
    pub full_name: Option<String>,
    pub email_address: Option<String>,
    pub telegram_id: Option<String>,
    pub location: Option<String>,
    pub linkedin_profile_link: Option<String>,
    pub unique_contribution_to_startups: Option<String>,
    pub years_of_experience_mentoring_startups: Option<i32>,
    pub past_work_records_links: Option<String>,
    pub motivation_for_becoming_a_mentor: Option<String>,
    pub areas_of_expertise: Option<String>,
    pub preferred_icp_hub: Option<String>,
    pub availability_and_time_commitment: Option<String>,
    pub preferred_startup_stage: Option<String>,
    pub success_stories_testimonials: Option<String>,
    pub languages_spoken: Option<String>,
    pub conflict_of_interest_disclosure: Option<String>,
    pub specific_goals_objectives_as_a_mentor: Option<String>,
    pub industry_achievements: Option<String>,
    pub specific_skills_or_technologies_expertise: Option<String>,
    pub professional_affiliations: Option<String>,
    pub volunteer_experience: Option<String>,
    pub preferred_communication_tools: Option<String>,
    pub time_zone: Option<String>,
    pub referrer_contact: Option<String>,
    pub mentor_image: Option<Vec<u8>>,
}

pub type MentorRegistry = HashMap<Principal, MentorInternal>;

#[derive(Serialize, Deserialize, Clone, Debug, CandidType)]
pub struct MentorInternal {
    pub profile: MentorProfile,
    pub uid: String,
}

thread_local! {
    pub static MENTOR_REGISTRY: RefCell<MentorRegistry> = RefCell::new(MentorRegistry::new());
}

#[update]
pub async fn register_mentor(profile: MentorProfile) ->std::string::String{
    let caller = caller();
    let random_bytes = raw_rand().await.expect("Failed to generate random bytes").0;

    let uid = format!("{:x}", Sha256::digest(&random_bytes));
    
    // let already_registered =
    //     MENTOR_REGISTRY.with(|registry| registry.borrow().contains_key(&caller));

    // if already_registered {
    //     //return "This Principal is already registered.".to_string();
    //     ic_cdk::println!("This Principal is already registered")
    // }

    let mentor_internal = MentorInternal {
        profile,
        uid: uid.clone(),
    };
    MENTOR_REGISTRY.with(|registry| {
        registry.borrow_mut().insert(caller, mentor_internal);
    });

    format!("Mentor registered successfully with ID: {}", uid)
}

#[query]
pub fn get_mentor() -> Option<MentorProfile> {
    let caller = caller();
    MENTOR_REGISTRY.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|mentor_internal| mentor_internal.profile.clone())
    })
}

#[update]
pub fn update_mentor(updated_profile: MentorProfile) -> String {
    let caller = caller();
    let result = MENTOR_REGISTRY.with(|registry| {
        let mut registry = registry.borrow_mut();
        if let Some(mentor_internal) = registry.get_mut(&caller) {

            mentor_internal.profile.full_name = updated_profile
                .full_name
                .or(mentor_internal.profile.full_name.clone());

            mentor_internal.profile.email_address = updated_profile
                .email_address
                .or(mentor_internal.profile.email_address.clone());
            mentor_internal.profile.telegram_id = updated_profile
                .telegram_id
                .or(mentor_internal.profile.telegram_id.clone());
            mentor_internal.profile.location = updated_profile
                .location
                .or(mentor_internal.profile.location.clone());
            mentor_internal.profile.linkedin_profile_link = updated_profile
                .linkedin_profile_link
                .or(mentor_internal.profile.linkedin_profile_link.clone());
            mentor_internal.profile.unique_contribution_to_startups = updated_profile
                .unique_contribution_to_startups
                .or(mentor_internal
                    .profile
                    .unique_contribution_to_startups
                    .clone());
            mentor_internal
                .profile
                .years_of_experience_mentoring_startups = updated_profile
                .years_of_experience_mentoring_startups
                .or(mentor_internal
                    .profile
                    .years_of_experience_mentoring_startups);
            mentor_internal.profile.past_work_records_links = updated_profile
                .past_work_records_links
                .or(mentor_internal.profile.past_work_records_links.clone());
            mentor_internal.profile.motivation_for_becoming_a_mentor = updated_profile
                .motivation_for_becoming_a_mentor
                .or(mentor_internal
                    .profile
                    .motivation_for_becoming_a_mentor
                    .clone());
            mentor_internal.profile.areas_of_expertise = updated_profile
                .areas_of_expertise
                .or(mentor_internal.profile.areas_of_expertise.clone());
            mentor_internal.profile.preferred_icp_hub = updated_profile
                .preferred_icp_hub
                .or(mentor_internal.profile.preferred_icp_hub.clone());
            mentor_internal.profile.availability_and_time_commitment = updated_profile
                .availability_and_time_commitment
                .or(mentor_internal
                    .profile
                    .availability_and_time_commitment
                    .clone());
            mentor_internal.profile.preferred_startup_stage = updated_profile
                .preferred_startup_stage
                .or(mentor_internal.profile.preferred_startup_stage.clone());
            mentor_internal.profile.success_stories_testimonials = updated_profile
                .success_stories_testimonials
                .or(mentor_internal.profile.success_stories_testimonials.clone());
            mentor_internal.profile.languages_spoken = updated_profile
                .languages_spoken
                .or(mentor_internal.profile.languages_spoken.clone());
            mentor_internal.profile.conflict_of_interest_disclosure = updated_profile
                .conflict_of_interest_disclosure
                .or(mentor_internal
                    .profile
                    .conflict_of_interest_disclosure
                    .clone());
            mentor_internal
                .profile
                .specific_goals_objectives_as_a_mentor = updated_profile
                .specific_goals_objectives_as_a_mentor
                .or(mentor_internal
                    .profile
                    .specific_goals_objectives_as_a_mentor
                    .clone());
            mentor_internal.profile.industry_achievements = updated_profile
                .industry_achievements
                .or(mentor_internal.profile.industry_achievements.clone());
            mentor_internal
                .profile
                .specific_skills_or_technologies_expertise = updated_profile
                .specific_skills_or_technologies_expertise
                .or(mentor_internal
                    .profile
                    .specific_skills_or_technologies_expertise
                    .clone());
            mentor_internal.profile.professional_affiliations = updated_profile
                .professional_affiliations
                .or(mentor_internal.profile.professional_affiliations.clone());
            mentor_internal.profile.volunteer_experience = updated_profile
                .volunteer_experience
                .or(mentor_internal.profile.volunteer_experience.clone());
            mentor_internal.profile.preferred_communication_tools = updated_profile
                .preferred_communication_tools
                .or(mentor_internal
                    .profile
                    .preferred_communication_tools
                    .clone());
            mentor_internal.profile.time_zone = updated_profile
                .time_zone
                .or(mentor_internal.profile.time_zone.clone());
            mentor_internal.profile.referrer_contact = updated_profile
                .referrer_contact
                .or(mentor_internal.profile.referrer_contact.clone());

            mentor_internal.profile.mentor_image = updated_profile
                .mentor_image
                .or(mentor_internal.profile.mentor_image.clone());

            "Mentor profile updated successfully.".to_string()
        } else {
            "Mentor profile not found.".to_string()
        }
    });
    result
}

#[update]
pub fn delete_mentor() -> String {
    let caller = caller();
    let removed = MENTOR_REGISTRY.with(|registry| registry.borrow_mut().remove(&caller).is_some());

    if removed {
        "Mentor profile deleted successfully.".to_string()
    } else {
        "Mentor profile not found.".to_string()
    }
}

#[query]
pub fn get_all_mentors() -> Vec<MentorProfile> {
    MENTOR_REGISTRY.with(|registry| {
        registry
            .borrow()
            .values()
            .map(|mentor_internal| mentor_internal.profile.clone())
            .collect()
    })
}
