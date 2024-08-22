use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use IcpAccelerator_backend::vc_registration::VentureCapitalist;
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
fn test_delete_venture_capitalist() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Define the expected VentureCapitalist parameters
    let vc_info = VentureCapitalist {
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

    // Simulate storing this VC info in the state
    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info.clone()).unwrap(),
    ).expect("Expected reply");

    // Call the delete_venture_capitalist function
    let Ok(WasmResult::Reply(response)) = pic.update_call(
        backend_canister,
        test_principal,
        "delete_venture_capitalist",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the account was deactivated
    let result: String = decode_one(&response).unwrap();
    assert_eq!(result, "Venture Capitalist Account Has Been DeActivated");

    // Verify that the VC's account is now deactivated
    let Ok(WasmResult::Reply(vc_info_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "get_vc_info",
        encode_one(()).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    let updated_vc_info: Option<VentureCapitalist> = decode_one(&vc_info_response).unwrap();

    // Ensure the VC is now inactive
    assert!(updated_vc_info.is_none(), "VC account should be deactivated and inaccessible.");
}
