use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::project_module::project_types::{ProjectInfo, ProjectInfoInternal, ProjectRatingStruct};
use IcpAccelerator_backend::user_modules::user_types::{UserInfoInternal, UserInformation};
use std::fs;
use std::collections::HashMap;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "../../target/wasm32-unknown-unknown/release/user_module_backend.wasm";

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
fn test_get_frequent_reviewers() {
    let (pic, backend_canister) = setup();

    // Define multiple test principals and projects
    let test_principal_1 = Principal::anonymous(); // Replace with specific principals as needed
    let test_principal_2 = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");
    let test_principal_3 = Principal::from_text("dfeex-vc3or-2abck-j24qg-vzytj-34nw4-cpb5r-h56yt-wx4ml-ly25s-yae")
    .expect("Failed to parse principal");

    // Define the UserInformation with some fields set to None
    let user_info = UserInfoInternal{
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
        test_principal_1,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");


    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal_2,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Simulate registering the user
    pic.update_call(
        backend_canister,
        test_principal_3,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");


    // Create a ProjectInfoInternal object to simulate project registration
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
        uid: "b7deb0ac398bb66b3d8e1736cd4163d0a8411ec4fda4e8be58de74cdac6c8e08".to_string(),
        is_active: true,
        is_verified: false,
        creation_date: 1625097600, // Example timestamp
    };

    // Simulate the project registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal_1,
        "register_project",
        encode_one(project_info.params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Call the get_project_id function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal_1,
        "get_project_id",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let project_id: String = decode_one(&response).expect("Decoding failed");

    // Add multiple reviews for test_principal_1
    for _ in 0..6 {
        let project_rating = ProjectRatingStruct {
            project_id: project_id.clone(),
            message: "Great project!".to_string(),
            rating: 5,
        };

        pic.update_call(
            backend_canister,
            test_principal_1,
            "add_project_rating",
            encode_one(project_rating.clone()).unwrap(),
        ).expect("Expected reply");
    }

    // Add fewer reviews for test_principal_2 and test_principal_3
    for _ in 0..3 {
        let project_rating = ProjectRatingStruct {
            project_id: project_id.clone(),
            message: "Good project.".to_string(),
            rating: 4,
        };

        pic.update_call(
            backend_canister,
            test_principal_2,
            "add_project_rating",
            encode_one(project_rating.clone()).unwrap(),
        ).expect("Expected reply");

        pic.update_call(
            backend_canister,
            test_principal_3,
            "add_project_rating",
            encode_one(project_rating.clone()).unwrap(),
        ).expect("Expected reply");
    }

    // Fetch frequent reviewers
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "get_frequent_reviewers",
        vec![],
    )else{
        panic!("Expected reply");
    };

    let frequent_reviewers: Vec<UserInfoInternal> = decode_one(&response).unwrap();

    // Check if test_principal_1 is in the frequent reviewers list
    assert!(frequent_reviewers.iter().any(|user| user.principal == test_principal_1));

    // Check if test_principal_2 and test_principal_3 are not in the frequent reviewers list
    assert!(!frequent_reviewers.iter().any(|user| user.principal == test_principal_2));
    assert!(!frequent_reviewers.iter().any(|user| user.principal == test_principal_3));
}
