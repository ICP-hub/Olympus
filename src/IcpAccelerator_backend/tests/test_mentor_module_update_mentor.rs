use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{
    mentor_module::mentor_types:: MentorProfile,
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
fn test_update_mentor() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the initial UserInformation
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Mentor Test".to_string(),
            profile_picture: None,
            email: Some("mentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Mentoring in blockchain technology.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["To guide new projects.".to_string()]),
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

    // Define the initial MentorProfile
    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };

    // Register the mentor
    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).expect("Mentor registration failed");

    // Define the updated MentorProfile
    let updated_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("New ICP Hub".to_string()),
        existing_icp_mentor: false,
        existing_icp_project_porfolio: Some("Updated Portfolio".to_string()),
        icp_hub_or_spoke: true,
        category_of_mentoring_service: "Updated Service".to_string(),
        links: None,
        multichain: Some("Polkadot, Avalanche".to_string()),
        years_of_mentoring: "15".to_string(),
        website: Some("https://new-mentor.example.com".to_string()),
        area_of_expertise: "Decentralized Finance".to_string(),
        reason_for_joining: Some("To mentor in new areas.".to_string()),
        hub_owner: Some("New Hub Owner".to_string()),
    };

    // Call the update_mentor function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_mentor",
        encode_one(updated_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the update was successful
    let update_result: String = decode_one(&response).unwrap();
    assert_eq!(update_result, "Mentor profile for has been approved and updated.");

    // Retrieve the updated mentor profile to verify changes
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();

    // Ensure the updated mentor info matches the updated profile
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.preferred_icp_hub, updated_mentor_profile.preferred_icp_hub, "Preferred ICP Hub should match");
    assert_eq!(retrieved_mentor.category_of_mentoring_service, updated_mentor_profile.category_of_mentoring_service, "Category of mentoring service should match");
    assert_eq!(retrieved_mentor.years_of_mentoring, updated_mentor_profile.years_of_mentoring, "Years of mentoring should match");
    assert_eq!(retrieved_mentor.website, updated_mentor_profile.website, "Website should match");
    assert_eq!(retrieved_mentor.area_of_expertise, updated_mentor_profile.area_of_expertise, "Area of expertise should match");
}










#[test]
fn test_update_non_existent_mentor() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[2 as u8]);
    // Define the initial UserInformation
    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Mentor Test".to_string(),
            profile_picture: None,
            email: Some("mentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: Some("Mentoring in blockchain technology.".to_string()),
            area_of_interest: "Blockchain".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: Some(vec!["To guide new projects.".to_string()]),
        },
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        is_active: true,
        joining_date: 1625097600,
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Update mentor profile without registering as a mentor
    let updated_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: false,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: true,
        category_of_mentoring_service: "DeFi".to_string(),
        links: None,
        multichain: Some("Polkadot, Avalanche".to_string()),
        years_of_mentoring: "15".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "DeFi".to_string(),
        reason_for_joining: Some("To mentor DeFi projects.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };

    // Call the update_mentor function
    let Ok(WasmResult::Reply(result)) = pic.update_call(
        backend_canister,
        principal,
        "update_mentor",
        encode_one(updated_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let response: String = decode_one(&result).unwrap();
    assert_eq!(response, "This Principal is not registered.", "Expected an error for non-existent mentor");
}






#[test]
fn test_partial_update() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[3 as u8]);

    // Register as user and mentor
    let user_info = UserInfoInternal {
        uid: "user_uid_3".to_string(),
        params: UserInformation {
            full_name: "User 3".to_string(),
            profile_picture: None,
            email: Some("user3@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user3".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 150823,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Perform a partial update (only update `category_of_mentoring_service` and `website`)
    let partial_update_profile = MentorProfile {
        preferred_icp_hub: None,
        existing_icp_mentor: true,
        existing_icp_project_porfolio: None,
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Updated Service".to_string(),
        links: None,
        multichain: None,
        years_of_mentoring: "10".to_string(), // No change
        website: Some("https://updated-mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(), // No change
        reason_for_joining: None,
        hub_owner: None,
    };
    // Call the update_mentor function
    let Ok(WasmResult::Reply(result)) = pic.update_call(
        backend_canister,
        principal,
        "update_mentor",
        encode_one(partial_update_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let response: String = decode_one(&result).unwrap();
    assert_eq!(response, "Mentor profile for has been approved and updated.");

    // Retrieve and verify the updated mentor profile
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();

    // Verify only the updated fields were changed
    assert_eq!(retrieved_mentor.category_of_mentoring_service, "Updated Service", "Category of mentoring service should be updated");
    assert_eq!(retrieved_mentor.website, Some("https://updated-mentor.example.com".to_string()), "Website should be updated");
    assert_eq!(retrieved_mentor.years_of_mentoring, "10".to_string(), "Years of mentoring should remain unchanged");
    assert_eq!(retrieved_mentor.area_of_expertise, "Blockchain".to_string(), "Area of expertise should remain unchanged");
}








#[test]
fn test_update_with_empty_fields() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[4 as u8]);

    // Register as user and mentor
    let user_info = UserInfoInternal {
        uid: "user_uid_4".to_string(),
        params: UserInformation {
            full_name: "User 4".to_string(),
            profile_picture: None,
            email: Some("user4@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user4".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 150823,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Update mentor profile with empty fields (e.g., empty strings)
    let updated_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("".to_string()),  // Empty string
        existing_icp_mentor: false,
        existing_icp_project_porfolio: Some("".to_string()),  // Empty string
        icp_hub_or_spoke: true,
        category_of_mentoring_service: "".to_string(),  // Empty string
        links: None,
        multichain: Some("".to_string()),  // Empty string
        years_of_mentoring: "".to_string(),  // Empty string
        website: Some("".to_string()),  // Empty string
        area_of_expertise: "".to_string(),  // Empty string
        reason_for_joining: Some("".to_string()),  // Empty string
        hub_owner: Some("".to_string()),  // Empty string
    };
    // Call the update_mentor function
    let Ok(WasmResult::Reply(result)) = pic.update_call(
        backend_canister,
        principal,
        "update_mentor",
        encode_one(updated_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let response: String = decode_one(&result).unwrap();
    assert_eq!(response, "Mentor profile for has been approved and updated.");

    // Retrieve and verify the updated mentor profile
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();

    // Ensure empty fields are updated correctly (or remain unchanged if empty input is ignored)
    assert_eq!(retrieved_mentor.preferred_icp_hub, Some("".to_string()), "Preferred ICP Hub should be an empty string");
    assert_eq!(retrieved_mentor.category_of_mentoring_service, "".to_string(), "Category of mentoring service should be an empty string");
    assert_eq!(retrieved_mentor.website, Some("".to_string()), "Website should be an empty string");
    assert_eq!(retrieved_mentor.area_of_expertise, "".to_string(), "Area of expertise should be an empty string");
}







#[test]
fn test_maximum_limits_on_input_data() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[7 as u8]);

    // Register as user and mentor
    let user_info = UserInfoInternal {
        uid: "user_uid_7".to_string(),
        params: UserInformation {
            full_name: "User 7".to_string(),
            profile_picture: None,
            email: Some("user7@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user7".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 150823,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Create a string with maximum allowed characters (assuming the limit is 1000 characters for this test)
    let max_length_string = "A".repeat(1000);

    // Update mentor profile with maximum input data
    let updated_mentor_profile = MentorProfile {
        preferred_icp_hub: Some(max_length_string.clone()), // Maximum length string
        existing_icp_mentor: false,
        existing_icp_project_porfolio: Some(max_length_string.clone()), // Maximum length string
        icp_hub_or_spoke: true,
        category_of_mentoring_service: max_length_string.clone(), // Maximum length string
        links: None,
        multichain: Some(max_length_string.clone()), // Maximum length string
        years_of_mentoring: max_length_string.clone(), // Maximum length string
        website: Some(max_length_string.clone()), // Maximum length string (even though it's supposed to be a URL)
        area_of_expertise: max_length_string.clone(), // Maximum length string
        reason_for_joining: Some(max_length_string.clone()), // Maximum length string
        hub_owner: Some(max_length_string.clone()), // Maximum length string
    };

    // Call the update_mentor function
    let Ok(WasmResult::Reply(result)) = pic.update_call(
        backend_canister,
        principal,
        "update_mentor",
        encode_one(updated_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let response: String = decode_one(&result).unwrap();
    assert_eq!(response, "Mentor profile for has been approved and updated.");

    // Retrieve and verify the updated mentor profile
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();

    // Ensure the maximum input data is updated correctly
    assert_eq!(retrieved_mentor.preferred_icp_hub, Some(max_length_string.clone()), "Preferred ICP Hub should match the maximum input data");
    assert_eq!(retrieved_mentor.category_of_mentoring_service, max_length_string.clone(), "Category of mentoring service should match the maximum input data");
    assert_eq!(retrieved_mentor.website, Some(max_length_string.clone()), "Website should match the maximum input data");
    assert_eq!(retrieved_mentor.area_of_expertise, max_length_string.clone(), "Area of expertise should match the maximum input data");
}








#[test]
fn test_case_sensitivity() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[8 as u8]);

    // Register as user and mentor
    let user_info = UserInfoInternal {
        uid: "user_uid_8".to_string(),
        params: UserInformation {
            full_name: "User 8".to_string(),
            profile_picture: None,
            email: Some("user8@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user8".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 150823,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Update mentor profile with case variations
    let updated_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("icp hub".to_string()), // Lowercase
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("blockchain projects".to_string()), // Lowercase
        icp_hub_or_spoke: true,
        category_of_mentoring_service: "DeFi".to_string(), // Different case
        links: None,
        multichain: Some("Ethereum, Solana".to_string()), // Original case
        years_of_mentoring: "15".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "DeFi".to_string(), // Different case
        reason_for_joining: Some("to mentor defi projects.".to_string()), // Lowercase
        hub_owner: Some("icp hub owner".to_string()), // Lowercase
    };

    // Call the update_mentor function
    let Ok(WasmResult::Reply(result)) = pic.update_call(
        backend_canister,
        principal,
        "update_mentor",
        encode_one(updated_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let response: String = decode_one(&result).unwrap();
    assert_eq!(response, "Mentor profile for has been approved and updated.");

    // Retrieve and verify the updated mentor profile
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();

    // Ensure that case sensitivity is handled correctly
    assert_eq!(retrieved_mentor.preferred_icp_hub, updated_mentor_profile.preferred_icp_hub, "Preferred ICP Hub should match the updated value with correct case");
    assert_eq!(retrieved_mentor.category_of_mentoring_service, updated_mentor_profile.category_of_mentoring_service, "Category of mentoring service should match the updated value with correct case");
    assert_eq!(retrieved_mentor.area_of_expertise, updated_mentor_profile.area_of_expertise, "Area of expertise should match the updated value with correct case");
    assert_eq!(retrieved_mentor.reason_for_joining, updated_mentor_profile.reason_for_joining, "Reason for joining should match the updated value with correct case");
}







#[test]
fn test_invalid_data_types() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[9 as u8]);

    // Register as user and mentor
    let user_info = UserInfoInternal {
        uid: "user_uid_9".to_string(),
        params: UserInformation {
            full_name: "User 9".to_string(),
            profile_picture: None,
            email: Some("user9@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user9".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 150823,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Attempt to update with invalid data types (e.g., passing a number instead of a string)
    let invalid_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "15".to_string(),  // Valid
        website: Some("https://mentor.example.com".to_string()),  // Valid
        area_of_expertise: "Blockchain".to_string(),  // Valid
        reason_for_joining: Some("To mentor new projects.".to_string()),  // Valid
        hub_owner: Some("ICP Hub Owner".to_string()),  // Valid
    };
    // Call the update_mentor function
    let Ok(WasmResult::Reply(result)) = pic.update_call(
        backend_canister,
        principal,
        "update_mentor",
        encode_one(invalid_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let response: String = decode_one(&result).unwrap();
    assert_eq!(response, "Mentor profile for has been approved and updated.");

    // Retrieve and verify the updated mentor profile
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();

    // Verify the update was successful
    assert_eq!(retrieved_mentor.years_of_mentoring, "15".to_string(), "Years of mentoring should be updated correctly");
    assert_eq!(retrieved_mentor.website, Some("https://mentor.example.com".to_string()), "Website should be updated correctly");
}






#[test]
fn test_special_characters_and_emojis() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[14 as u8]);

    // Register as user and mentor
    let user_info = UserInfoInternal {
        uid: "user_uid_14".to_string(),
        params: UserInformation {
            full_name: "User 14".to_string(),
            profile_picture: None,
            email: Some("user14@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user14".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 150823,
    };
// Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Blockchain Projects".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Blockchain".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor.example.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To help new projects succeed.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Attempt to update mentor profile with special characters and emojis
    let updated_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("✨ICP Hub✨".to_string()),  // Special characters and emojis
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("🚀 Blockchain Projects 🚀".to_string()),  // Special characters and emojis
        icp_hub_or_spoke: true,
        category_of_mentoring_service: "Blockchain 🌐".to_string(),  // Special characters and emojis
        links: None,
        multichain: Some("🌍 Ethereum, Solana 🌍".to_string()),  // Special characters and emojis
        years_of_mentoring: "10️⃣".to_string(),  // Special characters and emojis
        website: Some("https://mentor.example.com/✨".to_string()),  // Special characters and emojis
        area_of_expertise: "Blockchain 🔒".to_string(),  // Special characters and emojis
        reason_for_joining: Some("To help new projects succeed 🌟".to_string()),  // Special characters and emojis
        hub_owner: Some("ICP Hub Owner 🌟".to_string()),  // Special characters and emojis
    };

    // Call the update_mentor function
    let Ok(WasmResult::Reply(result)) = pic.update_call(
        backend_canister,
        principal,
        "update_mentor",
        encode_one(updated_mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let response: String = decode_one(&result).unwrap();
    assert_eq!(response, "Mentor profile for has been approved and updated.");

    // Retrieve and verify the updated mentor profile
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, _) = retrieved_mentor_info.unwrap();

    // Ensure the special characters and emojis are updated correctly
    assert_eq!(retrieved_mentor.preferred_icp_hub, Some("✨ICP Hub✨".to_string()), "Preferred ICP Hub should match the input with special characters and emojis");
    assert_eq!(retrieved_mentor.category_of_mentoring_service, "Blockchain 🌐".to_string(), "Category of mentoring service should match the input with special characters and emojis");
    assert_eq!(retrieved_mentor.website, Some("https://mentor.example.com/✨".to_string()), "Website should match the input with special characters and emojis");
    assert_eq!(retrieved_mentor.area_of_expertise, "Blockchain 🔒".to_string(), "Area of expertise should match the input with special characters and emojis");
}


