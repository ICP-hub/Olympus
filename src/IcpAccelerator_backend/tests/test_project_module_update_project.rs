use candid::{decode_one, encode_args, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{project_module::project_types::*, user_modules::user_types::UserInformation};
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
fn test_update_project() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

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

    // Define a ProjectInfo object for the initial project creation
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
    };

    // Register the project
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(initial_project_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response to retrieve the project ID
    let registration_result: String = decode_one(&response).unwrap();
    ic_cdk::println!("REGISTRATION RESULT {:?}", registration_result);
    assert!(registration_result.contains("Project created Succesfully with UID"), "Expected successful project creation message");

    // Extract the project ID from the response
    let project_id = registration_result.split("UID ").last().unwrap().to_string();
    ic_cdk::println!("PROJECT ID {:?}", project_id);

    // Define updated ProjectInfo object with modified fields
    let updated_project_info = ProjectInfo {
        project_name: "Updated Project".to_string(),
        project_logo: None,
        preferred_icp_hub: Some("Updated ICP Hub".to_string()),
        live_on_icp_mainnet: Some(false),
        money_raised_till_now: Some(true),
        supports_multichain: Some("Polkadot".to_string()),
        project_elevator_pitch: Some("An updated revolutionary project.".to_string()),
        project_area_of_focus: "Blockchain".to_string(),
        promotional_video: None,
        reason_to_join_incubator: "Innovation opportunities".to_string(),
        project_description: Some("This is the updated project description.".to_string()),
        project_cover: None,
        project_team: None,
        token_economics: None,
        technical_docs: None,
        long_term_goals: Some("Mass adoption".to_string()),
        target_market: Some("Global".to_string()),
        self_rating_of_project: 4.8,
        mentors_assigned: None,
        vc_assigned: None,
        project_website: None,
        links: None,
        money_raised: None,
        upload_private_documents: None,
        private_docs: None,
        public_docs: None,
        dapp_link: None,
        weekly_active_users: None,
        revenue: None,
        is_your_project_registered: None,
        type_of_registration: None,
        country_of_registration: None,

    };

    // Call the update_project function
    let Ok(WasmResult::Reply(update_response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_project",
        encode_args((project_id.clone(), updated_project_info.clone())).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the update response and verify the update was successful
    let update_result: String = decode_one(&update_response).unwrap();
    assert_eq!(update_result, "Profile updated successfully", "Expected successful project update message");

    // Verify that the project was updated in the project_storage
    let Ok(WasmResult::Reply(retrieved_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_project_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_project_info: Option<ProjectInfoInternal> = decode_one(&retrieved_response).unwrap();
    assert!(retrieved_project_info.is_some(), "Project info should be present");
    let project = retrieved_project_info.unwrap();
    assert_eq!(project.params.project_name, "Updated Project".to_string(), "Project name should match the updated name");
    assert_eq!(project.params.project_area_of_focus, "Blockchain".to_string(), "Project area of focus should match the updated value");
}

#[test]
fn test_update_project_not_owner() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous();

    // Register the project with a different principal
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
    };

    // Register the project
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(initial_project_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response to retrieve the project ID
    let registration_result: String = decode_one(&response).unwrap();
    let project_id = registration_result.split("UID ").last().unwrap().to_string();

    // Attempt to update the project with a different principal (simulate a different user)
    let different_principal = Principal::management_canister(); // Use a different principal for testing

    let updated_project_info = ProjectInfo {
        project_name: "Unauthorized Update".to_string(),
        project_logo: None,
        preferred_icp_hub: Some("Unauthorized ICP Hub".to_string()),
        live_on_icp_mainnet: Some(false),
        money_raised_till_now: Some(true),
        supports_multichain: Some("Polkadot".to_string()),
        project_elevator_pitch: Some("An unauthorized update.".to_string()),
        project_area_of_focus: "Finance".to_string(),
        promotional_video: None,
        reason_to_join_incubator: "Unauthorized access".to_string(),
        project_description: Some("This update should fail.".to_string()),
        project_cover: None,
        project_team: None,
        token_economics: None,
        technical_docs: None,
        long_term_goals: Some("Unauthorized goals".to_string()),
        target_market: Some("Unauthorized market".to_string()),
        self_rating_of_project: 1.0,
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
        is_your_project_registered: Some(false),
        type_of_registration: Some("Unauthorized".to_string()),
        country_of_registration: Some("Unauthorized".to_string()),
    };

    // Call the update_project function with the different principal
    let Ok(WasmResult::Reply(update_response)) = pic.update_call(
        backend_canister,
        different_principal,
        "update_project",
        encode_one((project_id.clone(), updated_project_info.clone())).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the update response and verify the update was rejected
    let update_result: String = decode_one(&update_response).unwrap();
    assert_eq!(update_result, "Error: Only the project owner can request updates.", "Expected update rejection message");
}

