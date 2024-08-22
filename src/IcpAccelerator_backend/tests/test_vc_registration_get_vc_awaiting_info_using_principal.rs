use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;


use IcpAccelerator_backend::vc_registration::*;

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
fn test_get_vc_awaiting_info_using_principal() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the expected VentureCapitalist parameters
    let expected_vc_info = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
        fund_size: Some(100_000_000.0),
        assets_under_management: Some("1B USD".to_string()),
        logo: Some(vec![1, 2, 3]), // Example binary data
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
        announcement_details: Some("Exciting investment".to_string()),
        website_link: Some("https://vcfund.example.com".to_string()),
        links: None, // Replace with actual data if needed
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: Some("Growth".to_string()),
        range_of_check_size: Some("$2-5M".to_string()),
    };

    // Simulate storing this VC info in the vc_awaits_response state
    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(expected_vc_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Manually move the VC info to vc_awaits_response to simulate awaiting approval
    pic.update_call(
        backend_canister,
        test_principal,
        "move_vc_to_awaiting_response",
        encode_one(test_principal).unwrap(),
    ).expect("Expected reply");

    // Call the get_vc_awaiting_info_using_principal function
    let Ok(WasmResult::Reply(response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_awaiting_info_using_principal",
        encode_one(test_principal).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response into an Option<VentureCapitalistInternal>
    let result: Option<VentureCapitalistInternal> = decode_one(&response).unwrap();

    // Define the expected VentureCapitalistInternal structure
    let expected_vc_internal = VentureCapitalistInternal {
        params: expected_vc_info,
        uid: String::from(""), // UID will be generated during registration
        is_active: true,
        approve: false,
        decline: false,
    };

    // Assert that the returned VC information matches the expected VC information
    assert_eq!(result, Some(expected_vc_internal));
}
