use candid::{decode_one, encode_one, Principal};
use pocket_ic::{PocketIc, WasmResult};
use std::fs;
use std::collections::HashMap;

// Define the path to your compiled Wasm file
const BACKEND_WASM: &str = "../../target/wasm32-unknown-unknown/release/user_module_backend.wasm";

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
fn test_filter_venture_capitalists() {
    let (pic, backend_canister) = setup();

    // Define a test principal
    let test_principal = Principal::anonymous(); // Replace with a specific principal if needed

    // Simulate the registration of a VC to ensure the profile exists
    let vc_info_1 = VentureCapitalist {
        name_of_fund: "Tech Fund".to_string(),
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
        range_of_check_size: Some("$10m-$50m".to_string()),
    };

    let vc_info_2 = VentureCapitalist {
        name_of_fund: "Health Fund".to_string(),
        fund_size: Some(200_000_000.0),
        assets_under_management: Some("2B USD".to_string()),
        logo: None,
        registered_under_any_hub: Some(true),
        average_check_size: 15_000_000.0,
        existing_icp_investor: true,
        money_invested: Some(100_000_000.0),
        existing_icp_portfolio: Some("Health Projects".to_string()),
        type_of_investment: "Equity".to_string(),
        project_on_multichain: Some("Ethereum".to_string()),
        category_of_investment: "Healthcare".to_string(),
        reason_for_joining: Some("Healthcare advancements".to_string()),
        preferred_icp_hub: "ICP Hub".to_string(),
        investor_type: Some("Venture Capital".to_string()),
        number_of_portfolio_companies: 20,
        portfolio_link: "https://portfolio.example.com".to_string(),
        announcement_details: None,
        website_link: None,
        links: None,
        registered: true,
        registered_country: Some("United States".to_string()),
        stage: None,
        range_of_check_size: Some("$50m-$100m".to_string()),
    };

    // Register both VCs
    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info_1).unwrap(),
    ).expect("Expected reply");

    pic.update_call(
        backend_canister,
        test_principal,
        "register_venture_capitalist",
        encode_one(vc_info_2).unwrap(),
    ).expect("Expected reply");

    // Define filter criteria to match only Technology VCs with check sizes between $10m and $50m
    let criteria = VcFilterCriteria {
        country: None,
        category_of_investment: Some("Technology".to_string()),
        money_invested_range: Some((10_000_000.0, 50_000_000.0)),
    };

    // Call the filter_venture_capitalists function
    let Ok(WasmResult::Reply(filtered_response)) = pic.query_call(
        backend_canister,
        test_principal,
        "filter_venture_capitalists",
        encode_one(criteria).unwrap(),
    ) else {
        panic!("Expected reply");
    };

    // Decode the response and verify the filtering was successful
    let filtered_vcs: Vec<VentureCapitalist> = decode_one(&filtered_response).unwrap();

    // There should only be one result that matches the criteria
    assert_eq!(filtered_vcs.len(), 1, "Should only match one VC");

    // Verify the matching VC is the Technology VC with the correct range of check size
    let vc = &filtered_vcs[0];
    assert_eq!(vc.category_of_investment, "Technology");
    assert_eq!(vc.range_of_check_size.as_deref(), Some("$10m-$50m"));
}
