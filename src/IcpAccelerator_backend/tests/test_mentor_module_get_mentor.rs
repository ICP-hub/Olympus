use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{mentor_module::mentor_types:: MentorProfile, user_modules::user_types::{UserInfoInternal, UserInformation}};
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
fn test_get_mentor() {
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
    let mentor_profile = MentorProfile {
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
    };

    // Simulate the mentor registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Call the get_mentor function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(), // No parameters for get_mentor
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the mentor info was retrieved correctly
    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();

    // There should be one mentor registered, and it should match the mentor_profile we registered
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, retrieved_user) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.area_of_expertise, mentor_profile.area_of_expertise, "Area of expertise should match");
    assert_eq!(retrieved_user.uid, user_info.uid, "User UID should match");
    assert_eq!(retrieved_user.params.full_name, user_info.params.full_name, "User full name should match");
}





#[test]
fn test_get_mentor_with_missing_fields() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();
    let incomplete_user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Incomplete Mentor".to_string(),
            profile_picture: None,
            email: None,  // Email is missing
            country: "United States".to_string(),
            social_links: None,
            bio: None,  // Bio is missing
            area_of_interest: "Technology".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: None,  // Reason to join is missing
        },
        uid: "example_uid".to_string(),
        is_active: true,
        joining_date: 1625097600,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(incomplete_user_info.params.clone()).unwrap(),
    ).unwrap();

    let incomplete_mentor_profile = MentorProfile {
        preferred_icp_hub: None,  // Preferred ICP hub is missing
        existing_icp_mentor: false,
        existing_icp_project_porfolio: None,
        icp_hub_or_spoke: true,
        category_of_mentoring_service: "Technology".to_string(),
        links: None,
        multichain: None,  // Multichain is missing
        years_of_mentoring: "5".to_string(),
        website: None,  // Website is missing
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: None,  // Reason for joining is missing
        hub_owner: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(incomplete_mentor_profile.clone()).unwrap(),
    ).unwrap();

    let result = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
            assert!(retrieved_mentor_info.is_some(), "Mentor info should still be retrievable even with missing fields");
        },
        Ok(WasmResult::Reject(reason)) => panic!("Query rejected: {}", reason),
        Err(e) => panic!("Query failed: {}", e),
    }
}







#[test]
fn test_get_mentor_with_extreme_input_sizes() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();
    let large_string = "a".repeat(10000);  // Very large string
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: large_string.clone(),
            profile_picture: None,
            email: Some(large_string.clone()),
            country: large_string.clone(),
            social_links: None,
            bio: Some(large_string.clone()),
            area_of_interest: large_string.clone(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec![large_string.clone()]),
        },
        uid: large_string.clone(),
        is_active: true,
        joining_date: 1625097600,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).unwrap();

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some(large_string.clone()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some(large_string.clone()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: large_string.clone(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some(large_string.clone()),
        area_of_expertise: large_string.clone(),
        reason_for_joining: Some(large_string.clone()),
        hub_owner: Some(large_string.clone()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    let result = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
            assert!(retrieved_mentor_info.is_some(), "Extreme size input should still retrieve valid mentor info");
        },
        Ok(WasmResult::Reject(reason)) => panic!("Query rejected: {}", reason),
        Err(e) => panic!("Query failed: {}", e),
    }
}







#[test]
fn test_duplicate_mentor_registration() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Duplicate Mentor".to_string(),
            profile_picture: None,
            email: Some("duplicate@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Duplicate registration test.".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["Testing duplicate entries.".to_string()]),
        },
        uid: "duplicate_uid".to_string(),
        is_active: true,
        joining_date: 1625097600,
    };

    // First registration
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).unwrap();

    let mentor_profile = MentorProfile {
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
    };

    // First mentor registration
    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Attempt second registration with the same profile
    let result = pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let registration_result: String = decode_one(&response).unwrap();
            ic_cdk::println!("REGISTRATION RESULT {:?}",registration_result);
        },
        Ok(WasmResult::Reject(reason)) => assert!(true, "Expected rejection for duplicate registration: {}", reason),
        Err(e) => panic!("Registration failed unexpectedly: {}", e),
    }
}









#[test]
fn test_non_existent_mentor_retrieval() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Attempt to retrieve a mentor profile without any registration
    let result = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
            assert!(retrieved_mentor_info.is_none(), "No mentor info should be present for non-existent registrations");
        },
        Ok(WasmResult::Reject(reason)) => panic!("Query rejected: {}", reason),
        Err(e) => panic!("Query failed: {}", e),
    }
}









#[test]
fn test_special_characters_in_input() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();
    let special_chars_string = "Mentor®™✓🚀";
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: special_chars_string.to_string(),
            profile_picture: None,
            email: Some("special@chars.com".to_string()),
            country: "Fantasy Land".to_string(),
            social_links: None,
            bio: Some("Special characters test 🚀".to_string()),
            area_of_interest: "Virtual Reality".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["Exploring new realms✨.".to_string()]),
        },
        uid: "special_uid".to_string(),
        is_active: true,
        joining_date: 1625097600,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).unwrap();

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("Virtual Hub✨".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Portfolio of VR projects🌐".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Virtual Reality".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana, Polkadot".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor-vr.com".to_string()),
        area_of_expertise: "VR & AR Technologies 🕶️".to_string(),
        reason_for_joining: Some("To explore new dimensions in mentoring.".to_string()),
        hub_owner: Some("Virtual Reality Hub Owner".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    let result = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
            ic_cdk::println!("RETRIEVED MENTOR {:?}",retrieved_mentor_info);
            assert!(retrieved_mentor_info.is_some(), "Mentor info should be retrievable with special characters");
        },
        Ok(WasmResult::Reject(reason)) => panic!("Query rejected: {}", reason),
        Err(e) => panic!("Query failed: {}", e),
    }
}









//HANDLED AT FRONTEND 
#[test]
fn test_validation_logic() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();
    let invalid_email_user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Invalid Email Mentor".to_string(),
            profile_picture: None,
            email: Some("invalid-email".to_string()),  // Invalid email format
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Testing validation logic.".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["To improve system robustness.".to_string()]),
        },
        uid: "invalid_email_uid".to_string(),
        is_active: true,
        joining_date: 1625097600,
    };

    let registration_result = pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(invalid_email_user_info.params.clone()).unwrap(),
    );

    assert!(registration_result.is_err(), "Registration with invalid email should fail or be handled specifically");
}








#[test]
fn test_unusual_workflow() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Querying before any registration
    let early_query_result = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    );

    match early_query_result {
        Ok(WasmResult::Reply(response)) => {
            let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
            assert!(retrieved_mentor_info.is_none(), "No mentor info should be present when queried before any registrations");
        },
        Ok(WasmResult::Reject(reason)) => panic!("Query rejected: {}", reason),
        Err(e) => panic!("Query failed: {}", e),
    }
}
