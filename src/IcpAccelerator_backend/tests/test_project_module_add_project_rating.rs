use candid::{decode_one, encode_one, Principal};
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
fn test_add_project_rating_successful() {
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

    // Register a project to be rated
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

    // Add a project rating
    let project_rating = ProjectRatingStruct {
        project_id: project_id.to_string(),
        message: "Great project!".to_string(),
        rating: 5,
    };

    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "add_project_rating",
        encode_one(project_rating).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the success message
    let result: Result<String, String> = decode_one(&response).unwrap();

    assert_eq!(result, Ok("Rating added".to_string()), "Expected successful rating addition");
}

#[test]
fn test_add_project_rating_already_rated() {
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


    // Register a project to be rated
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

    let Ok(WasmResult::Reply(_)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(initial_project_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Call the get_project_id function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_project_id",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the response
    let project_id: String = decode_one(&response).expect("Decoding failed");

    // Simulate user information retrieval
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

    // Assume user information is correctly stored in the canister state
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info.clone()).unwrap(),
    ).expect("Expected user registration reply");

    // Add the first project rating
    let project_rating = ProjectRatingStruct {
        project_id: project_id.to_string(),
        message: "Great project!".to_string(),
        rating: 5,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "add_project_rating",
        encode_one(project_rating.clone()).unwrap(),
    ).expect("Expected first rating reply");

    // Attempt to add another rating for the same project
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "add_project_rating",
        encode_one(project_rating).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the error message for already rated project
    let result: Result<String, String> = decode_one(&response).unwrap();
    assert_eq!(result.unwrap(), "User has already rated this project.", "Expected already rated error message");
}




#[test]
fn test_add_project_rating_project_not_found() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Attempt to add a rating to a non-existent project
    let invalid_project_id = "invalid-project-id".to_string();

    let project_rating = ProjectRatingStruct {
        project_id: invalid_project_id,
        message: "Non-existent project".to_string(),
        rating: 1,
    };

    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "add_project_rating",
        encode_one(project_rating).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode and verify the error message for non-existent project
    let result: Result<String, String> = decode_one(&response).unwrap();
    assert_eq!(result.unwrap(), "Project with ID does not exist.", "Expected project not found error message");
}
