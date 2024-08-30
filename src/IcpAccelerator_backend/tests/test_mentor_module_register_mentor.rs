use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{
    mentor_module::mentor_types::{MentorInternal,  MentorProfile}, project_module::project_types::{ProjectInfo, ProjectInfoInternal}, user_modules::user_types::{UserInfoInternal, UserInformation}
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
fn test_register_mentor() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the UserInformation
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

    // Define the MentorProfile
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

    // Call the register_mentor function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the mentor was registered correctly
    let registration_result: String = decode_one(&response).unwrap();
    assert!(registration_result.contains("Mentor Profile Created With UID"), "Mentor registration failed");

    // Now retrieve the registered mentor to verify
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_mentor",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_mentor_info: Option<(MentorProfile, UserInfoInternal)> = decode_one(&response).unwrap();

    // Ensure the mentor info matches what was registered
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, retrieved_user) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.area_of_expertise, mentor_profile.area_of_expertise, "Area of expertise should match");
    assert_eq!(retrieved_user.params.full_name, user_info.params.full_name, "User full name should match");
}













#[test]
fn test_project_role_conflict() {
    let (pic, backend_canister) = setup();

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
        joining_date: 150823,
    };
    // Simulate registering the user
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register a project
    let project_info = ProjectInfoInternal {
        params: ProjectInfo {
            project_name: "Sample Project".to_string(),
            project_logo: None,
            preferred_icp_hub: Some("ICP Hub".to_string()),
            live_on_icp_mainnet: Some(true),
            money_raised_till_now: Some(false),
            supports_multichain: Some("Ethereum, Solana".to_string()),
            project_elevator_pitch: Some("A revolutionary project.".to_string()),
            project_area_of_focus: "Technology".to_string(),
            promotional_video: None,
            reason_to_join_incubator: "Growth opportunities".to_string(),
            project_description: Some("This is a sample project description.".to_string()),
            project_cover: None,
            project_team: None,
            token_economics: None,
            technical_docs: None,
            long_term_goals: Some("Global adoption".to_string()),
            target_market: Some("Worldwide".to_string()),
            self_rating_of_project: 4.5,
            mentors_assigned: None,
            vc_assigned: None,
            project_website: None,
            links: None,
            money_raised: None,
            upload_private_documents: Some(false),
            private_docs: None,
            public_docs: None,
            dapp_link: None,
            weekly_active_users: None,
            revenue: None,
            is_your_project_registered: Some(true),
            type_of_registration: Some("Company".to_string()),
            country_of_registration: Some("United States".to_string()),
        },
        uid: "project_uid_1".to_string(),
        is_active: true,
        is_verified: false,
        creation_date: 150823,
    };

    // Simulate the project registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        principal,
        "register_project",
        encode_one(project_info.params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };


    let is_registered: String =decode_one(&response).unwrap();
    ic_cdk::println!("IS_REGISTERED {:?}", is_registered);

    // Attempt to register as mentor
    let mentor_profile = MentorProfile {
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
    };
    // Simulate the mentor registration by directly manipulating the canister state
        let result = pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
        );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let reply: String = decode_one(&response).unwrap();
            assert_eq!(reply, "You are not allowed to get this role because you already have the Project role.");
        },
        _ => panic!("Test failed for project role conflict"),
    }
}







#[test]
fn test_existing_mentor() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[3 as u8]);

    // Register as user first
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
    pic.update_call(
        backend_canister,
        principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");


    // Register as mentor
    let mentor_profile = MentorProfile {
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
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Attempt to register as mentor again
    let result = pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let reply: String = decode_one(&response).unwrap();
            assert_eq!(reply, "you are a mentor already");
        },
        _ => panic!("Test failed for existing mentor"),
    }
}








#[test]
fn test_validation_failures() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[4 as u8]);

    // Register as user first
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

    // Attempt to register as mentor with invalid data (e.g., missing area_of_expertise)
    let invalid_mentor_profile = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Portfolio of mentor".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Technology".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "".to_string(),  // Invalid data: empty years_of_mentoring
        website: Some("https://mentor.com".to_string()),
        area_of_expertise: "".to_string(),  // Invalid data: empty area_of_expertise
        reason_for_joining: Some("To mentor projects.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    let result = pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(invalid_mentor_profile.clone()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let reply: String = decode_one(&response).unwrap();
            assert!(reply.starts_with("Validation error:"), "Expected a validation error");
        },
        _ => panic!("Test failed for validation failures"),
    }
}






#[test]
fn test_random_uid_generation() {
    let (pic, backend_canister) = setup();

    let principal1 = Principal::from_slice(&[6 as u8]);
    let principal2 = Principal::from_slice(&[7 as u8]);

    // Register as users first
    let user_info1 = UserInfoInternal {
        uid: "user_uid_6".to_string(),
        params: UserInformation {
            full_name: "User 6".to_string(),
            profile_picture: None,
            email: Some("user6@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user6".to_string()),
            type_of_profile: Some("user".to_string()),
            reason_to_join: Some(vec!["Reason".to_string()]),
        },
        is_active: true,
        joining_date: 150823,
    };
    // Simulate registering the user
    pic.update_call(
        backend_canister,
        principal1,
        "register_user",
        encode_one(user_info1.params.clone()).unwrap(),
    ).expect("User registration failed");

    let user_info2 = UserInfoInternal {
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
        principal2,
        "register_user",
        encode_one(user_info2.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register as mentors
    let mentor_profile1 = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Portfolio of mentor 6".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Technology".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor6.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To mentor projects.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };

    // Simulate the mentor registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response1)) = pic.update_call(
        backend_canister,
        principal1,
        "register_mentor",
        encode_one(mentor_profile1.clone()).unwrap(),
        ) else {
            panic!("Expected reply");
        };
        let reply1: String = decode_one(&response1).unwrap();
        ic_cdk::println!("REGISTERED MENTOR {:?}",reply1);
    

    let mentor_profile2 = MentorProfile {
        preferred_icp_hub: Some("ICP Hub".to_string()),
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some("Portfolio of mentor 7".to_string()),
        icp_hub_or_spoke: false,
        category_of_mentoring_service: "Technology".to_string(),
        links: None,
        multichain: Some("Ethereum, Solana".to_string()),
        years_of_mentoring: "10".to_string(),
        website: Some("https://mentor7.com".to_string()),
        area_of_expertise: "Blockchain".to_string(),
        reason_for_joining: Some("To mentor projects.".to_string()),
        hub_owner: Some("ICP Hub Owner".to_string()),
    };
    // Simulate the mentor registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response2)) = pic.update_call(
        backend_canister,
        principal2,
        "register_mentor",
        encode_one(mentor_profile2.clone()).unwrap(),
        ) else {
            panic!("Expected reply");
        };
        let reply2: String = decode_one(&response2).unwrap();
        ic_cdk::println!("REGISTERED MENTOR {:?}",reply2);

    assert!(reply1.starts_with("Mentor Profile Created With UID"), "Expected successful registration with UID for mentor 1");
    assert!(reply2.starts_with("Mentor Profile Created With UID"), "Expected successful registration with UID for mentor 2");

    // Extract UIDs and compare
    let uid1 = reply1.replace("Mentor Profile Created With UID ", "");
    let uid2 = reply2.replace("Mentor Profile Created With UID ", "");

    assert_ne!(uid1, uid2, "UIDs should be unique for each mentor");
}







#[test]
fn test_duplicate_registration() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[12 as u8]);

    // Register as user first
    let user_info = UserInfoInternal {
        uid: "user_uid_12".to_string(),
        params: UserInformation {
            full_name: "User 12".to_string(),
            profile_picture: None,
            email: Some("user12@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user12".to_string()),
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

    // Register as mentor
    let mentor_profile = MentorProfile {
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
    };
    pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();

    // Attempt to register as mentor again
    let result = pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    );

    match result {
        Ok(WasmResult::Reply(response)) => {
            let reply: String = decode_one(&response).unwrap();
            assert_eq!(reply, "you are a mentor already");
        },
        _ => panic!("Test failed for duplicate registration"),
    }
}








#[test]
fn test_maximum_limits_on_input_data() {
    let (pic, backend_canister) = setup();

    let principal = Principal::from_slice(&[13 as u8]);

    // Register as user first
    let user_info = UserInfoInternal {
        uid: "839047bc25dd6b3d25bf153f8ae121bdfb5ca2cc9246763fb59a679c1eeb4586".to_string(),
        params: UserInformation {
            full_name: "User 13".to_string(),
            profile_picture: None,
            email: Some("user13@example.com".to_string()),
            country: "Country".to_string(),
            social_links: None,
            bio: Some("User Bio".to_string()),
            area_of_interest: "Technology".to_string(),
            openchat_username: Some("user13".to_string()),
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

    // Create a string with maximum allowed characters (assuming the limit is 1000 characters for this test)
    let max_length_string = "A".repeat(1000);

    // Create a MentorProfile with maximum input data
    let mentor_profile = MentorProfile {
        preferred_icp_hub: Some(max_length_string.clone()), // Maximum length string
        existing_icp_mentor: true,
        existing_icp_project_porfolio: Some(max_length_string.clone()), // Maximum length string
        icp_hub_or_spoke: false,
        category_of_mentoring_service: max_length_string.clone(), // Maximum length string
        links: None,
        multichain: Some(max_length_string.clone()), // Maximum length string
        years_of_mentoring: max_length_string.clone(), // Maximum length string
        website: Some(max_length_string.clone()), // Maximum length string (even though it's supposed to be a URL)
        area_of_expertise: max_length_string.clone(), // Maximum length string
        reason_for_joining: Some(max_length_string.clone()), // Maximum length string
        hub_owner: Some(max_length_string.clone()), // Maximum length string
    };

    // Attempt to register as mentor with maximum input data
        pic.update_call(
        backend_canister,
        principal,
        "register_mentor",
        encode_one(mentor_profile.clone()).unwrap(),
    ).unwrap();


    // Call the get_mentor_info_using_principal function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        principal,
        "get_mentor_info_using_principal",
        encode_one(principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the mentor info was retrieved correctly
    let retrieved_mentor_info: Option<(MentorInternal, UserInfoInternal)> = decode_one(&response).unwrap();

    // There should be one mentor registered, and it should match the mentor_profile we registered
    assert!(retrieved_mentor_info.is_some(), "Mentor info should be present");
    let (retrieved_mentor, retrieved_user) = retrieved_mentor_info.unwrap();
    assert_eq!(retrieved_mentor.profile.existing_icp_mentor, mentor_profile.existing_icp_mentor, "ICP Mentor should match");
    assert_eq!(retrieved_mentor.profile.preferred_icp_hub, mentor_profile.preferred_icp_hub, "Mentor preferred ICP hub should match");
    assert_eq!(retrieved_mentor.profile.website, mentor_profile.website, "Mentor preferred ICP hub should match");
    assert_eq!(retrieved_user.uid, user_info.uid, "User UID should match");
    assert_eq!(retrieved_user.params.full_name, user_info.params.full_name, "User full name should match");

    
}


