use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{
    mentor_module::mentor_types::{MentorInternal, MentorProfile, MentorFilterCriteria},
    user_modules::user_types::{UserInfoInternal, UserInformation},
};
use std::fs;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "/home/harman/accelerator/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";

// Setup function to initialize PocketIC and install the Wasm module
fn setup() -> (PocketIc, Principal) {
    let pic = PocketIc::new();

    let backend_canister = pic.create_canister();
    pic.add_cycles(backend_canister, 2_000_000_000_000); // 2T Cycles
    let wasm = fs::read(BACKEND_WASM).expect("Wasm file not found, run 'dfx build'.");
    pic.install_canister(backend_canister, wasm, vec![], None);
    (pic, backend_canister)
}

#[test]
fn test_filter_mentors() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the UserInformation
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Tech Mentor".to_string(),
            profile_picture: None,
            email: Some("techmentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Mentoring tech projects.".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["Helping projects grow.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600,
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Create a MentorProfile object to simulate mentor registration
    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Tech Portfolio".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.example.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("Mentor emerging tech projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "b7deb0ac398bb66b3d8e1736cd4163d0a8411ec4fda4e8be58de74cdac6c8e08".to_string(),
        active: true,
        approve: true,
        decline: false,
    };

    // Simulate the mentor registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Define the filter criteria
    let filter_criteria = MentorFilterCriteria {
        country: None, // Ignored in this implementation
        area_of_expertise: Some("Blockchain".to_string()), // Filtering based on this field
    };

    // Call the filter_mentors function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the filtered mentors are correct
    let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();

    // There should be one mentor returned, and it should match the mentor_profile we registered
    assert_eq!(filtered_mentors.len(), 1, "There should be one mentor in the filtered list");
    let filtered_mentor = &filtered_mentors[0];
    assert_eq!(filtered_mentor.area_of_expertise, mentor_profile.profile.area_of_expertise, "Area of expertise should match");
    assert_eq!(filtered_mentor.preferred_icp_hub, mentor_profile.profile.preferred_icp_hub, "Preferred ICP hub should match");
}








#[test]
fn test_multiple_criteria_matching() {
    let (pic, backend_canister) = setup();

    // Register multiple users and then register them as mentors with different criteria
    let num_mentors = 5;
    for i in 1..=num_mentors {
        let principal = Principal::from_slice(&[i as u8]);

        // Register as user first
        let user_info = UserInfoInternal {
            uid: format!("user_uid_{}", i),
            params: UserInformation {
                full_name: format!("User {}", i),
                profile_picture: None,
                email: Some(format!("user{}@example.com", i)),
                country: "Country".to_string(),
                social_links: None,
                bio: Some("User Bio".to_string()),
                area_of_interest: "Technology".to_string(),
                openchat_username: Some(format!("user{}", i)),
                type_of_profile: Some("user".to_string()),
                reason_to_join: Some(vec!["Reason".to_string()]),
            },
            is_active: true,
            joining_date: 121548,
        };
        pic.update_call(
            backend_canister,
            principal,
            "register_user",
            encode_one(user_info.clone()).unwrap(),
        ).unwrap();

        // Register as mentor
        let mentor_profile = MentorInternal {
            profile: MentorProfile {
                preferred_icp_hub: Some("ICP Hub".to_string()),
                existing_icp_mentor: true,
                existing_icp_project_porfolio: Some(format!("Portfolio of mentor {}", i)),
                icp_hub_or_spoke: false,
                category_of_mentoring_service: "Technology".to_string(),
                links: None,
                multichain: Some("Ethereum, Solana".to_string()),
                years_of_mentoring: "10".to_string(),
                website: Some(format!("https://mentor{}.com", i)),
                area_of_expertise: "Blockchain".to_string(),
                reason_for_joining: Some(format!("To mentor project {}", i)),
                hub_owner: Some("ICP Hub Owner".to_string()),
            },
            uid: format!("mentor_uid_{}", i),
            active: true,
            approve: true,
            decline: false,
        };
        pic.update_call(
            backend_canister,
            principal,
            "register_mentor",
            encode_one(mentor_profile.clone()).unwrap(),
        ).unwrap();
    }

    // Filter by expertise "Blockchain"
    let filter_criteria = MentorFilterCriteria {
        area_of_expertise: Some("Blockchain".to_string()),
        country: None,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();
            assert_eq!(filtered_mentors.len(), num_mentors, "All mentors should match the expertise criteria 'Blockchain'");
        },
        _ => panic!("Test failed for multiple criteria matching"),
    }
}




#[test]
fn test_no_matching_criteria() {
    let (pic, backend_canister) = setup();

    // Register a user first, then a mentor with expertise "Blockchain"
    let principal = Principal::from_slice(&[1 as u8]);

    // Register as user first
    let user_info = UserInfoInternal {
        uid: "user_uid_1".to_string(),
        params: UserInformation {
            full_name: "User 1".to_string(),
            profile_picture: None,
            email: Some("user1@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user1".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 121548,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register as mentor
    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Portfolio of mentor".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "mentor_uid_1".to_string(),
        active: true,
        approve: true,
        decline: false,
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Filter by expertise "AI", which does not match any mentor
    let filter_criteria = MentorFilterCriteria {
        area_of_expertise: Some("AI".to_string()),
        country: None,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();
            assert!(filtered_mentors.is_empty(), "No mentors should match the expertise criteria 'AI'");
        },
        _ => panic!("Test failed for no matching criteria"),
    }
}







#[test]
fn test_inactive_declined_mentors() {
    let (pic, backend_canister) = setup();

    // Register users first, then register as mentors (inactive and declined)
    let inactive_principal = Principal::from_slice(&[1 as u8]);
    let declined_principal = Principal::from_slice(&[2 as u8]);

    // Register as users first
    let user_info_inactive = UserInfoInternal {
        uid: "user_uid_inactive".to_string(),
        params: UserInformation {
            full_name: "Inactive User".to_string(),
            profile_picture: None,
            email: Some("inactive@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("Inactive User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("inactive".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 121548,
    };
    pic.update_call(
        backend_canister,
        inactive_principal,
        "register_user",
        encode_one(user_info_inactive.clone()).unwrap(),
    ).unwrap();

    let user_info_declined = UserInfoInternal {
        uid: "user_uid_declined".to_string(),
        params: UserInformation {
            full_name: "Declined User".to_string(),
            profile_picture: None,
            email: Some("declined@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("Declined User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("declined".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 121548,
    };
    pic.update_call(
        backend_canister,
        declined_principal,
        "register_user",
        encode_one(user_info_declined.clone()).unwrap(),
    ).unwrap();

    // Register as mentor (inactive)
    let inactive_mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Inactive mentor's portfolio".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://inactive.mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "inactive_mentor_uid".to_string(),
        active: false,  // Inactive
        approve: true,
        decline: false,
    };
    pic.update_call(
        backend_canister,
        inactive_principal,
        "register_mentor",
        encode_one(inactive_mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Register as mentor (declined)
    let declined_mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Declined mentor's portfolio".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://declined.mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "declined_mentor_uid".to_string(),
        active: true,
        approve: false,  // Not approved
        decline: true,   // Declined
    };
    pic.update_call(
        backend_canister,
        declined_principal,
        "register_mentor",
        encode_one(declined_mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Filter by expertise "Blockchain", which both mentors have
    let filter_criteria = MentorFilterCriteria {
        area_of_expertise: Some("Blockchain".to_string()),
        country: None,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();
            assert!(filtered_mentors.is_empty(), "Inactive and declined mentors should not appear in the results");
        },
        _ => panic!("Test failed for inactive/declined mentors"),
    }
}








#[test]
fn test_case_sensitivity() {
    let (pic, backend_canister) = setup();

    // Register as user first, then as mentor with expertise "Blockchain"
    let principal = Principal::from_slice(&[1 as u8]);

    // Register as user first
    let user_info = UserInfoInternal {
        uid: "user_uid_1".to_string(),
        params: UserInformation {
            full_name: "User 1".to_string(),
            profile_picture: None,
            email: Some("user1@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user1".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 121548,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register as mentor
    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Portfolio of mentor".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "mentor_uid_1".to_string(),
        active: true,
        approve: true,
        decline: false,
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Filter by expertise "blockchain" in lowercase
    let filter_criteria = MentorFilterCriteria {
        area_of_expertise: Some("blockchain".to_string()),
        country: None,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();
            assert_eq!(filtered_mentors.len(), 1, "Mentor should be returned regardless of case sensitivity");
        },
        _ => panic!("Test failed for case sensitivity"),
    }
}






#[test]
fn test_empty_criteria() {
    let (pic, backend_canister) = setup();

    // Register multiple users and then as mentors
    let num_mentors = 3;
    for i in 1..=num_mentors {
        let principal = Principal::from_slice(&[i as u8]);

        // Register as user first
        let user_info = UserInfoInternal {
            uid: format!("user_uid_{}", i),
            params: UserInformation {
                full_name: format!("User {}", i),
                profile_picture: None,
                email: Some(format!("user{}@example.com", i)),
                country: "Country".to_string(),
                social_links: None,
                bio: Some("User Bio".to_string()),
                area_of_interest: "Technology".to_string(),
                openchat_username: Some(format!("user{}", i)),
                type_of_profile: Some("user".to_string()),
                reason_to_join: Some(vec!["Reason".to_string()]),
            },
            is_active: true,
            joining_date: 121548,
        };
        pic.update_call(
            backend_canister,
            principal,
            "register_user",
            encode_one(user_info.clone()).unwrap(),
        ).unwrap();

        // Register as mentor
        let mentor_profile = MentorInternal {
            profile: MentorProfile {
                preferred_icp_hub: Some("ICP Hub".to_string()),
                existing_icp_mentor: true,
                existing_icp_project_porfolio: Some(format!("Portfolio of mentor {}", i)),
                icp_hub_or_spoke: false,
                category_of_mentoring_service: "Technology".to_string(),
                links: None,
                multichain: Some("Ethereum, Solana".to_string()),
                years_of_mentoring: "10".to_string(),
                website: Some(format!("https://mentor{}.com", i)),
                area_of_expertise: "Blockchain".to_string(),
                reason_for_joining: Some(format!("To mentor project {}", i)),
                hub_owner: Some("ICP Hub Owner".to_string()),
            },
            uid: format!("mentor_uid_{}", i),
            active: true,
            approve: true,
            decline: false,
        };
        pic.update_call(
            backend_canister,
            principal,
            "register_mentor",
            encode_one(mentor_profile.clone()).unwrap(),
        ).unwrap();
    }

    // Filter with empty criteria
    let filter_criteria = MentorFilterCriteria {
        area_of_expertise: None,
        country: None,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();
            assert_eq!(filtered_mentors.len(), num_mentors, "All mentors should be returned when criteria is empty");
        },
        _ => panic!("Test failed for empty criteria"),
    }
}








#[test]
fn test_null_none_values() {
    let (pic, backend_canister) = setup();

    // Register as user first, then as mentor
    let principal = Principal::from_slice(&[1 as u8]);

    // Register as user first
    let user_info = UserInfoInternal {
        uid: "user_uid_1".to_string(),
        params: UserInformation {
            full_name: "User 1".to_string(),
            profile_picture: None,
            email: Some("user1@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user1".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 121548,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register as mentor
    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Portfolio of mentor".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "mentor_uid_1".to_string(),
        active: true,
        approve: true,
        decline: false,
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Filter with None criteria
    let filter_criteria = MentorFilterCriteria {
        area_of_expertise: None,
        country: None,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();
            assert_eq!(filtered_mentors.len(), 1, "Mentor should be returned when criteria is None");
        },
        _ => panic!("Test failed for None values in criteria"),
    }
}







#[test]
fn test_invalid_inputs() {
    let (pic, backend_canister) = setup();

    // Register as user first, then as mentor with valid data
    let principal = Principal::from_slice(&[1 as u8]);

    // Register as user first
    let user_info = UserInfoInternal {
        uid: "user_uid_1".to_string(),
        params: UserInformation {
            full_name: "User 1".to_string(),
            profile_picture: None,
            email: Some("user1@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user1".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 121548,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register as mentor
    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Portfolio of mentor".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "mentor_uid_1".to_string(),
        active: true,
        approve: true,
        decline: false,
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Filter with invalid expertise criteria (empty string)
    let filter_criteria = MentorFilterCriteria {
        area_of_expertise: Some("".to_string()),
        country: None,
    };
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "filter_mentors",
        encode_one(filter_criteria).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let filtered_mentors: Vec<MentorProfile> = decode_one(&response).unwrap();
            assert!(filtered_mentors.is_empty(), "No mentors should match an empty expertise criteria");
        },
        _ => panic!("Test failed for invalid inputs (empty string)"),
    }
}
