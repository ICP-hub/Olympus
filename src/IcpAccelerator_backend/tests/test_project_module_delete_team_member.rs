use candid::{decode_one, encode_args, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{project_module::project_types::*, user_modules::user_types::{UserInfoInternal, UserInformation}};
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
fn test_delete_team_member_successful() {
    let (pic, backend_canister) = setup();

    // Define test principals for the project owner and team member
    let project_owner_principal = Principal::anonymous(); 
    let team_member_principal = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");


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
        project_owner_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");


    // Register a project with the project owner
    let initial_project_info = ProjectInfo {
        project_name: "Initial Project".to_string(),
        project_logo: None,
        preferred_icp_hub: Some("ICP Hub".to_string()),
        live_on_icp_mainnet: Some(true),
        money_raised_till_now: Some(false),
        supports_multichain: Some("Ethereum, Solana".to_string()),
        project_elevator_pitch: Some("A revolutionary project.".to_string()),
        project_area_of_focus: "Technology".to_string(),
        promotional_video: None,
        reason_to_join_incubator: "Growth opportunities".to_string(),
        project_description: Some("This is the initial project description.".to_string()),
        project_cover: None,
        project_team: Some(vec![]), // Initialize with an empty team
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
    };

    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        project_owner_principal,
        "register_project",
        encode_one(initial_project_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response to retrieve the project ID
    let registration_result: String = decode_one(&response).unwrap();
    let project_id = registration_result.split("UID ").last().unwrap().to_string();

    // Register the team member as a user
    let team_member_info = UserInformation {
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

    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        team_member_principal,
        "register_user",
        encode_one(team_member_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Add the team member to the project
    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        project_owner_principal,
        "update_team_member",
        encode_args((project_id.clone(), team_member_principal)).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Now, call the delete_team_member function to remove the team member
    let Ok(WasmResult::Reply(delete_response)) = pic.update_call(
        backend_canister,
        project_owner_principal,
        "delete_team_member",
        encode_args((project_id.clone(), team_member_principal)).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the delete response and verify the success message
    let delete_result: String = decode_one(&delete_response).unwrap();
    assert_eq!(delete_result, "Team member deleted successfully.", "Expected successful team member deletion message");

    // Verify that the team member was removed from the project
    let Ok(WasmResult::Reply(retrieved_response)) = pic.query_call(
        backend_canister,
        project_owner_principal,
        "get_project_info_using_principal",
        encode_one(project_owner_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_project_info: Option<(ProjectInfoInternal, UserInfoInternal)> = decode_one(&retrieved_response).unwrap();
    ic_cdk::println!("PROJECT INFO {:?}", retrieved_project_info);
    assert!(retrieved_project_info.is_some(), "Project info should be present");

    let project = retrieved_project_info.unwrap();
    let binding = project.0.params.project_team.unwrap();
    let team_member = binding.iter().find(|m| m.member_uid == "team_member_uid");
    assert!(team_member.is_none(), "Team member should not be present in the project team");
}

#[test]
fn test_delete_team_member_project_not_found() {
    let (pic, backend_canister) = setup();

    // Define test principals for the project owner and team member
    let project_owner_principal = Principal::anonymous(); 
    let team_member_principal = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");

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
        project_owner_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Register the team member as a user
    let team_member_info = UserInformation {
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

    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        team_member_principal,
        "register_user",
        encode_one(team_member_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Call the delete_team_member function with an invalid project ID
    let invalid_project_id = "invalid-project-id".to_string();

    let Ok(WasmResult::Reply(delete_response)) = pic.update_call(
        backend_canister,
        project_owner_principal,
        "delete_team_member",
        encode_args((invalid_project_id.clone(), team_member_principal)).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the delete response and verify the error message
    let delete_result: String = decode_one(&delete_response).unwrap();
    assert_eq!(delete_result, "Project not found.", "Expected project not found error message");
}

#[test]
fn test_delete_team_member_user_not_found() {
    let (pic, backend_canister) = setup();

    // Define test principals for the project owner and a non-existent team member
    let project_owner_principal = Principal::anonymous(); 
    let non_existent_member_principal = Principal::from_text("jwyik-wtp73-7aqic-gggmg-rb3mh-6vsg4-wzfw6-awdvm-sq4nc-o3lmr-cqe")
    .expect("Failed to parse principal");

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
        project_owner_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Register a project with the project owner
    let initial_project_info = ProjectInfo {
        project_name: "Initial Project".to_string(),
        project_logo: None,
        preferred_icp_hub: Some("ICP Hub".to_string()),
        live_on_icp_mainnet: Some(true),
        money_raised_till_now: Some(false),
        supports_multichain: Some("Ethereum, Solana".to_string()),
        project_elevator_pitch: Some("A revolutionary project.".to_string()),
        project_area_of_focus: "Technology".to_string(),
        promotional_video: None,
        reason_to_join_incubator: "Growth opportunities".to_string(),
        project_description: Some("This is the initial project description.".to_string()),
        project_cover: None,
        project_team: None, // No team members yet
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
    };

    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        project_owner_principal,
        "register_project",
        encode_one(initial_project_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response to retrieve the project ID
    let registration_result: String = decode_one(&response).unwrap();
    let project_id = registration_result.split("UID ").last().unwrap().to_string();

    // Call the delete_team_member function with a non-existent team member
    let Ok(WasmResult::Reply(delete_response)) = pic.update_call(
        backend_canister,
        project_owner_principal,
        "delete_team_member",
        encode_args((project_id.clone(), non_existent_member_principal)).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the delete response and verify the error message
    let delete_result: String = decode_one(&delete_response).unwrap();
    assert_eq!(delete_result, "User not found.", "Expected user not found error message");
}
