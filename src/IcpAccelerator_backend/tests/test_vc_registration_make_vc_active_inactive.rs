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
fn test_make_vc_active_inactive() {
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

    // Simulate the registration of a VC to ensure the profile exists
    let vc_info_initial = VentureCapitalist {
        name_of_fund: "Test Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        logo: None,
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
        announcement_details: None,
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: None,
    };

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info_initial).unwrap(),
    ).expect("Expected reply");

    // Call make_vc_active_inactive to deactivate the VC profile
    let Ok(WasmResult::Reply(response_deactivate)) = pic.update_call(
        backend_canister,
        test_principal,
        "make_vc_active_inactive",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify the response indicates the VC profile was made inactive
    let result_deactivate: String = decode_one(&response_deactivate).unwrap();
    assert_eq!(result_deactivate, "made inactive");

    // Verify the VC profile is now inactive
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let vc_info: Option<(VentureCapitalistAll, UserInfoInternal)> = decode_one(&vc_info_response).unwrap();
    ic_cdk::println!("DATA FROM API IN 112 {:?}", vc_info.clone());

    // ic_cdk::println!("113 PRINT");
    // assert!(vc_info.is_some(), true);
    // ic_cdk::println!("114 PRINT");

    if let Some((vc, _user_info)) = vc_info {
        // Now you can access the `registered` field from `vc`
        assert!(!vc.profile.is_active, "{}", false);
    } else {
        panic!("VC profile should exist");
    }

    // Call make_vc_active_inactive to activate the VC profile again
    let Ok(WasmResult::Reply(response_activate)) = pic.update_call(
        backend_canister,
        test_principal,
        "make_vc_active_inactive",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Verify the response indicates the VC profile was made active
    let result_activate: String = decode_one(&response_activate).unwrap();
    assert_eq!(result_activate, "made active");

    // Verify the VC profile is now active again
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let vc_info: Option<VentureCapitalist> = decode_one(&vc_info_response).unwrap();
    assert!(vc_info.is_some(), "VC profile should exist");
    assert!(vc_info.unwrap().registered, "VC profile should be active");
}
