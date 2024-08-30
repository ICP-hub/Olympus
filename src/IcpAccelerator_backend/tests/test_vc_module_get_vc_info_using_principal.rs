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
fn test_get_vc_info_using_principal() {
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
    let expected_vc_info = VentureCapitalist {
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

    // Simulate storing this VC info in the state
    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(expected_vc_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Call the get_vc_info_using_principal function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into an Option<VentureCapitalistInternal>
    let result: Option<(VentureCapitalistAll, UserInfoInternal)>  = decode_one(&response).unwrap();
    let result2= result.unwrap();
    let binding=result2.0;
    // Define the expected VentureCapitalistInternal structure
    // let expected_vc_internal = VentureCapitalistInternal {
    //     params: expected_vc_info,
    //     uid: String::from(""), // UID will be generated during registration
    //     is_active: true,
    //     approve: false,
    //     decline: false,
    // };

    // Assert that the returned VC information matches the expected VC information
    assert_eq!(binding.profile.params, expected_vc_info);
}







#[test]
fn test_update_and_retrieve_vc_info() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    let user_info = UserInformation {
        full_name: "Updating User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Updating bio.".to_string()),
        area_of_interest: "Finance".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
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
        reason_for_joining: Some("Growth opportunities.".to_string()),
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
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    let updated_vc_info = VentureCapitalist {
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

    pic.update_call(
        backend_canister,
        test_principal,
        "update_venture_capitalist",
        encode_one(updated_vc_info.clone()).unwrap(),
    ).expect("VC update failed");

    // Retrieve updated VC info
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: Option<(VentureCapitalistAll, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(result.is_some(), "VC information should be retrievable after update.");
    let (vc_all_info, _) = result.unwrap();
    assert_eq!(vc_all_info.profile.params, updated_vc_info, "VC information should reflect the updates.");
}






#[test]
fn test_retrieve_vc_info_with_different_principal() {
    let (pic, backend_canister) = setup();

    // Define two test principals
    let registering_principal = Principal::anonymous();
    let querying_principal = Principal::anonymous();

    // Register the user for the registering principal
    let user_info = UserInformation {
        full_name: "Registering User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("A user registering as VC.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("investor".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        registering_principal,
        "register_user",
        encode_one(user_info.clone()).unwrap(),
    ).expect("User registration failed");

    // Register the VC
    let vc_info = VentureCapitalist {
        name_of_fund: "Technology Fund".to_string(),
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
        registering_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("VC registration failed");

    // Attempt to retrieve the VC info using a different principal
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        querying_principal,
        "get_vc_info_using_principal",
        encode_one(querying_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: Option<(VentureCapitalistAll, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(result.is_none(), "VC information should not be accessible by a different principal.");
}



//handled at frontend 
#[test]
fn test_invalid_vc_data() {
    let (pic, backend_canister) = setup();

    let test_principal = Principal::anonymous();

    let user_info = UserInformation {
        full_name: "Invalid VC User".to_string(),
        profile_picture: None,
        email: None,
        country: "United States".to_string(),
        social_links: None,
        bio: Some("Testing invalid VC data.".to_string()),
        area_of_interest: "Technology".to_string(),
        openchat_username: None,
        type_of_profile: Some("vc".to_string()),
        reason_to_join: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_user",
        encode_one(user_info).unwrap(),
    ).expect("User registration failed");

    let vc_info = VentureCapitalist {
        name_of_fund: "".to_string(), // Invalid: empty string
        fund_size: Some(-100_000_000.0), // Invalid: negative value
        assets_under_management: None,
        registered_under_any_hub: None,
        average_check_size: -1_000_000.0, // Invalid: negative value
        existing_icp_investor: false,
        money_invested: None,
        existing_icp_portfolio: None,
        type_of_investment: "".to_string(), // Invalid: empty string
        project_on_multichain: None,
        category_of_investment: "".to_string(), // Invalid: empty string
        reason_for_joining: None,
        preferred_icp_hub: "".to_string(), // Invalid: empty string
        investor_type: None,
        number_of_portfolio_companies: 0,
        portfolio_link: "".to_string(), // Invalid: empty string
        website_link: None,
        links: None,
        registered: false,
        registered_country: None,
        stage: None,
        range_of_check_size: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect_err("VC registration should fail with invalid data");

    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let result: Option<(VentureCapitalistAll, UserInfoInternal)> = decode_one(&response).unwrap();
    assert!(result.is_none(), "VC information should not be retrievable with invalid data.");
}

