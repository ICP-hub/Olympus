use candid::{decode_args, decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{project_module::project_types::{ProjectInfo, ProjectInfoInternal}, user_modules::user_types::{UserInfoInternal, UserInformation}};
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
fn test_list_all_projects() {
    let (pic, backend_canister) = setup();

    // Define test principals
    let test_principal1 = Principal::anonymous(); // Replace with specific principals if needed
    let test_principal2 = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");

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
        test_principal1,
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
        test_principal2,
        "register_user",
        encode_one(user_info2.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Register two projects under two different principals
    let project_info1 = ProjectInfoInternal {
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
        uid: "5cbe7089b7f6704eda6cb2194489327900ae5cec9042352e3a0be17ab4573c5d".to_string(),
        is_active: true,
        is_verified: false,
        creation_date: 1625097600, // Example timestamp
    };

    // Simulate the project registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response1)) = pic.update_call(
        backend_canister,
        test_principal1,
        "register_project",
        encode_one(project_info1.params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };


    let is_registered: String =decode_one(&response1).unwrap();
    ic_cdk::println!("IS_REGISTERED 1 {:?}", is_registered);

    let project_info2 = ProjectInfoInternal {
        params: ProjectInfo {
            project_name: "Second Project".to_string(),
            project_logo: None,
            preferred_icp_hub: Some("ICP Hub".to_string()),
            live_on_icp_mainnet: Some(true),
            money_raised_till_now: Some(false),
            supports_multichain: Some("Ethereum, Solana".to_string()),
            project_elevator_pitch: Some("A revolutionary project.".to_string()),
            project_area_of_focus: "Marketing".to_string(),
            promotional_video: None,
            reason_to_join_incubator: "Loss opportunities".to_string(),
            project_description: Some("This is a second project description.".to_string()),
            project_cover: None,
            project_team: None,
            token_economics: None,
            technical_docs: None,
            long_term_goals: Some("Global adoption".to_string()),
            target_market: Some("India".to_string()),
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
            country_of_registration: Some("India".to_string()),
        },
        uid: "b6214924954366fa5cc590af7a267b0f30de3c36a4419048efaf0d5e74ca16a3".to_string(),
        is_active: true,
        is_verified: false,
        creation_date: 1625097600, // Example timestamp
    };

    // Simulate the project registration by directly manipulating the canister state
    let Ok(WasmResult::Reply(response2)) = pic.update_call(
        backend_canister,
        test_principal2,
        "register_project",
        encode_one(project_info2.params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };


    let is_registered: String =decode_one(&response2).unwrap();
    ic_cdk::println!("IS_REGISTERED 2 {:?}", is_registered);


    // Call the list_all_projects function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal1,
        "list_all_projects",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let projects_with_users: Vec<(ProjectInfoInternal, UserInfoInternal)> = decode_one(&response).expect("Decoding failed");
    
    assert_eq!(projects_with_users.len(), 2, "Should return two projects");

    let (project_1, user_1) = &projects_with_users[0];
    let (project_2, user_2) = &projects_with_users[1];

    // Check project and user details for both registered projects
    assert_eq!(project_1.params.project_name, project_info1.params.project_name, "First project name mismatch");
    assert_eq!(user_1.params.full_name, user_info1.params.full_name, "First user name mismatch");

    assert_eq!(project_2.params.project_name, project_info2.params.project_name, "Second project name mismatch");
    assert_eq!(user_2.params.full_name, user_info2.params.full_name, "Second user name mismatch");
}

#[test]
fn test_list_all_projects_empty() {
    let (pic, backend_canister) = setup();

    // Call the list_all_projects function when no projects are registered
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        Principal::anonymous(),
        "list_all_projects",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let projects_with_users: Vec<(ProjectInfoInternal, UserInfoInternal)> = decode_one(&response).expect("Decoding failed");

    assert!(projects_with_users.is_empty(), "{}", true);
}
