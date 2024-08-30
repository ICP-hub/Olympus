use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{mentor_module::mentor_types::{MentorInternal, MentorProfile}, user_modules::user_types::{UserInfoInternal, UserInformation}};
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
fn test_get_mentor_info_using_principal() {
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

    // Create a MentorInternal object to simulate mentor registration
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

    // Call the get_mentor_info_using_principal function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the mentor info was retrieved correctly
    let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();

    // There should be one mentor registered, and it should match the mentor_profile we registered
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, retrieved_user) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.uid, mentor_profile.uid, "Mentor UID should match");
    assert_eq!(retrieved_mentor.profile.preferred_icp_hub, mentor_profile.profile.preferred_icp_hub, "Mentor preferred ICP hub should match");
    assert_eq!(retrieved_user.uid, user_info.uid, "User UID should match");
    assert_eq!(retrieved_user.params.full_name, user_info.params.full_name, "User full name should match");
}






#[test]
fn test_missing_fields() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    let user_info = UserInfoInternal {
        params: UserInformation {
            full_name: "Test Mentor".to_string(),
            profile_picture: None,
            email: Some("mentor@example.com".to_string()),
            country: "United States".to_string(),
            social_links: None,
            bio: None,  // Missing bio
            area_of_interest: "Technology".to_string(),
            openchat_username: None,
            type_of_profile: Some("mentor".to_string()),
            reason_to_join: None,  // Missing reason to join
        },
        uid: "test_uid".to_string(),
        is_active: true,
        joining_date: 1625097600,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).unwrap();

    let mentor_profile = MentorInternal {
        profile: MentorProfile {
            preferred_icp_hub: None,  // Missing preferred hub
            existing_icp_mentor: true,
            existing_icp_project_porfolio: None,  // Missing portfolio
            icp_hub_or_spoke: false,
            category_of_mentoring_service: "Technology".to_string(),
            links: None,
            multichain: None,  // Missing multichain
            years_of_mentoring: "10".to_string(),
            website: None,  // Missing website
            area_of_expertise: "Blockchain".to_string(),
            reason_for_joining: None,  // Missing reason for joining
            hub_owner: None,  // Missing hub owner
        },
        uid: user_info.uid.clone(),
        active: true,
        approve: true,
        decline: false,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.profile.clone()).unwrap(),
    ).unwrap();

    let result = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
            assert!(retrieved_mentor_info.is_some(), "Mentor info should still be retrievable with missing fields");
        },
        _ => panic!("Test failed with missing fields"),
    }
}






#[test]
fn test_non_existent_mentor_retrieval() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous();

    // Define the UserInformation with some fields set to None
    let user_info = UserInformation {
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
    };

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Attempt to retrieve a mentor profile without any registration
    let result = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor_info_using_principal",
        encode_one(test_principal).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
            ic_cdk::println!("RETRIVED MENTOR INFO {:?}",retrieved_mentor_info);
            assert!(retrieved_mentor_info.is_none(), "No mentor info should be present for non-existent registrations");
        },
        _ => panic!("Test failed for non-existent mentor retrieval"),
    }
}







// #[test]
// fn test_with_inactive_users_or_mentors() {
//     let (pic, backend_canister) = setup();
//     let test_principal = Principal::anonymous();

//     let user_info = UserInfoInternal {
//         params: UserInformation {
//             full_name: "Inactive Mentor".to_string(),
//             profile_picture: None,
//             email: Some("inactive@mentor.com".to_string()),
//             country:"United States".to_string(),
//             social_links: None,
//             bio: Some("Testing with inactive status.".to_string()),
//             area_of_interest: "Technology".to_string(),
//             openchat_username: None,
//             type_of_profile: Some("mentor".to_string()),
//             reason_to_join: Some(vec!["To test inactive status handling.".to_string()]),
//         },
//         uid: "inactive_uid".to_string(),
//         is_active: true,  
//         joining_date: 1625097600,
//     };

//     // Simulate registering the user
//     pic.update_call(
//         backend_canister,
//         test_principal,
//         "register_user",
//         encode_one(user_info.params.clone()).unwrap(),
//     ).expect("User registration failed");

    
//     let mentor_profile = MentorInternal {
//         profile: MentorProfile {
//             preferred_icp_hub: Some("ICP Hub".to_string()),
//             existing_icp_mentor: true,
//             existing_icp_project_porfolio: Some("Portfolio of ICP projects".to_string()),
//             icp_hub_or_spoke: false,
//             category_of_mentoring_service: "Technology".to_string(),
//             links: None,
//             multichain: Some("Ethereum, Solana".to_string()),
//             years_of_mentoring: "10".to_string(),
//             website: Some("https://inactive.mentor.com".to_string()),
//             area_of_expertise: "Blockchain".to_string(),
//             reason_for_joining: Some("To mentor while being inactive.".to_string()),
//             hub_owner: Some("ICP Hub Owner".to_string()),
//         },
//         uid: user_info.uid.clone(),
//         active: true,  
//         approve: true,
//         decline: false,
//     };

//     pic.update_call(
//         backend_canister,
//         test_principal,
//         "register_mentor",
//         encode_one(mentor_profile.profile.clone()).unwrap(),
//     ).unwrap();






//     let result = pic.query_call(
//         backend_canister,
//         test_principal,
//         "get_mentor_info_using_principal",
//         encode_one(test_principal).unwrap(),
//     );

//     match result {
//         Ok(WasmResult::Reply(response)) => {
//             let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();
//             ic_cdk::println!("RETRIVED MENTOR INFO {:?}",retrieved_mentor_info);
//             assert!(retrieved_mentor_info.is_none() || !retrieved_mentor_info.unwrap().0.active, "Inactive mentor info should not be retrievable or should reflect inactive status");
//         },
//         _ => panic!("Test failed with inactive users or mentors"),
//     }
// }






