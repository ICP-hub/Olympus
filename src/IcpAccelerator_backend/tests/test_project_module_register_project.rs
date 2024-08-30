use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::{project_module::project_types::*, user_modules::user_types::{UserInfoInternal, UserInformation}, vc_module::vc_types::VentureCapitalist};
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
fn test_register_project() {
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

    // Define a valid ProjectInfo object
    let project_info = ProjectInfo {
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
    };

    // Call the register_project function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the project registration was successful
    let result: String = decode_one(&response).unwrap();
    assert!(result.contains("Project created Succesfully with UID"), "Expected successful project creation message");

    // Verify that the project was stored in the project_storage
    let Ok(WasmResult::Reply(retrieved_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_project_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let retrieved_project_info: Option<(ProjectInfoInternal, UserInfoInternal)> = decode_one(&retrieved_response).unwrap();
    ic_cdk::println!("RETRIVED PROJECT INFO {:?}", retrieved_project_info);
    assert!(retrieved_project_info.is_some(), "Project info should be present");
    let project = retrieved_project_info.unwrap();
    assert_eq!(project.0.params.project_name, "Sample Project".to_string(), "Project name should match");
}

#[test]
fn test_register_project_with_existing_role() {
    let (pic, backend_canister) = setup();

    // Define a test principal
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


     // Define the expected VentureCapitalist parameters
     let vc_params = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100000000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5000000.0,
        existing_icp_investor: true,
        money_invested: Some(50000000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: None,
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Growth opportunities".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Call the register_venture_capitalist function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response to ensure the VC was registered
    let vc_result: String = decode_one(&response).unwrap();
    ic_cdk::println!("RESULT FROM POST VC API {}", vc_result);

    // Define a ProjectInfo object
    let project_info = ProjectInfo {
        project_name: "Another Project".to_string(),
        project_logo: None,
        preferred_icp_hub: Some("ICP Hub".to_string()),
        live_on_icp_mainnet: Some(true),
        money_raised_till_now: Some(false),
        supports_multichain: Some("Ethereum, Solana".to_string()),
        project_elevator_pitch: Some("A revolutionary project.".to_string()),
        project_area_of_focus: "Technology".to_string(),
        promotional_video: None,
        reason_to_join_incubator: "Growth opportunities".to_string(),
        project_description: Some("This is another project description.".to_string()),
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

    // Attempt to register the project with an existing Mentor role
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the role conflict message
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "You are not allowed to get this role because you already have the Venture Capitalist role.", "Expected VC role conflict message");
}

#[test]
fn test_register_project_with_existing_project() {
    let (pic, backend_canister) = setup();

    // Define a test principal
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

    // Define a ProjectInfo object
    let project_info = ProjectInfo {
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
        project_description: Some("This is the first project description.".to_string()),
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

    // Register the first project
    pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Attempt to register a second project
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_project",
        encode_one(project_info).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the conflict message
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "You can't create more than one project", "Expected project conflict message");
}
