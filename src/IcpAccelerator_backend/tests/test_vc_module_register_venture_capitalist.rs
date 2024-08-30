use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::project_module::project_types::{ProjectInfo, ProjectInfoInternal};
use std::fs;

use IcpAccelerator_backend::user_modules::user_types::*;
use IcpAccelerator_backend::vc_module::vc_types::*;

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
fn test_register_venture_capitalist() {
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
    let result: String = decode_one(&response).unwrap();
    ic_cdk::println!("RESULT FROM POST VC API {}", result);

    // The result should contain the UID of the new VC, so we check for the expected output pattern
    assert!(result.starts_with("Venture Capitalist Created With UID"));

    // Verify the VC is stored in the state by querying the VC info
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(), 
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into VentureCapitalistAll
    let vc_info_all: Option<(VentureCapitalistAll, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    ic_cdk::println!("VC_INFO RESULT: {:?}", vc_info_all);

    let result=vc_info_all.unwrap();
    let binding=result.0;

    // Now perform the assertion to check if the stored VentureCapitalist matches the input parameters
    assert_eq!(
        binding.profile.params, vc_params,
        "The stored VentureCapitalist does not match the input parameters."
    );
}






#[test]
fn test_register_venture_capitalist_with_project_role_conflict() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user with an existing project role
    let user_info = UserInformation {
        full_name: "Project User".to_string(),
        profile_picture: None,
        email: Some("projectuser@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Project Owner.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("project".to_string()),
        reason_to_join: Some(vec!["Build a new project.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
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
        test_principal,
        "register_project",
        encode_one(project_info.params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };


    let is_registered: String =decode_one(&response).unwrap();
    ic_cdk::println!("IS_REGISTERED {:?}", is_registered);

    // Define VC parameters
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
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Call the register_venture_capitalist function with project role conflict
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration failed due to role conflict
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "You are not allowed to get this role because you already have the Project role.");
}

#[test]
fn test_register_venture_capitalist_with_too_many_roles() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Multi-Role User".to_string(),
        profile_picture: None,
        email: Some("multirole@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Entrepreneur and Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Support startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Simulate adding two roles to the user
    pic.update_call(
        backend_canister,
        test_principal,
        "register_role",
        encode_one("mentor").unwrap(),
    ).expect("Mentor role registration failed");

    pic.update_call(
        backend_canister,
        test_principal,
        "register_role",
        encode_one("vc").unwrap(),
    ).expect("VC role registration failed");

    // Define VC parameters
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
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Call the register_venture_capitalist function with too many roles
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration failed due to having too many roles
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "You are not eligible for this role because you have 2 or more roles");
}

#[test]
fn test_register_venture_capitalist_with_declined_request() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Declined VC User".to_string(),
        profile_picture: None,
        email: Some("declinedvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with previous declined request.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Finance startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Simulate a previously declined VC registration request
    pic.update_call(
        backend_canister,
        test_principal,
        "decline_vc_request",
        encode_one(test_principal).unwrap(),
    ).expect("Declining VC request failed");

    // Define VC parameters
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
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Call the register_venture_capitalist function with a previously declined request
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration failed due to the previous declined request
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "You had got your request declined earlier");
}

#[test]
fn test_register_venture_capitalist_with_existing_registration() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Existing VC User".to_string(),
        profile_picture: None,
        email: Some("existingvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with existing registration.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Support startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Register a VC
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
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ).expect("First VC registration failed");

    // Attempt to register the VC again
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration failed due to the existing registration
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "This Principal is already registered.");
}

#[test]
fn test_register_venture_capitalist_with_invalid_data() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Invalid Data User".to_string(),
        profile_picture: None,
        email: Some("invaliddata@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with invalid data.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Finance startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Define VC parameters with invalid data
    let vc_params = VentureCapitalist {
        name_of_fund: "".to_string(), // Missing name
        fund_size: Some(-100000000.0), // Invalid fund size
        assets_under_management: Some("".to_string()), // Empty string for AUM
        registered_under_any_hub: Some(false),
        average_check_size: 0.0, // Invalid check size
        existing_icp_investor: true,
        money_invested: Some(-50000000.0), // Invalid money invested
        existing_icp_portfolio: Some("".to_string()), // Empty string for portfolio
        type_of_investment: "".to_string(), // Missing investment type
        project_on_multichain: None,
        category_of_investment: "".to_string(), // Missing investment category
        reason_for_joining: Some("".to_string()), // Empty reason for joining
        preferred_icp_hub: "".to_string(), // Missing ICP hub
        investor_type: Some("".to_string()), // Empty investor type
        number_of_portfolio_companies: 0, // Invalid number of portfolio companies
        portfolio_link: "".to_string(), // Empty portfolio link
        website_link: Some("".to_string()), // Empty website link
        links: None,
        registered: true,
        registered_country: Some("".to_string()), // Empty country
        stage: Some("".to_string()), // Empty stage
        range_of_check_size: Some("".to_string()), // Empty range of check size
    };

    // Call the register_venture_capitalist function with invalid data
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration failed due to validation error
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Validation error: Name of the fund is a required field.");
}

#[test]
fn test_register_venture_capitalist_with_maximum_roles() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Max Role User".to_string(),
        profile_picture: None,
        email: Some("maxrole@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Entrepreneur with maximum roles.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("entrepreneur".to_string()),
        reason_to_join: Some(vec!["Lead multiple projects.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Simulate adding two roles to the user
    pic.update_call(
        backend_canister,
        test_principal,
        "register_role",
        encode_one("project").unwrap(),
    ).expect("Project role registration failed");

    pic.update_call(
        backend_canister,
        test_principal,
        "register_role",
        encode_one("mentor").unwrap(),
    ).expect("Mentor role registration failed");

    // Define VC parameters
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
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Call the register_venture_capitalist function with maximum roles
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration failed due to exceeding the maximum roles
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "You are not eligible for this role because you have 2 or more roles");
}

#[test]
fn test_register_venture_capitalist_with_long_strings() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Long String VC User".to_string(),
        profile_picture: None,
        email: Some("longstringvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with very long strings.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Support startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Define VC parameters with very long strings
    let vc_params = VentureCapitalist {
        name_of_fund: "Tech Fund".repeat(1000),
        fund_size: Some(100000000.0),
        assets_under_management: Some("1B USD".repeat(1000)),
        registered_under_any_hub: Some(true),
        average_check_size: 5000000.0,
        existing_icp_investor: true,
        money_invested: Some(50000000.0),
        existing_icp_portfolio: Some("ICP Projects".repeat(1000)),
        type_of_investment: "Equity".repeat(1000),
        project_on_multichain: None,
        category_of_investment: "Technology".repeat(1000),
        reason_for_joining: Some("Growth opportunities".repeat(1000)),
        preferred_icp_hub: "ICP Hub".repeat(1000),
        investor_type: Some("Venture Capital".repeat(1000)),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".repeat(1000),
        website_link: Some("https://vcfund.example.com".repeat(1000)),
        links: None,
        registered: true,
        registered_country: Some("United States".repeat(1000)),
        stage: Some("Growth".repeat(1000)),
        range_of_check_size: Some("$2-5M".repeat(1000)),
    };

    // Call the register_venture_capitalist function with long strings
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration succeeded, but the strings may have been truncated or caused errors
    let result: String = decode_one(&response).unwrap();
    assert!(result.starts_with("Venture Capitalist Created With UID"));
}

#[test]
fn test_register_venture_capitalist_with_special_characters() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Special Character VC User".to_string(),
        profile_picture: None,
        email: Some("specialcharvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with special characters.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Support startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Define VC parameters with special characters and emojis
    let vc_params = VentureCapitalist {
        name_of_fund: "Tech Fund 🚀".to_string(),
        fund_size: Some(100000000.0),
        assets_under_management: Some("1B USD 💰".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5000000.0,
        existing_icp_investor: true,
        money_invested: Some(50000000.0),
        existing_icp_portfolio: Some("ICP Projects 🛠️".to_string()),
        type_of_investment: "Equity ⚖️".to_string(),
        project_on_multichain: None,
        category_of_investment: "Technology 🧑‍💻".to_string(),
        reason_for_joining: Some("Growth opportunities 🚀".to_string()),
        preferred_icp_hub: "ICP Hub 🌐".to_string(),
        investor_type: Some("Venture Capital 💼".to_string()),
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States 🇺🇸".to_string()),
        stage: Some("Growth 📈".to_string()),
        range_of_check_size: Some("$2-5M 💵".to_string()),
    };

    // Call the register_venture_capitalist function with special characters
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration succeeded and the special characters were handled properly
    let result: String = decode_one(&response).unwrap();
    assert!(result.starts_with("Venture Capitalist Created With UID"));
}

#[test]
fn test_register_venture_capitalist_concurrent_requests() {
    let (pic, backend_canister) = setup();

    let test_principal1 = Principal::anonymous();
    let test_principal2 = Principal::anonymous();

    // Register two users
    let user_info1 = UserInformation {
        full_name: "Concurrent VC User 1".to_string(),
        profile_picture: None,
        email: Some("concurrentvc1@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor 1.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Support startups.".to_string()]),
    };

    let user_info2 = UserInformation {
        full_name: "Concurrent VC User 2".to_string(),
        profile_picture: None,
        email: Some("concurrentvc2@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor 2.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Support startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal1,
        "register_user",
        encode_one(user_info1).unwrap(),
    ).expect("User 1 registration failed");

    pic.update_call(
        backend_canister,
        test_principal2,
        "register_user",
        encode_one(user_info2).unwrap(),
    ).expect("User 2 registration failed");

    // Define VC parameters for both users
    let vc_params1 = VentureCapitalist {
        name_of_fund: "Tech Fund 1".to_string(),
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
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    let vc_params2 = vc_params1.clone();
    let vc_params3 = vc_params1.clone();

    // Call the register_venture_capitalist function concurrently for both users
    let Ok(WasmResult::Reply(response1)) = pic.update_call(
        backend_canister,
        test_principal1,
        "register_venture_capitalist",
        encode_one(vc_params1).unwrap(),
    ) else {
        panic!("Expected reply for user 1");
    };

    let Ok(WasmResult::Reply(response2)) = pic.update_call(
        backend_canister,
        test_principal2,
        "register_venture_capitalist",
        encode_one(vc_params2).unwrap(),
    ) else {
        panic!("Expected reply for user 2");
    };

    let Ok(WasmResult::Reply(response3)) = pic.update_call(
        backend_canister,
        test_principal2,
        "register_venture_capitalist",
        encode_one(vc_params3).unwrap(),
    ) else {
        panic!("Expected reply for user 2");
    };

    // Verify that both registrations succeeded without errors
    let result1: String = decode_one(&response1).unwrap();
    let result2: String = decode_one(&response2).unwrap();
    let result3: String = decode_one(&response3).unwrap();

    assert!(result1.starts_with("Venture Capitalist Created With UID"));
    assert!(result2.starts_with("Venture Capitalist Created With UID"));
    assert_eq!(result3, "This Principal is already registered.");
}

#[test]
fn test_register_venture_capitalist_with_null_values() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Null Value VC User".to_string(),
        profile_picture: None,
        email: Some("nullvaluevc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with null values.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Finance startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Define VC parameters with null (None) values where allowed
    let vc_params = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: None, // Null value allowed
        assets_under_management: None, // Null value allowed
        registered_under_any_hub: None, // Null value allowed
        average_check_size: 5000000.0,
        existing_icp_investor: true,
        money_invested: None, // Null value allowed
        existing_icp_portfolio: None, // Null value allowed
        type_of_investment: "Equity".to_string(),
        project_on_multichain: None, // Null value allowed
        category_of_investment: "Technology".to_string(),
        reason_for_joining: None, // Null value allowed
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: None, // Null value allowed
        number_of_portfolio_companies: 10,
        portfolio_link: "https://portfolio.example.com".to_string(),
        website_link: None, // Null value allowed
        links: None, // Null value allowed
        registered: true,
        registered_country: None, // Null value allowed
        stage: None, // Null value allowed
        range_of_check_size: None, // Null value allowed
    };

    // Call the register_venture_capitalist function with null values
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration succeeded and null values were handled properly
    let result: String = decode_one(&response).unwrap();
    assert!(result.starts_with("Venture Capitalist Created With UID"));
}

#[test]
fn test_register_venture_capitalist_with_existing_investor() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    // Register a user
    let user_info = UserInformation {
        full_name: "Existing Investor User".to_string(),
        profile_picture: None,
        email: Some("existinginvestor@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor with existing investments.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Finance startups.".to_string()]),
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Define VC parameters with existing ICP investor
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
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Call the register_venture_capitalist function with existing investor
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_params.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify that the registration succeeded and the existing investor status was handled properly
    let result: String = decode_one(&response).unwrap();
    assert!(result.starts_with("Venture Capitalist Created With UID"));
}