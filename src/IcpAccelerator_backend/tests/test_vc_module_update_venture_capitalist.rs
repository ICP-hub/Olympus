use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;

use IcpAccelerator_backend::user_modules::user_types::*;
use IcpAccelerator_backend::vc_module::vc_types::*;

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
