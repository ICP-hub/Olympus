use candid::{CandidType, Principal};
use ic_cdk::api::call;
use ic_cdk::api::{caller, management_canister::main::raw_rand};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
extern crate serde_cbor;
use crate::admin::send_approval_request;
use crate::trie::EXPERTISE_TRIE;
use crate::user_module::ROLE_STATUS_ARRAY;
use std::cell::RefCell;

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default)]
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

#[derive(Serialize, Deserialize, Clone, Debug, CandidType, Default)]
pub struct MentorInternal {
    pub profile: MentorProfile,
    pub uid: String,
    pub active: bool,
    pub approve: bool,
    pub decline: bool,
}

thread_local! {
    pub static MENTOR_REGISTRY: RefCell<MentorRegistry> = RefCell::new(MentorRegistry::new());
    pub static MENTOR_AWAITS_RESPONSE: RefCell<MentorRegistry> = RefCell::new(MentorRegistry::new());
    pub static DECLINED_MENTOR_REQUESTS: RefCell<MentorRegistry> = RefCell::new(MentorRegistry::new());
}

pub async fn register_mentor(profile: MentorProfile) -> String {
    let caller = caller();

    DECLINED_MENTOR_REQUESTS.with(|d_mentors| {
        let exits = d_mentors.borrow().contains_key(&caller);
        if exits {
            panic!("You had got your request declined earlier");
        }
    });

    let random_bytes = raw_rand().await.expect("Failed to generate random bytes").0;

    let uid = format!("{:x}", Sha256::digest(&random_bytes));

    // let already_registered = MENTOR_REGISTRY.with(|registry| registry.borrow().contains_key(&caller));

    // if already_registered {

    //     ic_cdk::println!("This Principal is already registered");
    //     return "This Principal is already registered.".to_string()}

    let profile_for_pushing = profile.clone();

    let mentor_internal = MentorInternal {
        profile: profile_for_pushing,
        uid: uid.clone(),
        active: true,
        approve: false,
        decline: false,
    };

    MENTOR_AWAITS_RESPONSE.with(|awaiters: &RefCell<HashMap<Principal, MentorInternal>>| {
        let mut await_ers: std::cell::RefMut<'_, HashMap<Principal, MentorInternal>> =
            awaiters.borrow_mut();
        await_ers.insert(caller, mentor_internal);
    });

    let res = send_approval_request().await;

    ROLE_STATUS_ARRAY.with(|role_status| {
        let mut role_status = role_status.borrow_mut();

        for role in role_status.get_mut(&caller).expect("couldn't get role status for this principal").iter_mut(){
            if role.name == "mentor"{
                role.status = "requested".to_string();
            }
        }
    });

    format!("{}", res)

    // MENTOR_REGISTRY.with(|registry| {
    //     registry.borrow_mut().insert(caller, mentor_internal);
    // });

    // if let Some(expertise) = profile.areas_of_expertise {
    //     let keyword = crate::trie::expertise_to_str(&expertise);
    //     EXPERTISE_TRIE.with(|trie| {
    //         trie.borrow_mut().insert(&keyword, caller);
    //     });
    // }
}

pub fn get_mentor() -> Option<MentorProfile> {
    let caller = caller();
    MENTOR_REGISTRY.with(|registry| {
        registry
            .borrow()
            .get(&caller)
            .map(|mentor_internal| mentor_internal.profile.clone())
    })
}

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

pub fn delete_mentor() -> String {
    let caller = caller();
    let removed = MENTOR_REGISTRY.with(|registry| registry.borrow_mut().remove(&caller).is_some());

    if removed {
        "Mentor profile deleted successfully.".to_string()
    } else {
        "Mentor profile not found.".to_string()
    }
}

pub fn get_all_mentors() -> Vec<MentorProfile> {
    MENTOR_REGISTRY.with(|registry| {
        registry
            .borrow()
            .values()
            .map(|mentor_internal| mentor_internal.profile.clone())
            .collect()
    })
}

pub fn make_active_inactive(p_id: Principal) -> String {
    MENTOR_REGISTRY.with(|m_container| {
        let mut tutor_hashmap = m_container.borrow_mut();
        if let Some(mentor_internal) = tutor_hashmap.get_mut(&p_id) {
            if mentor_internal.active {
                let active = false;
                mentor_internal.active = active;

                //ic_cdk::println!("mentor profile check status {:?}", mentor_internal);
                return "made inactive".to_string();
            } else {
                let active = true;
                mentor_internal.active = active;
                //ic_cdk::println!("mentor profile check status {:?}", mentor_internal);
                return "made active".to_string();
            }
        } else {
            "profile seems not to be existed".to_string()
        }
    })
}

pub fn find_mentors_by_expertise(expertise_keyword: &str) -> Vec<MentorProfile> {
    let keyword = expertise_keyword;
    let mentor_principals = EXPERTISE_TRIE.with(|trie| trie.borrow().search(keyword));

    let mut mentor_profiles = Vec::new();
    MENTOR_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        for principal in mentor_principals {
            if let Some(mentor_internal) = registry.get(&principal) {
                mentor_profiles.push(mentor_internal.profile.clone());
            }
        }
    });

    mentor_profiles
}
