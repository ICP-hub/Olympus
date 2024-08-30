use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{mentor_module::mentor_types::{MentorInternal, MentorProfile}, types::individual_types::MentorWithRoles, user_modules::user_types::{Role, UserInfoInternal, UserInformation}};
use std::collections::HashMap;
use std::fs;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "/Users/mridulyadav/Desktop/ICPAccelerator/target/wasm32-unknown-unknown/release/IcpAccelerator_backend.wasm";

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
fn test_get_all_mentors() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the UserInformation with some fields set to None
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Test Mentor".to_string(),
            profile_picture: None, // Profile picture provided
            email: Some("mentor@example.com".to_string()), // Email provided
            country: "United States".to_string(),
            social_links: None, // No social links provided
            bio: Some("Experienced mentor with a focus on technology.".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: None, // OpenChat username not provided
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["Contribute to innovative projects.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600, // Example timestamp
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
            existing_icp_project_porfolio: Some("Portfolio of ICP projects".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://mentor.example.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor emerging projects.".to_string()),
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

    // Call the get_all_mentors function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_all_mentors",
        encode_one(()).unwrap(), // No parameters for get_all_mentors
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the mentor info was retrieved correctly
    let retrieved_mentors: HashMap<Principal, (MentorInternal, UserInfoInternal, Vec<Role>)> = decode_one(&response).unwrap();

    // There should be one mentor registered, and it should match the mentor_profile we registered
    assert_eq!(retrieved_mentors.len(), 1, "There should be one mentor in the list");

    // Extract the retrieved mentor details
    let (retrieved_mentor_internal, retrieved_user_info, _retrieved_roles) = retrieved_mentors.get(&test_principal).expect("Mentor not found");

    assert_eq!(retrieved_mentor_internal.uid, mentor_profile.uid, "Mentor UID should match");
    assert_eq!(retrieved_mentor_internal.profile.area_of_expertise, mentor_profile.profile.area_of_expertise, "Area of expertise should match");
    assert_eq!(retrieved_user_info.uid, user_info.uid, "User UID should match");
    assert_eq!(retrieved_user_info.params.full_name, user_info.params.full_name, "User full name should match");

    // Additional assertions for roles (if roles were to be added)
    // assert_eq!(retrieved_roles.len(), expected_role_count, "Expected number of roles should match");
}




#[test]
fn test_empty_state() {
    let (pic, backend_canister) = setup();

    // Call the get_all_mentors function
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors",
        encode_one(()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let mentors: HashMap<Principal, (MentorWithRoles, UserInfoInternal, Vec<Role>)> = decode_one(&response).unwrap();
            assert!(mentors.is_empty(), "The mentor list should be empty when no mentors or users are registered");
        },
        _ => panic!("Test failed for empty state"),
    }
}





//PANICKED WHERE INACTIVE USER IS TRIED TO BE LISTED
#[test]
fn test_multiple_mentors_mixed_active_states() {
    let (pic, backend_canister) = setup();

    let active_principal = Principal::anonymous();
    let inactive_principal = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");  // Example inactive principal

    // Define the UserInformation with some fields set to None
    let user_info1 = UserInfoInternal{
        params :UserInformation {
            full_name: "Test User".to_string(),
            profile_picture: None, // No initial picture provided
            email: None, // Email not provided
            country: "United States".to_string(),
            social_links: None, // No social links provided
            bio: Some("An enthusiastic tech investor focused on blockchain technologies.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None, // OpenChat username not provided
            type_of_profile: Some("investor".to_string()),
            reason_to_join: None,
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 06062003,
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        active_principal,
        "register_user",
        encode_one(user_info1.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Define the UserInformation with some fields set to None
    let user_info2 = UserInfoInternal{
        params :UserInformation {
            full_name: "Second User".to_string(),
            profile_picture: None, // No initial picture provided
            email: None, // Email not provided
            country: "India".to_string(),
            social_links: None, // No social links provided
            bio: Some("An enthusiastic tech investor focused on blockchain technologies.".to_string()),
            area_of_interest: "CyberSecurity".to_string(),
            openchat_username: None, // OpenChat username not provided
            type_of_profile: Some("VC".to_string()),
            reason_to_join: None,
        },
        uid: "gdgdgd".to_string(),
        is_active: true,
        joining_date: 09092003,
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        inactive_principal,
        "register_user",
        encode_one(user_info2.params.clone()).unwrap(),
    ).expect("User registration failed");

    let active_mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Active mentor's portfolio".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "10".to_string(),
            website: Some("https://active.mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor active projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "active_mentor_uid".to_string(),
        active: true,
        approve: true,
        decline: false,
    };

    let inactive_mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: Some("ICP Hub".to_string()),
            existing_icp_mentor: true,
            existing_icp_project_porfolio: Some("Inactive mentor's portfolio".to_string()),
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: Some("Ethereum, Solana".to_string()),
            years_of_mentoring: "5".to_string(),
            website: Some("https://inactive.mentor.com".to_string()),
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: Some("To mentor inactive projects.".to_string()),
            hub_owner: Some("ICP Hub Owner".to_string()),
        },
        uid: "inactive_mentor_uid".to_string(),
        active: true,  
        approve: true,
        decline: false,
    };

    // Register both mentors
    pic.update_call(
        backend_canister,
        active_principal,
        "register_mentor",
        encode_one(active_mentor_profile.profile.clone()).unwrap(),
    ).unwrap();

    pic.update_call(
        backend_canister,
        inactive_principal,
        "register_mentor",
        encode_one(inactive_mentor_profile.profile.clone()).unwrap(),
    ).unwrap();

    // Call the make_active_inactive_mentor function again to reactivate the mentor
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        inactive_principal,
        "make_active_inactive_mentor",
        encode_one(inactive_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let deactivate_result: String = decode_one(&response).unwrap();
    ic_cdk::println!("DEACTIVATE REULT {:?}",deactivate_result);
    assert_eq!(deactivate_result, "made inactive");


    // Call the get_all_mentors function
    let result = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_all_mentors",
        encode_one(()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let mentors: HashMap<Principal, (MentorInternal, UserInfoInternal, Vec<Role>)> = decode_one(&response).unwrap();
            assert!(mentors.contains_key(&active_principal), "Active mentor should be included in the list");
            assert!(!mentors.contains_key(&inactive_principal), "Inactive mentor should not be included in the list");
        },
        _ => panic!("Test failed for multiple mentors with mixed active states"),
    }
}






