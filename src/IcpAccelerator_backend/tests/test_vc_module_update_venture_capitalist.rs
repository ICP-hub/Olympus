use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
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
fn test_update_venture_capitalist() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

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
        test_principal,
        "register_user",
        encode_one(user_info.params.clone()).unwrap(),
    ).expect("User registration failed");

    // Define the initial VentureCapitalist parameters
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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

    // Register the initial VC profile
    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("Expected reply");

    // Define the updated VentureCapitalist parameters
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects".to_string()),
        type_of_investment: "Debt".to_string(),
        project_on_multichain: Some("Polkadot, Cosmos".to_string()),
        category_of_investment: "Finance".to_string(),
        reason_for_joining: Some("New opportunities".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Private Equity".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: Some("https://updatedvcfund.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Expansion".to_string()),
        range_of_check_size: Some("$5-10M".to_string()),
    };

    // Call the update_venture_capitalist function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the update was successful
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Profile updated successfully");

    // Verify that the VC's profile was updated correctly
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info:  Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap();
    let binding=result.0;

    // Ensure the VC's profile matches the updated information
    assert_eq!(binding, vc_info_updated);
}











#[test]
fn test_update_venture_capitalist_non_existent_profile() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Non-existent VC User".to_string(),
        profile_picture: None,
        email: Some("nonexistentvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in new projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Attempt to update a VC profile that does not exist
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Non-existent Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects".to_string()),
        type_of_investment: "Debt".to_string(),
        project_on_multichain: Some("Polkadot, Cosmos".to_string()),
        category_of_investment: "Finance".to_string(),
        reason_for_joining: Some("New opportunities".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Private Equity".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: Some("https://updatedvcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Expansion".to_string()),
        range_of_check_size: Some("$5-10M".to_string()),
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Error processing request: No existing VC profile found to update.");
}

#[test]
fn test_update_venture_capitalist_special_characters() {
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
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Update VC profile with special characters and emojis
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund 💼🚀".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects 🎯".to_string()),
        type_of_investment: "Debt".to_string(),
        project_on_multichain: Some("Polkadot, Cosmos 🌐".to_string()),
        category_of_investment: "Finance 💸".to_string(),
        reason_for_joining: Some("New opportunities 🌟".to_string()),
        preferred_icp_hub: "ICP Hub 2 🚀".to_string(),
        investor_type: Some("Private Equity 💼".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: Some("https://updatedvcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Expansion 🌍".to_string()),
        range_of_check_size: Some("$5-10M 💵".to_string()),
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Profile updated successfully");

    // Verify that the VC's profile was updated correctly with special characters
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert_eq!(result, vc_info_updated);
}

#[test]
fn test_update_venture_capitalist_with_null_values() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Null Value VC User".to_string(),
        profile_picture: None,
        email: Some("nullvaluevc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Update VC profile with null values for optional fields
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund".to_string(),
        fund_size: None,
        assets_under_management: None,
        registered_under_any_hub: None,
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: None,
        existing_icp_portfolio: None,
        type_of_investment: "Debt".to_string(),
        project_on_multichain: None,
        category_of_investment: "Finance".to_string(),
        reason_for_joining: None,
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: None,
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: None,
        links: None,
        registered: true,
        registered_country: None,
        stage: None,
        range_of_check_size: None,
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Profile updated successfully");

    // Verify that the VC's profile was updated correctly with null values
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert_eq!(result, vc_info_updated);
}

#[test]
fn test_update_venture_capitalist_large_input_sizes() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Large Input VC User".to_string(),
        profile_picture: None,
        email: Some("largeinputvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Update VC profile with large input sizes
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund".repeat(1000),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".repeat(1000)),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects".repeat(1000)),
        type_of_investment: "Debt".repeat(1000),
        project_on_multichain: Some("Polkadot, Cosmos".repeat(1000)),
        category_of_investment: "Finance".repeat(1000),
        reason_for_joining: Some("New opportunities".repeat(1000)),
        preferred_icp_hub: "ICP Hub 2".repeat(1000),
        investor_type: Some("Private Equity".repeat(1000)),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: Some("https://updatedvcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Canada".repeat(1000)),
        stage: Some("Expansion".repeat(1000)),
        range_of_check_size: Some("$5-10M".repeat(1000)),
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Profile updated successfully");

    // Verify that the VC's profile was updated correctly with large input sizes
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert_eq!(result, vc_info_updated);
}

#[test]
fn test_update_venture_capitalist_invalid_fund_size() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Invalid Fund Size VC User".to_string(),
        profile_picture: None,
        email: Some("invalidfundsizevc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Update VC profile with an invalid fund size
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund".to_string(),
        fund_size: Some(-200_000_000.0), // Invalid fund size
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects".to_string()),
        type_of_investment: "Debt".to_string(),
        project_on_multichain: Some("Polkadot, Cosmos".to_string()),
        category_of_investment: "Finance".to_string(),
        reason_for_joining: Some("New opportunities".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Private Equity".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: Some("https://updatedvcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Expansion".to_string()),
        range_of_check_size: Some("$5-10M".to_string()),
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Error processing request: Invalid fund size.");

    // Ensure that the VC's profile was not updated with the invalid fund size
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert_eq!(result, vc_info_initial); // No change should have been made
}


#[test]
fn test_update_venture_capitalist_empty_strings() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Empty String VC User".to_string(),
        profile_picture: None,
        email: Some("emptystringvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Update VC profile with empty strings for string fields
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("".to_string()),
        type_of_investment: "".to_string(),
        project_on_multichain: Some("".to_string()),
        category_of_investment: "".to_string(),
        reason_for_joining: Some("".to_string()),
        preferred_icp_hub: "".to_string(),
        investor_type: Some("".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "".to_string(),
        website_link: Some("".to_string()),
        links: None,
        registered: true,
        registered_country: Some("".to_string()),
        stage: Some("".to_string()),
        range_of_check_size: Some("".to_string()),
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Profile updated successfully");

    // Verify that the VC's profile was updated correctly with empty strings
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert_eq!(result, vc_info_updated);
}

#[test]
fn test_update_venture_capitalist_concurrent_updates() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Concurrent VC User".to_string(),
        profile_picture: None,
        email: Some("concurrentvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Perform two concurrent updates
    let vc_info_update_1 = VentureCapitalist {
        name_of_fund: "Concurrent Fund 1".to_string(),
        fund_size: Some(150_000_000.0),
        assets_under_management: Some("1.5B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 7_500_000.0,
        existing_icp_investor: false,
        money_invested: Some(75_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Polkadot, Cosmos".to_string()),
        category_of_investment: "Finance".to_string(),
        reason_for_joining: Some("Concurrent update 1".to_string()),
        preferred_icp_hub: "ICP Hub 1".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 15,
        portfolio_link: "https://portfolio1.example.com".to_string(),
        website_link: Some("https://vcfund1.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    let vc_info_update_2 = VentureCapitalist {
        name_of_fund: "Concurrent Fund 2".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects 2".to_string()),
        type_of_investment: "Debt".to_string(),
        project_on_multichain: Some("Solana, Avalanche".to_string()),
        category_of_investment: "Technology".to_string(),
        reason_for_joining: Some("Concurrent update 2".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Private Equity".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio2.example.com".to_string(),
        website_link: Some("https://vcfund2.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Expansion".to_string()),
        range_of_check_size: Some("$5-10M".to_string()),
    };

    let handle_1 = std::thread::spawn({
        let pic = pic.clone();
        let backend_canister = backend_canister.clone();
        let test_principal = test_principal.clone();
        move || {
            let Ok(WasmResult::Reply(response)) = pic.update_call(
                backend_canister,
                test_principal,
                "update_venture_capitalist",
                encode_one(vc_info_update_1.clone()).unwrap(),
            ) else {
                panic!("Expected reply");
            };
            let result: String = decode_one(&response).unwrap();
            assert_eq!(result, "Profile updated successfully");
        }
    });

    let handle_2 = std::thread::spawn({
        let pic = pic.clone();
        let backend_canister = backend_canister.clone();
        let test_principal = test_principal.clone();
        move || {
            let Ok(WasmResult::Reply(response)) = pic.update_call(
                backend_canister,
                test_principal,
                "update_venture_capitalist",
                encode_one(vc_info_update_2.clone()).unwrap(),
            ) else {
                panic!("Expected reply");
            };
            let result: String = decode_one(&response).unwrap();
            assert_eq!(result, "Profile updated successfully");
        }
    });

    handle_1.join().unwrap();
    handle_2.join().unwrap();

    // Verify that the VC's profile was updated with one of the concurrent updates (the final state is non-deterministic)
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert!(result == vc_info_update_1 || result == vc_info_update_2);
}

#[test]
fn test_update_venture_capitalist_with_null_values() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Null VC User".to_string(),
        profile_picture: None,
        email: Some("nullvc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Update VC profile with null values
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund".to_string(),
        fund_size: None, // Null value
        assets_under_management: None, // Null value
        registered_under_any_hub: None, // Null value
        average_check_size: 0.0,
        existing_icp_investor: false,
        money_invested: None, // Null value
        existing_icp_portfolio: None, // Null value
        type_of_investment: "".to_string(), // Empty value
        project_on_multichain: None, // Null value
        category_of_investment: "".to_string(), // Empty value
        reason_for_joining: None, // Null value
        preferred_icp_hub: "".to_string(), // Empty value
        investor_type: None, // Null value
        number_of_portfolio_companies: 0,
        portfolio_link: "".to_string(), // Empty value
        website_link: None, // Null value
        links: None,
        registered: true,
        registered_country: None, // Null value
        stage: None, // Null value
        range_of_check_size: None, // Null value
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Profile updated successfully");

    // Verify that the VC's profile was updated correctly with null values
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert_eq!(result, vc_info_updated);
}

#[test]
fn test_update_venture_capitalist_inactive_vc() {
    let (pic, backend_canister) = setup();
    let test_principal = Principal::anonymous(); 

    // Register a user
    let user_info = UserInformation {
        full_name: "Inactive VC User".to_string(),
        profile_picture: None,
        email: Some("inactivevc@example.com".to_string()),
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Investor.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: Some(vec!["Invest in innovative projects.".to_string()]),
    };
    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    // Initial VC registration
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Initial Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        registered_under_any_hub: Some(true),
        average_check_size: 5_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(50_000_000.0),
        existing_icp_portfolio: Some("ICP Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum, Solana".to_string()),
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
        encode_one(vc_info_initial.clone()).unwrap(),
    ).expect("VC registration failed");

    // Deactivate the VC
    let deactivate_vc = |pic: &PocketIc, backend_canister: Principal, test_principal: Principal| {
        let Ok(WasmResult::Reply(response)) = pic.update_call(
            backend_canister,
            test_principal,
            "make_active_inactive_venture_capitalist",
            encode_one(test_principal).unwrap(),
        ) else {
            panic!("Expected reply");
        };
        let result: String = decode_one(&response).unwrap();
        assert_eq!(result, "made inactive");
    };
    deactivate_vc(&pic, backend_canister, test_principal);

    // Attempt to update the inactive VC profile
    let vc_info_updated = VentureCapitalist {
        name_of_fund: "Updated Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        registered_under_any_hub: Some(false),
        average_check_size: 10_000_000.0,
        existing_icp_investor: false,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Updated ICP Projects".to_string()),
        type_of_investment: "Debt".to_string(),
        project_on_multichain: Some("Polkadot, Cosmos".to_string()),
        category_of_investment: "Finance".to_string(),
        reason_for_joining: Some("New opportunities".to_string()),
        preferred_icp_hub: "ICP Hub 2".to_string(),
        investor_type: Some("Private Equity".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://updatedportfolio.example.com".to_string(),
        website_link: Some("https://updatedvcfund.example.com".to_string()),
        links: None,
        registered: true,
        registered_country: Some("Canada".to_string()),
        stage: Some("Expansion".to_string()),
        range_of_check_size: Some("$5-10M".to_string()),
    };
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(vc_info_updated.clone()).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Profile updated successfully");

    // Verify that the VC's profile was updated correctly
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };
    let updated_vc_info: Option<(VentureCapitalist, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    let result = updated_vc_info.unwrap().0;
    assert_eq!(result, vc_info_updated);
}